import { useEffect, useRef } from 'react';
import { useEmojiPickerStore } from '../store/hooks';

/**
 * Hook to set scroll pane ref in component store on component mount, so
 * it can be accessed by other components:
 * - GroupsNavBar: to scroll to selected group
 * - EmojiButton: to auto scroll to selected emoji
 */
export const useSetScrollPaneRef = () => {
	const scrollPaneRef = useRef<HTMLDivElement | null>(null);

	const { setEmojiPickerStore } = useEmojiPickerStore();

	useEffect(() => {
		setEmojiPickerStore({ scrollPaneElement: scrollPaneRef.current });
	}, []);

	return scrollPaneRef;
};
