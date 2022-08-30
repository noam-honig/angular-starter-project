import { BackendMethod, Entity, Fields, getEntityRef, isBackend } from "remult";

@Entity("products", {
    allowApiCrud: true
})
export class Product {
    @Fields.uuid()
    id?: string;
    @Fields.string<Product>({
        validate: async product => {
            if (isBackend()) {
                if (getEntityRef(this).isNew()) {

                }
            }
        }
    })
    name = '';
    @Fields.integer({
        allowApiUpdate: false
    })
    quantity = 0;
    @BackendMethod({ allowed: true })
    async resetQuantity() {
        this.quantity = 5;
        await getEntityRef(this).save();
    }
}