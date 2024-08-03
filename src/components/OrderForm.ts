import { Form } from './common/Form';
import { IEvents } from './base/EventEmitter';
import { ensureElement } from '../utils/utils';
import { PaymentMethod } from '../types';

type TOrderForm = {
	payment: PaymentMethod;
	address: string;
};

export class OrderForm extends Form<TOrderForm> {
	private _payment: PaymentMethod = 'card';
	private _address: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		const paymentButtons = ['card', 'cash'];
		paymentButtons.forEach((name) => {
			const button = ensureElement<HTMLButtonElement>(
				`.button_alt[name=${name}]`,
				this.container
			);

			button.addEventListener('click', () => {
				this.payment = name as PaymentMethod;
				this.onInputChange('payment', name);
			});

			if (name === this._payment) {
				button.classList.add('button_alt-active');
			}
		});

		this._address = ensureElement<HTMLInputElement>(
			'.form__input[name=address]',
			this.container
		);
	}

	set payment(value: PaymentMethod) {
		this._payment = value;
		const buttons = Array.from(document.querySelectorAll('.button_alt'));
		buttons.forEach((button) => {
			button.classList.toggle(
				'button_alt-active',
				button.getAttribute('name') === this._payment
			);
		});
	}
}
