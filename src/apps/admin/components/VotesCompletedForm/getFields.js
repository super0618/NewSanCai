import { fieldName as button } from '../Form/fields/FormFieldButton';
import { fieldName as title } from '../Form/fields/FormFieldTitle';
import { DEFAULT_LOCALE } from '../../../client/constants';

export default function ({ formTitle, item }) {
    const answersEntries = item.answers ? Object.entries(item.answers) : null;

    const totalVotes = answersEntries
        ? answersEntries.reduce((acc, current) => (
            acc + current[1].length
        )
        , 0)
        : 0;
    const optionsVotes = answersEntries
        ? answersEntries.reduce((acc, currentOption) => {
            const percent = (currentOption[1].length / totalVotes * 100);
            return [
                ...acc,
                {
                    optionTitle: item.data[DEFAULT_LOCALE]?.votingOptions.find(option => option.variantId === currentOption[0])?.data[DEFAULT_LOCALE].variant,
                    voteCount: currentOption[1].length,
                    percent: percent % 1 === 0 ? percent : percent.toFixed(2)
                }
            ];
        }, [])
        : [];

    return [
        {
            field: title,
            name: 'titleField',
            settings: {
                label: formTitle
            }
        },
        {
            field: title,
            name: 'titleField',
            settings: {
                label: 'Title',
                variant: 'h5'
            }
        },
        {
            field: title,
            name: 'titleField',
            settings: {
                label: item.data[DEFAULT_LOCALE]?.title,
                variant: 'h6'
            }
        },
        {
            field: title,
            name: 'titleField',
            settings: {
                label: 'Description',
                variant: 'h5'
            }
        },
        {
            field: title,
            name: 'titleField',
            settings: {
                label: item.data[DEFAULT_LOCALE]?.editor,
                variant: 'editor'
            }
        },
        {
            field: title,
            name: 'titleField',
            settings: {
                label: 'Total votes',
                variant: 'h5'
            }
        },
        {
            field: title,
            name: 'titleField',
            settings: {
                label: `${totalVotes}`,
                variant: 'h6'
            }
        },
        {
            field: title,
            name: 'titleField',
            settings: {
                label: 'Voting options',
                variant: 'h5'
            }
        },
        ...(optionsVotes.map(item => ({
            field: title,
            name: 'titleField',
            settings: {
                label: `${item.optionTitle} (${item.voteCount} users voted | ${item.percent}% of total)`,
                variant: 'h6'
            }
        }))),
        {
            field: button,
            name: 'button',
            settings: {
                label: 'Close'
            }
        }
    ];
}
