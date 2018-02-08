export class GeneralUtils {
    public static roundToPrecision(value: number, precision: number): number {
        // const factor = Math.pow(10, precision);
        // return Math.round(number * factor) / factor;
        return Math.round(value * 100) / 100;
    }
}