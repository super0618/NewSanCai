import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import classNames from 'classnames';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FilterListIcon from '@material-ui/icons/FilterList';
import { makeStyles } from '@material-ui/core/styles';
import { lighten } from '@material-ui/core/styles/colorManipulator';

import getRemovedItemName from '../AdminTable/utils/getRemovedItemName';
import TextField from '@material-ui/core/TextField';
import { MenuItem, Select } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85)
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark
            },
    spacer: {
        flex: '1 1 100%'
    },
    actions: {
        display: 'flex',
        alignItems: 'center',
        color: theme.palette.text.secondary
    },
    title: {
        flex: '0 0 auto',
        '@media (max-width:780px)': {
        }
    },
    itemsNumber: {
        display: 'flex',
        alignItems: 'center',
        width: '130px',
        justifyContent: 'space-between'
    },
    valuesActions: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    closeIcon: {
        cursor: 'pointer'
    },
    toolbar: {
        width: '100%',
        marginTop: theme.spacing(3)
    },
    warningContent: {
        paddingBottom: '0'
    },
    button: {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        whiteSpace: 'nowrap',
        '@media (max-width:1500px)': {
            '& span': {
                fontSize: '10px'
            }
        },
        '@media (max-width:1360px)': {
            whiteSpace: 'unset'
        }
    },
    search: {
        width: '250px',
        flexShrink: '0',
        '@media (max-width:1500px)': {
            width: '155px'
        }
    },
    status: {
        width: '100px',
        flexShrink: '0',
        margin: '0 20px 0 0',
        '@media (max-width:1500px)': {
            width: '100px'
        }
    },
    searchRoot: {
        margin: '0 20px 0 0'
    },
    dateRoot: {
        margin: '0 20px 0 0',
        '@media (max-width:1400px)': {
            width: '100px'
        }
    },
    statusRoot: {
        minWidth: '80px'
    }
}));

const STATUS_OPTIONS = [
    { value: '', label: 'Clear' },
    { value: 'published', label: 'Published' },
    { value: 'private', label: 'Private' },
    { value: 'draft', label: 'Draft' }
];

