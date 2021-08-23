import {Card} from "~/components/Card";
import {DelayService} from "~/services/DelayService";
import FindTheJokerScene from "~/scenes/FindTheJokerScene";
import {Score} from "~/interfaces/Score";
import {Scoreboard} from "~/models/Scoreboard";
import {DatabaseService} from "~/services/DatabaseService";
import GameScoreComponent from "~/components/GameScoreComponent";
import {CardShuffleService} from "~/services/CardShuffleService";

export class CardSelectionService {
    jokerScene: FindTheJokerScene;

    constructor(jokerScene: FindTheJokerScene) {
        this.jokerScene = jokerScene;
    }

    async cardSelected(card: Card) {
        const isJoker = card.face == 'joker';
        if (!this.jokerScene.ready) return;
        this.jokerScene.ready = false;
        card.flip();
        this.jokerScene.soundBoard.play(isJoker ? 'correct_card' : 'wrong_card');
        await DelayService.runDelay(1000 + this.jokerScene.shuffleSpeed);
        card.flip();
        await DelayService.runDelay(1000);
        if (!isJoker) {
            const hasLife = await this.wrongCardSelected();
            if (!hasLife) return;
        } else await this.correctCardSelected();
        this.jokerScene.scoreBoard.load();
        this.jokerScene.ready = true;
    }

    async wrongCardSelected() {
        const hasLife = this.jokerScene.scoreBoard.wrongSelection();
        const jokerCard = this.jokerScene.cards.find(f => f.face == 'joker');
        if (jokerCard) {
            jokerCard.flip();
            await DelayService.runDelay(1000);
            jokerCard.flip();
        }
        if (hasLife) await new CardShuffleService(this.jokerScene).doShuffle();
        else await this.initiateGameOver();
        return hasLife;
    }

    async correctCardSelected() {
        this.jokerScene.scoreBoard.correctSelection();
        this.loadScoreBoardData();
        this.jokerScene.cards.forEach(card => card.removeCard());
        this.jokerScene.cards = [];
        await DelayService.runDelay(1000);
        this.jokerScene.loadCards();
    }


    async initiateGameOver() {
        const score: Score = {
            score: this.jokerScene.data.get(Scoreboard.SCORE),
            level: this.jokerScene.data.get(Scoreboard.LEVEL),
            date: new Date()
        };
        await new DatabaseService().saveScore(score);
        await this.loadScore(score);
    }

    async loadScore(score: Score) {
        const scores = await new DatabaseService().getScores();
        this.jokerScene.cards.forEach(card => card.removeCard());
        this.jokerScene.scoreBoard.destroy();
        const x = this.jokerScene.scale.width / 2;
        const y = this.jokerScene.scale.height / 2;
        const action = (scene: string) => {
            if (!scene) {
                this.jokerScene.cards = [];
                return this.jokerScene.scene.restart();
            }
            this.jokerScene.scene.start(scene);
        };
        const gameScoreComponent: HTMLElement = GameScoreComponent(scores, score, action);
        this.jokerScene.add.dom(x, y, gameScoreComponent);
    }

    loadScoreBoardData() {
        this.jokerScene.shuffleSpeed = this.jokerScene.data.get(Scoreboard.SPEED);
        this.jokerScene.shuffleCount = this.jokerScene.data.get(Scoreboard.SHUFFLES);
    }
}
