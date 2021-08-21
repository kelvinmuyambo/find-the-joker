import Phaser from 'phaser';
import ButtonComponent from "~/components/ButtonComponent";

export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super('main-menu');
    }

    create() {
        this.add.dom(400, 300, ButtonComponent('Start Game', () => this.openGameScene()) as HTMLElement)
    }

    openGameScene() {
        this.scene.start('find-the-joker');
    }
}
