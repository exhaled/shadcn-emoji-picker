import type { CustomGroup } from '../constants';
import { GROUP_TO_BASE_EMOJIS, GROUPS, NUM_EMOJIS_PER_ROW } from '../constants';
import type { DataGroup, SelectedEmoji } from '../types';
import type { ArrowKey } from './keys';

/**
 * Computes and returns the next selected emoji based on the current selected emoji and the arrow key.
 * Navigation is restricted within the current group.
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
            const emoji = firstGroupEmojis.length > 0 ? firstGroupEmojis[0] : GROUP_TO_BASE_EMOJIS[group as DataGroup][0];
            return {
                group,
                idx: 0,
                emoji,
            };
        }
        return undefined;
    }

    const { group, idx } = selectedEmoji;
    const currentGroupEmojis = group === firstGroup ? firstGroupEmojis : GROUP_TO_BASE_EMOJIS[group as DataGroup];
    const maxIdx = currentGroupEmojis.length - 1;

    if (key === 'Left') {
        // Stay at the first emoji if already at index 0
        if (idx === 0) {
            return selectedEmoji;
        }

        // Move to previous emoji in current group
        const newIdx = idx - 1;
        return {
            group,
            idx: newIdx,
            emoji: currentGroupEmojis[newIdx],
        };
    } else if (key === 'Right') {
        // Stay at the last emoji if already at max index
        if (idx === maxIdx) {
            return selectedEmoji;
        }

        // Move to next emoji in current group
        const newIdx = idx + 1;
        return {
            group,
            idx: newIdx,
            emoji: currentGroupEmojis[newIdx],
        };
    } else if (key === 'Up') {
        // Stay at current position if in first row
        if (idx < NUM_EMOJIS_PER_ROW) {
            return selectedEmoji;
        }

        // Move up one row in current group
        const newIdx = idx - NUM_EMOJIS_PER_ROW;
        return {
            group,
            idx: newIdx,
            emoji: currentGroupEmojis[newIdx],
        };
    } else {
        const newIdx = idx + NUM_EMOJIS_PER_ROW;
        // Stay at current position if would go beyond group bounds
        if (newIdx > maxIdx) {
            return selectedEmoji;
        }

        // Move down one row in current group
        return {
            group,
            idx: newIdx,
            emoji: currentGroupEmojis[newIdx],
        };
    }
};
