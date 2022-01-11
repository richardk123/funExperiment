import { Vector } from "vector2d";
import { Star } from "./star";

export class Renderer
{
    data: Uint8ClampedArray;
    width: number;
    height: number;
    context: CanvasRenderingContext2D;
    image: ImageData;
    
    constructor()
    {
        var canvas = <HTMLCanvasElement> document.getElementById("canvas");
        this.context = canvas.getContext('2d');
        this.image = this.context.createImageData(canvas.width, canvas.height);
        this.data = this.image.data;
        this.width = canvas.width;
        this.height = canvas.height;
    }

    private drawPixel(x: number, y: number, color: Color) {
        var index = 4 * (this.width * x + y);

        this.data[index + 0] = color.r;
        this.data[index + 1] = color.g;
        this.data[index + 2] = color.b;
        this.data[index + 3] = color.a;
  }

    public render(stars: Array<Star>): void
    {
        stars[0].position.x = Math.random() * this.width;

        requestAnimationFrame(() => this.render(stars));
        for (let x = 0; x < this.width; x++)
        {
            for (let y = 0; y < this.width; y++)
            {
                const position = new Vector(x, y);
                const sum = stars
                    .map(star => 180 * star.radius / star.distance(position))
                    .reduce((acc, cur) => acc + cur, 0);

                const redColor = Math.min(sum, 255);
                this.drawPixel(x, y, {r : redColor, g: 0, b: 0, a: 255});
            }
        }

        this.context.putImageData(this.image, 0, 0);

        // this.renderDebugCircles(stars);

    }

    private renderDebugCircles(stars: Array<Star>)
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