import { createStore } from 'zustand';
import { persist } from 'zustand/middleware';
import { CustomGroup, type SkinTone } from '../constants';
import type { Group, SelectedEmoji } from '../types';

export type OnEmojiSelect = (emoji: string, metadata: {
	baseEmoji: string;
	group: Group;
	searchInput: string;
}) => void;

export type OnEscapeKeyDown = () => void;

// Public interface - only what consumers need
export interface EmojiPickerProps {
	onEmojiSelect?: OnEmojiSelect;
	onEscapeKeyDown?: OnEscapeKeyDown;
	darkMode?: boolean;
	autoFocus?: boolean;
	simulateSearchInputFocus?: boolean;
}

// Internal store state
interface InternalState {
	scrollPaneElement: HTMLDivElement | null;
	scrollPaneCurrentGroupId: number;
	searchInput: string;
	searchEmojisResults: string[];
	selectedGroup?: Group;
	selectedEmoji?: SelectedEmoji;
	skinTone?: SkinTone;
	frequentlyUsedEmojis: string[];
	customEmojiKeywords: Record<string, string[]>;
	customKeywordMostRelevantEmoji: Record<string, string>;
	recentlySearchedInputs: string[];
	lastAutoScrollTimeInMs: number;
	autoFocus: boolean;
	simulateSearchInputFocus: boolean;
}

// Store actions
interface StoreActions {
	setScrollPaneElement: (element: HTMLDivElement | null) => void;
	setSearchInput: (input: string) => void;
	setSelectedGroup: (group: Group) => void;
	setSelectedEmoji: (emoji: SelectedEmoji | undefined) => void;
	addFrequentlyUsedEmoji: (emoji: string) => void;
	addSearchedInput: (input: string) => void;
	updateCustomKeywords: (emoji: string, keyword: string) => void;
	handleEmojiSelect: (emojiVariant: string, baseEmoji: string, group: Group) => void;
	resetState: () => void;
}

// Combined store type
export interface EmojiPickerStore extends InternalState, StoreActions {
	darkMode?: boolean;
	onEmojiSelect?: OnEmojiSelect;
	onEscapeKeyDown?: OnEscapeKeyDown;
	onBlur?: (resetState: () => void) => void;
	resetEmojiPickerState: () => void;
}

const DEFAULT_STATE: InternalState = {
	scrollPaneElement: null,
	scrollPaneCurrentGroupId: 0,
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
				
				addFrequentlyUsedEmoji: (emoji) => set((state) => ({
					frequentlyUsedEmojis: [
						emoji,
						...state.frequentlyUsedEmojis.filter((e) => e !== emoji)
					].slice(0, 20)
				})),
				
				addSearchedInput: (input) => set((state) => ({
					recentlySearchedInputs: [
						input,
						...state.recentlySearchedInputs.filter((i) => i !== input)
					].slice(0, 10)
				})),
				
				updateCustomKeywords: (emoji, keyword) => set((state) => ({
					customEmojiKeywords: {
						...state.customEmojiKeywords,
						[emoji]: [
							keyword,
							...(state.customEmojiKeywords[emoji] || []).filter((k) => k !== keyword)
						]
					}
				})),

				handleEmojiSelect: (emojiVariant: string, baseEmoji: string, group: Group) => {
					const state = get();
					const { searchInput, onEmojiSelect } = state;

					// Copy to clipboard by default
					navigator.clipboard.writeText(emojiVariant);

					// Update recently searched input and custom keyword most relevant emoji
					if (searchInput) {
						set((state) => ({
							recentlySearchedInputs: [
								searchInput,
								...state.recentlySearchedInputs.filter((i) => i !== searchInput)
							],
							customKeywordMostRelevantEmoji: {
								...state.customKeywordMostRelevantEmoji,
								[searchInput]: baseEmoji,
							}
						}));
					}

					// Update frequently used emojis
					set((state) => ({
						frequentlyUsedEmojis: [
							baseEmoji,
							...state.frequentlyUsedEmojis.filter((e) => e !== baseEmoji)
						].slice(0, 20)
					}));

					// Update custom keywords
					if (searchInput && group !== CustomGroup.SearchResults) {
						set((state) => ({
							customEmojiKeywords: {
								...state.customEmojiKeywords,
								[baseEmoji]: [
									searchInput,
									...(state.customEmojiKeywords[baseEmoji] || []).filter((k) => k !== searchInput)
								]
							}
						}));
					}

					// Call user's onEmojiSelect if provided
					if (onEmojiSelect) {
						onEmojiSelect(emojiVariant, {
							baseEmoji,
							group,
							searchInput
						});
					}

					// Reset state
					set({
						searchInput: '',
						searchEmojisResults: [],
						scrollPaneCurrentGroupId: 0,
						selectedEmoji: undefined
					});
				},
				
				resetState: () => set({
					searchInput: '',
					searchEmojisResults: [],
					scrollPaneCurrentGroupId: 0,
					selectedEmoji: undefined
				}),

				resetEmojiPickerState: () => set({
					searchInput: '',
					searchEmojisResults: [],
					scrollPaneCurrentGroupId: 0,
					selectedEmoji: undefined
				})
			}),
			{
				name: 'emoji-picker-storage',
				partialize: (state) => ({ 
					frequentlyUsedEmojis: state.frequentlyUsedEmojis 
				}),
			}
		)
	);
};

export type EmojiPickerZustandStore = ReturnType<typeof createEmojiPickerStore>;

export type GetEmojiPickerStore = () => EmojiPickerStore;
export type SetEmojiPickerStore = (partialStore: Partial<EmojiPickerStore>) => void;
