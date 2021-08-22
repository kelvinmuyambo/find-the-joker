// @ts-ignore
import image from '../../public/assets/images/png-joker-head.png';

const MenuComponent = (name: string, action: Function) => {
    return (
        <div class='w-100 text-center'>
            <img src={image}/>
            <br/>
            <h3 class='text-warning font-monospace'>Find The Joker</h3>
            <br/>
            <div class="btn btn-group-lg btn-group-vertical w-50">
                <button class='btn btn-warning mb-4' onClick={() => action('find-the-joker')}>Start Game</button>
                <button class='btn btn-warning mb-4' onClick={() => action('score-history')}>View Scores</button>
            </div>
        </div>
    );
}
export default MenuComponent;
