import type { DataGroup } from './types';

import groupToBaseEmojis from '../../data/group-to-base-emojis.json';
import emojiToSpecialVariants from '../../data/emoji-to-special-variants.json';

export const GROUP_TO_BASE_EMOJIS = groupToBaseEmojis;
export const GROUPS = Object.keys(GROUP_TO_BASE_EMOJIS) as DataGroup[];
export const EMOJI_TO_SPECIAL_VARIANTS = emojiToSpecialVariants;

export const NUM_EMOJIS_PER_ROW = 9;
export const GROUP_TITLE_HEIGHT = 28;

export enum CustomGroup {
	SearchResults = 'Search Results',
	FrequentlyUsed = 'Frequently Used',
}
