type Action = () => void | Promise<void>;

export class Typer {
	private element: HTMLElement;
	private caret: Caret | undefined;
	private actionQueue: Action[] = [];

	constructor(elementid: string) {
		const element = document.getElementById(elementid);

		if (!element) {
			throw new Error("Incorrect selector, or element does not exist!");
		}

		this.element = element;
	}

	public type(text: string, delay: number = 0): this {
		if (!delay) {
			this.actionQueue.push(() => {
				this.element.innerText += text;
			});

			return this;
		}

		this.actionQueue.push(async () => {
			for (const letter of text) {
				await new Promise((resolve) => setTimeout(resolve, delay));
				this.element.innerText += letter;
			}
		});

		return this;
	}

	public moveCaret(position: number): this {
		this.actionQueue.push(() => {
			if (!this.caret) {
				this.caret = new Caret(this.element, position);

				this.caret.setUpCaret();
			}

			this.caret.addCaret();
		});

		return this;
	}

	public async go() {
		for (const action of this.actionQueue) {
			await action();
		}
	}
}

class Caret {
	private element: HTMLElement;
	private range: Range | undefined;
	private selection: Selection | null | undefined;
	private textNode: ChildNode | null | undefined;
	private position: number;

	constructor(element: HTMLElement, position: number) {
		this.element = element;
		this.position = position;
	}

	public setUpCaret() {
		this.textNode = this.element.firstChild;
		this.range = new Range();
		this.selection = window.getSelection();
	}

	public addCaret() {
		if (this.textNode && this.range && this.selection) {
			this.element.focus();

			this.range.setStart(this.textNode, this.position);
			this.range.setEnd(this.textNode, this.position);

			this.selection.removeAllRanges();
			this.selection.addRange(this.range);

			this.addFocusChangeEventListener();
		}
	}

	private addFocusChangeEventListener() {
		document.onclick = () => {
			this.addCaret();
		};
	}
}
