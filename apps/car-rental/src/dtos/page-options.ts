import { Order } from "../enums/order";

export type PageOptions = {
    readonly sortField?: string;
    readonly order?: Order;
    readonly page?: number;
    readonly take?: number;
}