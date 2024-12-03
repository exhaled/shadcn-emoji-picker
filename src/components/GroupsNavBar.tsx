import { Icons } from './group-icons/Icons';

import type { NavBarGroup } from '../lib/types';
import { cx } from '../lib/cx';
import { GROUP_TO_GROUP_ID } from './scroll-pane/group-pane-utils';
import { useEmojiPickerSelector, useEmojiPickerStore } from '../lib/store/hooks';
import { CustomGroup } from '../lib/constants';

// Note: The order of the mapping matters here as it is the order of the group icons
const GROUP_TO_NAV_BAR_ICON: Record<NavBarGroup, () => React.JSX.Element> = {
	'Frequently Used': Icons.SearchIcon,
	'Smileys & Emotion': Icons.SmileysAndEmotionIcon,
	// 'People & Body': Icons.PeopleAndBodyIcon,
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
 * Clicking a group icon shows emojis from that category.
 */
export const GroupsNavBar = () => {
	const selectedGroup = useEmojiPickerSelector((state) => state.selectedGroup);
	const { setEmojiPickerStore } = useEmojiPickerStore();

	return (
		<nav className="pt-2 pb-2.5 px-[var(--emoji-picker-padding)] border-b-ld">
			<ul className="grid grid-cols-9 gap-[9px]">
				{Object.entries(GROUP_TO_NAV_BAR_ICON).map(([group, Icon]) => {
					const isSelected = selectedGroup === group;
					return (
						<li
							key={group}
							title={group}
							className={cx(
								'cursor-pointer',
								!isSelected && 'grayscale opacity-70 hover:filter-none',
								!isSelected && group === 'Flags' && 'hover:opacity-90'
							)}
							onMouseDown={() => {
								setEmojiPickerStore({ 
									selectedGroup: group as NavBarGroup,
									searchInput: '',
									searchEmojisResults: []
								});
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
