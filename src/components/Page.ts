import { Component } from './base/Component';
import { IEvents } from './base/EventEmitter';
import { ensureElement } from '../utils/utils';

interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

export class Page extends Component<IPage> {
	protected _counter: HTMLElement;
	protected _setCatalog: HTMLElement;
	protected _wrapper: HTMLElement;
	protected _basket: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._counter = ensureElement<HTMLElement>('.header__basket-counter');
		this._setCatalog = ensureElement<HTMLElement>('.gallery');
		this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
		this._basket = ensureElement<HTMLElement>('.header__basket');

		this._basket.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}

	// отрисовка каталога
	set setCatalog(items: HTMLElement[]) {
		this._setCatalog.replaceChildren(...items);
	}

	// блокировка каталога
	set lockPage(value: boolean) {
		this._wrapper.classList.toggle('page__wrapper_locked', value);
	}

	// количества продуктов в корзине
	set setBasketCounter(value: number) {
		this.setText(this._counter, String(value));
	}
}
