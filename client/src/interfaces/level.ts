import { ITextAlign } from "leafer-ui";

export type LevelType = 'ImageBox' | 'TextBox' | 'Background';
export type scaleX = 1 | -1;
export type borderType = "Color" | "Pic";
export type borderLineType = "Solid" | "Dashed" | "Dotted";

export interface level {
    width: number,
    height: number,
    x: number,
    y: number,
    mask?: string,
    rotation: number,
    seq: number,
    type: LevelType,
    border?: border,
    backgroundColor?:string,
    opacity: number,
    image?:{
        rotation: number,
        offsetx: number,
        offsety: number,
        resource?: string,
        resourceid?: string,
        scale: number,
        scaleX:scaleX,
        scaleY:scaleX,
    },
    text?:text
}
export interface border {
    type: borderType,
    lineWidth: number,
    color?: string,
    image?: string,
    lineType?: borderLineType,
    radius?: {
        lb: number,
        lt: number,
        rb: number,
        rt: number,
    },
}
export interface text {
    text: string,
    fontSize: number,
    color: string,
    family: string,
    weight: boolean,
    italic: boolean,
    letterSpacing: number,
    lineHeight: number,
    textAlign: ITextAlign | undefined,
    writingMode: 'x' | 'y',
}