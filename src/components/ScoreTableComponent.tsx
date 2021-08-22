import {ScoreTable} from "~/interfaces/ScoreTable";
import {Score} from "~/interfaces/Score";
import moment from "moment";


const ScoreTableComponent = (scoreTable: ScoreTable, callback: Function) => {
    const getTable = (title: string, scores: Score[]) => {
        return <table class="table table-striped table-dark">
            <thead>
            <tr>
                <th colSpan={2} class='text-center'>{title}</th>
            </tr>
            </thead>
            <tbody>
            {
                scores.map(score => <tr>
                    <td>{moment(score.date).format(`HH:mm DD-MM-yyyy`)}</td>
                    <td><b>{score.score}</b></td>
                </tr>)
            }
            </tbody>
        </table>
    }

    const highScores = scoreTable.scores.sort((a, b) => b.score - a.score).slice(0, 10);
    const highScoreTable = getTable('HIGH SCORES', highScores);

    const latestScores = scoreTable.scores.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 10);
    const latestScoreTable = getTable('LATEST SCORES', latestScores);

    return (
        <div style={{width: '100%'}}>
            <div class='row'>
                <div class='col-6'>
                    {highScoreTable}
                </div>
                <div class='col-6'>
                    {latestScoreTable}
                </div>
            </div>
            <div class='w-100 mt-3 text-center'>
                <button class='btn btn-warning btn-lg' onClick={callback}>START A NEW GAME</button>
            </div>
        </div>
    );
}
export default ScoreTableComponent;
