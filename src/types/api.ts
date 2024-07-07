import { Product, Order } from './index';

export interface OrderResult {
	id: string;
	total: number;
}

export interface ResponseError {
	error: string;
}

export interface ILarekApi {
	getProducts(): Promise<Product[] | ResponseError>;

	sendOrder(order: Order): Promise<OrderResult | ResponseError>;
}
