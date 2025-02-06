import { EmojiPicker } from '@/components/emoji-picker';
import { Input } from '@/components/ui/input';
import { StrictMode, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';

const Playground = () => {
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div className='relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black p-4'>
            <div className='absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]' />
            <div className='absolute left-0 right-0 top-[-10%] h-[1000px] w-[1000px] rounded-full bg-[radial-gradient(circle_400px_at_50%_300px,#fbfbfb36,#000)]' />

            <div className='relative mx-auto w-full max-w-3xl space-y-8'>
                <div className='space-y-2 text-center'>
                    <h1 className='bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-4xl font-bold text-transparent'>
                        Emoji Picker
                    </h1>
                    <p className='text-gray-400'>Advanced emoji picker with search engine built with shadcn/ui components</p>
                </div>

                <div className='flex h-[250px] items-center justify-center'>
                    <div className='flex h-full w-full max-w-md items-center justify-center rounded-xl border border-gray-800 bg-black p-4'>
                        <div className='flex items-center gap-2'>
                            <Input
                                ref={inputRef}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder='Emojis will appear here...'
                                className='border-gray-800 bg-gray-900/70 text-white backdrop-blur-sm placeholder:text-gray-400'
                            />
                            <EmojiPicker
                                onEmojiSelect={(emoji) => {
                                    if (inputRef.current) {
                                        const start = inputRef.current.selectionStart || 0;
                                        const end = inputRef.current.selectionEnd || 0;
                                        const newValue = inputValue.slice(0, start) + emoji + inputValue.slice(end);
                                        setInputValue(newValue);
                                        // Set cursor position after the inserted emoji
                                        setTimeout(() => {
                                            if (inputRef.current) {
                                                const newPosition = start + emoji.length;
                                                inputRef.current.setSelectionRange(newPosition, newPosition);
                                                inputRef.current.focus();
                                            }
                                        }, 0);
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className='text-center'>
                    <a
                        href='https://github.com/exhaled/shadcn-emoji-picker'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='inline-flex items-center space-x-2 text-sm text-gray-400 transition-colors hover:text-white'>
                        <svg
                            viewBox='0 0 24 24'
                            width='16'
                            height='16'
                            stroke='currentColor'
                            strokeWidth='2'
                            fill='none'
                            strokeLinecap='round'
                            strokeLinejoin='round'>
                            <path d='M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22' />
                        </svg>
                        <span>View on GitHub</span>
                    </a>
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
