import { Allow, BackendMethod, Controller, ControllerBase, Fields, Validators } from "remult";
import { terms } from "../terms";
import { User } from "./user";

@Controller("updatePassword")
export class UpdatePasswordController extends ControllerBase {
    @Fields.string({
        caption: terms.password,
        validate: Validators.required,
        inputType: 'password'
    })
    password = '';
    @Fields.string<UpdatePasswordController>({
        caption: terms.confirmPassword,
        validate: [Validators.required, self => {
            if (self.password != self.confirmPassword)
                throw terms.doesNotMatchPassword;
        }],
        inputType: 'password'
    })
    confirmPassword = '';

    @BackendMethod({ allowed: Allow.authenticated })
    async updatePassword() {
        const user = await this.remult.repo(User).findId(this.remult.user.id);
        await user.hashAndSetPassword(this.password);
        await user.save();
    }
}