import { Entity } from "typeorm";
import { CommonEntity } from "../../../common/entities/common.entity";

@Entity({ name: "carts", synchronize: true })
export class CartEntity extends CommonEntity {}
