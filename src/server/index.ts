import { config } from 'dotenv'
config() //loads the configuration from the .env file
import express from 'express'
import sslRedirect from 'heroku-ssl-redirect'
import helmet from 'helmet'
import compression from 'compression'
import { api } from './api'
import { getRequestMiddleware } from './getRequestMiddleware'
import session from 'cookie-session'

import { SignInController } from '../app/users/SignInController'

async function startup() {
  const app = express()
  app.use(sslRedirect())
  app.use(
    session({
      secret:
        process.env['NODE_ENV'] === 'production'
          ? process.env['SESSION_SECRET']
          : 'my secret',
    })
  )
  app.use(compression())
  app.use(helmet({ contentSecurityPolicy: false }))

  app.use(getRequestMiddleware)
  app.use(api)

  app.use(express.static('dist/angular-starter-project'))
  app.use('/*', async (req, res) => {
    req.session
    if (req.headers.accept?.includes('json')) {
      console.log(req)
      res.status(404).json('missing route: ' + req.originalUrl)
      return
    }
    try {
      res.sendFile(process.cwd() + '/dist/angular-starter-project/index.html')
    } catch (err) {
      res.sendStatus(500)
    }
  })
  let port = process.env['PORT'] || 3002
  app.listen(port)
}
startup()
