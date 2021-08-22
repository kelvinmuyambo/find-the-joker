import Phaser from 'phaser';
import {SceneService} from "~/services/SceneService";
import {Score} from "~/interfaces/Score";
import {DatabaseService} from "~/services/DatabaseService";
import ScoreTableComponent from "~/components/ScoreTableComponent";


export default class ScoreHistoryScene extends Phaser.Scene {
    scores: Score[] = [];

    constructor() {
        super('score-history');
    }

    preload() {
        this.load.image('poker_bg', 'assets/backgrounds/poker_table_bg.png');
    }

    async create() {
        SceneService.loadBackground(this, 'poker_bg');
        this.scores = await new DatabaseService().getScores();
        this.add.dom(this.scale.width / 2, this.scale.height / 2, ScoreTableComponent({
            title: 'TOP SCORES',
            scores: this.scores
        }, () => this.openGameScene()) as HTMLElement);
    }

    openGameScene() {
        this.scene.start('find-the-joker');
    }
}
