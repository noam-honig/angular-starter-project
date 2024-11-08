import { remultExpress } from 'remult/remult-express'
import { createPostgresConnection } from 'remult/postgres'
import { User } from '../app/users/user'
import { SignInController, getUser } from '../app/users/SignInController'
import { UpdatePasswordController } from '../app/users/UpdatePasswordController'

export const entities = [User]
export const api = remultExpress({
  controllers: [SignInController, UpdatePasswordController],
  entities,
  getUser,
  dataProvider: async () => {
    if (process.env['NODE_ENV'] === 'production')
      return createPostgresConnection({ configuration: 'heroku' })
    return undefined
  },
})
