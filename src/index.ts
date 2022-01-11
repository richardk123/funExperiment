import * as Vec2D from 'vector2d'
import { Vector } from 'vector2d';
import { Renderer } from './renderer';
import { Star } from './star';

const v = new Vec2D.Vector(2, 3);

let renderer = new Renderer();

const star1 = new Star(new Vector(100, 100), 100);
const star2 = new Star(new Vector(350, 350), 100);

renderer.render([star1, star2]);
