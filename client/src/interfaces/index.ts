
import { Box } from "leafer-ui";

export interface ContainerWithLevel extends Box {
    __levelData: any;
    __levelIndex: number;
    width: number,
    height: number,
    x: number,
    y: number,
}

export * from './page';
export * from './level';