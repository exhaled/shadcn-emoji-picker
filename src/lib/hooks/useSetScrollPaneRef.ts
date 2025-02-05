import { useEffect, useRef } from 'react';
import { useEmojiPickerStore } from '../store/hooks';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';

/**
 * Hook to set scroll pane ref in component store on component mount, so
 * it can be accessed by other components:
 * - GroupsNavBar: to scroll to selected group
 * - EmojiButton: to auto scroll to selected emoji
 */
export interface ScrollRefs {
	scrollPaneRef: React.RefObject<HTMLDivElement>;
	viewportRef: React.RefObject<React.ElementRef<typeof ScrollAreaPrimitive.Viewport>>;
}

export const useSetScrollPaneRef = (): ScrollRefs => {
	const scrollPaneRef = useRef<HTMLDivElement>(null);
	const viewportRef = useRef<React.ElementRef<typeof ScrollAreaPrimitive.Viewport>>(null);

	const { setEmojiPickerStore } = useEmojiPickerStore();

	useEffect(() => {
		setEmojiPickerStore({ scrollPaneElement: scrollPaneRef.current });
	}, []);

	return {
		scrollPaneRef,
		viewportRef
	};
};
