import { Form } from './common/Form';
import { ensureElement } from '../utils/utils';
import { IEvents } from './base/EventEmitter';

type TContactsForm = {
	email: string;
	phone: string;
};

export class ContactsForm extends Form<TContactsForm> {
	protected _email: HTMLInputElement;
	protected _phone: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._email = ensureElement<HTMLInputElement>(
			'.form__input[name=email]',
			this.container
		);
		this._phone = ensureElement<HTMLInputElement>(
			'.form__input[name=phone]',
			this.container
		);
	}
}
