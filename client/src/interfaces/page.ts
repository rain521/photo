import { level } from "./level";

export interface page {
    width: number;
    height: number;
    pagecover?: string,
    levels: level[],
}