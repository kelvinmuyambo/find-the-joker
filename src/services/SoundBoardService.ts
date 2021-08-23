import {SoundBoard} from "~/interfaces/SoundBoard";

export class SoundBoardService {
    soundOn = true;
    soundItems: Phaser.Sound.BaseSound[] = [];

    constructor(soundBoard: SoundBoard) {
        this.soundItems = soundBoard.keys.map(key => soundBoard.scene.sound.add(key));
    }

    play(key: string) {
        if (!this.soundOn) return;
        const item = this.soundItems.find(f => f.key == key);
        if (item) item.play();
    }

    stop(key: string) {
        const item = this.soundItems.find(f => f.key == key);
        if (item) item.stop();
    }

    toggleSound(soundOn = !this.soundOn) {
        this.soundOn = soundOn;
    }
}
