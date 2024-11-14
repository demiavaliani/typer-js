export class Typer {
    elementid;
    actionQueue = [];
    constructor(elementid) {
        this.elementid = elementid;
    }
    type(text, delay = 0) {
        const element = document.getElementById(this.elementid);
        if (!element) {
            throw new Error("Incorrect selector, or element does not exist!");
        }
        if (!delay) {
            this.actionQueue.push(() => {
                element.innerText += text;
            });
            return this;
        }
        this.actionQueue.push(async () => {
            for (const letter of text) {
                await new Promise(resolve => setTimeout(resolve, delay));
                element.innerText += letter;
            }
        });
        return this;
    }
    async go() {
        for (const action of this.actionQueue) {
            await action();
        }
    }
}
//# sourceMappingURL=utils.js.map