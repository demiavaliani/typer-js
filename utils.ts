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

				if (!this.caret) {
					this.caret = new Caret(this.element);
				}

				this.caret.addCaret(this.element.innerText.length);
			});

			return this;
		}

		this.actionQueue.push(async () => {
			if (!this.caret) {
				this.caret = new Caret(this.element);
			}

			for (const letter of text) {
				await new Promise((resolve) => setTimeout(resolve, delay));
				this.element.innerText += letter;

				this.caret.addCaret(this.element.innerText.length);
			}
		});

		return this;
	}

	public moveCaret(position: number): this {
		this.actionQueue.push(() => {
			if (!this.caret) {
				this.caret = new Caret(this.element);
			}

			this.caret.addCaret(position);
		});

		return this;
	}

	public async go() {
		for (const action of this.actionQueue) {
			await action();
		}

		this.actionQueue = [];
	}
}

class Caret {
	private element: HTMLElement;
	private range: Range | undefined;
	private selection: Selection | null | undefined;
	private textNode: ChildNode | null | undefined;
	private position: number = 0;

	constructor(element: HTMLElement) {
		this.element = element;
	}

	public addCaret(position: number) {
		this.textNode = this.element.firstChild;
		this.range = new Range();
		this.selection = window.getSelection();

		if (this.textNode && this.range && this.selection) {
			this.position = position;

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
			this.addCaret(this.position);
		};
	}
}
