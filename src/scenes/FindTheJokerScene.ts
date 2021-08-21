import Phaser from 'phaser'
import {Card} from "~/components/Card";
import {GridService} from "~/services/GridService";
import {GridItem} from "~/interfaces/GridItem";
import {SceneService} from "~/services/SceneService";
import {CountDownText} from "~/components/CountDownText";
import {ScoreboardComponent} from "~/components/ScoreboardComponent";
import {DelayService} from "~/services/DelayService";
import {Scoreboard} from "~/models/Scoreboard";

export default class FindTheJokerScene extends Phaser.Scene {
    cards: Card[] = [];
    gridItems: GridItem[] = [];
    frames: string[] = [];
    shuffleSpeed = 1000;
    shuffleCount = 2;
    countDownText: CountDownText = null as any;
    scoreBoard: ScoreboardComponent = null as any;
    ready = false;


    constructor() {
        super('find-the-joker');
    }

    preload() {
        this.load.atlas('cards', 'assets/atlas/cards.png', 'assets/atlas/cards.json');
        this.load.image('poker_bg', 'assets/backgrounds/poker_table_bg.png');
    }

    create() {
        SceneService.loadBackground(this, 'poker_bg');
        this.countDownText = new CountDownText(this, 100, 100);
        this.countDownText.start(() => this.loadGameObjects());
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
            endX: 100,
            endY: 100
        }, numberOfCards);
        this.frames = this.textures.get('cards')
            .getFrameNames()
            .filter(name => name != 'back')
            .slice(0, numberOfCards);
        if (!this.frames.includes('joker'))
            this.frames.splice(0, 1, 'joker');
        this.assignCardsToGrid();
        setTimeout(() => this.doShuffle().then(() => this.ready = true), 2000);
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
        card.delayedFlip(card.face == 'joker' ? 1000 : 0);
        this.cards.push(card);
    }

    assignExistingCard(position: number) {
        const gridItem = this.gridItems[position];
        const card: Card = this.cards[position];
        card.fold();
        this.tweens.add({
            targets: card,
            x: {value: gridItem.x, duration: this.shuffleSpeed, ease: 'Power2'},
            y: {value: gridItem.y, duration: this.shuffleSpeed, ease: 'Bounce.easeOut', delay: 150}
        });
    }

    async doShuffle() {
        for (let i = 0; i < this.shuffleCount; i++) {
            await this.doTimedShuffle();
        }
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
        if (!this.ready) return;
        this.ready = false;
        card.flip();
        await DelayService.runDelay(1000 + this.shuffleSpeed);
        card.flip();
        await DelayService.runDelay(1000);
        if (card.face != 'joker') await this.wrongCardSelected()
        else await this.correctCardSelected();
        this.scoreBoard.load();
        this.ready = true;
    }

    async wrongCardSelected() {
        const jokerCard = this.cards.find(f => f.face == 'joker');
        if (jokerCard) {
            jokerCard.flip();
            await DelayService.runDelay(1000);
            jokerCard.flip();
        }
        await this.doShuffle();
        this.scoreBoard.wrongSelection();
    }

    async correctCardSelected() {
        this.scoreBoard.correctSelection();
        this.loadScoreBoardData();
        this.cards.forEach(card => card.destroy());
        this.cards = [];
        await DelayService.runDelay(1000);
        this.loadCards();
    }

    loadScoreBoardData() {
        this.shuffleSpeed = this.data.get(Scoreboard.SPEED);
        this.shuffleCount = this.data.get(Scoreboard.SHUFFLES);
    }
}
