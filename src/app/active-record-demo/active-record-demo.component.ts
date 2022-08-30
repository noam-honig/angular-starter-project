import { Component, OnInit } from '@angular/core';
import { Remult } from 'remult';
import { Product2 } from './product2';

@Component({
  selector: 'app-active-record-demo',
  templateUrl: './active-record-demo.component.html',
  styleUrls: ['./active-record-demo.component.scss']
})
export class ActiveRecordDemoComponent implements OnInit {

  constructor(private remult: Remult) { }
  products: Product2[] = [];
  repo = this.remult.repo(Product2);
  ngOnInit(): void {
    this.repo.find().then(x => this.products = x);
  }
  add() {
    this.products.push(this.repo.create());
  }
  async save(p: Product2) {
    
    await p.save();
  }

}
