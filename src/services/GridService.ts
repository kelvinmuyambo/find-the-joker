import {GridConfig} from "~/interfaces/GridConfig";
import {GridItem} from "~/interfaces/GridItem";

export class GridService {
    static maxItemsX = 4;
    static itemWidth = 150;
    static itemHeight = 180;

    static getItems(config: GridConfig, count: number): GridItem[] {
        const width = config.endX - config.startX;
        const height = config.endY = config.startY;
        const items: GridItem[] = [];
        const grid = this.optimiseGrid(this.gridData(count));
        for (let y = 0; y < grid.length; y++) {
            const column = grid[y];
            for (let x = 0; x < column.length; x++) {
                const adjustmentX = width / (column.length * 2);
                const adjustmentY = height / (grid.length * 2);
                const xPoint = config.startX + adjustmentX + (x * this.itemWidth);
                const yPoint = config.startY + adjustmentY + (y * this.itemHeight);
                items.push({x: xPoint, y: yPoint, id: `${x}${y}`});
            }
        }
        return items;
    }


    static gridData(count: number): number[][] {
        let tempRow: number[] = [];
        const grid: number[][] = [];
        for (let i = 0; i < count; i++) {
            if (i != 0 && i % this.maxItemsX == 0) {
                grid.push(tempRow)
                tempRow = [];
            }
            tempRow.push(i);
        }
        if (tempRow.length > 0)
            grid.push(tempRow);
        return grid;
    }

    static optimiseGrid(grid: number[][]): number[][] {
        if (grid.length < 2) return grid;
        const last = grid.length - 1;
        const isOptimum = (): boolean => {
            const lengths = grid.map(g => g.length).sort();
            return lengths[last] - lengths[0] <= 1;
        }
        while (!isOptimum()) {
            grid = grid.sort((a, b) => a.length - b.length);
            const item = grid[last].pop();
            if (item != null) {
                grid[0].push(item);
            }
        }
        return grid;
    }

    static shuffle(gridItems: GridItem[]): GridItem[] {
        if (!gridItems || gridItems.length < 1) return [];
        for (let i = gridItems.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = gridItems[i];
            gridItems[i] = gridItems[j];
            gridItems[j] = temp;
        }
        return gridItems;
    }
}
