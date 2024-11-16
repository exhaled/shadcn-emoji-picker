import type { Group } from '../../lib/types';

export const GROUP_TO_GROUP_ID: Record<Group, number> = {
	'Search Results': 0,
	'Frequently Used': 0,
	'Smileys & Emotion': 1,
	'People & Body': 2,
	'Animals & Nature': 3,
	'Food & Drink': 4,
	'Travel & Places': 5,
	Activities: 6,
	Objects: 7,
	Symbols: 8,
	Flags: 9,
};

export const GROUP_PANE_SECTION_DATA_ATTR = 'data-group-pane-section-id';
export const GROUP_PANE_HEADING_DATA_ATTR = 'data-group-pane-heading-id';

/**
 * Get the group pane element by group id.
 *
 * This is used by GroupsNavBar to scroll to the corresponding group pane by clicking the group icon.
 */
export const getGroupPaneByGroupId = (
	scrollPane: HTMLDivElement,
	groupId: number
) => {
	return scrollPane.querySelector(
		`[${GROUP_PANE_SECTION_DATA_ATTR}='${groupId}']`
	) as HTMLDivElement;
};

/**
 * Get the group pane heading element by group id.
 *
 * This is used by useUpdateScrollPaneCurrentGroupId hook to update the current group icon id.
 */
export const getGroupPaneHeadingByGroupId = (
	scrollPane: HTMLDivElement,
	groupId: number
) => {
	return scrollPane.querySelector(
		`[${GROUP_PANE_HEADING_DATA_ATTR}='${groupId}']`
	) as HTMLHeadingElement;
};
