import Phaser from 'phaser'
import {Card} from "~/components/Card";
import {GridService} from "~/services/GridService";
import {GridItem} from "~/interfaces/GridItem";
import {SceneService} from "~/services/SceneService";
import {CountDownText} from "~/components/CountDownText";
import {ScoreboardComponent} from "~/components/ScoreboardComponent";
import {Scoreboard} from "~/models/Scoreboard";
import MuteComponent from "~/components/MuteComponent";
import {SoundBoardService} from "~/services/SoundBoardService";
import {CardSelectionService} from "~/services/CardSelectionService";
import {CardShuffleService} from "~/services/CardShuffleService";

export default class FindTheJokerScene extends Phaser.Scene {
    // TODO: CLASS DECONGESTING, DEDICATE OTHER FUNCTIONALITY TO ANOTHER CLASS
    cards: Card[] = [];
    gridItems: GridItem[] = [];
    frames: string[] = [];
    shuffleSpeed = 1000;
    shuffleCount = 2;
    countDownText: CountDownText = null as any;
    scoreBoard: ScoreboardComponent = null as any;
    ready = false;
    soundBoard: SoundBoardService = null as any;
    muteButton: Phaser.GameObjects.DOMElement = null as any;


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
        setTimeout(() => new CardShuffleService(this).doShuffle().then(() => this.ready = true), 1000);
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
        card.on(Phaser.Input.Events.POINTER_UP, () => new CardSelectionService(this).cardSelected(card));
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
}
