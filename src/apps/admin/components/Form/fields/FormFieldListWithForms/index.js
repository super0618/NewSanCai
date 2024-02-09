import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper/Paper';

import CloseFormDialog from '../../../CloseFormDialog';
import Lists from '../../../Lists';
import Form from '../../Form';

import { makeStyles } from '@material-ui/core/styles';

import uniqid from 'uniqid';

import checkSettings from '../../utils/checkSettings';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

const SETTINGS_MODEL = {
    label: ['required', 'string'], // label of the list
    getFields: ['required', 'function'], // function, which returns a list of the fields for the inner form
    getFormLabel: ['function'] // function, which returns a label of the form
};

const useStyles = makeStyles(theme => ({
    paper: {
        margin: '30px 0 0 30px',
        display: 'inline-block',
        paddingRight: theme.spacing(1),
        '@media (max-width:1200px)': {
            paddingRight: '0',
            margin: '30px 0 0 0',
            display: 'block'
        }
    },
    drawer: {
        width: '400px',
        flexShrink: 0,
        '@media (max-width:1200px)': {
            width: '100%',
            maxWidth: 'unset',
            boxShadow: '0px 1px 5px 0px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12)'
        }
    },
    drawerPaper: {
        top: '0px',
        maxWidth: '400px',
        position: 'relative',
        minHeight: '93vh',
        '@media (max-width:1200px)': {
            zIndex: '0',
            minHeight: 'unset',
            width: '100%',
            maxWidth: 'unset'
        }
    },
    content: {
        flexGrow: 1,
        padding: '30px',
        '@media (max-width:600px)': {
            padding: '15px'
        },
        '@media (max-width:400px)': {
            padding: '15px 0'
        }
    },
    toolbar: {
        height: '0px'
    },
    toolbarNav: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '5px 30px 5px 30px'
    },
    categoryTitle: {
        height: '30px'
    },
    modal: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
    },
    closeButton: {
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: '10'
    },
    modalContent: {
        position: 'absolute',
        width: '1200px',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(4),
        outline: 'none',
        overflowY: 'auto',
        maxHeight: '100vh',
        '@media (max-width:1300px)': {
            width: '90%'
        }
    }
}));

const FormFieldListWithForms = ({ value, settings, onChange, langs }) => {
    useEffect(() => {
        checkSettings('List of forms', settings, SETTINGS_MODEL);
    }, []);

    const classes = useStyles();
    const [formShowed, setFormShowed] = useState(false);
    const [warningFormShowed, setWarningFormShowed] = useState(false);
    const [editableSlide, setEditableSlide] = useState(null);
    const [editableSlideIndex, setEditableSlideIndex] = useState(null);
    const [currentValues, setCurrentValues] = useState([]);

    const handleFormOpen = useCallback((slide, index = null) => () => {
        setFormShowed(true);
        setEditableSlide(slide);
        setEditableSlideIndex(index);
    }, []);

    const handlePositionsEdit = useCallback(value => {
        onChange(value);
    }, []);

    const handleDelete = useCallback(deletedIds => {
        onChange(value.filter(item => !deletedIds.find(({ id }) => id === item.id)));
    }, [value]);

    const handleChangeFormClose = useCallback(value => {
        setWarningFormShowed(value);
    }, []);

    const handleCloseSlideForm = useCallback(() => {
        setFormShowed(false);
        setWarningFormShowed(false);
        setEditableSlide(null);
    }, []);

    const handleSubmit = payload => {
        if (editableSlideIndex === null) {
            onChange([
                ...value,
                { ...payload, id: uniqid() }
            ]);
        } else {
            value[editableSlideIndex] = payload;
            onChange([...value]);
        }

        handleCloseSlideForm();
    };

    const handleInnerChange = (values) => {
        setCurrentValues(values);
    };

    return <div className={classes.root}>
        <Lists
            values={value}
            sortable
            bigAvatar
            onDelete={handleDelete}
            onFormOpen={handleFormOpen}
            onPositionChange={handlePositionsEdit}
            title={settings.label}
            getFormLabel={settings.getFormLabel}
        />
        <Modal open={formShowed} onClose={() => handleChangeFormClose(true)} className={classes.modal}>
            <Paper className={classes.modalContent}>
                <Form
                    data={editableSlide}
                    langs={langs}
                    fields={settings.getFields(editableSlide, currentValues)}
                    onSubmit={handleSubmit}
                    onChange={handleInnerChange}
                />
                <IconButton onClick={() => handleChangeFormClose(true)} className={classes.closeButton}>
                    <CloseIcon />
                </IconButton>
            </Paper>
        </Modal>
        <CloseFormDialog
            open={warningFormShowed && formShowed}
            text='Вы точно хотите закрыть форму?'
            onClose={handleChangeFormClose}
            onDone={handleCloseSlideForm}
        />
    </div>;
};

FormFieldListWithForms.propTypes = {
    value: PropTypes.array,
    onChange: PropTypes.func.isRequired,
    settings: PropTypes.object.isRequired,
    langs: PropTypes.array
};

FormFieldListWithForms.defaultProps = {
    value: [],
    langs: []
};

export const fieldName = 'listWithForms';
export const getInitialValues = (data, field, langs) => langs.reduce((result, lang) => {
    result[field.name] = data[lang][field.name] || [];
    return result;
}, {});
export const getPayload = (values, field) => values[field.name];
export const Component = FormFieldListWithForms;

export default {
    Component,
    fieldName,
    getInitialValues,
    getPayload
};
