import { Api, ApiListResponse } from './base/api';
import { ILarekApi, IOrderResult, IResponseError } from '../types/api';
import { IOrder, IProduct } from '../types';

/**
 * Класс LarekApi предоставляет методы для взаимодействия с API ларька.
 */
export class LarekApi extends Api implements ILarekApi {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	/**
	 * Получение списка продуктов.
	 * @return {Promise<IProduct[] | IResponseError>} - Промис, который разрешается в массив продуктов или ошибку.
	 */
	async getProducts(): Promise<IProduct[] | IResponseError> {
		try {
			const data = (await this.get('/product')) as ApiListResponse<IProduct>;
			return data.items.map((item) => ({
				...item,
				image: `${this.cdn}${item.image}`,
			}));
		} catch (error: unknown) {
			return error as IResponseError;
		}
	}

	/**
	 * Получение конкретного продукта по его идентификатору.
	 * @param id - Идентификатор продукта.
	 * @return {Promise<IProduct | IResponseError>} - Промис, который разрешается в объект продукта или ошибку.
	 */
	async getProduct(id: string): Promise<IProduct | IResponseError> {
		try {
			const item = (await this.get(`/product/${id}`)) as IProduct;
			return {
				...item,
				image: `${this.cdn}${item.image}`,
			};
		} catch (error) {
			return error;
		}
	}

	/**
	 * Отправка заказа.
	 * @param order - Заказ, который нужно отправить.
	 * @return {Promise<IOrderResult | IResponseError>} - Промис, который разрешается в объект результата заказа или ошибку.
	 */
	async sendOrder(order: IOrder): Promise<IOrderResult | IResponseError> {
		try {
			return (await this.post('/order', order)) as IOrderResult;
		} catch (error) {
			return error;
		}
	}
}
