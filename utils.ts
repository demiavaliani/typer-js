type Action = () => void | Promise<void>;

export class Typer {
	private elementid: string;
	private actionQueue: Action[] = [];

	constructor(elementid: string) {
		this.elementid = elementid;
	}
	
	public type(text: string, delay: number = 0): this {
		const element = document.getElementById(this.elementid)
		
		if (!element) {
			throw new Error("Incorrect selector, or element does not exist!")
		}
		
		if (!delay) {
			this.actionQueue.push(() => {
				element.innerText += text;
			})

			return this;
		}
		
		this.actionQueue.push(async () => {
			for (const letter of text) {
				await new Promise(resolve => setTimeout(resolve, delay));
				element.innerText += letter;
			}
		})

		return this;
	}

	public async go() {
		for (const action of this.actionQueue) {
			await action();
		}
	}
}