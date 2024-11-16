import type { CustomGroup } from '../constants';
import type { DataGroup, SelectedEmoji } from '../types';
import type { ArrowKey } from './keys';
import { GROUP_TO_BASE_EMOJIS, GROUPS, NUM_EMOJIS_PER_ROW } from '../constants';

/**
 * Computes and returns the next selected emoji based on the current selected emoji and the arrow key.
 */
export const getNextSelectedEmoji = (
	selectedEmoji: SelectedEmoji | undefined,
	key: ArrowKey,
	firstGroup: CustomGroup,
	firstGroupEmojis: string[]
): SelectedEmoji | undefined => {
	// Handle case where selectedEmoji is undefined
	if (selectedEmoji === undefined) {
		if (key === 'Right' || key === 'Down') {
			const group = firstGroupEmojis.length > 0 ? firstGroup : GROUPS[0];
			const emoji =
				firstGroupEmojis.length > 0
					? firstGroupEmojis[0]
					: GROUP_TO_BASE_EMOJIS[group as DataGroup][0];
			return {
				group,
				idx: 0,
				emoji,
			};
		}
		return undefined;
	}

	const { group, idx } = selectedEmoji;
	const isInFirstGroup =
		group === firstGroup ||
		(group === GROUPS[0] && firstGroupEmojis.length === 0);

	if (key === 'Left') {
		// Handle case where the selected emoji is the first emoji in the group
		if (idx === 0) {
			// Reset selected emoji to undefined if in the first group 0 index
			if (isInFirstGroup) {
				return undefined;
			}
			// Otherwise, go to the previous group last emoji for data groups
			else {
				const groupIdx = GROUPS.indexOf(group as DataGroup);
				if (groupIdx === 0) {
					const newGroup = firstGroup;
					const newIdx = firstGroupEmojis.length - 1;
					const emoji = firstGroupEmojis[newIdx];
					return {
						group: newGroup,
						idx: newIdx,
						emoji,
					};
				} else {
					const newGroup = GROUPS[groupIdx - 1];
					const newIdx = GROUP_TO_BASE_EMOJIS[newGroup].length - 1;
					const emoji = GROUP_TO_BASE_EMOJIS[newGroup][newIdx];
					return {
						group: newGroup,
						idx: newIdx,
						emoji,
					};
				}
			}
		}

		// Handle general case to go to the previous emoji
		const newIdx = idx - 1;
		const emoji =
			firstGroup === group
				? firstGroupEmojis[newIdx]
				: GROUP_TO_BASE_EMOJIS[group as DataGroup][newIdx];
		return {
			group,
			idx: newIdx,
			emoji,
		};
	} else if (key === 'Right') {
		// Handle case where the selected emoji is the last emoji in the first group
		if (group === firstGroup && idx === firstGroupEmojis.length - 1) {
			const newGroup = GROUPS[0];
			const newIdx = 0;
			const emoji = GROUP_TO_BASE_EMOJIS[newGroup][newIdx];
			return {
				group: newGroup,
				idx: newIdx,
				emoji,
			};
		}
		// Handle case where the selected emoji is the last emoji in the data groups
		else if (
			group in GROUP_TO_BASE_EMOJIS &&
			idx === GROUP_TO_BASE_EMOJIS[group as DataGroup].length - 1
		) {
			const groupIdx = GROUPS.indexOf(group as DataGroup);
			// Do nothing if it is the last group
			if (groupIdx === GROUPS.length - 1) {
				return selectedEmoji;
			}
			// Go to the next group first emoji
			else {
				const newGroup = GROUPS[groupIdx + 1];
				const newIdx = 0;
				const emoji = GROUP_TO_BASE_EMOJIS[newGroup][newIdx];
				return {
					group: newGroup,
					idx: newIdx,
					emoji,
				};
			}
		}

		// Handle general case to go to the next emoji
		const newIdx = idx + 1;
		const emoji =
			firstGroup === group
				? firstGroupEmojis[newIdx]
				: GROUP_TO_BASE_EMOJIS[group as DataGroup][newIdx];
		return {
			group,
			idx: newIdx,
			emoji,
		};
	} else if (key === 'Up') {
		const getNewIdxAtPreviousGroup = (
			previousGroupEmojis: string[],
			currentGroupIdx: number
		) => {
			const lastIdx = previousGroupEmojis.length - 1;
			const startingIdxOfLastRow = lastIdx - (lastIdx % NUM_EMOJIS_PER_ROW);
			const newIdx = startingIdxOfLastRow + currentGroupIdx;
			return newIdx <= lastIdx ? newIdx : lastIdx;
		};
		// Handle case where the selected emoji is in the first row of the first group
		if (isInFirstGroup && idx < NUM_EMOJIS_PER_ROW) {
			return selectedEmoji;
		}
		// Handle case where the selected emoji is in the first row of the data groups
		else if (group in GROUP_TO_BASE_EMOJIS && idx < NUM_EMOJIS_PER_ROW) {
			const groupIdx = GROUPS.indexOf(group as DataGroup);
			if (groupIdx === 0) {
				const newGroup = firstGroup;
				const newIdx = getNewIdxAtPreviousGroup(firstGroupEmojis, idx);
				const emoji = firstGroupEmojis[newIdx];
				return {
					group: newGroup,
					idx: newIdx,
					emoji,
				};
			} else {
				const newGroup = GROUPS[groupIdx - 1];
				const previousGroupEmojis = GROUP_TO_BASE_EMOJIS[newGroup];
				const newIdx = getNewIdxAtPreviousGroup(previousGroupEmojis, idx);
				const emoji = previousGroupEmojis[newIdx];
				return {
					group: newGroup,
					idx: newIdx,
					emoji,
				};
			}
		}

		// Handle general case to go to the previous row
		const newIdx = idx - NUM_EMOJIS_PER_ROW;
		const emoji =
			firstGroup === group
				? firstGroupEmojis[newIdx]
				: GROUP_TO_BASE_EMOJIS[group as DataGroup][newIdx];
		return {
			group,
			idx: newIdx,
			emoji,
		};
	} else {
		const newIdx = idx + NUM_EMOJIS_PER_ROW;
		// Handle case where the selected emoji is the last row in the first group
		if (group === firstGroup && newIdx > firstGroupEmojis.length - 1) {
			const newGroup = GROUPS[0];
			const newGroupIdx = newIdx % NUM_EMOJIS_PER_ROW;
			const emoji = GROUP_TO_BASE_EMOJIS[newGroup][newGroupIdx];
			return {
				group: newGroup,
				idx: newGroupIdx,
				emoji,
			};
		}
		// Handle case where the selected emoji is the last row in the data groups
		else if (
			group in GROUP_TO_BASE_EMOJIS &&
			newIdx > GROUP_TO_BASE_EMOJIS[group as DataGroup].length - 1
		) {
			const groupIdx = GROUPS.indexOf(group as DataGroup);
			// Do nothing if it is the last group
			if (groupIdx === GROUPS.length - 1) {
				return selectedEmoji;
			}
			// Go to the next group
			else {
				const newGroup = GROUPS[groupIdx + 1];
				const newGroupIdx = newIdx % NUM_EMOJIS_PER_ROW;
				const emoji = GROUP_TO_BASE_EMOJIS[newGroup][newGroupIdx];
				return {
					group: newGroup,
					idx: newGroupIdx,
					emoji,
				};
			}
		}

		// Handle general case to go to the next row
		const emoji =
			firstGroup === group
				? firstGroupEmojis[newIdx]
				: GROUP_TO_BASE_EMOJIS[group as DataGroup][newIdx];
		return {
			group,
			idx: newIdx,
			emoji,
		};
	}
};
