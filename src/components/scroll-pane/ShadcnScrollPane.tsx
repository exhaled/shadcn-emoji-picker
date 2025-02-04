import { type Group } from '../../lib/types';
import { GROUP_TO_BASE_EMOJIS, CustomGroup } from '../../lib/constants';
import { useEmojiPickerSelector } from '../../lib/store/hooks';
import { useSetScrollPaneRef } from '../../lib/hooks/useSetScrollPaneRef';
import { cn } from '../../lib/utils';
import DefaultGroupPanel from './default-group-panel';
import NoResults from './no-results';
import { GroupPanel } from './group-panel';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';

const outerContainerClasses = 'px-[var(--emoji-picker-padding)] relative';

const scrollPaneClasses = [
	'max-h-[var(--emoji-scroll-pane-max-height)]',
	'mb-2 pr-2',
	'scroll-smooth h-auto',
];

const viewportClasses = [
	'[&>[data-radix-scroll-area-viewport]]:max-h-[inherit]',
	'[&>[data-radix-scroll-area-viewport]]:snap-y [&>[data-radix-scroll-area-viewport]]:snap-mandatory',
];

const groupClasses = 'snap-start snap-always';

/**
 * ShadcnScrollPane renders emojis from the selected category in a scrollable container
 * using Shadcn UI components.
 */
export const ScrollPanel = () => {
	const scrollPaneRef = useSetScrollPaneRef();
	const selectedEmoji = useEmojiPickerSelector((state) => state.selectedEmoji);
	const selectedGroup = useEmojiPickerSelector((state) => state.selectedGroup);
	const searchInput = useEmojiPickerSelector((state) => state.searchInput);
	const searchEmojisResults = useEmojiPickerSelector((state) => state.searchEmojisResults);

	// When there's a search input, show search results regardless of selected group
	if (searchInput.trim()) {
		return (
			<div className={outerContainerClasses}>
				<ScrollArea ref={scrollPaneRef} className={cn(scrollPaneClasses, viewportClasses)}>
					<div className={groupClasses}>
						<GroupPanel
							group={CustomGroup.SearchResults}
							emojis={searchEmojisResults}
							selectedEmoji={selectedEmoji}
							memo={false}
						>
							{searchEmojisResults.length === 0 && <NoResults type="search" />}
						</GroupPanel>
					</div>
				</ScrollArea>
			</div>
		);
	}

	// Show selected category emojis
	return (
		<div className={outerContainerClasses}>
			<ScrollArea
				ref={scrollPaneRef}
				className={cn(scrollPaneClasses, viewportClasses)}
				onMouseDown={(e) => {
					e.preventDefault();
				}}
			>
				<div className={groupClasses}>
					{selectedGroup === CustomGroup.FrequentlyUsed ? (
						<DefaultGroupPanel />
					) : (
						<GroupPanel
							key={selectedGroup}
							group={selectedGroup}
							emojis={
								GROUP_TO_BASE_EMOJIS[selectedGroup as keyof typeof GROUP_TO_BASE_EMOJIS] || []
							}
							selectedEmoji={selectedEmoji}
							memo={true}
						/>
					)}
				</div>
			</ScrollArea>
		</div>
	);
};
