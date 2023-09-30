import type { Request } from 'express'
import type from 'cookie-session' //required for session data in request

export const getRequestConfig = {
  requestFactory: (): Request => undefined!,
}

export function getRequest() {
  return getRequestConfig.requestFactory()
}
