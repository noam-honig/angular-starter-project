import { UserInfo, remult } from 'remult'
import type { Request } from 'express'
import type from 'cookie-session' //needed for build - do not remove

declare module 'remult' {
  export interface RemultContext {
    session: CookieSessionInterfaces.CookieSessionObject
    sessionOptions: CookieSessionInterfaces.CookieSessionOptions
  }
}

export async function initRequest(req: Request) {
  remult.context.session = req.session!
  remult.user = req.session!['user']
}

export function setSessionUser(user: UserInfo, remember: boolean): UserInfo {
  remult.context.session['user'] = user
  if (remember) remult.context.sessionOptions.maxAge = 365 * 24 * 60 * 60 * 1000 //remember for a year
  remult.user = user
  return user
}
