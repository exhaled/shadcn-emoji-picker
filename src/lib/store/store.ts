import { createStore } from 'zustand';
import type { SkinTone } from '../constants';
import type { Group, SelectedEmoji, EmojiToSpecialVariant } from '../types';

export type OnEmojiClick = (
	emojiWithVariant: string,
	resetEmojiPickerState: () => void,
	baseEmoji: string,
	group: Group,
	searchInput: string
) => void;

// Pass in props
export interface EmojiPickerProps {
	autoFocus?: boolean;
	frequentlyUsedEmojis?: string[];
	customEmojiKeywords?: Record<string, string[]>;
	customKeywordMostRelevantEmoji?: Record<string, string>;
	recentlySearchedInputs?: string[];
	darkMode?: boolean; // undefined means follow system preference
	skinTone?: SkinTone;
	emojiToSpecialVariant?: EmojiToSpecialVariant;
	hideBorder?: boolean;
	simulateSearchInputFocus?: boolean; // This is used to show a blinking cursor for demo purpose
	onEmojiClick?: OnEmojiClick;
	onBlur?: (resetEmojiPickerState: () => void) => void;
	onEscapeKeyDown?: () => void;
}

// Emoji Picker component store (includes both pass in props and internal state)
export interface EmojiPickerStore extends EmojiPickerProps {
	scrollPaneElement: HTMLDivElement | null;
	scrollPaneCurrentGroupId: number;
	searchInput: string;
	searchEmojisResults: string[];
	selectedEmoji?: SelectedEmoji;
	lastAutoScrollTimeInMs: number;
	resetEmojiPickerState: () => void;
}

const defaultEmojiPickerStore: EmojiPickerStore = {
	// Pass in props
	autoFocus: false,
	frequentlyUsedEmojis: [],
	customEmojiKeywords: {},
	customKeywordMostRelevantEmoji: {},
	recentlySearchedInputs: [],
	darkMode: undefined,
	skinTone: undefined,
	emojiToSpecialVariant: undefined,
	hideBorder: undefined,
	simulateSearchInputFocus: undefined,
	onEmojiClick: undefined,
	onBlur: undefined,
	onEscapeKeyDown: undefined,
	// Internal state
	scrollPaneElement: null,
	scrollPaneCurrentGroupId: 0,
	searchInput: '',
	searchEmojisResults: [],
	selectedEmoji: undefined,
	lastAutoScrollTimeInMs: Date.now(),
	resetEmojiPickerState: () => {},
};

export const createEmojiPickerStore = (initialState: EmojiPickerProps) => {
	return createStore<EmojiPickerStore>()((set) => ({
		...defaultEmojiPickerStore,
		...initialState,
		resetEmojiPickerState: () => {
			set({
				scrollPaneCurrentGroupId: 0,
				searchInput: '',
				searchEmojisResults: [],
				selectedEmoji: undefined,
			});
		},
	}));
};

export type EmojiPickerZustandStore = ReturnType<typeof createEmojiPickerStore>;

export type GetEmojiPickerStore = () => EmojiPickerStore;
export type SetEmojiPickerStore = (
	partialStore: Partial<EmojiPickerStore>
) => void;
