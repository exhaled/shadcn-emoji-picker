import { type Group } from '../../lib/types';
import { GROUP_TO_BASE_EMOJIS } from '../../lib/constants';

import { FirstGroupPane } from './FirstGroupPane';
import { GroupPane } from './GroupPane';

import { useEmojiPickerSelector } from '../../lib/store/hooks';
import { useSetScrollPaneRef } from '../../lib/hooks/useSetScrollPaneRef';
import { useUpdateScrollPaneCurrentGroupId } from '../../lib/hooks/useUpdateScrollPaneCurrentGroupId';

/**
 * ScrollPane renders each group of emojis in a scrollable container.
 */
export const ScrollPane = () => {
	const scrollPaneRef = useSetScrollPaneRef();
	const selectedEmoji = useEmojiPickerSelector((state) => state.selectedEmoji);

	useUpdateScrollPaneCurrentGroupId({
		scrollPaneRef,
	});

	return (
		<section
			ref={scrollPaneRef}
			className={
				'overflow-y-scroll overflow-x-hidden snap-y scrollbar-thin scrollbar-thumb-gray-200-ld scrollbar-track-gray-100-ld scrollbar-thumb-rounded-md pl-[19px] max-h-[var(--emoji-scroll-pane-max-height)] relative pb-2'
			}
			onMouseDown={(e) => {
				// Prevent scroll pane from getting focus so pressing arrow keys & space don't scroll it
				e.preventDefault();
			}}
		>
			<FirstGroupPane />
			{Object.entries(GROUP_TO_BASE_EMOJIS).map(([group, emojis]) => (
				<GroupPane
					key={group}
					group={group as Group}
					emojis={emojis}
					selectedEmoji={selectedEmoji}
					memo={true}
				/>
			))}
		</section>
	);
};
