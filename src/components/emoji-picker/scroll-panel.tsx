import { CustomGroup, GROUP_TO_BASE_EMOJIS } from '../../lib/constants';
import { useEmojiScroll } from '../../lib/hooks/useEmojiScroll';
import { useSetScrollPanelRef } from '../../lib/hooks/useSetScrollPanelRef';
import { useEmojiPickerSelector } from '../../lib/store/hooks';
import { type Group } from '../../lib/types';
import { cn } from '../../lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import DefaultGroupPanel from './default-group-panel';
import { GroupPanel } from './group-panel';
import NoResults from './no-results';
import { useEffect } from 'react';

const CLASSES = {
    outer: 'px-[var(--emoji-picker-padding)] relative',
    scrollPane: ['max-h-[var(--emoji-scroll-pane-max-height)]', 'mb-2 pr-2', 'scroll-smooth h-auto'].join(' '),
    viewport: [
        '[&>[data-radix-scroll-area-viewport]]:max-h-[inherit]',
        '[&>[data-radix-scroll-area-viewport]]:snap-y [&>[data-radix-scroll-area-viewport]]:snap-mandatory',
    ].join(' '),
    group: 'snap-start snap-always',
} as const;

const useScrollPanelState = () => {
    const selectedEmoji = useEmojiPickerSelector((state) => state.selectedEmoji);
    const selectedGroup = useEmojiPickerSelector((state) => state.selectedGroup);
    const searchInput = useEmojiPickerSelector((state) => state.searchInput);
    const searchEmojisResults = useEmojiPickerSelector((state) => state.searchEmojisResults);

    return {
        selectedEmoji,
        selectedGroup,
        searchInput,
        searchEmojisResults,
    };
};

/**
 * ShadcnScrollPane renders emojis from the selected category in a scrollable container
 * using Shadcn UI components.
 */
export const ScrollPanel = () => {
    const { scrollPanelRef, viewportRef } = useSetScrollPanelRef();
    const { selectedEmoji, selectedGroup, searchInput, searchEmojisResults } = useScrollPanelState();

    useEmojiScroll({ scrollPanelRef, viewportRef });

    // Reset scroll position when group changes
    useEffect(() => {
        if (viewportRef.current) {
            viewportRef.current.scrollTop = 0;
        }
    }, [selectedGroup, searchInput]);

    const renderGroupPanel = (group: Group, emojis: string[]) => (
        <GroupPanel key={group} group={group} emojis={emojis} selectedEmoji={selectedEmoji} memo={group !== CustomGroup.SearchResults}>
            {group === CustomGroup.SearchResults && emojis.length === 0 && <NoResults type='search' />}
        </GroupPanel>
    );

    const content = searchInput.trim() ? (
        renderGroupPanel(CustomGroup.SearchResults, searchEmojisResults)
    ) : selectedGroup === CustomGroup.FrequentlyUsed ? (
        <DefaultGroupPanel />
    ) : (
        renderGroupPanel(selectedGroup, GROUP_TO_BASE_EMOJIS[selectedGroup as keyof typeof GROUP_TO_BASE_EMOJIS] || [])
    );

    return (
        <div className={CLASSES.outer}>
            <ScrollArea
                ref={scrollPanelRef}
                viewportRef={viewportRef}
                className={cn(CLASSES.scrollPane, CLASSES.viewport)}
                onMouseDown={(e) => e.preventDefault()}>
                <div className={CLASSES.group}>{content}</div>
            </ScrollArea>
        </div>
    );
};
