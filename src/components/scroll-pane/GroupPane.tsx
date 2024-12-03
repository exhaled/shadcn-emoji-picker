import { memo } from 'react';
import { useEmojiPickerSelector, useEmojiPickerStore } from '../../lib/store/hooks';
import { getEmojiWithVariant } from '../../lib/emoji-variants';
import { NUM_EMOJIS_PER_ROW } from '../../lib/constants';
import { EmojiButton } from './EmojiButton';
import type { Group } from '../../lib/types';

interface GroupPaneProps {
	group: Group;
	emojis: string[];
	selectedEmoji?: {
		group: Group;
		idx: number;
		emoji: string;
	};
	memo?: boolean;
	children?: React.ReactNode;
}

const GroupPaneCore = ({ group, emojis, selectedEmoji, children }: GroupPaneProps) => {
	const skinTone = useEmojiPickerSelector((state) => state.skinTone);
	const { getEmojiPickerStore, setEmojiPickerStore } = useEmojiPickerStore();

	return (
		<section>
			{children}
			<ul className="grid grid-cols-[repeat(8,32px)] gap-0">
				{emojis.map((baseEmoji, idx) => {
					const emojiWithVariant = getEmojiWithVariant(baseEmoji, skinTone);
					const isSelected = group === selectedEmoji?.group && idx === selectedEmoji?.idx;

					const isFirstInRow = idx % NUM_EMOJIS_PER_ROW === 0;
					const rowNum = Math.floor(idx / NUM_EMOJIS_PER_ROW) + 1;
					const labelOffsetClassName = rowNum >= 10 ? 'before:-left-[14px]' : 'before:-left-[10px]';

					return (
						<li
							key={idx}
							className={
								isFirstInRow
									? `flex items-center snap-end relative ${labelOffsetClassName}`
									: undefined
							}
							data-row-number={isFirstInRow ? rowNum : undefined}
						>
							<EmojiButton
								emoji={emojiWithVariant}
								isSelected={isSelected}
								onClick={() => {
									const handleEmojiSelect = getEmojiPickerStore().handleEmojiSelect;
									handleEmojiSelect(emojiWithVariant, baseEmoji, group);
								}}
								onMouseEnter={() => {
									// If user hovers on an emoji, we want to update it as the selected emoji.
									// There are 3 ways to hover on an emoji:
									//    1. Hover on mouse movement
									//    2. Hover on mouse wheel scroll
									//    3. Hover due to arrow keys navigation that triggers auto scroll
									// 3 is not a desirable UI/UX experience, so we disable it
									const lastAutoScrollTimeDiffInMs =
										Date.now() - getEmojiPickerStore().lastAutoScrollTimeInMs;
									const isHoverViaAutoScroll = lastAutoScrollTimeDiffInMs < 100;
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
		</section>
	);
};

export const GroupPane = memo(GroupPaneCore);
