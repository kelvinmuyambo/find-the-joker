import Phaser from 'phaser'
import {Card} from "~/components/Card";
import {CountDownText} from "~/components/CountDownText";
import {ScoreboardComponent} from "~/components/ScoreboardComponent";
import {Scoreboard} from "~/models/Scoreboard";
import MuteComponent from "~/components/MuteComponent";
import {SoundBoardService} from "~/services/SoundBoardService";
import {DelayService} from "~/services/DelayService";
import {Score} from "~/interfaces/Score";
import {DatabaseService} from "~/services/DatabaseService";
import GameScoreComponent from "~/components/GameScoreComponent";
import CardDeckScene from "~/scenes/CardDeckScene";
import {SceneService} from "~/services/SceneService";

export default class FindTheJokerScene extends CardDeckScene {
    // TODO: CLASS DECONGESTING, DEDICATE OTHER FUNCTIONALITY TO ANOTHER CLASS
    countDownText: CountDownText = null as any;
    scoreBoard: ScoreboardComponent = null as any;
    muteButton: Phaser.GameObjects.DOMElement = null as any;


    constructor() {
        super('find-the-joker');
    }

    create() {
        SceneService.loadBackground(this, 'poker_bg');
        this.countDownText = new CountDownText(this);
        this.soundBoard = new SoundBoardService({
            scene: this,
            keys: ['wrong_card', 'correct_card', 'shuffle']
        });
        this.countDownText.start(() => this.loadGameObjects());
        this.loadMuteComponent();
    }

    loadMuteComponent() {
        if (this.muteButton)
            this.muteButton.destroy();
        const muteComponent: HTMLElement = MuteComponent(this.soundBoard.soundOn, (soundOn) => {
            this.soundBoard.toggleSound(soundOn);
            this.loadMuteComponent();
        });
        this.muteButton = this.add.dom(this.scale.width - 100, 30, muteComponent);
    }

    loadGameObjects() {
        this.scoreBoard = new ScoreboardComponent(this);
        this.scoreBoard.load();
        this.loadCards();
    }

    assignCardsToGrid() {
        const assignCard: Function = this.cards.length > 0
            ? (i) => this.assignExistingCard(i)
            : (i) => this.assignNewCard(i);
        for (let i = 0; i < this.frames.length; i++) assignCard(i);
    }

    async cardSelected(card: Card) {
        const isJoker = card.face == 'joker';
        if (!this.ready) return;
        this.ready = false;
        card.flip();
        this.soundBoard.play(isJoker ? 'correct_card' : 'wrong_card');
        await DelayService.runDelay(1000 + this.shuffleSpeed);
        card.flip();
        await DelayService.runDelay(1000);
        if (!isJoker) {
            const hasLife = await this.wrongCardSelected();
            if (!hasLife) return;
        } else await this.correctCardSelected();
        this.scoreBoard.load();
        this.ready = true;
    }

    async wrongCardSelected() {
        const hasLife = this.scoreBoard.wrongSelection();
        const jokerCard = this.cards.find(f => f.face == 'joker');
        if (jokerCard) {
            jokerCard.flip();
            await DelayService.runDelay(1000);
            jokerCard.flip();
        }
        if (hasLife) await this.doShuffle();
        else await this.initiateGameOver();
        return hasLife;
    }

    async correctCardSelected() {
        this.scoreBoard.correctSelection();
        this.loadScoreBoardData();
        this.cards.forEach(card => card.removeCard());
        this.cards = [];
        await DelayService.runDelay(1000);
        this.loadCards();
    }


    async initiateGameOver() {
        const score: Score = {
            score: this.data.get(Scoreboard.SCORE),
            level: this.data.get(Scoreboard.LEVEL),
            date: new Date()
        };
        await new DatabaseService().saveScore(score);
        await this.loadScore(score);
    }

    async loadScore(score: Score) {
        const scores = await new DatabaseService().getScores();
        this.cards.forEach(card => card.removeCard());
        this.scoreBoard.destroy();
        const x = this.scale.width / 2;
        const y = this.scale.height / 2;
        const action = (scene: string) => {
            if (!scene) {
                this.cards = [];
                return this.scene.restart();
            }
            this.scene.start(scene);
        };
        const gameScoreComponent: HTMLElement = GameScoreComponent(scores, score, action);
        this.add.dom(x, y, gameScoreComponent);
    }

    loadScoreBoardData() {
        this.shuffleSpeed = this.data.get(Scoreboard.SPEED);
        this.shuffleCount = this.data.get(Scoreboard.SHUFFLES);
    }
}
