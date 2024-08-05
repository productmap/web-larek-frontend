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
}

interface IPayments {
	payment: PaymentMethod;
	address: string;
}

interface IContacts {
	email: string;
	phone: string;
}

export interface IOrder extends IPayments, IContacts {
	total: number;
}
export type TOrder = IPayments & IContacts;

export interface IAppState {
	catalog: IProduct[];
	basket: IBasket;
	order: TOrder;
	preview: IProduct | null;
	isLoading: boolean;
	isError: boolean;
	total: number;
}

export type PaymentMethod = 'cash' | 'card';

export type FormErrors = Partial<Record<keyof IOrder, string>>;
