import { type FC } from 'react';
import { cn } from '@/lib/utils';

type NoResultsProps = {
	type: 'search' | 'default';
};

const NoResults: FC<NoResultsProps> = ({ type }) => {
	return (
		<div className={'text-xs text-muted-foreground tracking-tight select-none w-full text-center grid pr-[3px]'}>
			{type == 'default' && (
				<>
					<p>No frequently used emojis</p>
					<p>Select some to appear here</p>
				</>
			)}

			{type == 'search' && (
				<>
					<p>No emojis found</p>
					<p>Try searching for something else</p>
				</>
			)}
		</div>
	);
};

export default NoResults;
