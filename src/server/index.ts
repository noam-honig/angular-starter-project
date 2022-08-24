import './global';
import express from 'express';
import sslRedirect from 'heroku-ssl-redirect'
import swaggerUi from 'swagger-ui-express';
import helmet from 'helmet';
import { expressjwt } from 'express-jwt';
import compression from 'compression';
import { api } from './api';
import { getJwtSecret } from '../app/users/SignInController';


async function startup() {
    const app = express();
    app.use(sslRedirect());
    app.use(expressjwt({ secret: getJwtSecret(), credentialsRequired: false, algorithms: ['HS256'] }));
    app.use(compression());
    app.use(
        helmet({
            contentSecurityPolicy: false,
        })
    );

    app.use(api);
    app.use('/api/docs', swaggerUi.serve,
        swaggerUi.setup(api.openApiDoc({ title: 'remult-react-todo' })));

    app.use(express.static('dist/angular-starter-project'));
    app.use('/*', async (req, res) => {
        if (req.headers.accept?.includes("json")) {
            console.log(req);
            res.status(404).json("missing route: " + req.originalUrl);
            return;
        }
        try {
            res.sendFile(process.cwd() + '/dist/angular-starter-project/index.html');
        } catch (err) {
            res.sendStatus(500);
        }
    });
    let port = process.env['PORT'] || 3002;
    app.listen(port);
}
startup();