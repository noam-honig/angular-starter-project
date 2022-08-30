import { remultExpress } from 'remult/remult-express';
import { createPostgresConnection } from 'remult/postgres';
import { User } from '../app/users/user';
import { SignInController } from '../app/users/SignInController';
import { UpdatePasswordController } from '../app/users/UpdatePasswordController';
import { config } from 'dotenv';
import { HomeController } from '../app/home/home.controller';
import { InstanceBackendController } from '../app/instance-backend-method/instance-backend-controller';
import { Product } from '../app/entity-backend-method/products';
import { Product2 } from '../app/active-record-demo/product2';
config(); //loads the configuration from the .env file

export const api = remultExpress({
    entities: [User, Product, Product2],
    controllers: [SignInController,
        UpdatePasswordController,
        HomeController,
        InstanceBackendController],
    dataProvider: async () => {
        if (process.env['NODE_ENV'] === "production")
            return createPostgresConnection({ configuration: "heroku" })
        return undefined;
    }
});