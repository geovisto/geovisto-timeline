/**
 * The Subject interface declares a set of methods for managing subscribers.
 */
export class Subject<CallbackParams> {
    private callbacks: Array<(params: CallbackParams) => void> = [];

    public subscribe(callback: (params: CallbackParams) => void): void {
        this.callbacks.push(callback);
    }

    public notify(params: CallbackParams): void {
        this.callbacks.forEach(callback => callback(params));
    }
}
