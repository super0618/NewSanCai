import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

import always from 'ramda/src/always';

import checkSettings from '../../utils/checkSettings';
import debounce from 'lodash.debounce';

import { arrayMove, SortableContainer, SortableElement } from 'react-sortable-hoc';
import Chip from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/core/styles';
import { DEFAULT_LOCALE } from '../../../../../client/constants';

const SETTINGS_MODEL = {
    label: ['required', 'string'],
    multiple: ['required', 'boolean'],
    onInputChangeHandler: ['function'],
    onValueChangeHandler: ['function'],
    selectedFeatured: ['array'],
    max: ['number']
};

const useStyles = makeStyles(theme => ({
    sortableContainer: {
        display: 'flex',
        overflowX: 'auto',
        padding: '0',
        userSelect: 'none',
        '-webkit-overflow-scrolling': 'touch'
    },
    sortableItem: {
        cursor: 'col-resize',
        whiteSpace: 'nowrap',
        zIndex: '99999999'
    },
    popper: {
        zIndex: '99999999'
    }
}));

const FormFieldSuggestRequest = ({ value, settings, validationMessage, onChange, onBlur }) => {
    const classes = useStyles();
    const [search, setSearch] = useState('');
    const [options, setOptions] = useState([]);
    const [valueOptions, setValueOptions] = useState(settings.multiple ? [] : '');
    const onInputChange = (event) => {
        setSearch(event.target.value);
    };

    useEffect(() => {
        checkSettings('Suggest', settings, SETTINGS_MODEL);
    }, []);

    useEffect(() => {
        const query = settings.multiple ? value?.filter(item => !!item).join(',') : value;
        if (query) {
            settings.onValueChangeHandler(query).then(result => {
                if (settings.multiple) {
                    const newOptions = [];
                    result.forEach(item => {
                        const index = value.findIndex((id) => id === item._id);
                        newOptions[index] = ({
                            label: item.data[DEFAULT_LOCALE].title,
                            value: item._id.toString()
                        });
                    });
                    setValueOptions(newOptions);
                } else {
                    setValueOptions(result.map(item => ({ label: item.data[DEFAULT_LOCALE].title, value: item._id.toString() }))[0].value);
                }
            });
        } else {
            if (settings.multiple) {
                return setValueOptions([]);
            } else {
                return setValueOptions('');
            }
        }
    }, [value]);

    const handleChange = (event, option) => {
        event.preventDefault();
        const value = settings.multiple ? option.map(item => item.value) : (option?.value || '');

        if (settings.multiple) {
            value.unshift(value.pop()); // new elements will be added to the start of array
        }

        onChange(value);
    };

    const handleFetchOptions = (query, value) => {
        settings.onInputChangeHandler(query, value).then(result => {
            setOptions(result.paginatedResults.map(item => ({ label: item.data[DEFAULT_LOCALE].title, value: item._id.toString() })));
        });
    };

    useEffect(() => {
        handleFetchOptionsDebounced.current(search, [...(value || []), ...(settings.selectedFeatured || [])]);
    }, [search, value, settings.selectedFeatured]);

    const handleFetchOptionsDebounced = useRef(debounce(handleFetchOptions, 200));

    const setList = ({ oldIndex, newIndex }) => {
        const newValue = arrayMove(valueOptions, oldIndex, newIndex);
        onChange(newValue.map(item => item.value));
    };

    const handleDelete = (event, id) => {
        event.preventDefault();
        if (!id) return;
        const newValue = valueOptions.map(item => item.value).filter(item => item !== id);
        onChange(newValue);
    };

    const SortableItem = SortableElement(({ option, getTagProps, index }) => (
        <div className={classes.sortableItem}>
            <Chip {...getTagProps({ index })} label={option.label} onDelete={event => handleDelete(event, option.value)}/>
        </div>
    ));

    const SortableList = SortableContainer(({ tagValue, getTagProps }) => (
        <div className={classes.sortableContainer}>
            {tagValue.map((option, index) => (
                <SortableItem key={`item-${index}`} index={index} option={option} getTagProps={getTagProps} />
            ))}
        </div>
    ));

    return <Autocomplete
        multiple={settings.multiple}
        onChange={handleChange}
        options={options || []}
        value={valueOptions}
        getOptionLabel={option => option.label || ''}
        freeSolo={settings.max && valueOptions.length <= settings.max}
        getOptionDisabled={(option) => (option.disabled || value?.includes(option.value) || (settings.max && valueOptions.length >= settings.max))}
        renderInput={(params) => <TextField
            {...params}
            label={settings.label}
            onBlur={onBlur}
            error={!!validationMessage}
            margin='normal'
            variant='outlined'
            onChange={onInputChange}
        />
        }
        renderTags={(tagValue, getTagProps) => {
            return <SortableList
                axis={'x'}
                tagValue={tagValue}
                getTagProps={getTagProps}
                onSortEnd={setList}
                distance={10}
            />;
        }}
        classes={{
            popper: classes.popper
        }}
    />;
};

FormFieldSuggestRequest.propTypes = {
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array
    ]),
    settings: PropTypes.object,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    validationMessage: PropTypes.string
};

FormFieldSuggestRequest.defaultProps = {
    value: undefined,
    settings: {},
    onChange: always,
    onBlur: always,
    validationMessage: ''
};

export const fieldName = 'suggestRequest';
export const getInitialValues = (data, field, langs) => langs.reduce((result, lang) => {
    if (field.langInsensitive) {
        result[field.name] = data[lang][field.name] || undefined;
    } else {
        result[`${lang}_${field.name}`] = data[lang][field.name] || undefined;
    }
    return result;
}, {});
export const getPayload = (values, field, lang) => field.langInsensitive ? values[field.name] : values[`${lang}_${field.name}`];
export const Component = FormFieldSuggestRequest;

export default {
    Component,
    fieldName,
    getInitialValues,
    getPayload
};
