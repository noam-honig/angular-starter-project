import { Component, OnInit, ViewChild } from '@angular/core'
import { Router, Route, ActivatedRoute } from '@angular/router'
import { MatSidenav } from '@angular/material/sidenav'

import { UIToolsService } from './common/UIToolsService'
import { openDialog, RouteHelperService } from 'common-ui-elements'
import { User } from './users/user'
import { DataAreaDialogComponent } from './common/data-area-dialog/data-area-dialog.component'
import { terms } from './terms'
import { SignInController } from './users/SignInController'
import { UpdatePasswordController } from './users/UpdatePasswordController'
import { remult } from 'remult'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    public router: Router,
    public activeRoute: ActivatedRoute,
    private routeHelper: RouteHelperService,
    public uiService: UIToolsService
  ) {}
  terms = terms
  remult = remult

  async signIn() {
    const signIn = new SignInController()
    openDialog(
      DataAreaDialogComponent,
      (i) =>
        (i.args = {
          title: terms.signIn,
          object: signIn,
          ok: async () => {
            remult.user = await signIn.signIn()
          },
        })
    )
  }

  ngOnInit(): void {}

  signOut() {
    SignInController.signOut()
    remult.user = undefined
    this.router.navigate(['/'])
  }

  async updateInfo() {
    let user = await remult.repo(User).findId(remult.user!.id)
    openDialog(
      DataAreaDialogComponent,
      (i) =>
        (i.args = {
          title: terms.updateInfo,
          fields: [user.$.name],
          ok: async () => {
            await user._.save()
          },
        })
    )
  }
  async changePassword() {
    const updatePassword = new UpdatePasswordController()
    openDialog(
      DataAreaDialogComponent,
      (i) =>
        (i.args = {
          title: terms.signIn,
          object: updatePassword,
          ok: async () => {
            await updatePassword.updatePassword()
          },
        })
    )
  }

  routeName(route: Route) {
    let name = route.path
    if (route.data && route.data['name']) name = route.data['name']
    return name
    return ''
  }

  currentTitle() {
    if (this.activeRoute!.snapshot && this.activeRoute!.firstChild)
      if (this.activeRoute.snapshot.firstChild!.data!['name']) {
        return this.activeRoute.snapshot.firstChild!.data['name']
      } else {
        if (this.activeRoute.firstChild.routeConfig)
          return this.activeRoute.firstChild.routeConfig.path
      }
    return 'angular-starter-project'
  }
  doesNotRequireLogin() {
    return this.activeRoute?.snapshot?.firstChild?.data?.['noLogin']
  }

  shouldDisplayRoute(route: Route) {
    if (
      !(
        this.routeName(route) &&
        (route.path || '').indexOf(':') < 0 &&
        (route.path || '').indexOf('**') < 0 &&
        !route.data?.['hide']
      )
    )
      return false
    return this.routeHelper.canNavigateToRoute(route)
  }
  //@ts-ignore ignoring this to match angular 7 and 8
  @ViewChild('sidenav') sidenav: MatSidenav
  routeClicked() {
    if (this.uiService.isScreenSmall()) this.sidenav.close()
  }
}
