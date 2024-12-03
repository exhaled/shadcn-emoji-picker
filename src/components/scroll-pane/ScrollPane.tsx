import { type Group } from '../../lib/types';
import { GROUP_TO_BASE_EMOJIS, CustomGroup } from '../../lib/constants';

import { FirstGroupPane } from './FirstGroupPane';
import { GroupPane } from './GroupPane';

import { useEmojiPickerSelector } from '../../lib/store/hooks';
import { useSetScrollPaneRef } from '../../lib/hooks/useSetScrollPaneRef';

/**
 * ScrollPane renders emojis from the selected category in a scrollable container.
 */
export const ScrollPane = () => {
	const scrollPaneRef = useSetScrollPaneRef();
	const selectedEmoji = useEmojiPickerSelector((state) => state.selectedEmoji);
	const selectedGroup = useEmojiPickerSelector((state) => state.selectedGroup);
	const searchInput = useEmojiPickerSelector((state) => state.searchInput);
	const searchEmojisResults = useEmojiPickerSelector((state) => state.searchEmojisResults);

	// When there's a search input, show search results regardless of selected group
	if (searchInput.trim()) {
		return (
			<section
				ref={scrollPaneRef}
				className="overflow-y-scroll overflow-x-hidden snap-y scrollbar-thin scrollbar-thumb-gray-200-ld scrollbar-track-gray-100-ld scrollbar-thumb-rounded-md px-[var(--emoji-picker-padding)] max-h-[var(--emoji-scroll-pane-max-height)] relative pb-2 pt-2"
			>
				<GroupPane
					group={CustomGroup.SearchResults}
					emojis={searchEmojisResults}
					selectedEmoji={selectedEmoji}
					memo={false}
				/>
			</section>
		);
	}

	// When there's no search and no selected group, show the prompt
	if (!selectedGroup) {
		return (
			<section
				ref={scrollPaneRef}
				className="overflow-y-scroll overflow-x-hidden snap-y scrollbar-thin scrollbar-thumb-gray-200-ld scrollbar-track-gray-100-ld scrollbar-thumb-rounded-md px-[var(--emoji-picker-padding)] max-h-[var(--emoji-scroll-pane-max-height)] relative pb-2 flex items-center justify-center"
			>
				<p className="text-gray-600-ld text-sm">Select a category to view emojis</p>
			</section>
		);
	}

	// Show selected category emojis
	return (
		<section
			ref={scrollPaneRef}
			className="overflow-y-scroll overflow-x-hidden snap-y scrollbar-thin scrollbar-thumb-gray-200-ld scrollbar-track-gray-100-ld scrollbar-thumb-rounded-md px-[var(--emoji-picker-padding)] max-h-[var(--emoji-scroll-pane-max-height)] relative pb-2 pt-2"
			onMouseDown={(e) => {
				// Prevent scroll pane from getting focus so pressing arrow keys & space don't scroll it
				e.preventDefault();
			}}
		>
			{selectedGroup === CustomGroup.FrequentlyUsed ? (
				<FirstGroupPane />
			) : (
				<GroupPane
					key={selectedGroup}
					group={selectedGroup}
					emojis={GROUP_TO_BASE_EMOJIS[selectedGroup as keyof typeof GROUP_TO_BASE_EMOJIS] || []}
					selectedEmoji={selectedEmoji}
					memo={true}
				/>
			)}
		</section>
	);
};
