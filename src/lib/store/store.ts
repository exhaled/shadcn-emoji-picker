import { createStore } from 'zustand';
import { persist } from 'zustand/middleware';
import { CustomGroup } from '../constants';
import type { Group, SelectedEmoji } from '../types';

export interface EmojiMetadata {
	baseEmoji: string;
	group: Group;
	searchInput: string;
}

export type OnEmojiSelect = (emoji: string, metadata: EmojiMetadata) => void;
export type OnEscapeKeyDown = () => void;

export interface EmojiPickerProps {
	onEmojiSelect?: OnEmojiSelect;
	onEscapeKeyDown?: OnEscapeKeyDown;
	autoFocus?: boolean;
}

interface InternalState {
	scrollPanelElement: HTMLDivElement | null;
	searchInput: string;
	searchEmojisResults: string[];
	selectedGroup: Group;
	selectedEmoji?: SelectedEmoji;
	frequentlyUsedEmojis: string[];
	customEmojiKeywords: Record<string, string[]>;
	customKeywordMostRelevantEmoji: Record<string, string>;
	recentlySearchedInputs: string[];
	lastAutoScrollTimeInMs: number;
	autoFocus: boolean;
	firstGroupButtonRef: HTMLButtonElement | null;
}

const MAX_ITEMS = {
	FREQUENTLY_USED: 18,
	RECENT_SEARCHES: 10,
} as const;

const DEFAULT_STATE: InternalState = {
	scrollPanelElement: null,
	searchInput: '',
	searchEmojisResults: [],
	selectedGroup: CustomGroup.FrequentlyUsed,
	selectedEmoji: undefined,
	frequentlyUsedEmojis: [],
	customEmojiKeywords: {},
	customKeywordMostRelevantEmoji: {},
	recentlySearchedInputs: [],
	lastAutoScrollTimeInMs: Date.now(),
	autoFocus: false,
	firstGroupButtonRef: null,
};

const RESET_STATE: Partial<InternalState> = {
	searchInput: '',
	searchEmojisResults: [],
	selectedEmoji: undefined,
};

// Utility functions for state updates
const addToStartUnique = <T>(arr: T[], item: T, maxItems: number): T[] =>
	[item, ...arr.filter((i) => i !== item)].slice(0, maxItems);

const updateKeywordList = (
	keywords: Record<string, string[]>,
	key: string,
	value: string
): Record<string, string[]> => ({
	...keywords,
	[key]: [value, ...(keywords[key] || []).filter((k) => k !== value)],
});

interface StoreActions {
	setScrollPanelElement: (element: HTMLDivElement | null) => void;
	setSearchInput: (input: string) => void;
	setSelectedGroup: (group: Group) => void;
	setSelectedEmoji: (emoji: SelectedEmoji | undefined) => void;
	addFrequentlyUsedEmoji: (emoji: string) => void;
	addSearchedInput: (input: string) => void;
	updateCustomKeywords: (emoji: string, keyword: string) => void;
	handleEmojiSelect: (emoji: string, group: Group) => void;
	resetEmojiPickerState: () => void;
}

export interface EmojiPickerStore extends InternalState, StoreActions {
	onEmojiSelect?: OnEmojiSelect;
	onEscapeKeyDown?: OnEscapeKeyDown;
	onBlur?: (resetState: () => void) => void;
}

export const createEmojiPickerStore = (props: EmojiPickerProps) => {
	return createStore<EmojiPickerStore>()(
		persist(
			(set, get) => ({
				...DEFAULT_STATE,
				...props,

				setScrollPanelElement: (element) => set({ scrollPanelElement: element }),
				setSearchInput: (input) => set({ searchInput: input }),
				setSelectedGroup: (group) => set({ selectedGroup: group }),
				setSelectedEmoji: (emoji) => set({ selectedEmoji: emoji }),

				addFrequentlyUsedEmoji: (emoji) =>
					set((state) => ({
						frequentlyUsedEmojis: addToStartUnique(
							state.frequentlyUsedEmojis,
							emoji,
							MAX_ITEMS.FREQUENTLY_USED
						),
					})),

				addSearchedInput: (input) =>
					set((state) => ({
						recentlySearchedInputs: addToStartUnique(
							state.recentlySearchedInputs,
							input,
							MAX_ITEMS.RECENT_SEARCHES
						),
					})),

				updateCustomKeywords: (emoji, keyword) =>
					set((state) => ({
						customEmojiKeywords: updateKeywordList(state.customEmojiKeywords, emoji, keyword),
					})),

				handleEmojiSelect: (emoji, group) => {
					const { searchInput, onEmojiSelect } = get();
					const updates: Partial<InternalState> = {
						frequentlyUsedEmojis: addToStartUnique(
							get().frequentlyUsedEmojis,
							emoji,
							MAX_ITEMS.FREQUENTLY_USED
						),
					};

					if (searchInput) {
						updates.recentlySearchedInputs = addToStartUnique(
							get().recentlySearchedInputs,
							searchInput,
							MAX_ITEMS.RECENT_SEARCHES
						);
						updates.customKeywordMostRelevantEmoji = {
							...get().customKeywordMostRelevantEmoji,
							[searchInput]: emoji,
						};

						if (group !== CustomGroup.SearchResults) {
							updates.customEmojiKeywords = updateKeywordList(
								get().customEmojiKeywords,
								emoji,
								searchInput
							);
						}
					}

					set(updates);

					if (onEmojiSelect) {
						onEmojiSelect(emoji, { baseEmoji: emoji, group, searchInput });
					}

					if (group !== CustomGroup.SearchResults) {
						set(RESET_STATE);
					}
				},

				resetEmojiPickerState: () => set(RESET_STATE),
			}),
			{
				name: 'emoji-picker-storage',
				partialize: (state) => ({
					frequentlyUsedEmojis: state.frequentlyUsedEmojis,
				}),
			}
		)
	);
};

export type EmojiPickerZustandStore = ReturnType<typeof createEmojiPickerStore>;
export type GetEmojiPickerStore = () => EmojiPickerStore;
export type SetEmojiPickerStore = (partialStore: Partial<EmojiPickerStore>) => void;
