import Phaser from "phaser";
import FindTheJokerScene from "~/scenes/FindTheJokerScene";

export class Card extends Phaser.GameObjects.Sprite {
    static defaultScale = 0.8;
    static back = 'back';
    scene: Phaser.Scene;
    face: string;

    constructor(scene: FindTheJokerScene, x: number, y: number, texture: string, frame: string) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.scene = scene;
        this.face = frame;
        this.setScale(Card.defaultScale);
        this.setInteractive();
    }

    delayedFlip = (delay: number) => setTimeout(() => this.flip(), delay)

    flip() {
        const timeline = this.scene.tweens.timeline({
            onComplete: () => timeline.destroy()
        });

        timeline.add({
            targets: this,
            scale: Card.defaultScale * 1.02,
            duration: 150
        });

        const flipTo = Card.back == this.frame.name ? this.face : Card.back;

        timeline.add({
            targets: this,
            scaleX: 0,
            scaleY: 0.5,
            duration: 200,
            delay: 100,
            onComplete: () => this.setTexture('cards', flipTo)
        });

        timeline.add({
            targets: this,
            scaleX: 1,
            duration: 50
        });

        timeline.add({
            targets: this,
            scale: Card.defaultScale,
            duration: 100
        })

        timeline.play();
    }


    fold() {
        const timeline = this.scene.tweens.timeline({
            onComplete: () => timeline.destroy()
        });

        timeline.add({
            targets: this,
            scale: Card.defaultScale,
            duration: 150
        });

        timeline.add({
            targets: this,
            scale: Card.defaultScale * 0.95,
            duration: 200,
            delay: 100
        });

        timeline.add({
            targets: this,
            scale: Card.defaultScale,
            duration: 100
        })

        timeline.play();
    }
}
