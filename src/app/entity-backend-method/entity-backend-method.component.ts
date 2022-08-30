import { Component, OnInit } from '@angular/core';
import { getEntityRef, Remult } from 'remult';
import { Product } from './products';

@Component({
  selector: 'app-entity-backend-method',
  templateUrl: './entity-backend-method.component.html',
  styleUrls: ['./entity-backend-method.component.scss']
})
export class EntityBackendMethodComponent implements OnInit {

  constructor(private remult: Remult) { }
  products: Product[] = [];
  productRepo = this.remult.repo(Product);
  ngOnInit(): void {
    this.productRepo.find().then(x => this.products = x);
  }
  add() {
    this.products.push(
      this.productRepo.create()//instead of new product
    );
  }
  async save(p: Product) {
    await this.productRepo.save(p);
    console.log(p.quantity);
  }
  async resetQuantity(p: Product) {
    await p.resetQuantity()
    await getEntityRef(p).reload();
    console.log(p.quantity);
  }

}
