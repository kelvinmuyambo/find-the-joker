import Phaser from "phaser";
import FindTheJokerScene from "~/scenes/FindTheJokerScene";

export class CountDownText extends Phaser.GameObjects.Text {
    scene: Phaser.Scene;

    constructor(scene: FindTheJokerScene, text = 'Ready...') {
        super(scene, scene.scale.width / 3, scene.scale.height / 2, text, null as any);
        this.scene = scene;
        const style: Phaser.GameObjects.TextStyle | any = {
            color: 'orange',
            fontSize: '5em'
        };
        this.setAlign('center');
        this.setStyle(style);
        scene.add.existing(this);
    }

    start(callBack: Function) {
        const timeline = this.scene.tweens.timeline({
            onComplete: () => timeline.destroy()
        });

        timeline.add({
            targets: this,
            duration: 1000,
            delay: 1000,
            scale: 1,
            onStart: () => this.setText('Set...')
        });

        timeline.add({
            targets: this,
            duration: 1000,
            delay: 500,
            scale: 1,
            onStart: () => {
                this.setText('FIND THE JOKER!!!');
            },
            onComplete: () => {
                this.setVisible(false);
                callBack();
            }
        });

        timeline.play();
    }
}
