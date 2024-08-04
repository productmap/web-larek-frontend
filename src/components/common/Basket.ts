import { Component } from '../base/Component';
import { createElement, ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/EventEmitter';

export class Basket extends Component<{
	items: HTMLElement[];
	total: number;
	selected: string[];
}> {
	protected itemsContainer: HTMLElement;
	protected totalElement: HTMLElement;
	protected purchaseButton: HTMLElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this.itemsContainer = ensureElement<HTMLElement>(
			'.basket__list',
			this.container
		);
		this.totalElement = this.container.querySelector('.basket__price');
		this.purchaseButton = this.container.querySelector('.basket__button');

		this.purchaseButton.addEventListener('click', () => {
			events.emit('order:open');
		});

		this.items = [];
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this.itemsContainer.replaceChildren(
				...items.map((item, index) => {
					const indexElement = item.querySelector('.basket__item-index');
					indexElement.textContent = String(index + 1);
					return item;
				})
			);
		} else {
			this.itemsContainer.replaceChildren(
				...[
					createElement<HTMLParagraphElement>('p', {
						textContent: 'Корзина пуста',
					}),
				]
			);
		}
		this.submitButtonLock(items.map((item) => item.dataset.id));
	}

	protected submitButtonLock(items: string[]) {
		this.setDisabled(this.purchaseButton, !items.length);
	}

	set total(total: number) {
		this.setText(this.totalElement, `${total} синапсов`);
	}
}
