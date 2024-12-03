import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ToggleableEmojiPicker } from '../src/components/ToggleableEmojiPicker';

const DARK_MODE_OPTIONS = [
	[undefined, '⚙️'],
	[false, '🌞'],
	[true, '🌚'],
] as const;

const POSITION_OPTIONS = [
	{ side: 'bottom', align: 'center' },
	{ side: 'top', align: 'center' },
	{ side: 'left', align: 'center' },
	{ side: 'right', align: 'center' },
	{ side: 'bottom', align: 'start' },
	{ side: 'bottom', align: 'end' },
] as const;

const Playground = () => {
	const [darkMode, setDarkMode] = useState<boolean | undefined>(undefined);
	const [position, setPosition] = useState<typeof POSITION_OPTIONS[number]>(POSITION_OPTIONS[0]);
	const [lastEmoji, setLastEmoji] = useState<string>('');

	return (
		<div className="flex flex-col items-center py-12 px-4 md:px-12">
			<div className="max-w-[380px] text-gray-600 text-sm">
				{lastEmoji && <p>Last selected emoji: {lastEmoji}</p>}
			</div>

			{/* Demo different positions */}
			<div className="mt-12 flex flex-col items-center gap-8">
				<div className="flex gap-4 items-center flex-wrap justify-center">
					{POSITION_OPTIONS.map((pos, idx) => (
						<button
							key={idx}
							onClick={() => setPosition(pos)}
							className={`px-3 py-1 rounded-full text-sm ${
								position.side === pos.side && position.align === pos.align
									? 'bg-blue-500 text-white'
									: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
							}`}
						>
							{pos.side}-{pos.align}
						</button>
					))}
				</div>

				<div className="relative w-[500px] h-[300px] flex items-center justify-center border border-gray-700 rounded-lg bg-gray-900">
					<ToggleableEmojiPicker
						side={position.side}
						align={position.align}
						buttonContent="Click me! 😊"
						buttonClassName="border shadow-sm"
						darkMode={darkMode}
						onEmojiSelect={(emoji, metadata) => {
							setLastEmoji(`${emoji} (${metadata.baseEmoji} from ${metadata.group}${metadata.searchInput ? ` searched as "${metadata.searchInput}"` : ''})`);
						}}
					/>
				</div>
			</div>

			{/* Settings */}
			<div className="mt-8">
				<div className="flex gap-4">
					<div className="flex gap-2">
						{DARK_MODE_OPTIONS.map(([mode, emoji], idx) => (
							<div
								key={idx}
								onClick={() => setDarkMode(mode)}
								className={`cursor-pointer border rounded-full w-7 h-7 flex items-center justify-center ${
									darkMode === mode ? 'border-yellow-500' : ''
								}`}
							>
								{emoji}
							</div>
						))}
					</div>
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
