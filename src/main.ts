import Phaser from 'phaser'
import FindTheJokerScene from "~/scenes/FindTheJokerScene";
import MainMenuScene from "~/scenes/MainMenuScene";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import 'regenerator-runtime/runtime'
import ScoreHistoryScene from "~/scenes/ScoreHistoryScene";

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: 'container',
    dom: {createContainer: true},
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 200}
        }
    },
    scene: [MainMenuScene, ScoreHistoryScene, FindTheJokerScene]
}

export default new Phaser.Game(config)
