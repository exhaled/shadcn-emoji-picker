import { useRef, useEffect } from 'react';
import { Input } from './ui/input';
import { Search } from 'lucide-react';
import { cn } from '../lib/utils';
import {
	useEmojiPickerSelector,
	useEmojiPickerStore,
} from '../lib/store/hooks';
import { useSearchBarKeyboardFocus } from '../lib/hooks/useSearchBarKeyboardFocus';
import { useSearchAutoComplete } from '../lib/hooks/useSearchAutoComplete';
import { useSearchHandler } from '../lib/hooks/useSearchHandler';
import { CustomGroup } from '../lib/constants';
import { handleKeyDown } from '../lib/key-down/handle-key-down';
import { Key } from '../lib/key-down/keys';

const inputBaseClasses = 'h-9 px-8 py-1';

/**
 * ShadcnSearchBar renders the search input field with auto-complete suggestions
 * using Shadcn UI components.
 */
export const SearchBar = () => {
	const searchInput = useEmojiPickerSelector((state) => state.searchInput);
	const selectedEmoji = useEmojiPickerSelector((state) => state.selectedEmoji);
	const { getEmojiPickerStore, setEmojiPickerStore } = useEmojiPickerStore();

	const inputRef = useRef<HTMLInputElement>(null);
	const autoFocus = useEmojiPickerSelector((state) => state.autoFocus);

	const searchAutoCompleteSuggestion = useSearchAutoComplete(
		searchInput,
		getEmojiPickerStore,
		selectedEmoji
	);

	const handleSearch = useSearchHandler(
		getEmojiPickerStore,
		setEmojiPickerStore
	);

	useSearchBarKeyboardFocus(inputRef);

	useEffect(() => {
		if (autoFocus) {
			inputRef.current?.focus();
			// Reset autoFocus after focusing
			setEmojiPickerStore({ autoFocus: false });
		}
	}, [autoFocus]);

	return (
		<div className="px-[var(--emoji-picker-padding)] relative mt-2">
			<Search className="absolute left-[calc(var(--emoji-picker-padding)+0.5rem)] top-2.5 h-4 w-4 text-muted-foreground" />
			<div className="relative">
				{searchAutoCompleteSuggestion && (
					<Input
						className={cn(
							inputBaseClasses,
							'absolute text-muted-foreground bg-transparent border-transparent'
						)}
						value={searchAutoCompleteSuggestion}
						readOnly
					/>
				)}
				<Input
					ref={inputRef}
					className={cn(
						inputBaseClasses,
						'bg-transparent relative z-10',
						'focus-visible:ring-1 focus-visible:ring-offset-0'
					)}
					placeholder="Search emoji"
					value={searchInput}
					onChange={(e) => {
						const newSearchInput = e.target.value;
						handleSearch(newSearchInput);
					}}
					onKeyDown={(e) => {
						const key = e.key;
						const caretPosition = (e.target as HTMLInputElement).selectionStart;

						const store = getEmojiPickerStore();
						const selectedEmoji = store.selectedEmoji;
						const searchResults = store.searchEmojisResults;
						const hasSearchResults = searchResults.length > 0;

						// Always prevent propagation when handling keyboard events in search
						e.stopPropagation();

						// Handle Tab key
						if (key === 'Tab') {
							e.preventDefault();

							if (searchAutoCompleteSuggestion && hasSearchResults) {
								handleSearch(searchAutoCompleteSuggestion);
							} else {
								// Find and focus the first group button
								const firstGroupButton = document.querySelector('[role="tablist"] button') as HTMLButtonElement;
								if (firstGroupButton) {
									inputRef.current?.blur();
									firstGroupButton.focus();
								}
							}
							return;
						}

						// Handle arrow keys
						if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
							const isAtStart = caretPosition === 0;
							const isAtEnd = caretPosition === searchInput.length;
							const isVerticalNavigation = key === 'ArrowUp' || key === 'ArrowDown';
							
							// If we have search results, prioritize emoji navigation over text cursor movement
							if (hasSearchResults && (isVerticalNavigation || isAtStart || isAtEnd)) {
								e.preventDefault();

								// Ensure we have a selected emoji when starting navigation
								if (!selectedEmoji) {
									setEmojiPickerStore({
										selectedEmoji: {
											group: CustomGroup.SearchResults,
											idx: 0,
											emoji: searchResults[0],
										},
									});
									return;
								}
								
								// Map web key to internal key type
								const keyMap = {
									ArrowLeft: Key.Left,
									ArrowRight: Key.Right,
									ArrowUp: Key.Up,
									ArrowDown: Key.Down,
								};

								handleKeyDown(
									keyMap[key as keyof typeof keyMap],
									getEmojiPickerStore,
									setEmojiPickerStore
								);
								return;
							}

							// Only prevent default for vertical navigation to avoid text cursor movement
							if (isVerticalNavigation) {
								e.preventDefault();
							}
						}

						// Handle Enter key
						if (key === 'Enter' && selectedEmoji) {
							e.preventDefault();
							const baseEmoji = selectedEmoji.emoji;
							const handleEmojiSelect = store.handleEmojiSelect;
							if (handleEmojiSelect) {
								handleEmojiSelect(baseEmoji, baseEmoji, selectedEmoji.group);
							}
						}
					}}
				/>
			</div>
		</div>
	);
};
