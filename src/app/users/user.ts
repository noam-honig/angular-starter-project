import { IdEntity, Entity, Validators, isBackend, Allow, Fields, BackendMethod, Remult } from "remult";
import { Roles } from './roles';
import { terms } from "../terms";

@Entity<User>("Users", {
    allowApiRead: Allow.authenticated,
    allowApiUpdate: Allow.authenticated,
    allowApiDelete: Roles.admin,
    allowApiInsert: Roles.admin
},
    (options, remult) => {
        options.apiPrefilter = !remult.isAllowed(Roles.admin) ? { id: remult.user.id } : {};
        options.saving = async (user) => {
            if (isBackend()) {
                if (user._.isNew()) {
                    user.createDate = new Date();
                }
            }
        }
    }
)
export class User extends IdEntity {
    @Fields.string({
        validate: [Validators.required, Validators.uniqueOnBackend],
        caption: terms.username
    })
    name = '';
    @Fields.string({ includeInApi: false })
    password = '';
    @Fields.date({
        allowApiUpdate: false
    })
    createDate = new Date();

    @Fields.boolean({
        allowApiUpdate: Roles.admin,
        caption: terms.admin
    })
    admin = false;

    async hashAndSetPassword(password: string) {
        this.password = (await import('password-hash')).generate(password);
    }
    async passwordMatches(password: string) {
        return !this.password || (await import('password-hash')).verify(password, this.password);
    }
    @BackendMethod({ allowed: Roles.admin })
    async resetPassword() {
        this.password = '';
        await this.save();
    }
}
