export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
}

export interface IBasket {
	items: string[];
	total: number;
}

interface IPayments {
	payment: PaymentMethod;
	address: string;
}

interface IContacts {
	email: string;
	phone: string;
}

export interface IOrder extends IPayments, IContacts {}

export interface IAppState {
	catalog: IProduct[];
	cart: IBasket;
	order: IOrder;
	selectedItem?: string;
	isLoading: boolean;
	isError: boolean;
}

export type PaymentMethod = 'cash' | 'card';

export type FormErrors = Partial<Record<keyof IOrder, string>>;
