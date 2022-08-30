import { CommonUIElementsModule } from 'common-ui-elements';
import { NgModule, ErrorHandler } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';


import { UsersComponent } from './users/users.component';
import { AdminGuard } from "./users/AdminGuard";
import { ShowDialogOnErrorErrorHandler } from './common/dialog';
import { JwtModule } from '@auth0/angular-jwt';
import { AuthService } from './auth.service';
import { terms } from './terms';
import { InstanceBackendMethodComponent } from './instance-backend-method/instance-backend-method.component';
import { EntityBackendMethodComponent } from './entity-backend-method/entity-backend-method.component';
import { ActiveRecordDemoComponent } from './active-record-demo/active-record-demo.component';

const defaultRoute = terms.home;
const routes: Routes = [
  { path: defaultRoute, component: HomeComponent },
  { path: 'active-record', component: ActiveRecordDemoComponent },
  { path: 'entity-backend-method', component: EntityBackendMethodComponent },
  { path: "instance-backend-method", component: InstanceBackendMethodComponent },
  { path: terms.userAccounts, component: UsersComponent, canActivate: [AdminGuard] },
  { path: '**', redirectTo: '/' + defaultRoute, pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes),
    CommonUIElementsModule,
  JwtModule.forRoot({
    config: { tokenGetter: () => AuthService.fromStorage() }
  })],
  providers: [AdminGuard, { provide: ErrorHandler, useClass: ShowDialogOnErrorErrorHandler }],
  exports: [RouterModule]
})
export class AppRoutingModule { }
