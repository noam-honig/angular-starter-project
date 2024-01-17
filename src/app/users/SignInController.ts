import {
  Allow,
  BackendMethod,
  Controller,
  ControllerBase,
  Fields,
  remult,
  UserInfo,
  Validators,
} from 'remult'
import { terms } from '../terms'
import { Roles } from './roles'
import { User } from './user'
import { setSessionUser } from '../../server/server-session'

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
    const userRepo = remult.repo(User)
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
        result = {
          id: u.id,
          roles: [],
          name: u.name,
        }
        if (u.admin) {
          result.roles!.push(Roles.admin)
        }
      }
    }

    if (result) {
      return setSessionUser(result)
    }
    throw new Error(terms.invalidSignIn)
  }
  @BackendMethod({ allowed: Allow.authenticated })
  static signOut() {
    setSessionUser(undefined!)
  }
  @BackendMethod({ allowed: true })
  static currentUser() {
    return remult.user
  }
}
