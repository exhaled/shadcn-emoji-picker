import { type FC } from 'react';

type NoResultsProps = {
    type: 'search' | 'default';
};

const NoResults: FC<NoResultsProps> = ({ type }) => {
    return (
        <div className={'grid w-full select-none pr-[3px] text-center text-xs tracking-tight text-muted-foreground'}>
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
