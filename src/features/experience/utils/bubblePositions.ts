export interface BubblePosition {
	top: string;
	right: string;
}

export const generateBubblePositions = (count: number): BubblePosition[] => {
	const positions: BubblePosition[] = [
		{ top: "5%", right: "-12%" },
		{ top: "25%", right: "-18%" },
		{ top: "50%", right: "-14%" },
		{ top: "70%", right: "-10%" },
		{ top: "15%", right: "-8%" },
		{ top: "40%", right: "-20%" },
		{ top: "60%", right: "-6%" },
		{ top: "85%", right: "-16%" },
	];
	return positions.slice(0, count);
};
