import { Icons } from './group-icons/Icons';

import type { NavBarGroup } from '../lib/types';
import type {
	GetEmojiPickerStore,
	SetEmojiPickerStore,
} from '../lib/store/store';
import { cx } from '../lib/cx';
import {
	getGroupPaneByGroupId,
	GROUP_TO_GROUP_ID,
} from './scroll-pane/group-pane-utils';
import {
	useEmojiPickerSelector,
	useEmojiPickerStore,
} from '../lib/store/hooks';

// Note: The order of the mapping matters here as it is the order of the group icons
const GROUP_TO_NAV_BAR_ICON: Record<NavBarGroup, () => React.JSX.Element> = {
	'Search Results': Icons.SearchIcon,
	'Smileys & Emotion': Icons.SmileysAndEmotionIcon,
	'People & Body': Icons.PeopleAndBodyIcon,
	'Animals & Nature': Icons.AnimalsAndNatureIcon,
	'Food & Drink': Icons.FoodAndDrinkIcon,
	'Travel & Places': Icons.TravelAndPlacesIcon,
	Activities: Icons.ActivitiesIcon,
	Objects: Icons.ObjectsIcon,
	Symbols: Icons.SymbolsIcon,
	Flags: Icons.FlagsIcon,
};

/**
 * GroupsNavBar is the top navigation bar that lists an icon for each of the 10 groups.
 * - Clicking a group icon scrolls the scroll pane to the corresponding group.
 * - Only the current active group icon is colorized while the other non-active ones are grayscale.
 */
export const GroupsNavBar = () => {
	const scrollPaneCurrentGroupId = useEmojiPickerSelector(
		(state) => state.scrollPaneCurrentGroupId
	);
	const { getEmojiPickerStore, setEmojiPickerStore } = useEmojiPickerStore();

	return (
		<nav className="pt-2 pb-2.5 px-[var(--emoji-picker-padding)] border-b-ld">
			<ul className="grid grid-cols-10 gap-[9px]">
				{Object.entries(GROUP_TO_NAV_BAR_ICON).map(([group, Icon]) => {
					const groupId = GROUP_TO_GROUP_ID[group as NavBarGroup];
					return (
						<li
							key={group}
							title={group}
							className={cx(
								'cursor-pointer',
								scrollPaneCurrentGroupId !== groupId &&
									'grayscale opacity-70 hover:filter-none',
								scrollPaneCurrentGroupId !== groupId &&
									group === 'Flags' &&
									'hover:opacity-90'
							)}
							onMouseDown={() => {
								scrollToGroupPane(
									getEmojiPickerStore,
									setEmojiPickerStore,
									groupId
								);
							}}
						>
							<Icon />
						</li>
					);
				})}
			</ul>
		</nav>
	);
};

/**
 * Scroll to the group pane with the given order id, e.g. 0 - Search Results, 1 - Smileys & Emotion, etc.
 */
const scrollToGroupPane = (
	getEmojiPickerStore: GetEmojiPickerStore,
	setEmojiPickerStore: SetEmojiPickerStore,
	groupId: number
) => {
	const scrollPane = getEmojiPickerStore().scrollPaneElement!;
	const groupPane = getGroupPaneByGroupId(scrollPane, groupId);
	if (groupPane) {
		// block: 'nearest' is used to only scroll groupPane within scrollPane and prevents scrolling the viewport
		// (Reference: https://stackoverflow.com/questions/11039885/scrollintoview-causing-the-whole-page-to-move)
		// Also, 'nearest' can scroll groupPane to the nearest top or bottom, to ensure groupPane is always scrolled
		// to the top, we first reset scrollPane scrollTop to 0
		scrollPane.scrollTop = 0;
		groupPane.scrollIntoView({ block: 'nearest' });
		setEmojiPickerStore({ scrollPaneCurrentGroupId: groupId });
	}
	// If the Search Results group doesn't exist, scroll to Smileys & Emotion group
	else if (groupId === 0) {
		const smileysGroup = getGroupPaneByGroupId(scrollPane, 1);
		scrollPane.scrollTop = 0;
		smileysGroup.scrollIntoView({
			block: 'nearest',
		});
		setEmojiPickerStore({ scrollPaneCurrentGroupId: groupId });
	}
};
