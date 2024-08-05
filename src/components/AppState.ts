import {
	FormErrors,
	IAppState,
	IBasket,
	IProduct,
	PaymentMethod,
	TOrder,
} from '../types';
import { Model } from './base/Model';

export class AppState extends Model<IAppState> {
	catalog: IProduct[] = [];
	preview: IProduct | null = null;
	basket: IBasket = {
		items: [],
	};

	order: TOrder = {
		payment: 'card',
		address: '',
		email: '',
		phone: '',
	};

	total = 0;
	formErrors: FormErrors = {};

	setCatalog(items: IProduct[]) {
		this.catalog = items;
		this.emitChanges('catalog:changed', this.catalog);
	}

	setPreview(item: IProduct) {
		this.preview = item;
		this.emitChanges('card:changed', item);
	}

	isInBasket(item: IProduct) {
		return this.basket.items.includes(item.id);
	}

	addToBasket(item: IProduct) {
		this.basket.items.push(item.id);
		this.total += item.price;
		this.events.emit('basket:changed', this.basket);
	}

	removeFromBasket(item: IProduct) {
		this.basket.items = this.basket.items.filter((id) => id !== item.id);
		this.total -= item.price;
		this.events.emit('basket:changed', this.basket);
	}

	setOrderField(field: keyof TOrder, value: string) {
		if (field === 'payment') {
			this.setPayment(value as PaymentMethod);
		} else {
			this.order[field] = value;
		}
	}

	setPayment(method: PaymentMethod) {
		this.order.payment = method;
	}

	validateOrderForm() {
		const errors: typeof this.formErrors = {};
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}
		this.formErrors = errors;
		this.events.emit('orderFormErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateContactsForm() {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}

		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}

		this.formErrors = errors;
		this.events.emit('contactsFormErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	// Вычисление общей стоимости корзины
	calculateBasketTotal(): number {
		return this.basket.items.reduce((total: number, itemId: string) => {
			const product = this.catalog.find((product) => product.id === itemId);
			return total + (product?.price || 0);
		}, 0);
	}

	// Сброс состояния корзины
	clearBasket() {
		this.basket.items = [];
		this.total = 0;
		this.events.emit('basket:changed', this.basket);
	}
}
