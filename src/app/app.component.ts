import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, Route, ActivatedRoute } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { Remult } from 'remult';
import { DialogService } from './common/dialog';
import { openDialog, RouteHelperService } from 'common-ui-elements';
import { User } from './users/user';
import { InputAreaComponent } from './common/input-area/input-area.component';
import { AuthService } from './auth.service';
import { terms } from './terms';
import { SignInController } from './users/SignInController';
import { UpdatePasswordController } from './users/UpdatePasswordController';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    public router: Router,
    public activeRoute: ActivatedRoute,
    private routeHelper: RouteHelperService,
    public dialogService: DialogService,
    public remult: Remult,
    public auth: AuthService) {
  }
  terms = terms;

  async signIn() {
    const signIn = new SignInController(this.remult);
    openDialog(InputAreaComponent, i => i.args = {
      title: terms.signIn,
      object: signIn,
      ok: async () => {
        this.auth.setAuthToken(await signIn.signIn(), signIn.rememberOnThisDevice);
      }
    });
  }

  ngOnInit(): void {

  }

  signOut() {
    this.auth.setAuthToken(null);
    this.router.navigate(['/']);
  }

  async updateInfo() {
    let user = await this.remult.repo(User).findId(this.remult.user.id);
    openDialog(InputAreaComponent, i => i.args = {
      title: terms.updateInfo,
      fields: () => [
        user.$.name
      ],
      ok: async () => {
        await user._.save();
      }
    });
  }
  async changePassword() {
    const updatePassword = new UpdatePasswordController(this.remult);
    openDialog(InputAreaComponent, i => i.args = {
      title: terms.signIn,
      object: updatePassword,
      ok: async () => {
        await updatePassword.updatePassword();
      }
    });

  }

  routeName(route: Route) {
    let name = route.path;
    if (route.data && route.data['name'])
      name = route.data['name'];
    return name;
  }

  currentTitle() {
    if (this.activeRoute!.snapshot && this.activeRoute!.firstChild)
      if (this.activeRoute.snapshot.firstChild!.data!['name']) {
        return this.activeRoute.snapshot.firstChild!.data['name'];
      }
      else {
        if (this.activeRoute.firstChild.routeConfig)
          return this.activeRoute.firstChild.routeConfig.path;
      }
    return 'angular-starter-project';
  }

  shouldDisplayRoute(route: Route) {
    if (!(route.path && route.path.indexOf(':') < 0 && route.path.indexOf('**') < 0))
      return false;
    return this.routeHelper.canNavigateToRoute(route);
  }
  //@ts-ignore ignoring this to match angular 7 and 8
  @ViewChild('sidenav') sidenav: MatSidenav;
  routeClicked() {
    if (this.dialogService.isScreenSmall())
      this.sidenav.close();
  }
}
