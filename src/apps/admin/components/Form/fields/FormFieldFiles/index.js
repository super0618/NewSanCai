import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import classNames from 'classnames';

import uploadFile from '../../../../services/uploadFile';

import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';

import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/core/styles';

import arrayMove from '../../utils/arrayMove';
import uniqid from 'uniqid';

import remove from 'ramda/src/remove';
import map from 'ramda/src/map';
import includes from 'ramda/src/includes';
import last from 'ramda/src/last';

import checkSettings from '../../utils/checkSettings';

const useStyles = makeStyles(theme => ({
    uploadInput: {
        display: 'none'
    },
    upload: {
        display: 'flex',
        alignItems: 'center',
        maxWidth: '400px',
        justifyContent: 'space-between',
        marginTop: theme.spacing(1)
    },
    title: {
        fontFamily: 'Roboto',
        fontStyle: 'italic',
        color: '#868686'
    },
    button: {
        borderRadius: '0px',
        padding: '8px 26px',
        border: '1px solid #B9A659',
        backgroundColor: 'transparent',

        '&:hover': {
            backgroundColor: 'transparent'
        }
    },
    uploadIcon: {
        marginLeft: theme.spacing(1),
        width: '30px',
        height: '19px',
        color: 'black'
    },
    filesList: {
        overflow: 'auto'
    },
    fileItem: {
        position: 'relative',
        userSelect: 'none',
        padding: '16px',
        width: '200px',
        float: 'left',
        zIndex: '100',
        cursor: 'grab',
        '&:hover $fileItemDeleteContainer': {
            visibility: 'visible'
        }
    },
    fileItemSorting: {
        '&:hover $fileItemDeleteContainer': {
            visibility: 'hidden'
        }
    },
    fileImage: {
        width: '100%'
    },
    fileImageError: {
        outline: 'solid 4px #f44336'
    },
    fileItemDeleteContainer: {
        position: 'absolute',
        right: '0',
        top: '0',
        visibility: 'hidden',
        background: 'white',
        borderRadius: '100%',
        zIndex: '1'
    },
    warning: {
        display: 'flex',
        alignItems: 'center',
        marginTop: '20px'
    },
    warningIcon: {
        color: '#ffae42',
        marginRight: '10px'
    },
    errorIcon: {
        color: '#f44336',
        marginRight: '10px'
    },
    warningText: {
        fontSize: '16px'
    },
    divider: {
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(2)
    }
}));

const imagesFileExt = ['png', 'jpg', 'jpeg', 'gif', 'svg'];

const Image = SortableHandle(({ imageClassName, src }) => (
    includes(last(src.split('.')), imagesFileExt) ? <img className={imageClassName} src={src} /> : <Typography>{last(src.split('/'))}</Typography>
));

const FilePreview = SortableElement(({ file, i, classes, onFileDelete, isSorting }) =>
    <div className={classNames(classes.fileItem, {
        [classes.fileItemSorting]: isSorting
    })}>
        <div className={classes.fileItemDeleteContainer}>
            <IconButton
                aria-label='Delete'
                onClick={onFileDelete(i)}
            >
                <DeleteIcon />
            </IconButton>
        </div>
        <Image src={file.path} imageClassName={classes.fileImage} />
    </div>);

const FilesPreviews = SortableContainer(({ files, classes, ...rest }) => {
    return (
        <div className={classes.filesList}>
            {files.map((file, i) => <FilePreview
                key={i}
                index={i}
                i={i}
                file={file}
                classes={classes}
                {...rest}
            />)}
        </div>
    );
});

const SETTINGS_MODEL = {
    webp: ['required', 'boolean'], // should the backend prepare a webp version of the file
    max: ['number'], // maximum number of files
    accept: ['string'], // "accept" attribute of the file input
    type: ['string'],
    filename: ['string']
};

const FormFieldFiles = ({ value, settings, onChange, name }) => {
    useEffect(() => {
        checkSettings('Files', settings, SETTINGS_MODEL);
    }, []);

    const [isSorting, setSorting] = useState(false);

    const classes = useStyles();

    const handleFilesUpload = event => {
        const newFiles = map(file => (file), event.target.files);
        let files = [...value, ...newFiles];

        event.target.value = '';

        if (settings.max && files.length > settings.max) {
            files = files.slice(files.length - settings.max);
        }

        Promise.all(
            map(file => {
                return new Promise((resolve) => {
                    if (file.path) {
                        return resolve(file);
                    }
                    const formData = new FormData();

                    if (settings.type === 'articleImage') { // pretty custom file name for images in articles
                        const extension = file.name.split('.').pop();
                        // eslint-disable-next-line max-len
                        const fileName = `${settings.filename}.${extension}`;
                        formData.append(file.name, file, fileName);
                    } else {
                        formData.append(file.name, file);
                    }

                    return uploadFile(formData, settings.webp)
                        .then(({ path, pathWebp }) => {
                            resolve({
                                path,
                                ...(pathWebp ? { pathWebp } : {}),
                                id: uniqid()
                            });
                        });
                });
            }, files)
        )
            .then(filesArr => {
                onChange(filesArr);
            });
    };

    const onDragStart = () => {
        setSorting(true);
    };

    const onDragEnd = ({ oldIndex, newIndex }) => {
        onChange(arrayMove(value, oldIndex, newIndex));

        setSorting(false);
    };

    const handleFileDelete = i => () => {
        onChange(remove(i, 1, value));
    };

    const inputId = useMemo(() => `${name}-${+Date.now()}`, [name]);

    return <div>
        <div className={classes.upload}>
            <input
                className={classes.uploadInput}
                id={inputId}
                type='file'
                accept={settings.accept || 'image/*'}
                onChange={handleFilesUpload}
                multiple
            />
            <label htmlFor={inputId}>
                <Button variant='contained' component='span' color='default'>
                    <FormattedMessage id='upload' />
                    <CloudUploadIcon className={classes.uploadIcon} />
                </Button>
            </label>
        </div>
        <FilesPreviews
            axis='xy'
            classes={classes}
            files={value}
            onFileDelete={handleFileDelete}
            onSortStart={onDragStart}
            onSortEnd={onDragEnd}
            isSorting={isSorting}
            useDragHandle
        />
    </div>;
};

FormFieldFiles.propTypes = {
    value: PropTypes.array,
    settings: PropTypes.object,
    onChange: PropTypes.func,
    name: PropTypes.string
};

FormFieldFiles.defaultProps = {
    value: [],
    settings: {},
    name: ''
};

export const fieldName = 'files';
export const getInitialValues = (data, field, langs) => langs.reduce((result, lang) => {
    if (field.langInsensitive) {
        result[field.name] = (data[lang][field.name] || []).map(file => {
            return {
                path: file.path,
                pathWebp: file.pathWebp,
                id: file.id
            };
        });
    } else {
        result[`${lang}_${field.name}`] = (data[lang][field.name] || []).map(file => {
            return {
                path: file.path,
                pathWebp: file.pathWebp,
                id: file.id
            };
        });
    }
    return result;
}, {});
export const getPayload = (values, field, lang) => field.langInsensitive
    ? values[field.name]
    : values[`${lang}_${field.name}`]
        .map(file => {
            return {
                path: file.path,
                pathWebp: file.pathWebp,
                id: file.id
            };
        });
export const Component = FormFieldFiles;

export default {
    Component,
    fieldName,
    getInitialValues,
    getPayload
};
