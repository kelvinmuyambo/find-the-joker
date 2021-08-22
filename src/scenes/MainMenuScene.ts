import Phaser from 'phaser';
import {SceneService} from "~/services/SceneService";
import MenuComponent from "~/components/MenuComponent";

export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super('main-menu');
    }

    preload() {
        this.load.image('poker_bg', 'assets/backgrounds/poker_table_bg.png');
    }

    create() {
        SceneService.loadBackground(this, 'poker_bg');
        const menu = MenuComponent('Start Game', (scene: string) => this.openGameScene(scene)) as HTMLElement;
        this.add.dom(this.scale.width/2, this.scale.height/2, menu);
    }

    openGameScene(scene: string) {
        this.scene.start(scene);
    }
}
