import { NgModule, NgZone } from '@angular/core'
import { DataControl2Component } from './data-control/data-control2.component'
import { DataControl3Component } from './data-control/data-control3.component'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { DataFilterInfoComponent } from './data-filter-info/data-filter-info.component'
import { DataGrid2Component } from './date-grid-2/data-grid2.component'

import { Remult, FieldMetadata, ValueListItem, remult } from 'remult'
import { actionInfo } from 'remult/internals'

import {
  NotAuthenticatedGuard,
  AuthenticatedGuard,
  RouteHelperService,
} from './navigate-to-component-route-service'
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http'
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner'
import { BusyService, LoaderInterceptor } from './wait/busy-service'
import { MatLegacyDialog as MatDialog, MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { WaitComponent } from './wait/wait.component'
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select'
import { DataArea2Component } from './data-area/dataArea2'
import { SelectValueDialogComponent } from './add-filter-dialog/add-filter-dialog.component'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox'
import { FilterDialogComponent } from './filter-dialog/filter-dialog.component'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu'
import { BidiModule } from '@angular/cdk/bidi'
import { Repository, EntityOrderBy, EntityFilter, EntityMetadata } from 'remult'
import { CommonUIElementsPluginsService } from './CommonUIElementsPluginsService'

import { GridDialogComponent } from '../../../common/grid-dialog/grid-dialog.component'
import { dialogConfigMember } from './dialogConfigMember'

@NgModule({
  declarations: [
    DataControl2Component,
    DataArea2Component,
    DataFilterInfoComponent,
    DataGrid2Component,
    WaitComponent,
    DataControl3Component,
    SelectValueDialogComponent,
    FilterDialogComponent,
    GridDialogComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatListModule,
    MatTooltipModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatMenuModule,
    BidiModule,
    MatSelectModule,
  ],
  providers: [
    {
      provide: Remult,
      useFactory: () => remult,
    },
    NotAuthenticatedGuard,
    AuthenticatedGuard,
    RouteHelperService,
    BusyService,
    CommonUIElementsPluginsService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
  ],
  exports: [
    DataControl2Component,
    DataFilterInfoComponent,
    DataGrid2Component,
    DataArea2Component,
    SelectValueDialogComponent,
  ],
})
export class CommonUIElementsModule {
  constructor(http: HttpClient, dialog: MatDialog, zone: NgZone) {
    remult.apiClient.wrapMessageHandling = async (x) =>
      await zone.run(() => x())
    remult.apiClient.httpClient = http
    _matDialog = dialog
    actionInfo.runActionWithoutBlockingUI = async (x) =>
      await BusyService.singleInstance.donotWait(x)
    actionInfo.startBusyWithProgress = () =>
      BusyService.singleInstance.startBusyWithProgress()
  }
}
var _matDialog: MatDialog

export async function openDialog<T, C>(
  component: { new (...args: any[]): C },
  setParameters?: (it: C) => void,
  returnAValue?: (it: C) => T
): Promise<T> {
  let ref = _matDialog.open(component, (component as any)[dialogConfigMember])
  if (setParameters) setParameters(ref.componentInstance)
  ;(ref.componentInstance as WantsToCloseDialog).closeDialog = () => ref.close()
  var r
  if (ref.beforeClosed) r = await ref.beforeClosed().toPromise()
  //@ts-ignore
  else r = await ref.beforeClose().toPromise()
  if (returnAValue) return returnAValue(ref.componentInstance)
  return r
}

export interface WantsToCloseDialog {
  closeDialog: VoidFunction
}
