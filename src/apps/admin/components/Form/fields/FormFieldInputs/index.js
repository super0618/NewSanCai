import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import classNames from 'classnames';

import uniqid from 'uniqid';

import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';

import ReorderIcon from '@material-ui/icons/Reorder';
import FormGroup from '@material-ui/core/FormGroup';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';

import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/core/styles';

import arrayMove from '../../utils/arrayMove';

import always from 'ramda/src/always';
import remove from 'ramda/src/remove';

import checkSettings from '../../utils/checkSettings';

const SETTINGS_MODEL = {
    inputs: [ // list of inputs
        'required',
        {
            name: ['required', 'string'], // field name of the input
            label: ['required', 'string'] // label of the input
        }
    ]
};

const useStyles = makeStyles({
    input: {
        flexWrap: 'nowrap',
        alignItems: 'center',
        zIndex: 9999
    },
    inputGroup: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
    },
    inputField: {
        width: '32%'
    },
    inputFieldFullWidth: {
        width: '100%'
    },
    inputFieldHalfFullWidth: {
        width: '49%'
    },
    buttonSortable: {
        position: 'relative',
        top: '4px',
        marginRight: '12px',
        cursor: 'pointer'
    },
    addButton: {
        display: 'flex',
        justifyContent: 'flex-end',
        paddingRight: '80px'
    }
});

const ButtonSortable = SortableHandle(({ imageClassName }) => (
    <ReorderIcon className={imageClassName}> <FormattedMessage id='adminTable.reorder' /> </ReorderIcon>
));

const InputGroup =
    SortableElement(({ rowIndex, input, validationMessage, onInputDelete, onInputChange, classes, settings }) => (
        <FormGroup className={classes.input} row>
            <ButtonSortable imageClassName={classes.buttonSortable} />
            <div className={classes.inputGroup}>
                {settings.inputs.map((inputSetting, i) => <TextField
                    key={i}
                    className={classNames(classes.inputField, {
                        [classes.inputFieldFullWidth]: settings.inputs.length === 1,
                        [classes.inputFieldHalfFullWidth]: settings.inputs.length === 2
                    })}
                    label={inputSetting.label || ''}
                    value={input[inputSetting.name] || ''}
                    onChange={onInputChange(inputSetting.name, rowIndex)}
                    margin='normal'
                    variant='outlined'
                    error={!!validationMessage}
                />)}
            </div>
            <IconButton aria-label='Delete' onClick={onInputDelete(rowIndex)}>
                <DeleteIcon />
            </IconButton>
        </FormGroup>
    ));

const Inputs = SortableContainer(({ inputs, classes, ...rest }) =>
    <div>
        {inputs.map((input, i) => {
            return <InputGroup
                key={i}
                index={i}
                rowIndex={i}
                input={input}
                {...rest}
                classes={classes}
            />;
        })}
    </div>
);

const FormFieldInputs = ({ value, onChange, validationMessage, settings }) => {
    useEffect(() => {
        checkSettings('Checkbox', settings, SETTINGS_MODEL);
    }, []);

    const classes = useStyles();

    const handleInputAdd = () => {
        onChange([
            ...value,
            {
                ...settings.inputs.reduce((result, input) => ({ ...result, [input.name]: '' }), {}),
                id: uniqid()
            }
        ]);
    };

    const handleInputChange = (prop, i) => event => {
        value[i][prop] = event.target.value;
        onChange(value);
    };

    const handleInputDelete = i => () => {
        onChange(remove(i, 1, value));
    };

    const onDragEnd = ({ oldIndex, newIndex }) => {
        onChange(arrayMove(value, oldIndex, newIndex));
    };

    return <div>
        <Inputs
            axis='xy'
            inputs={value}
            onInputDelete={handleInputDelete}
            onInputChange={handleInputChange}
            onSortEnd={onDragEnd}
            classes={classes}
            useDragHandle
            validationMessage={validationMessage}
            settings={settings}
        />
        <div className={classes.addButton}>
            <Fab color='primary' size='small' onClick={handleInputAdd}>
                <AddIcon />
            </Fab>
        </div>
    </div>;
};

FormFieldInputs.propTypes = {
    value: PropTypes.array,
    onChange: PropTypes.func,
    validationMessage: PropTypes.string,
    settings: PropTypes.object
};

FormFieldInputs.defaultProps = {
    value: [],
    onChange: always,
    validationMessage: '',
    settings: {}
};

export const fieldName = 'inputs';
export const getInitialValues = (data, field, langs) => langs.reduce((result, lang) => {
    if (field.langInsensitive) {
        result[field.name] = data[lang][field.name] || [];
    } else {
        result[`${lang}_${field.name}`] = data[lang][field.name] || [];
    }
    return result;
}, {});
export const getPayload = (values, field, lang) => field.langInsensitive ? values[field.name] : values[`${lang}_${field.name}`];
export const Component = FormFieldInputs;

export default {
    Component,
    fieldName,
    getInitialValues,
    getPayload
};
