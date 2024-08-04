import './scss/styles.scss';

import { EventEmitter } from './components/base/EventEmitter';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { LarekApi } from './components/LarekApi';
import { Modal } from './components/common/Modal';
import { Page } from './components/Page';
import { Basket } from './components/common/Basket';
import { AppState } from './components/AppState';
import { Card } from './components/Card';
import { IOrder, IProduct } from './types';
import { OrderForm } from './components/OrderForm';
import { Success } from './components/common/Success';
import { ContactsForm } from './components/СontactsForm';
import { IOrderResult } from './types/api';

const events = new EventEmitter();
const api = new LarekApi(CDN_URL, API_URL);

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модель данных приложения
const appState = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Все модули
const basket = new Basket(cloneTemplate(basketTemplate), events);
const orderForm = new OrderForm(cloneTemplate(orderTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate), events);
const success = new Success(cloneTemplate(successTemplate), {
	onClick: () => modal.close(),
});

// Отрисовка каталога
events.on('catalog:changed', (items: IProduct[]) => {
	page.setCatalog = items.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render(item);
	});
});

// Выборы карточки
events.on('card:select', (item: IProduct) => {
	appState.setPreview(item);
});

// Добавили карточку в корзину
events.on('card:changed', (item: IProduct) => {
	const card = new Card(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			if (appState.isInBasket(item)) {
				appState.removeFromBasket(item);
				card.button = 'В корзину';
			} else {
				appState.addToBasket(item);
				card.button = 'Удалить из корзины';
			}
		},
	});

	card.button = appState.isInBasket(item) ? 'Удалить из корзины' : 'В корзину';
	modal.render({ content: card.render(item) });
});

// Открытие корзины
events.on('basket:open', () => {
	modal.render({
		content: basket.render(),
	});
});

// Изменение карточки в корзине
events.on('basket:changed', () => {
	page.setBasketCounter = appState.basket.items.length;
	basket.items = appState.basket.items.map((id) => {
		const item = appState.catalog.find((item) => item.id === id);
		const card = new Card(cloneTemplate(cardBasketTemplate), {
			onClick: () => appState.removeFromBasket(item),
		});
		return card.render(item);
	});

	basket.total = appState.basket.total;
});

// Открытие заказа
events.on('order:open', () => {
	modal.render({
		content: orderForm.render({
			payment: 'card',
			valid: false,
			errors: [],
		}),
	});
});

// Обработка формы заказа
events.on(
	/^order\..*:change$/,
	(data: { field: keyof IOrder; value: string }) => {
		appState.setOrderField(data.field, data.value);
		appState.validateOrderForm();
	}
);

// Обработка ошибок формы заказа
events.on('orderFormErrors:change', (error: Partial<IOrder>) => {
	const { payment, address } = error;
	const formIsValid = !payment && !address;
	orderForm.valid = formIsValid;
	orderForm.errors = formIsValid ? '' : address;
});

// Передача данных форм
events.on('order:submit', () => {
	modal.render({
		content: contactsForm.render({
			valid: false,
			errors: [],
		}),
	});
});

// Обработка формы контактов
events.on(
	/^contacts\..*:change$/,
	(data: { field: keyof IOrder; value: string }) => {
		appState.setOrderField(data.field, data.value);
		appState.validateContactsForm();
	}
);

// Обработка ошибок формы контактов
events.on('contactsFormErrors:change', (error: Partial<IOrder>) => {
	const { email, phone } = error;
	const formIsValid = !email && !phone;
	contactsForm.valid = formIsValid;
	contactsForm.errors = formIsValid ? '' : email || phone;
});

// Отправка заказа
events.on('contacts:submit', () => {
	api
		.sendOrder({ ...appState.order, ...appState.basket })
		.then((data: IOrderResult) => {
			modal.render({
				content: success.render(),
			});
			success.total = data.total;
			appState.clearBasket();
			console.log(data);
		})
		.catch(console.error);
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	page.lockPage = true;
});

// ... и разблокируем
events.on('modal:close', () => {
	page.lockPage = false;
});

// Получаем лоты с сервера
api
	.getProducts()
	.then(appState.setCatalog.bind(appState))
	.catch((err) => {
		console.error(err);
	});
