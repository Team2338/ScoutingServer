
/**
 * Rounds a number to <i>at most</i> two decimal points.
 *
 * @param target The number to be rounded;
 * @return A number with at most two decimal points.
 */
export function roundToDecimal(target: number): number {
	return Math.round((target + Number.EPSILON) * 100) / 100;
}
