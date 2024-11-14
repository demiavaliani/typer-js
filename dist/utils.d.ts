export declare class Typer {
    private elementid;
    private actionQueue;
    constructor(elementid: string);
    type(text: string, delay?: number): this;
    go(): Promise<void>;
}
//# sourceMappingURL=utils.d.ts.map