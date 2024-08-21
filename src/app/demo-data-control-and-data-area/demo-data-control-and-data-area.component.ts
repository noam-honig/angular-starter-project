import { Component, inject, OnInit } from '@angular/core'
import { Fields, getFields, getValueList } from 'remult'
import { DataAreaSettings } from '../common-ui-elements/interfaces'
import { UIToolsService } from '../common/UIToolsService'

const genders = ['male', 'female'] as const

@Component({
  selector: 'app-demo-data-control-and-data-area',
  templateUrl: './demo-data-control-and-data-area.component.html',
  styleUrls: ['./demo-data-control-and-data-area.component.scss'],
})
export class DemoDataControlAndDataAreaComponent {
  ui = inject(UIToolsService);

  @Fields.string()
  name = '';
  @Fields.number<DemoDataControlAndDataAreaComponent>()
  code = 0;
  @Fields.boolean()
  isOk = false;
  @Fields.dateOnly()
  today = new Date();
  @Fields.literal(() => genders)
  gender = 'male';
  @Fields.string({
    customInput: (x) => x.textarea(),
  })
  comment = '';
  area: DataAreaSettings<DemoDataControlAndDataAreaComponent> =
    new DataAreaSettings({
      fields: () => [
        this.$.name,
        this.$.code,
        {
          field: this.$.code,
          getValue: () => `value: ${this.$.code.value}`,
        },
        {
          field: this.$.code,
          hideDataOnInput: true,
          getValue: () => `value: ${this.$.code.value}`,
          click: () => this.code++,
        },
        this.$.isOk,
        this.$.today,
        { field: this.$.gender, valueList: getValueList(this.$.gender) },
        {
          field: this.$.name,
          click: async () => {
            if (await this.ui.yesNoQuestion('Clear name value?'))
              this.name = '';
          },
        },
        this.$.comment,
      ],
    });
  get $() {
    return getFields<DemoDataControlAndDataAreaComponent>(this);
  }
}
