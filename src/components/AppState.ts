import {
	FormErrors,
	IAppState,
	IBasket,
	IOrder,
	IProduct,
	PaymentMethod,
} from '../types';
import { Model } from './base/Model';

export class AppState extends Model<IAppState> {
	catalog: IProduct[] = [];
	preview: IProduct | null = null;
	basket: IBasket = {
		items: [],
		total: 0,
	};

	order: IOrder = {
		payment: 'card',
		address: '',
		email: '',
		phone: '',
	};

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
		this.basket.total += item.price;
		this.events.emit('basket:changed', this.basket);
	}

	removeFromBasket(item: IProduct) {
		this.basket.items = this.basket.items.filter((id) => id !== item.id);
		this.basket.total -= item.price;
		this.events.emit('basket:changed', this.basket);
	}

	setOrderField(field: keyof IOrder, value: string) {
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

	// Сброс состояния корзины
	clearBasket() {
		this.basket.items = [];
		this.basket.total = 0;
		this.events.emit('basket:changed', this.basket);
	}
}
