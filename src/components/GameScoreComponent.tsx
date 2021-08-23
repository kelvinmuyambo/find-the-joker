// @ts-ignore
import image from '../../public/assets/images/png-joker-head.png';
import {Score} from "~/interfaces/Score";

const GameScoreComponent = (scores: Score[], score: Score, action: Function) => {
    const position = scores.filter(f => f.score > score.score).length + 1;
    return (
        <div class='w-100 text-center'>
            <img src={image}/>
            <br/>
            <h1 class='text-light'>{score.score} points!</h1>
            <h3 class='text-warning font-monospace'>Position: <b>{position}</b></h3>
            <br/>
            <div class="btn btn-group-lg btn-group-vertical w-50">
                <button class='btn btn-warning mb-4' onClick={() => action(null)}>New Game</button>
                <button class='btn btn-warning mb-4' onClick={() => action('score-history')}>View Scores</button>
            </div>
        </div>
    );
}
export default GameScoreComponent;
