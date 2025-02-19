import { Key } from './key-down/keys';
import type { DataGroup } from './types';

import groupToBaseEmojis from '../../data/group-to-base-emojis.json';

export const GROUP_TO_BASE_EMOJIS = groupToBaseEmojis;
export const GROUPS = Object.keys(GROUP_TO_BASE_EMOJIS) as DataGroup[];

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
