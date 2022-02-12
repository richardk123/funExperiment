export class Utils
{
    public static randomFromInterval(min: number, max: number)
    {
        return (Math.random() * (max - min)) + min;
    }

    public static randomBool(): boolean
    {
        return Math.random() < 0.5;
    }
}