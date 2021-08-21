import Phaser from 'phaser'
import FindTheJokerScene from "~/scenes/FindTheJokerScene";
import MainMenuScene from "~/scenes/MainMenuScene";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import 'regenerator-runtime/runtime'

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: 'container',
    dom: {createContainer: true},
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 200}
        }
    },
    scene: [MainMenuScene, FindTheJokerScene]
}

export default new Phaser.Game(config)
