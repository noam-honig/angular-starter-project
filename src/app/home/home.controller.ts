import { BackendMethod } from "remult";

export class HomeController {
    @BackendMethod({ allowed: true })
    static async doSomething(what: string) {
        console.log("Something" + what);
    }
}