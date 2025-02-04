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
	simulateSearchInputFocus?: boolean;
}

interface InternalState {
	scrollPaneElement: HTMLDivElement | null;
	searchInput: string;
	searchEmojisResults: string[];
	selectedGroup?: Group;
	selectedEmoji?: SelectedEmoji;
	frequentlyUsedEmojis: string[];
	customEmojiKeywords: Record<string, string[]>;
	customKeywordMostRelevantEmoji: Record<string, string>;
	recentlySearchedInputs: string[];
	lastAutoScrollTimeInMs: number;
	autoFocus: boolean;
	simulateSearchInputFocus: boolean;
}

const DEFAULT_STATE: InternalState = {
	scrollPaneElement: null,
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
	simulateSearchInputFocus: false,
};

const RESET_STATE = {
	searchInput: '',
	searchEmojisResults: [],
	selectedEmoji: undefined,
};

const MAX_FREQUENTLY_USED = 18;
const MAX_RECENT_SEARCHES = 10;

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
	setScrollPaneElement: (element: HTMLDivElement | null) => void;
	setSearchInput: (input: string) => void;
	setSelectedGroup: (group: Group) => void;
	setSelectedEmoji: (emoji: SelectedEmoji | undefined) => void;
	addFrequentlyUsedEmoji: (emoji: string) => void;
	addSearchedInput: (input: string) => void;
	updateCustomKeywords: (emoji: string, keyword: string) => void;
	handleEmojiSelect: (
		emojiVariant: string,
		baseEmoji: string,
		group: Group
	) => void;
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

				setScrollPaneElement: (element) => set({ scrollPaneElement: element }),
				setSearchInput: (input) => set({ searchInput: input }),
				setSelectedGroup: (group) => set({ selectedGroup: group }),
				setSelectedEmoji: (emoji) => set({ selectedEmoji: emoji }),

				addFrequentlyUsedEmoji: (emoji) =>
					set((state) => ({
						frequentlyUsedEmojis: addToStartUnique(
							state.frequentlyUsedEmojis,
							emoji,
							MAX_FREQUENTLY_USED
						),
					})),

				addSearchedInput: (input) =>
					set((state) => ({
						recentlySearchedInputs: addToStartUnique(
							state.recentlySearchedInputs,
							input,
							MAX_RECENT_SEARCHES
						),
					})),

				updateCustomKeywords: (emoji, keyword) =>
					set((state) => ({
						customEmojiKeywords: updateKeywordList(
							state.customEmojiKeywords,
							emoji,
							keyword
						),
					})),

				handleEmojiSelect: (emojiVariant, baseEmoji, group) => {
					const { searchInput, onEmojiSelect } = get();

					if (searchInput) {
						set((state) => ({
							recentlySearchedInputs: addToStartUnique(
								state.recentlySearchedInputs,
								searchInput,
								MAX_RECENT_SEARCHES
							),
							customKeywordMostRelevantEmoji: {
								...state.customKeywordMostRelevantEmoji,
								[searchInput]: baseEmoji,
							},
						}));

						if (group !== CustomGroup.SearchResults) {
							set((state) => ({
								customEmojiKeywords: updateKeywordList(
									state.customEmojiKeywords,
									baseEmoji,
									searchInput
								),
							}));
						}
					}

					set((state) => ({
						frequentlyUsedEmojis: addToStartUnique(
							state.frequentlyUsedEmojis,
							baseEmoji,
							MAX_FREQUENTLY_USED
						),
					}));

					if (onEmojiSelect) {
						onEmojiSelect(emojiVariant, { baseEmoji, group, searchInput });
					}

					set(RESET_STATE);
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
export type SetEmojiPickerStore = (
	partialStore: Partial<EmojiPickerStore>
) => void;
