import Phaser from "phaser";
import FindTheJokerScene from "~/scenes/FindTheJokerScene";
import {Scoreboard} from "~/models/Scoreboard";

export class ScoreboardComponent extends Phaser.GameObjects.Text {
    static keys = [Scoreboard.LEVEL, Scoreboard.LIVES, Scoreboard.SCORE];
    scene: Phaser.Scene;

    constructor(scene: FindTheJokerScene) {
        super(scene, 20, 20, 'Scoreboard', null as any);
        this.scene = scene;
        const style: Phaser.GameObjects.TextStyle | any = {
            color: 'orange',
            fontSize: '20px'
        };
        this.setStyle(style);
        this.reset();
        scene.add.existing(this);
    }

    load() {
        const data = ScoreboardComponent.keys.map(key => `${key}: ${this.scene.data.get(key)}`);
        const text = data.join('     ');
        this.setText(text);
    }

    reset() {
        this.scene.data.set(Scoreboard.LIVES, 3);
        this.scene.data.set(Scoreboard.LEVEL, 1);
        this.scene.data.set(Scoreboard.SCORE, 0);
        this.scene.data.set(Scoreboard.SPEED, 1000);
        this.scene.data.set(Scoreboard.CARDS, 2);
        this.scene.data.set(Scoreboard.SHUFFLES, 3);
    }

    wrongSelection(): boolean {
        const lives: number = this.scene.data.get(Scoreboard.LIVES);
        if (lives == 0) return false;
        this.scene.data.set(Scoreboard.LIVES, lives - 1);
        this.load();
        return true;
    }

    correctSelection() {
        const shuffles: number = this.scene.data.get(Scoreboard.SHUFFLES);
        if (shuffles >= 4) {
            const cards = this.scene.data.get(Scoreboard.CARDS);
            const level = this.scene.data.get(Scoreboard.LEVEL);
            this.scene.data.set(Scoreboard.CARDS, cards + 1);
            this.scene.data.set(Scoreboard.SHUFFLES, 3);
            this.scene.data.set(Scoreboard.LEVEL, level + 1);
        } else {
            this.scene.data.set(Scoreboard.SHUFFLES, shuffles + 1);
        }
        const score = this.scene.data.get(Scoreboard.SCORE);
        this.scene.data.set(Scoreboard.SCORE, score + 10);
    }
}
