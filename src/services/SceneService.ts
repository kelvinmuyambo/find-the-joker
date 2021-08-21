export class SceneService{

    static loadBackground(scene: Phaser.Scene, texture: string) {
        const pokerBg = scene.add.sprite(0, 0, texture);
        pokerBg.setOrigin(0, 0);
        const width: any = scene.sys.game.config.width;
        const height: any = scene.sys.game.config.height;
        pokerBg.displayWidth = width;
        pokerBg.displayHeight = height;
    }
}
