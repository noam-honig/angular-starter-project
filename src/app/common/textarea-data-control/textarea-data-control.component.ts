import { Component, OnInit } from '@angular/core'
import { ErrorStateMatcher } from '@angular/material/core'
import {
  CustomComponentArgs,
  CustomDataComponent,
} from '../../common-ui-elements/interfaces'

@Component({
  template: `<mat-form-field
    appearance="outline"
    class="full-width-form-field dense-form-field"
    *ngIf="args"
  >
    <mat-label>{{ args.settings.caption }}</mat-label>
    <textarea
      rows="5"
      #theId
      matInput
      [(ngModel)]="args.fieldRef.value"
      #addressInput
      [errorStateMatcher]="ngErrorStateMatches"
    >
    </textarea>
    <mat-error *ngIf="args.fieldRef.error" id="theId">{{
      args.fieldRef.error
    }}</mat-error>
  </mat-form-field>`,
})
export class TextAreaDataControlComponent
  implements OnInit, CustomDataComponent
{
  constructor() {}
  args!: CustomComponentArgs

  ngOnInit(): void {}
  ngErrorStateMatches = new (class extends ErrorStateMatcher {
    constructor(public parent: TextAreaDataControlComponent) {
      super()
    }
    override isErrorState() {
      return !!this.parent.args.fieldRef.error
    }
  })(this)
}
