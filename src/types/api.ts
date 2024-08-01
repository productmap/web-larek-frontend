import { IProduct, IOrder } from './index';

export interface IOrderResult {
	id: string;
	total: number;
}

export interface IResponseError {
	error: string;
}

/**
 * Интерфейс для работы с API ларька.
 * Предоставляет методы для получения продуктов, конкретного продукта и отправки заказа.
 */

export interface ILarekApi {
	// Получение списка продуктов.
	getProducts(): Promise<IProduct[] | IResponseError>;

	// Получение конкретного продукта по его идентификатору.
	getProduct(id: string): Promise<IProduct | IResponseError>;

	// Отправка заказа.
	sendOrder(order: IOrder): Promise<IOrderResult | IResponseError>;
}
