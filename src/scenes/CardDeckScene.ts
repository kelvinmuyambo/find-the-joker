import Phaser from 'phaser'
import {Card} from "~/components/Card";
import {GridService} from "~/services/GridService";
import {GridItem} from "~/interfaces/GridItem";
import {Scoreboard} from "~/models/Scoreboard";
import {SoundBoardService} from "~/services/SoundBoardService";
import {DelayService} from "~/services/DelayService";
import {SceneService} from "~/services/SceneService";

export default class CardDeckScene extends Phaser.Scene {
    cards: Card[] = [];
    gridItems: GridItem[] = [];
    frames: string[] = [];
    shuffleSpeed = 1000;
    shuffleCount = 2;
    ready = false;
    soundBoard: SoundBoardService = null as any;

    async cardSelected(card: Card) {
        console.log(card);
    }

    constructor(scene: string) {
        super(scene);
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
    }

    loadCards() {
        const numberOfCards = this.data.get(Scoreboard.CARDS);
        this.gridItems = GridService.getItems({
            startX: 0,
            startY: 150,
            endX: this.scale.width,
            endY: this.scale.height - 100
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

    async doShuffle() {
        if (this.soundBoard)
            DelayService.runDelayed(() => this.soundBoard.play('shuffle'), 1000).then(console.log)
        for (let i = 0; i < this.shuffleCount; i++) {
            await DelayService.runDelay(1000);
            this.gridItems = GridService.shuffle(this.gridItems);
            this.assignCardsToGrid();
        }
        if (this.soundBoard)
            this.soundBoard.stop('shuffle');
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
}
