import {DelayService} from "~/services/DelayService";
import FindTheJokerScene from "~/scenes/FindTheJokerScene";

export class CardShuffleService {
    jokerScene: FindTheJokerScene;
    constructor(jokerScene: FindTheJokerScene) {
        this.jokerScene = jokerScene;
    }

    async doShuffle() {
        DelayService.runDelayed(() => this.jokerScene.soundBoard.play('shuffle'), 1000).then(console.log)
        for (let i = 0; i < this.jokerScene.shuffleCount; i++) {
            await this.doTimedShuffle();
        }
        this.jokerScene.soundBoard.stop('shuffle');
    }

    doTimedShuffle = () => DelayService.runDelayed(() => this.fisherYatesShuffle(), 1000);

    fisherYatesShuffle() {
        for (let i = this.jokerScene.gridItems.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = this.jokerScene.gridItems[i];
            this.jokerScene.gridItems[i] = this.jokerScene.gridItems[j];
            this.jokerScene.gridItems[j] = temp;
        }
        this.jokerScene.assignCardsToGrid();
    }

}
