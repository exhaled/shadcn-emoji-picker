import type { DataGroup } from './types';
import { Key } from './key-down/keys';

import groupToBaseEmojis from '../../data/group-to-base-emojis.json';
import emojiToSpecialVariants from '../../data/emoji-to-special-variants.json';

export const GROUP_TO_BASE_EMOJIS = groupToBaseEmojis;
export const GROUPS = Object.keys(GROUP_TO_BASE_EMOJIS) as DataGroup[];
export const EMOJI_TO_SPECIAL_VARIANTS = emojiToSpecialVariants;

export const NUM_EMOJIS_PER_ROW = 9;
export const GROUP_TITLE_HEIGHT = 28;

export const WEB_KEY_TO_KEY_DOWN_CONTROL_KEY = {
	ArrowLeft: Key.Left,
	ArrowRight: Key.Right,
	ArrowUp: Key.Up,
	ArrowDown: Key.Down,
	Enter: Key.Enter,
} as const;

export type WebKey = keyof typeof WEB_KEY_TO_KEY_DOWN_CONTROL_KEY;

export enum CustomGroup {
	SearchResults = 'Search Results',
	FrequentlyUsed = 'Frequently Used',
}
