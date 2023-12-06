import { Component, OnInit } from '@angular/core'
import { ErrorStateMatcher } from '@angular/material/core'
import {
  CustomComponentArgs,
  CustomDataComponent,
} from '../../common-ui-elements/interfaces'

@Component({
  template: `<div
    appearance="outline"
    class="full-width-form-field dense-form-field"
    *ngIf="args"
  >
    <input
      #fileInput
      type="file"
      (input)="onFileInput($event)"
      accept="image/*"
      id="uploadImage"
      style="display: none"
    />
    <button mat-button>
      <label for="uploadImage" style="display: flex; align-items: center">
        <mat-icon>photo_camera</mat-icon>&nbsp; תמונה של הציוד
      </label>
    </button>
    <img [src]="getImageSrc()" *ngIf="this.args.fieldRef.value" width="200" />
  </div>`,
})
export class InputImageComponent implements OnInit, CustomDataComponent {
  constructor() {}
  args!: CustomComponentArgs

  getImageSrc() {
    return this.args.fieldRef.value
  }

  private async loadFiles(files: any) {
    for (let index = 0; index < files.length; index++) {
      const file = files[index]
      let f: File = file
      await new Promise((res) => {
        var fileReader = new FileReader()

        fileReader.onload = async (e: any) => {
          var img = new Image()

          var canvas = document.createElement('canvas')
          if (true) {
            img.onload = async () => {
              var ctx = canvas.getContext('2d')!
              ctx.drawImage(img, 0, 0)

              var MAX_WIDTH = 800
              var MAX_HEIGHT = 600
              var width = img.width
              var height = img.height

              if (width > height) {
                if (width > MAX_WIDTH) {
                  height *= MAX_WIDTH / width
                  width = MAX_WIDTH
                }
              } else {
                if (height > MAX_HEIGHT) {
                  width *= MAX_HEIGHT / height
                  height = MAX_HEIGHT
                }
              }
              canvas.width = width
              canvas.height = height
              var ctx = canvas.getContext('2d')!
              ctx.drawImage(img, 0, 0, width, height)

              var dataurl = canvas.toDataURL('image/png')
              this.args.fieldRef.value = dataurl
            }
            img.src = e.target.result.toString()
          }
          //   this.image.image.value = e.target.result.toString();
          //   this.image.fileName.value = f.name;
          res({})
        }
        fileReader.readAsDataURL(f)
      })
    }
  }

  onFileInput(e: any) {
    this.loadFiles(e.target.files)
  }

  ngOnInit(): void {}
  ngErrorStateMatches = new (class extends ErrorStateMatcher {
    constructor(public parent: InputImageComponent) {
      super()
    }
    override isErrorState() {
      return !!this.parent.args.fieldRef.error
    }
  })(this)
}
