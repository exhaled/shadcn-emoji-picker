import { Button } from './ui/button';
import type { NavBarGroup } from '../lib/types';
import { useEmojiPickerSelector, useEmojiPickerStore } from '../lib/store/hooks';
import { Search, Smile, Cat, Coffee, Plane, Gamepad2, Laptop2, Hash, Flag } from 'lucide-react';
import { useRef, useEffect } from 'react';

// Note: The order of the mapping matters here as it is the order of the group icons
const GROUP_TO_ICON: Record<NavBarGroup, React.ComponentType<{ className?: string }>> = {
	'Frequently Used': Search,
	'Smileys & Emotion': Smile,
	'Animals & Nature': Cat,
	'Food & Drink': Coffee,
	'Travel & Places': Plane,
	Activities: Gamepad2,
	Objects: Laptop2,
	Symbols: Hash,
	Flags: Flag,
};

/**
 * ShadcnGroupsNavBar is the top navigation bar using Shadcn UI Button components
 * that lists an icon for each emoji group. Clicking a group icon shows emojis
 * from that category.
 */
export const GroupsNavigation = () => {
	const selectedGroup = useEmojiPickerSelector((state) => state.selectedGroup);
	const { setEmojiPickerStore } = useEmojiPickerStore();
	const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);
	const groups = Object.keys(GROUP_TO_ICON) as NavBarGroup[];

	const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
		let nextIndex: number | null = null;

		switch (e.key) {
			case 'ArrowLeft':
				e.preventDefault();
				nextIndex = currentIndex > 0 ? currentIndex - 1 : groups.length - 1;
				break;
			case 'ArrowRight':
				e.preventDefault();
				nextIndex = currentIndex < groups.length - 1 ? currentIndex + 1 : 0;
				break;
		}

		if (nextIndex !== null) {
			buttonsRef.current[nextIndex]?.focus();
			setEmojiPickerStore({
				selectedGroup: groups[nextIndex],
				searchInput: '',
				searchEmojisResults: [],
			});
		}
	};

	const handleGroupChange = (group: NavBarGroup) => {
		// Find the ScrollArea viewport and reset its scroll position
		const viewport = document.querySelector('[data-radix-scroll-area-viewport]');
		if (viewport) {
			viewport.scrollTop = 0;
		}

		setEmojiPickerStore({
			selectedGroup: group,
			searchInput: '',
			searchEmojisResults: [],
		});
	};

	// Focus the selected group's button when it changes
	useEffect(() => {
		if (Object.keys(GROUP_TO_ICON).includes(selectedGroup)) {
			const selectedIndex = groups.indexOf(selectedGroup as NavBarGroup);
			if (selectedIndex !== -1) {
				buttonsRef.current[selectedIndex]?.focus();
			}
		}
	}, [selectedGroup]);

	return (
		<nav
			className="py-2 px-[var(--emoji-picker-padding)]"
			role="navigation"
			aria-label="Emoji categories"
		>
			<div className="flex gap-1 justify-between" role="tablist">
				{groups.map((group, index) => {
					const Icon = GROUP_TO_ICON[group];
					const isSelected = selectedGroup === group;
					return (
						<Button
							ref={(el) => (buttonsRef.current[index] = el)}
							key={group}
							variant={isSelected ? 'secondary' : 'ghost'}
							size="icon"
							className="w-8 h-8"
							onClick={() => handleGroupChange(group)}
							onKeyDown={(e) => handleKeyDown(e, index)}
							aria-label={`Show ${group} emojis`}
							aria-selected={isSelected}
							role="tab"
							tabIndex={isSelected ? 0 : -1}
						>
							<Icon className="h-4 w-4" />
						</Button>
					);
				})}
			</div>
		</nav>
	);
};
