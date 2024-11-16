import React, { memo } from 'react';
import { type Group, type SelectedEmoji } from '../../lib/types';
import { EmojiButton } from './EmojiButton';
import { NUM_EMOJIS_PER_ROW } from '../../lib/constants';
import {
	useEmojiPickerSelector,
	useEmojiPickerStore,
} from '../../lib/store/hooks';
import { getEmojiWithVariant } from '../../lib/emoji-variants';
import {
	GROUP_PANE_HEADING_DATA_ATTR,
	GROUP_PANE_SECTION_DATA_ATTR,
	GROUP_TO_GROUP_ID,
} from './group-pane-utils';

interface GroupPaneProps {
	group: Group;
	emojis: string[];
	selectedEmoji?: SelectedEmoji;
	memo: boolean;
	children?: React.ReactNode;
}

/**
 * GroupPane renders the group section title and all the emojis with a group.
 */
export const GroupPane = memo(
	({ group, emojis, selectedEmoji, children }: GroupPaneProps) => {
		const skinTone = useEmojiPickerSelector((state) => state.skinTone);
		const emojiToSpecialVariant = useEmojiPickerSelector(
			(state) => state.emojiToSpecialVariant
		);
		const { getEmojiPickerStore, setEmojiPickerStore } = useEmojiPickerStore();

		const groupId = GROUP_TO_GROUP_ID[group];

		return (
			<section
				{...{
					[GROUP_PANE_SECTION_DATA_ATTR]: groupId,
				}}
			>
				<h2
					{...{
						[GROUP_PANE_HEADING_DATA_ATTR]: groupId,
					}}
					// h2 height = 16px line height + 12px padding = 28px GROUP_TITLE_HEIGHT
					// Note useAutoScrollToSelectedEmoji uses this height value
					className="text-xs text-gray-600-ld select-none py-1.5 px-[var(--emoji-picker-padding)] -mx-[var(--emoji-picker-padding)] sticky top-[-0.1px] bg-white_95-ld z-10 font-semibold"
				>
					{group}
				</h2>
				<ul className="flex flex-wrap">
					{emojis.map((baseEmoji, idx) => {
						const emojiWithVariant = getEmojiWithVariant(
							baseEmoji,
							skinTone,
							emojiToSpecialVariant
						);
						const isSelected =
							group === selectedEmoji?.group && idx === selectedEmoji?.idx;

						const isFirstInRow = idx % NUM_EMOJIS_PER_ROW === 0;
						const rowNum = Math.floor(idx / NUM_EMOJIS_PER_ROW) + 1;
						const labelOffsetClassName =
							rowNum >= 10 ? 'before:-left-[14px]' : 'before:-left-[10px]';

						return (
							<li
								key={idx}
								className={
									isFirstInRow
										? `flex items-center snap-end relative before:content-[attr(data-row-number)] before:text-xs before:absolute before:text-gray-400-ld before:tracking-[-1.5px] ${labelOffsetClassName}`
										: undefined
								}
								data-row-number={isFirstInRow ? rowNum : undefined}
							>
								<EmojiButton
									emoji={emojiWithVariant}
									isSelected={isSelected}
									onClick={() => {
										const searchInput = getEmojiPickerStore().searchInput;
										const resetEmojiPickerState =
											getEmojiPickerStore().resetEmojiPickerState;
										const onEmojiClick = getEmojiPickerStore().onEmojiClick;
										if (onEmojiClick) {
											onEmojiClick(
												emojiWithVariant,
												resetEmojiPickerState,
												baseEmoji,
												group,
												searchInput
											);
										}
									}}
									onMouseEnter={() => {
										// If user hovers on an emoji, we want to update it as the selected emoji.
										// There are 3 ways to hover on an emoji:
										// 		1. Hover on mouse movement
										// 		2. Hover on mouse wheel scroll
										// 		3. Hover due to arrow keys navigation that triggers auto scroll
										// 3 is not a desirable UI/UX experience, so we disable it
										const lastAutoScrollTimeDiffInMs =
											Date.now() - getEmojiPickerStore().lastAutoScrollTimeInMs;
										const isHoverViaAutoScroll =
											lastAutoScrollTimeDiffInMs < 100;
										if (isHoverViaAutoScroll) {
											return;
										}
										const selectedEmoji = {
											group,
											idx,
											emoji: baseEmoji,
										};
										setEmojiPickerStore({ selectedEmoji });
									}}
								/>
							</li>
						);
					})}
				</ul>
				{children}
			</section>
		);
	},
	(prevProps, nextProps) => {
		// memo is used to prevent unnecessary re-renders for performance optimization
		// We only re-renders the group pane (by returning false) if the current group
		// is the selectedEmoji group to update the selected emoji or if the memo prop
		// is false (used by FirstGroupPane for search results or frequently used emojis)
		const group = prevProps.group;
		if (
			prevProps.selectedEmoji?.group === group ||
			nextProps.selectedEmoji?.group === group ||
			nextProps.memo === false
		) {
			return false;
		}

		return true;
	}
);
