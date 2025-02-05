import { memo } from 'react';
import { useEmojiPickerStore } from '../../lib/store/hooks';
import { NUM_EMOJIS_PER_ROW } from '../../lib/constants';
import type { Group } from '../../lib/types';
import { EmojiButton } from './emoji-button';
import { cn } from '../../lib/utils';

interface GroupPanelProps {
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

const GroupPanelCore = ({ group, emojis, selectedEmoji, children }: GroupPanelProps) => {
	const { getEmojiPickerStore } = useEmojiPickerStore();

	return (
		<section 
			role="tabpanel" 
			aria-label={`${group} emojis`}
		>
			{children}

			<ul className="grid grid-cols-9 gap-px">
				{emojis.map((baseEmoji, idx) => {
					const isSelected = group === selectedEmoji?.group && idx === selectedEmoji?.idx;

					const isFirstInRow = idx % NUM_EMOJIS_PER_ROW === 0;
					const rowNum = Math.floor(idx / NUM_EMOJIS_PER_ROW) + 1;

					return (
						<li
							key={idx}
							className={isFirstInRow ? `flex items-center snap-start` : undefined}
							data-row-number={isFirstInRow ? rowNum : undefined}
						>
							<EmojiButton
								emoji={baseEmoji}
								isSelected={isSelected}
								onClick={() => {
									const handleEmojiSelect = getEmojiPickerStore().handleEmojiSelect;
									handleEmojiSelect(baseEmoji, group);
								}}
							/>
						</li>
					);
				})}
			</ul>
		</section>
	);
};

export const GroupPanel = memo(GroupPanelCore);
