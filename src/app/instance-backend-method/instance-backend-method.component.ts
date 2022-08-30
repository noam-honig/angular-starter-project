import { Component, OnInit } from '@angular/core';
import { InstanceBackendController } from './instance-backend-controller';

@Component({
  selector: 'app-instance-backend-method',
  templateUrl: './instance-backend-method.component.html',
  styleUrls: ['./instance-backend-method.component.scss']
})
export class InstanceBackendMethodComponent implements OnInit {

  constructor() { }
  me = new InstanceBackendController();
  ngOnInit(): void {
  }
  call() {
    this.me.myDoSomething();
  }


}
