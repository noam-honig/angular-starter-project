import { remultExpress } from 'remult/remult-express'
import { createPostgresConnection } from 'remult/postgres'
import { User } from '../app/users/user'
import { SignInController } from '../app/users/SignInController'
import { UpdatePasswordController } from '../app/users/UpdatePasswordController'
import { initRequest } from './server-session'

export const api = remultExpress({
  entities: [User],
  controllers: [SignInController, UpdatePasswordController],
  initRequest,
  dataProvider: async () => {
    if (process.env['NODE_ENV'] === 'production')
      return createPostgresConnection({ configuration: 'heroku' })
    return undefined
  },
})
