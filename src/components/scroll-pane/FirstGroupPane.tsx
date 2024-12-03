import { GroupPane } from './GroupPane';

import { CustomGroup } from '../../lib/constants';
import { useEmojiPickerSelector } from '../../lib/store/hooks';

export const FirstGroupPane = () => {
	const frequentlyUsedEmojis =
		useEmojiPickerSelector((state) => state.frequentlyUsedEmojis) ?? [];
	const selectedEmoji = useEmojiPickerSelector((state) => state.selectedEmoji);

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
