import { GroupPane } from './GroupPane';

import { CustomGroup } from '../../lib/constants';
import { useEmojiPickerSelector } from '../../lib/store/hooks';

export const FirstGroupPane = () => {
	const searchInput = useEmojiPickerSelector((state) => state.searchInput);
	const searchEmojisResults = useEmojiPickerSelector(
		(state) => state.searchEmojisResults
	);
	const frequentlyUsedEmojis =
		useEmojiPickerSelector((state) => state.frequentlyUsedEmojis) ?? [];
	const selectedEmoji = useEmojiPickerSelector((state) => state.selectedEmoji);

	if (searchInput) {
		return (
			<GroupPane
				key={CustomGroup.SearchResults}
				group={CustomGroup.SearchResults}
				emojis={searchEmojisResults}
				selectedEmoji={selectedEmoji}
				memo={false}
			>
				{searchEmojisResults.length === 0 && (
					<div className="text-xs text-gray-700-ld tracking-tight select-none mr-[var(--emoji-picker-padding)] pb-2 border-b-ld">
						<div>
							😅Oops, looks like we couldn't find any emojis related to '
							{searchInput}'
						</div>
						<div className="mt-1.5">
							😉Select an emoji below that best fits this keyword, then it'll
							show up on next search
						</div>
					</div>
				)}
			</GroupPane>
		);
	}

	if (frequentlyUsedEmojis.length > 0) {
		return (
			<GroupPane
				key={CustomGroup.FrequentlyUsed}
				group={CustomGroup.FrequentlyUsed}
				emojis={frequentlyUsedEmojis}
				selectedEmoji={selectedEmoji}
				memo={false}
			/>
		);
	}

	return null;
};
