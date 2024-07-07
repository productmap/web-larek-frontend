import { Product, Order, Catalog } from './index';

export interface OrderResult {
	id: string;
	total: number;
}

export interface ResponseError {
	error: string;
}

export interface ILarekApi {
	getProducts(): Promise<Catalog>;

	getItem(id: string): Promise<Product | ResponseError>;

	order(order: Order): Promise<OrderResult | ResponseError>;
}
