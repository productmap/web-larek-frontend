import { Component } from '../base/Component';
import { createElement, ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/events';

export class Basket extends Component<{
	items: HTMLElement[];
	total: number;
	selected: string[];
}> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');

		this._button.addEventListener('click', () => {
			events.emit('order:open');
		});

		this.items = [];
	}

	set items(items: HTMLElement[]) {
		this._list.replaceChildren(
			...(items.length
				? items
				: [
						createElement<HTMLParagraphElement>('p', {
							textContent: 'Корзина пуста',
						}),
				  ])
		);
	}

	set submitButtonLock(items: string[]) {
		this.setDisabled(this._button, !items.length);
	}

	set total(total: number) {
		this.setText(this._total, `${total} синапсов`);
	}
}
