export interface Product {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
}

export interface Catalog {
	total: number; // total number of products
	items: Product[];
}

export interface Cart {
	items: Product[];
	total: number; // total price of products
}

interface Payments {
	payment: string;
	address: string;
}

interface Contacts {
	email: string;
	phone: string;
}

export interface Order extends Payments, Contacts {
	total: number;
	items: string[];
}

export enum AppModals {
	item = 'modalitem',
	cart = 'modalcart',
	orderPayment = 'modalorderpayment',
	orderAddress = 'modalordersuccess',
	orderSuccess = 'modalordersuccess',
}

export interface AppState {
	catalog?: Catalog;
	cart?: Cart;
	order?: Order;
	selectedItem?: string;
	openedModal: AppModals;
	isLoading: boolean;
	isError: boolean;
}
