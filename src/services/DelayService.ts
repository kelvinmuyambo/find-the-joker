export class DelayService {
    static async runDelayed(callBack, delay: number) {
        await this.runDelay(delay);
        callBack();
    }

    static async runDelay(delay: number) {
        await new Promise((resolve) => setTimeout(() => resolve(), delay));
    }
}
