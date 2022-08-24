import { AuthenticatedGuard } from 'common-ui-elements';
import { Injectable } from '@angular/core';
import { Roles } from './roles';



@Injectable()
export class AdminGuard extends AuthenticatedGuard {

    override isAllowed() {
        return Roles.admin;
    }
}
