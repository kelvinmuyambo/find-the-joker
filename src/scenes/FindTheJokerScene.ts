import Phaser from 'phaser'
import {Card} from "~/components/Card";
import {GridService} from "~/services/GridService";
import {GridItem} from "~/interfaces/GridItem";
import {SceneService} from "~/services/SceneService";
import {CountDownText} from "~/components/CountDownText";
import {ScoreboardComponent} from "~/components/ScoreboardComponent";
import {DelayService} from "~/services/DelayService";
import {Scoreboard} from "~/models/Scoreboard";
import {DatabaseService} from "~/services/DatabaseService";
import {Score} from "~/interfaces/Score";
import GameScoreComponent from "~/components/GameScoreComponent";
import MuteComponent from "~/components/MuteComponent";

export default class FindTheJokerScene extends Phaser.Scene {
    cards: Card[] = [];
    gridItems: GridItem[] = [];
    frames: string[] = [];
    shuffleSpeed = 1000;
    shuffleCount = 2;
    countDownText: CountDownText = null as any;
    scoreBoard: ScoreboardComponent = null as any;
    ready = false;
    shuffleSound: Phaser.Sound.BaseSound = null as any;
    wrongCardSound: Phaser.Sound.BaseSound = null as any;
    correctCardSound: Phaser.Sound.BaseSound = null as any;
    muteButton: Phaser.GameObjects.DOMElement = null as any;
    soundOn = true;


    constructor() {
        super('find-the-joker');
    }

    preload() {
        this.load.atlas('cards', 'assets/atlas/cards.png', 'assets/atlas/cards.json');
        this.load.image('poker_bg', 'assets/backgrounds/poker_table_bg.png');
        this.load.audio('shuffle', 'assets/audio/shuffling-cards.mp3');
        this.load.audio('correct_card', 'assets/audio/correct-card.mp3');
        this.load.audio('wrong_card', 'assets/audio/wrong-card.mp3');
    }

    create() {
        SceneService.loadBackground(this, 'poker_bg');
        this.countDownText = new CountDownText(this);
        this.shuffleSound = this.sound.add('shuffle');
        this.wrongCardSound = this.sound.add('wrong_card');
        this.correctCardSound = this.sound.add('correct_card');
        this.countDownText.start(() => this.loadGameObjects());
        this.loadMuteComponent();
    }

    loadMuteComponent() {
        if (this.muteButton)
            this.muteButton.destroy();
        const muteComponent: HTMLElement = MuteComponent(this.soundOn, (soundOn) => {
            this.soundOn = soundOn;
            this.loadMuteComponent();
        });
        this.muteButton = this.add.dom(this.scale.width - 100, 30, muteComponent);
    }

    loadGameObjects() {
        this.scoreBoard = new ScoreboardComponent(this);
        this.scoreBoard.load();
        this.loadCards();
    }

    loadCards() {
        const numberOfCards = this.data.get(Scoreboard.CARDS);
        this.gridItems = GridService.getItems({
            startX: 150,
            startY: 100,
            endX: this.scale.height - 100,
            endY: this.scale.width - 100
        }, numberOfCards);
        this.frames = this.textures.get('cards')
            .getFrameNames()
            .filter(name => name != 'back')
            .slice(0, numberOfCards);
        if (!this.frames.includes('joker'))
            this.frames.splice(0, 1, 'joker');
        this.assignCardsToGrid();
        setTimeout(() => this.doShuffle().then(() => this.ready = true), 1000);
    }

    assignCardsToGrid() {
        const assignCard: Function = this.cards.length > 0
            ? (i) => this.assignExistingCard(i)
            : (i) => this.assignNewCard(i);
        for (let i = 0; i < this.frames.length; i++) assignCard(i);
    }

    assignNewCard(position: number) {
        const gridItem = this.gridItems[position];
        const card: Card = new Card(this, gridItem.x, gridItem.y, 'cards', this.frames[position]);
        card.on(Phaser.Input.Events.POINTER_UP, () => this.cardSelected(card));
        card.delayedFlip(card.face == 'joker' ? 800 : 0);
        this.cards.push(card);
    }

    assignExistingCard(position: number) {
        const gridItem = this.gridItems[position];
        const card: Card = this.cards[position];
        card.fold();
        this.tweens.add({
            targets: card,
            x: {value: (this.scale.width / 1.1) - gridItem.x, duration: this.shuffleSpeed, ease: 'Power2'},
            y: {
                value: this.scale.height - gridItem.y,
                duration: this.shuffleSpeed,
                ease: 'Bounce.easeOut',
                delay: 150
            }
        });
        this.tweens.add({
            targets: card,
            x: {value: gridItem.x, duration: this.shuffleSpeed, ease: 'Power2', delay: this.shuffleSpeed},
            y: {value: gridItem.y, duration: this.shuffleSpeed, ease: 'Bounce.easeOut', delay: this.shuffleSpeed}
        });
    }

    async doShuffle() {
        DelayService.runDelayed(() => {
            if (this.soundOn)
                this.shuffleSound.play();
        }, 1000).then(console.log)
        for (let i = 0; i < this.shuffleCount; i++) {
            await this.doTimedShuffle();
        }
        this.shuffleSound.stop();
    }

    doTimedShuffle() {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.fisherYatesShuffle();
                resolve();
            }, 1000);
        });
    }

    fisherYatesShuffle() {
        for (let i = this.gridItems.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = this.gridItems[i];
            this.gridItems[i] = this.gridItems[j];
            this.gridItems[j] = temp;
        }
        this.assignCardsToGrid();
    }

    async cardSelected(card: Card) {
        const isJoker = card.face == 'joker';
        if (!this.ready) return;
        this.ready = false;
        card.flip();
        if (this.soundOn) {
            if (isJoker) this.correctCardSound.play();
            else this.wrongCardSound.play();
        }
        await DelayService.runDelay(1000 + this.shuffleSpeed);
        card.flip();
        await DelayService.runDelay(1000);
        if (!isJoker) await this.wrongCardSelected()
        else await this.correctCardSelected();
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
    }

    async correctCardSelected() {
        this.scoreBoard.correctSelection();
        this.loadScoreBoardData();
        this.cards.forEach(card => card.removeCard());
        this.cards = [];
        await DelayService.runDelay(1000);
        this.loadCards();
    }

    loadScoreBoardData() {
        this.shuffleSpeed = this.data.get(Scoreboard.SPEED);
        this.shuffleCount = this.data.get(Scoreboard.SHUFFLES);
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
        this.add.dom(this.scale.width / 2, this.scale.height / 2, GameScoreComponent(scores, score,
            (scene: string) => this.scene.start(scene)) as HTMLElement)
    }

}
