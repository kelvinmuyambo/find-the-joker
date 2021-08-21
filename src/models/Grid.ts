import {GridConfig} from "~/interfaces/GridConfig";
import {GridService} from "~/services/GridService";

export class Grid {
   config: GridConfig;

    constructor(config: GridConfig) {
        this.config = config;
    }

    getGridItems(count: number){
        GridService.getItems(this.config, count);
    }
}
