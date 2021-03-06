import { Vector } from "vector2d";
import { Star } from "./star";
import {Renderer} from "./renderer";

export class RendererCpu implements Renderer
{
    data: Uint8ClampedArray;
    width: number;
    height: number;
    context: CanvasRenderingContext2D;
    image: ImageData;
    readonly radiusMultiplier = 250;
    
    constructor()
    {
        var canvas = <HTMLCanvasElement> document.getElementById("canvas");
        this.context = canvas.getContext('2d');
        this.image = this.context.createImageData(canvas.width, canvas.height);
        this.data = this.image.data;
        this.width = canvas.width;
        this.height = canvas.height;
    }

    public render(stars: Array<Star>): void
    {
        for (let x = 0; x < this.width; x++)
        {
            for (let y = 0; y < this.height; y++)
            {
                const position = new Vector(x, y);
                const sum = stars
                    .map(star =>
                    {
                        const distance = star.distance(position);
                        return star.radius * star.radius / Math.pow(distance, 2) * this.radiusMultiplier;
                    })
                    .reduce((acc, cur) => acc + cur, 0);

                let redColor = Math.min(sum, 255);
                this.drawPixel(x, y, {r : redColor, g: 0, b: 0, a: 255});
            }
        }

        this.context.putImageData(this.image, 0, 0);
    }

    private drawPixel(x: number, y: number, color: Color) {
        var index = 4 * (this.width * y + x);

        this.data[index + 0] = color.r;
        this.data[index + 1] = color.g;
        this.data[index + 2] = color.b;
        this.data[index + 3] = color.a;
    }

    public renderDebugCircles(stars: Array<Star>)
    {
        stars.forEach(star =>
            {
                this.context.beginPath();
                this.context.lineWidth = 2;
                this.context.arc(star.position.x, star.position.y, star.radius, 0, 2 * Math.PI);
                this.context.strokeStyle = 'blue';
                this.context.stroke();
            })
    }
}

interface Color
{
    r: number;
    g: number;
    b: number;
    a: number;
}