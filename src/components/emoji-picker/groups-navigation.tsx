import { Cat, Clock, Coffee, Flag, Gamepad2, Hash, Laptop2, Plane, Smile } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { GROUP_TO_BASE_EMOJIS } from '../../lib/constants';
import { useEmojiPickerKeyDownProps } from '../../lib/hooks/useEmojiPickerKeyDownProps';
import { useEmojiPickerSelector, useEmojiPickerStore } from '../../lib/store/hooks';
import type { DataGroup, NavBarGroup } from '../../lib/types';
import { Button } from '../ui/button';

// Note: The order of the mapping matters here as it is the order of the group icons
const GROUP_TO_ICON: Record<NavBarGroup, React.ComponentType<{ className?: string }>> = {
    'Frequently Used': Clock,
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
    const wasDirectInteraction = useRef(false);
    const groups = Object.keys(GROUP_TO_ICON) as NavBarGroup[];
    const { addKeyDownEventListener, removeKeyDownEventListener } = useEmojiPickerKeyDownProps();

    // Store first button ref in store when available
    useEffect(() => {
        if (buttonsRef.current[0]) {
            setEmojiPickerStore({ firstGroupButtonRef: buttonsRef.current[0] });
        }
    }, [setEmojiPickerStore]);

    const moveToEmojis = (currentIndex: number) => {
        const group = groups[currentIndex];
        const emojis = GROUP_TO_BASE_EMOJIS[group as DataGroup];

        // If no emojis found for this group, don't proceed
        if (!emojis?.length) return;

        buttonsRef.current[currentIndex]?.blur();
        // Remove any existing event listener before adding a new one
        removeKeyDownEventListener();
        addKeyDownEventListener();
        setEmojiPickerStore({
            selectedGroup: group,
            searchInput: '',
            searchEmojisResults: [],
            selectedEmoji: {
                group,
                idx: 0,
                emoji: emojis[0],
            },
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
        let nextIndex: number | null = null;

        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                e.stopPropagation();
                nextIndex = currentIndex > 0 ? currentIndex - 1 : groups.length - 1;
                break;
            case 'ArrowRight':
                e.preventDefault();
                e.stopPropagation();
                nextIndex = currentIndex < groups.length - 1 ? currentIndex + 1 : 0;
                break;
            case 'Tab':
                e.preventDefault();
                e.stopPropagation();
                moveToEmojis(currentIndex);
                return;
            default:
                return;
        }

        if (nextIndex !== null) {
            wasDirectInteraction.current = true;
            buttonsRef.current[nextIndex]?.focus();
            setEmojiPickerStore({
                selectedGroup: groups[nextIndex],
                searchInput: '',
                searchEmojisResults: [],
            });
        }
    };

    const handleGroupChange = (group: NavBarGroup) => {
        wasDirectInteraction.current = true;
        setEmojiPickerStore({
            selectedGroup: group,
            searchInput: '',
            searchEmojisResults: [],
        });
    };

    // Focus the selected group's button only when changed through direct interaction
    useEffect(() => {
        if (Object.keys(GROUP_TO_ICON).includes(selectedGroup) && wasDirectInteraction.current) {
            const selectedIndex = groups.indexOf(selectedGroup as NavBarGroup);
            if (selectedIndex !== -1) {
                buttonsRef.current[selectedIndex]?.focus();
            }
        }
        wasDirectInteraction.current = false;
    }, [selectedGroup]);

    return (
        <nav
            className='px-[var(--emoji-picker-padding)] py-2'
            role='navigation'
            aria-label='Emoji categories - Use Tab to navigate to emojis, arrow keys to switch categories'>
            <div className='flex justify-between gap-1' role='tablist' aria-label='Category selection'>
                {groups.map((group, index) => {
                    const Icon = GROUP_TO_ICON[group];
                    const isSelected = selectedGroup === group;
                    return (
                        <Button
                            ref={(el) => (buttonsRef.current[index] = el)}
                            key={group}
                            variant={isSelected ? 'secondary' : 'ghost'}
                            size='icon'
                            className='h-8 w-8'
                            onClick={() => handleGroupChange(group)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            aria-label={`${group} category - Press Tab to view emojis`}
                            aria-selected={isSelected}
                            role='tab'
                            tabIndex={isSelected ? 0 : -1}>
                            <Icon className='h-4 w-4' />
                        </Button>
                    );
                })}
            </div>
        </nav>
    );
};
