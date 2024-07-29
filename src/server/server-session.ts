import { UserInfo, remult, repo } from 'remult'
import type { Request } from 'express'
import type from 'cookie-session' //needed for build - do not remove
import { User } from '../app/users/user'
import { Roles } from '../app/users/roles'

declare module 'remult' {
  export interface RemultContext {
    session: CookieSessionInterfaces.CookieSessionObject
    sessionOptions: CookieSessionInterfaces.CookieSessionOptions
  }
}

export async function initRequest(req: Request) {
  remult.context.session = req.session!
  remult.context.sessionOptions = req.sessionOptions

  const sessionUser = req.session!['user']
  if (!sessionUser || !sessionUser.id) return
  const user = (await repo(User).findFirst({
    id: sessionUser!.id,
    disabled: false,
  }))!
  await setSessionUserBasedOnUserRow(user)
}

export function setSessionUser(user: UserInfo): UserInfo {
  const current = remult.context.session['user']
  if (JSON.stringify(user) != JSON.stringify(current))
    remult.context.session['user'] = user
  remult.user = user
  return user
}

export async function setSessionUserBasedOnUserRow(user: User) {
  if (!user) {
    return setSessionUser(undefined!)
  }
  const roles: string[] = []

  if (user.admin) {
    roles.push(Roles.admin)
  }
  return setSessionUser({
    id: user.id,
    name: user.name,
    roles,
  })
}
