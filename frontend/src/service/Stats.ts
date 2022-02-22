
export const getMean = (scores: number[]): number => {
	const sum = scores.reduce((accumulator: number, current: number) => accumulator + current, 0);
	return sum / scores.length;
};

export const getMedian = (scores: number[]): number => {
	if (scores.length < 2) {
		return scores[0];
	}

	const sorted = scores.slice().sort((a: number, b: number) => a - b);
	const middleIndex = Math.floor(sorted.length / 2);

	// If there's an even number of elements, take average of both middle elements
	if (sorted.length % 2 === 0) {
		return (sorted[middleIndex] + sorted[middleIndex - 1]) / 2
	}

	// Else return middle element
	return sorted[middleIndex];
};

export const getMode = (scores: number[]): number => {

	// Create list of frequencies
	const frequencies = new Map<number, number>();
	for (const score of scores) {
		if (!frequencies.has(score)) {
			frequencies.set(score, 0);
		}

		const nextFrequency = frequencies.get(score) + 1;
		frequencies.set(score, nextFrequency);
	}

	// Select score of highest frequency
	let mode = scores[0];
	frequencies.forEach((frequency: number, score: number) => {
		if (frequency > frequencies.get(mode)) {
			mode = score;
		}
	});

	return mode;
};
