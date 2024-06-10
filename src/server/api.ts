import { remultExpress } from 'remult/remult-express'
import { createPostgresConnection } from 'remult/postgres'
import { User } from '../app/users/user'
import { SignInController } from '../app/users/SignInController'
import { UpdatePasswordController } from '../app/users/UpdatePasswordController'
import { initRequest } from './server-session'
import { config } from 'dotenv'
config() //loads the configuration from the .env file

export const entities = [User]
export const api = remultExpress({
  admin:true,
  controllers: [SignInController, UpdatePasswordController],
  entities,
  initRequest,
  dataProvider: async () => {
    if (process.env['NODE_ENV'] === 'production')
      return createPostgresConnection({ configuration: 'heroku' })
    return undefined
  },
})
