import { Injectable, NgZone, ErrorHandler } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Remult } from 'remult'

import { YesNoQuestionComponent } from './yes-no-question/yes-no-question.component'
import {
  BusyService,
  CommonUIElementsPluginsService,
  openDialog,
  SelectValueDialogComponent,
} from 'common-ui-elements'
import { terms } from '../terms'
import {
  GridDialogArgs,
  InputAddressResult,
  AreaDialogArgs,
  UITools,
  MultiSelectOptions,
} from './UITools'
import { TextAreaDataControlComponent } from './textarea-data-control/textarea-data-control.component'
import { AddressInputComponent } from './address-input/address-input.component'
import { User } from '../users/user'
import { InputImageComponent } from './input-image/input-image.component'
import { MultiSelectListDialogComponent } from './multi-select-list-dialog/multi-select-list-dialog.component'

@Injectable()
export class UIToolsService implements UITools {
  report(what: string, context: string, taskId?: string) {}
  constructor(
    zone: NgZone,
    private snackBar: MatSnackBar,
    commonUIPlugin: CommonUIElementsPluginsService,
    private busy: BusyService
  ) {
    this.mediaMatcher.addListener((mql) =>
      zone.run(() => /*this.mediaMatcher = mql*/ ''.toString())
    )
    this.enhanceFieldOptionsAndDataControlOptions(commonUIPlugin)
  }
  multiSelectValueDialog<T>(args: MultiSelectOptions<T>): Promise<void> {
    return openDialog(MultiSelectListDialogComponent, (x) => x.args(args))
  }

  info(info: string): any {
    this.snackBar.open(info, 'סגור', { duration: 4000 })
  }
  async error(err: any, taskId?: string) {
    const message = extractError(err)
    if (message == 'Network Error') return
    this.report('שגיאה', message, taskId)
    return await openDialog(
      YesNoQuestionComponent,
      (d) =>
        (d.args = {
          message,
          isAQuestion: false,
        })
    )
  }
  async gridDialog(args: GridDialogArgs): Promise<void> {
    await openDialog(
      (
        await import('./grid-dialog/grid-dialog.component')
      ).GridDialogComponent,
      (x) => (x.args = args)
    )
  }
  async areaDialog(args: AreaDialogArgs): Promise<void> {
    await openDialog(
      (
        await import('./data-area-dialog/data-area-dialog.component')
      ).DataAreaDialogComponent,
      (x) => (x.args = args)
    )
  }
  private mediaMatcher: MediaQueryList = matchMedia(`(max-width: 720px)`)

  isScreenSmall() {
    return this.mediaMatcher.matches
  }
  async yesNoQuestion(question: string) {
    return await openDialog(
      YesNoQuestionComponent,
      (d) => (d.args = { message: question }),
      (d) => d.okPressed
    )
  }
  async confirmDelete(of: string) {
    return await this.yesNoQuestion(
      terms.areYouSureYouWouldLikeToDelete + ' ' + of + '?'
    )
  }

  async selectValuesDialog<T extends { caption?: string }>(args: {
    values: T[]
    onSelect: (selected: T) => void
    title?: string
  }): Promise<void> {
    await openDialog(SelectValueDialogComponent, (x) => x.args(args))
  }
  private enhanceFieldOptionsAndDataControlOptions(
    commonUIPlugin: CommonUIElementsPluginsService
  ) {
    commonUIPlugin.dataControlAugmenter = (fieldMetadata, options) => {
      if (fieldMetadata?.options.clickWithUI) {
        if (!options.click) {
          options.click = (entity, fieldRef) =>
            fieldMetadata.options.clickWithUI!(this, entity, fieldRef)
        }
      }
      if (fieldMetadata.options.valueList && !options.valueList)
        options.valueList = fieldMetadata.options.valueList
      if (fieldMetadata.options.width)
        options.width = fieldMetadata.options.width
      if (fieldMetadata.options.customInput && !options.customComponent) {
        fieldMetadata.options.customInput({
          image() {
            {
              options.customComponent = {
                component: InputImageComponent,
              }
            }
          },
          textarea() {
            options.customComponent = {
              component: TextAreaDataControlComponent,
            }
          },
          inputAddress(
            onSelect?: (result: InputAddressResult, entityInstance: any) => void
          ) {
            options.customComponent = {
              component: AddressInputComponent,
              args: onSelect,
            }
          },
        })
      }
    }
  }
}
@Injectable()
export class ShowDialogOnErrorErrorHandler extends ErrorHandler {
  constructor(private ui: UIToolsService, private zone: NgZone) {
    super()
  }
  lastErrorString = ''
  lastErrorTime!: number
  override async handleError(error: any) {
    super.handleError(error)
    if (
      this.lastErrorString == error.toString() &&
      new Date().valueOf() - this.lastErrorTime < 100
    )
      return
    this.lastErrorString = error.toString()
    this.lastErrorTime = new Date().valueOf()
    this.zone.run(() => {
      this.ui.error(error)
    })
  }
}

export function extractError(err: any): string {
  if (typeof err === 'string') return err
  if (err.modelState) {
    if (err.message) return err.message
    for (const key in err.modelState) {
      if (err.modelState.hasOwnProperty(key)) {
        const element = err.modelState[key]
        return key + ': ' + element
      }
    }
  }
  if (err.rejection) return extractError(err.rejection) //for promise failed errors and http errors
  if (err.httpStatusCode == 403) return 'אינך מורשה פעולה זו'
  if (err.message) {
    let r = err.message
    if (err.error && err.error.message) r = err.error.message
    return r
  }
  if (err.error) return extractError(err.error)

  return JSON.stringify(err)
}
