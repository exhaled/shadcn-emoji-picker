import { useEffect } from 'react';
import { useEmojiPickerStore } from '../store/hooks';
import {
	getGroupPaneHeadingByGroupId,
	GROUP_TO_GROUP_ID,
} from '../../components/scroll-pane/group-pane-utils';

/**
 * A hook that subscribes to scroll pane scroll and wheel scroll events to update a store prop:
 * scrollPaneCurrentGroupId - The current group id that is sticky to the top of the scroll pane.
 * 							  This is used in GroupsNavBar to update the current group icon appearance.
 */
export const useUpdateScrollPaneCurrentGroupId = ({
	scrollPaneRef,
}: {
	scrollPaneRef: React.RefObject<HTMLDivElement>;
}) => {
	const { setEmojiPickerStore } = useEmojiPickerStore();

	useEffect(() => {
		const scrollPaneElement = scrollPaneRef.current!;
		const updateScrollPaneCurrentGroupId = () => {
			// Set current group id to first group if user has scrolled to the top
			if (scrollPaneElement.scrollTop === 0) {
				setEmojiPickerStore({
					scrollPaneCurrentGroupId: 0,
				});
			} else {
				for (const groupId of Object.values(GROUP_TO_GROUP_ID)) {
					if (groupId === 0) {
						continue;
					}
					const groupPaneHeading = getGroupPaneHeadingByGroupId(
						scrollPaneElement,
						groupId
					)!;
					const diff = Math.abs(
						scrollPaneElement.scrollTop - groupPaneHeading.offsetTop
					);
					if (diff < 1) {
						setEmojiPickerStore({
							scrollPaneCurrentGroupId: groupId,
						});
						break;
					}
				}
			}
		};

		scrollPaneElement.addEventListener(
			'scroll',
			updateScrollPaneCurrentGroupId
		);
		scrollPaneElement.addEventListener('wheel', updateScrollPaneCurrentGroupId);

		return () => {
			scrollPaneElement?.removeEventListener(
				'scroll',
				updateScrollPaneCurrentGroupId
			);
			scrollPaneElement?.removeEventListener(
				'wheel',
				updateScrollPaneCurrentGroupId
			);
		};
	}, []);
};
