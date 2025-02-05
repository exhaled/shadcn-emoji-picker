import { type Group } from '../../lib/types';
import { GROUP_TO_BASE_EMOJIS, CustomGroup } from '../../lib/constants';
import { useEmojiPickerSelector } from '../../lib/store/hooks';
import { useSetScrollPaneRef } from '../../lib/hooks/useSetScrollPaneRef';
import { useEmojiScroll } from '../../lib/hooks/useEmojiScroll';
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

	// Add auto-scrolling functionality
	useEmojiScroll(scrollPaneRef);

	const renderGroupPanel = (group: Group, emojis: string[]) => (
		<GroupPanel
			key={group}
			group={group}
			emojis={emojis}
			selectedEmoji={selectedEmoji}
			memo={group !== CustomGroup.SearchResults}
		>
			{group === CustomGroup.SearchResults && emojis.length === 0 && (
				<NoResults type="search" />
			)}
		</GroupPanel>
	);

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
					{searchInput.trim() ? (
						renderGroupPanel(CustomGroup.SearchResults, searchEmojisResults)
					) : selectedGroup === CustomGroup.FrequentlyUsed ? (
						<DefaultGroupPanel />
					) : (
						renderGroupPanel(
							selectedGroup,
							GROUP_TO_BASE_EMOJIS[selectedGroup as keyof typeof GROUP_TO_BASE_EMOJIS] || []
						)
					)}
				</div>
			</ScrollArea>
		</div>
	);
};
