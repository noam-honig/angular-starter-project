import {
  Allow,
  BackendMethod,
  Controller,
  ControllerBase,
  Fields,
  remult,
  repo,
  UserInfo,
  Validators,
} from 'remult'
import { terms } from '../terms'
import { Roles } from './roles'
import { User } from './user'
import type express from 'express'
import type from 'cookie-session'

declare module 'remult' {
  export interface RemultContext {
    request?: express.Request
  }
}

@Controller('signIn')
export class SignInController extends ControllerBase {
  @Fields.string({
    caption: terms.username,
    validate: Validators.required,
  })
  user = ''
  @Fields.string({
    caption: terms.password,
    validate: Validators.required,
    inputType: 'password',
  })
  password = ''

  @BackendMethod({ allowed: true })
  /**
   * This sign mechanism represents a simplistic sign in management utility with the following behaviors
   * 1. The first user that signs in, is created as a user and is determined as admin.
   * 2. When a user that has no password signs in, that password that they've signed in with is set as the users password
   */
  async signIn() {
    let result: UserInfo | undefined
    const userRepo = repo(User)
    let u = await userRepo.findFirst({ name: this.user })
    if (!u) {
      if ((await userRepo.count()) === 0) {
        //first ever user is the admin
        u = await userRepo.insert({
          name: this.user,
          admin: true,
        })
      }
    }
    if (u) {
      if (!u.password) {
        // if the user has no password defined, the first password they use is their password
        await u.hashAndSetPassword(this.password)
        await u.save()
      }

      if (await u.passwordMatches(this.password)) {
        return setSessionUserBasedOnUserRow(u)
      }
    }
    throw new Error(terms.invalidSignIn)
  }
  @BackendMethod({ allowed: Allow.authenticated })
  static signOut() {
    setSessionUserBasedOnUserRow(undefined!)
  }
}

export async function setSessionUserBasedOnUserRow(user?: User) {
  if (!user) {
    if (remult.context.request?.session) {
      remult.context.request.session['user'] = undefined!
    }
    return undefined
  }
  const roles: string[] = []

  if (user.admin) {
    roles.push(Roles.admin)
  }
  const userInfo: UserInfo = { id: user.id, name: user.name, roles }
  if (remult.context.request?.session) {
    const current = remult.context.request.session['user']
    if (JSON.stringify(userInfo) != JSON.stringify(current))
      remult.context.request.session['user'] = userInfo
  }
  return userInfo
}

export async function getUser(req: express.Request) {
  const sessionUser = req.session?.['user']
  if (!sessionUser || !sessionUser.id) return
  const user = await repo(User).findFirst({
    id: sessionUser!.id,
    disabled: false,
  })
  return await setSessionUserBasedOnUserRow(user)
}
