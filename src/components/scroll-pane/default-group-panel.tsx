import { CustomGroup } from '@/lib/constants';
import { useEmojiPickerSelector } from '@/lib/store/hooks';
import NoResults from './no-results';
import { GroupPanel } from './group-panel';

const DefaultGroupPanel = () => {
	const selectedEmoji = useEmojiPickerSelector((state) => state.selectedEmoji);
	const frequentlyUsedEmojis = useEmojiPickerSelector((state) => state.frequentlyUsedEmojis);

	return (
		<GroupPanel
			group={CustomGroup.FrequentlyUsed}
			emojis={frequentlyUsedEmojis}
			selectedEmoji={selectedEmoji}
			memo={false}
		>
			{frequentlyUsedEmojis.length === 0 && <NoResults type="default" />}
		</GroupPanel>
	);
};

export default DefaultGroupPanel;