const AdminTableHeader = props => {
    const classes = useStyles();
    const {
        selected, headerText, handleAddNewsClick, isMultimedia, noActions, search, handleSearchChange,
        dateStart, handleDateStartChange,
        dateEnd, handleDateEndChange,
        isComment, voteCompleted,
        handleStatusChange, status,
        onCategorySelectorOpen
    } = props;
    const [valueForDelete, setValueForDelete] = useState(false);
    const [valueForApprove, setValueForApprove] = useState(false);

    const handleSelectedCloseClick = () => {
        props.onSelectedCloseClick();
    };

    const handleDelete = () => {
        setValueForDelete(selected);
    };

    const handleApprove = () => {
        setValueForApprove(selected);
    };

    const handleWarningDisagree = () => {
        setValueForDelete(null);
        setValueForApprove(null);
    };

    const handleWarningAgree = () => {
        if (valueForDelete) {
            setValueForDelete(null);

            if (!isComment) {
                const ids = selected.map(item => item._id);
                props.onDelete(ids);
            }

            if (isComment) {
                props.onDelete(valueForDelete);
            }
        }

        if (valueForApprove && isComment) {
            setValueForApprove(null);

            props.onApprove(valueForApprove);
        }
    };

    return <div>
        <Toolbar
            className={classNames(classes.toolbar, {
                [classes.highlight]: selected.length > 0
            })}
        >
            <div className={classes.title}>
                {selected.length > 0
                    ? (
                        <div className={classes.itemsNumber}>
                            <CloseIcon className={classes.closeIcon} onClick={handleSelectedCloseClick}/>
                            <Typography color='inherit' variant='subtitle1'>
                                {selected.length} <FormattedMessage id='adminTableHeader.selected' />
                            </Typography>
                        </div>
                    )
                    : (
                        <Typography variant='h6' id='tableTitle'>
                            {headerText}
                        </Typography>
                    )}
            </div>
            <div className={classes.spacer} />
            {
                (!noActions && !selected.length) &&
                <div className={classes.date}>
                    <TextField
                        label={'Pick start date to filter'}
                        value={dateStart}
                        onChange={handleDateStartChange}
                        margin='normal'
                        variant='outlined'
                        type='date'
                        InputLabelProps={{
                            shrink: true
                        }}
                        classes={{
                            root: classes.dateRoot
                        }}
                    />
                </div>
            }
            {
                (!noActions && !selected.length) &&
                <div className={classes.date}>
                    <TextField
                        label={'Pick end date to filter'}
                        value={dateEnd}
                        onChange={handleDateEndChange}
                        margin='normal'
                        variant='outlined'
                        type='date'
                        InputLabelProps={{
                            shrink: true
                        }}
                        classes={{
                            root: classes.dateRoot
                        }}
                    />
                </div>
            }
            {
                (!noActions && !selected.length) &&
                <div className={classes.search}>
                    <TextField
                        label={'Search by title'}
                        value={search}
                        onChange={handleSearchChange}
                        margin='normal'
                        variant='outlined'
                        multiline={false}
                        type={'text'}
                        classes={{
                            root: classes.searchRoot
                        }}
                    />
                </div>
            }
            {
                (!noActions && !isComment && !isMultimedia && !selected.length) &&
                <div className={classes.status}>
                    <Select
                        value={status}
                        label="Filter by status"
                        onChange={handleStatusChange}
                        classes={{
                            root: classes.statusRoot
                        }}
                    >
                        {STATUS_OPTIONS.map((item, i) => (
                            <MenuItem value={item.value} key={i}>{item.label}</MenuItem>
                        ))}
                    </Select>
                </div>
            }
            <div className={classes.actions}>
                {selected.length > 0
                    ? (
                        <React.Fragment>
                            {
                                isComment &&
                                <Tooltip title='Approve'>
                                    <IconButton aria-label='Delete' onClick={handleApprove}>
                                        <CheckIcon />
                                    </IconButton>
                                </Tooltip>
                            }
                            <Tooltip title='Delete'>
                                <IconButton aria-label='Delete' onClick={handleDelete}>
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                            {
                                (!isComment && !isMultimedia && !noActions) &&
                                <Button className={classes.button} onClick={onCategorySelectorOpen(selected)}>Move to category...</Button>
                            }
                        </React.Fragment>
                    )
                    : (
                        <div className={classes.valuesActions}>
                            { props.onFiltersOpen && <Tooltip title={<FormattedMessage id='adminTableHeader.filtration' />}>
                                <IconButton aria-label='Filters' onClick={props.onFiltersOpen}>
                                    <FilterListIcon />
                                </IconButton>
                            </Tooltip> }
                            {isMultimedia
                                ? <div className={classes.valuesActions}>
                                    <Tooltip title={<FormattedMessage id='adminTableHeader.addition' />} style={{ marginRight: '10px' }}>
                                        <Button className={classes.button} onClick={props.onFormOpen({}, 'photo')}>Add photo post</Button>
                                    </Tooltip>
                                    <Tooltip title={<FormattedMessage id='adminTableHeader.addition' />}>
                                        <Button className={classes.button} onClick={props.onFormOpen({}, 'video')}>Add video post</Button>
                                    </Tooltip>
                                </div>
                                : <div className={classes.valuesActions}>
                                    {
                                        (!noActions && !isComment) &&
                                        <Tooltip title={<FormattedMessage id='adminTableHeader.addition' />}>
                                            <Button className={classes.button} onClick={handleAddNewsClick}>zhengjian</Button>
                                        </Tooltip>
                                    }
                                    {
                                        (!voteCompleted && !isComment) &&
                                        <Tooltip title={<FormattedMessage id='adminTableHeader.addition' />}>
                                            <IconButton aria-label='Add' onClick={props.onFormOpen()}>
                                                <AddIcon />
                                            </IconButton>
                                        </Tooltip>
                                    }
                                </div>
                            }
                        </div>
                    )}
            </div>
        </Toolbar>
        <Dialog
            open={!!valueForDelete}
            onClose={handleWarningDisagree}
        >
            <DialogTitle>{!isComment
                ? <FormattedMessage id='adminTable.dialogTitle' />
                : 'Are you sure you want to delete selected comments? Deleted comments will be removed from the article and cannot be restored'}
            </DialogTitle>
            <DialogContent className={classes.warningContent}>
                {
                    !isComment &&
                    <List>
                        {
                            selected.map((item, i) => <ListItem key={i}>
                                <ListItemText
                                    primary={getRemovedItemName(item)}
                                />
                            </ListItem>)
                        }
                    </List>
                }
            </DialogContent>
            <DialogActions>
                <Button onClick={handleWarningDisagree} color='primary'>
                    <FormattedMessage id='no' />
                </Button>
                <Button onClick={handleWarningAgree} color='primary' autoFocus>
                    <FormattedMessage id='yes' />
                </Button>
            </DialogActions>
        </Dialog>
        <Dialog
            open={!!valueForApprove}
            onClose={handleWarningDisagree}
        >
            <DialogTitle>{'Are you sure you want to approve selected comments? Approved comments will not be shown on this page anymore'}</DialogTitle>
            <DialogActions>
                <Button onClick={handleWarningDisagree} color='primary'>
                    <FormattedMessage id='no' />
                </Button>
                <Button onClick={handleWarningAgree} color='primary' autoFocus>
                    <FormattedMessage id='yes' />
                </Button>
            </DialogActions>
        </Dialog>
    </div>;
};

AdminTableHeader.propTypes = {
    headerText: PropTypes.string,
    selected: PropTypes.array,
    onDelete: PropTypes.func.isRequired,
    onApprove: PropTypes.func,
    onFormOpen: PropTypes.func.isRequired,
    onSelectedCloseClick: PropTypes.func.isRequired,
    onFiltersOpen: PropTypes.func,
    handleAddNewsClick: PropTypes.func,
    isMultimedia: PropTypes.bool,
    isComment: PropTypes.bool,
    noActions: PropTypes.bool,
    search: PropTypes.string,
    handleSearchChange: PropTypes.func,
    handleStatusChange: PropTypes.func,
    status: PropTypes.string,
    dateStart: PropTypes.string,
    handleDateStartChange: PropTypes.func,
    dateEnd: PropTypes.string,
    handleDateEndChange: PropTypes.func,
    onCategorySelectorOpen: PropTypes.func,
    voteCompleted: PropTypes.bool
};

AdminTableHeader.defaultProps = {
    headerText: '',
    selected: [],
    onFormOpen: () => {}
};

export default AdminTableHeader;
