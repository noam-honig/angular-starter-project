import { Entity, EntityBase, Fields, IdEntity } from "remult";

@Entity("products2", { allowApiCrud: true })
export class Product2 extends IdEntity {
    @Fields.string({
        caption:"Product Name"
    })
    name = '';
}