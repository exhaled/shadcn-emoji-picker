import { EmojiPicker } from '@/components/emoji-picker';
import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';

const Playground = () => {
	const [lastEmoji, setLastEmoji] = useState<string>('');

	return (
		<div className="flex flex-col items-center py-12 px-4 md:px-12">
			<div className="max-w-[380px] text-center">
				<p className="font-medium">Last selected emoji:</p>
				{lastEmoji && <p>{lastEmoji}</p>}
			</div>

			<div className="mt-12 flex flex-col items-center">
				<div className="relative w-56 lg:w-[500px] h-[300px] flex gap-4 items-center justify-center border border-gray-700 rounded-lg bg-gray-900">
					<EmojiPicker
						onEmojiSelect={(emoji, metadata) => {
							setLastEmoji(
								`${emoji} (${metadata.baseEmoji} from ${metadata.group}${metadata.searchInput ? ` searched as "${metadata.searchInput}"` : ''})`
							);
						}}
					/>
				</div>
			</div>
		</div>
	);
};

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Playground />
	</StrictMode>
);
