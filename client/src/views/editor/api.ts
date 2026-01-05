import { page } from "@/interfaces/page";
export const pages:page[] = [
    {
        width: 508,
        height: 762,
        levels:[
            {
                width: 508,
                height: 762,
                x: 0,
                y: 0,
                rotation: 0,
                seq: 0,
                type: "Background",
                backgroundColor: "red",
                opacity: 50,
                image:{
                    rotation: 0,
                    offsetx: -200,
                    offsety: 0,
                    resource: "https://pic-dev.momentsgocdn.com/clipArt-aeafe64a-1e92-4de1-b836-52da0c3b07e8",
                    scale: 1.5,
                    scaleX: 1,
                    scaleY: 1,
                }
            },
            {
                width: 100,
                height: 100,
                x: 100,
                y: 100,
                rotation: 0,
                seq: 1,
                type: "ImageBox",
                backgroundColor: "#ddd",
                opacity: 100,
                mask:"https://pic-dev.momentsgocdn.com/material-d48bba45-ea2d-495c-9b22-035ae49acff2",
                image:{
                    rotation: 0,
                    offsetx: -120,
                    offsety: 0,
                    resource: "https://pic-dev.momentsgocdn.com/gallery-725a5ef6-49c5-42ae-fc37-83e845d2ab44-4235",
                    scale: 1.5,
                    scaleX: 1,
                    scaleY: 1,
                }
            },
            {
                width: 100,
                height: 100,
                x: 100,
                y: 300,
                rotation: 0,
                seq: 2,
                type: "TextBox",
                opacity: 100,
                text:{
                    text: "Hello World",
                    fontSize: 16,
                    color: "#666",
                    family: "font_44318eae_94c2_11ea_8a6f_0242ac140003",
                    weight: false,
                    italic: false,
                    letterSpacing: 0,
                    lineHeight: 1.2,
                    textAlign: 'center',
                    writingMode: 'x',
                }
            },
            {
                width: 100,
                height: 100,
                x: 100,
                y: 500,
                rotation: 0,
                seq: 3,
                type: "TextBox",
                opacity: 100,
                text:{
                    text: "Hello World",
                    fontSize: 16,
                    color: "#dd2323ff",
                    family: "font_44318eae_94c2_11ea_8a6f_0242ac140003",
                    weight: false,
                    italic: false,
                    letterSpacing: 0,
                    lineHeight: 1.2,
                    textAlign: 'center',
                    writingMode: 'x',
                }
            }
        ]
    }
];