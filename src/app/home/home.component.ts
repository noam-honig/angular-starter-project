import { Component, OnInit } from '@angular/core';
import { Fields, getFields } from 'remult';
import { DataAreaSettings } from '../common-ui-elements/interfaces';

const options = {
  a: ['a', 'b', 'c'].map((x) => ({
    id: x,
    caption: x,
  })),
  b: ['d', 'e', 'f'].map((x) => ({
    id: x,
    caption: x,
  })),
};
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor() {}

  @Fields.string()
  a = 'a';
  @Fields.string()
  b = '';
  area = new DataAreaSettings({
    fields: () => {
      const $ = getFields(this);
      return [
        {
          field: $.a,
          valueList: ['a', 'b'],
        },
        {
          field: $.b,
          //@ts-ignore
          valueList:async () =>{
            //@ts-ignore
            return options[this.a] },
          valueListChangeKey: () => this.a,
        },
      ];
    },
  });

  ngOnInit() {}
}
