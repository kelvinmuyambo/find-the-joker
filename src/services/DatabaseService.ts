import Dexie from "dexie";
import {Score} from "~/interfaces/Score";

export class DatabaseService extends Dexie {
    // TODO: DECOUPLE THIS DB SERVICE
    public scores: Dexie.Table<Score, number>;

    public constructor() {
        super("FindTheJokerDatabase");
        this.version(1).stores({
            scores: "++id,score,level,date"
        });
        this.scores = this.table("scores");
    }

    async saveScore(score: Score) {
        await this.transaction('rw', this.scores, async () => this.scores.add(score));
    }

    async getScores(orderBy = 'score') {
        const scores = await this.transaction('rw', this.scores,
            async () => this.scores.orderBy(orderBy).toArray())
            .catch(e => {
                alert(e.stack || e);
            });
        return scores as Score[]
    }
}
