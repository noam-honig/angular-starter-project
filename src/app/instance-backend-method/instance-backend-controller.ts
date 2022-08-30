import { BackendMethod, Controller, Fields, Validators } from "remult";

@Controller("instanceBackendController")
export class InstanceBackendController {
    @Fields.string({
        validate: Validators.required
    })
    what = '';
    @BackendMethod({ allowed: true })
    async myDoSomething() {
        console.log("Do something " + this.what);
    }
}