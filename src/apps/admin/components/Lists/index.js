import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';

// Material components
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Tooltip from '@material-ui/core/Tooltip';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

// icons
import ReorderIcon from '@material-ui/icons/Reorder';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';

// Sortable
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import arrayMove from '../../utils/arrayMove';

// utils
import last from 'ramda/src/last';

const MAX_LENGTH_NAMES = 59;
const VIDEO_FORMATS = ['mp4', 'mkv', 'avi'];

const isVideo = (path) => {
    return VIDEO_FORMATS.find(item => item === last(path.split('.')));
};

const ButtonSortable = SortableHandle(({ classes }) => (
    <Tooltip title={<FormattedMessage id='list.move' />}>
        <ReorderIcon className={classes.buttonSortable}> <FormattedMessage id='adminTable.reorder' /> </ReorderIcon>
    </Tooltip>
));

const Video = SortableHandle(({ fileClassName, src }) => (
    <div style={{ position: 'relative' }}>
        <video className={fileClassName} src={src}/>
        <PlayCircleFilledIcon style={{ position: 'absolute', top: 'calc(50% - 10px)', right: 'calc(50% - 10px)' }}/>
    </div>
));

const ItemSortable = SortableElement(({
    onFormOpen, index,
    positionIndex, name, getCorrectName, bigAvatar, onDelete, sortable, numeration, value, classes
}) => (
    <ListItem row className={classes.row}>
        {sortable && <ButtonSortable classes={classes}/>}
        {
            numeration && <div className={classes.indexItem}>
                {value.positionIndex || positionIndex + 1}.
            </div>
        }
        {
            bigAvatar && value.avatar && isVideo(value.avatar[0].path)
                ? bigAvatar && value.avatar && <ListItemAvatar>
                    <Video src={value.avatar[0].path} fileClassName={classNames(classes.avatar, { [classes.bigAvatar]: bigAvatar })}/>
                </ListItemAvatar>
                : bigAvatar && value.avatar && <ListItemAvatar>
                    <Avatar className={classNames(classes.avatar, { [classes.bigAvatar]: bigAvatar })} alt={value.alt} src={value.avatar[0].path}/>
                </ListItemAvatar>
        }
        <ListItemText
            className={classes.listItemText}
            primary={name && getCorrectName(name)}
        />
        <div className={classes.valueActions}>
            <ListItemSecondaryAction>
                <Tooltip title={<FormattedMessage id='list.edit' />}>
                    <IconButton onClick={onFormOpen(value, positionIndex)}>
                        <EditIcon/>
                    </IconButton>
                </Tooltip>
                <Tooltip title={<FormattedMessage id='list.delete' />}>
                    <IconButton onClick={onDelete(value)} edge="end" aria-label="delete">
                        <DeleteIcon/>
                    </IconButton>
                </Tooltip>
            </ListItemSecondaryAction>
        </div>
    </ListItem>
));

const SortableWrapp = SortableContainer((
    {
        values,
        getFormLabel,
        ...rest
    }) =>
    <List>
        {
            values.map((value, i) => {
                const name = getFormLabel ? getFormLabel(value) : `Item ${i + 1}`;
                return <ItemSortable key={i} name={name} value={value} index={i} positionIndex={i} {...rest}/>;
            })
        }
    </List>
);

const useStyles = makeStyles(theme => ({
    content: {
        flexGrow: 1,
        padding: '30px'
    },
    toolbar: {
        height: '0px'
    },
    toolbarNav: {
        display: 'flex',
        justifyContent: 'flex-end',
        padding: '5px 30px 5px 30px'
    },
    buttonSortable: {
        position: 'relative',
        marginRight: '12px',
        cursor: 'pointer'
    },
    modal: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    row: {
        backgroundColor: 'white',
        border: '#e4e4e4 solid 1px',
        borderRadius: '5px',
        margin: '5px 0px',
        zIndex: 1000,
        '&:hover $valueActions': {
            visibility: 'visible'
        },
        '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)'
        }
    },
    valueActions: {
        visibility: 'hidden'
    },
    listItemText: {
        cursor: 'default'
    },
    modalContent: {
        position: 'absolute',
        width: '1200px',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(4),
        outline: 'none',
        overflowY: 'auto',
        maxHeight: '100vh'
    },
    avatar: {
        borderRadius: 0,
        backgroundSize: 'cover',
        border: '2px solid #3f51b5',
        boxShadow: 'inset black 0px 0px 5px 0px'
    },
    bigAvatar: {
        height: '100px',
        width: '175px'
    },
    indexItem: {
        color: '#3f51b5',
        fontFamily: 'sans-serif',
        margin: '0 12px'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '10px',
        alignItems: 'center'
    },
    listWrapp: {
        padding: '8px 20px 20px',
        border: '#e4e4e4 solid 1px',
        borderRadius: '5px'
    },
    title: {
        height: '30px'
    }
}));

const getCorrectName = name => {
    return name.length > MAX_LENGTH_NAMES ? `${name.substring(0, MAX_LENGTH_NAMES)}...` : name;
};

const Lists = props => {
    const classes = useStyles();
    const [valueForDelete, setValueForDelete] = useState(null);

    const { sortable, bigAvatar, numeration, maxLength, onFormOpen, title, values, onPositionChange, onDelete, getFormLabel } = props;

    const handleDelete = value => () => {
        setValueForDelete(value);
    };

    const handleWarningAgree = () => {
        onDelete([valueForDelete]);
        setValueForDelete(null);
    };

    const handleWarningDisagree = () => {
        setValueForDelete(null);
    };

    const handleDragEnd = ({ oldIndex, newIndex }) => {
        const newValues = arrayMove(values, oldIndex, newIndex);

        onPositionChange(newValues);
    };

    return <div>
        <div className={classes.listWrapp}>
            <div className={classes.header}>
                <Typography variant='h5' className={classes.title}>{title}</Typography>
                <Tooltip title={<FormattedMessage id='list.add' />}>
                    <IconButton disabled={values.length === maxLength} onClick={onFormOpen()}>
                        <AddIcon/>
                    </IconButton>
                </Tooltip>
            </div>
            <Divider/>
            <SortableWrapp
                axis='y'
                onFormOpen={onFormOpen}
                onDelete={handleDelete}
                getCorrectName={getCorrectName}
                onSortEnd={handleDragEnd}
                sortable={sortable}
                bigAvatar={bigAvatar}
                numeration={numeration}
                values={values}
                useDragHandle
                classes={classes}
                getFormLabel={getFormLabel}
            />
        </div>
        <Dialog
            open={!!valueForDelete}
            onClose={handleWarningDisagree}
        >
            <DialogTitle><FormattedMessage id='list.dialogTitle' /></DialogTitle>
            <DialogContent className={classes.warningContent}>
                <DialogContentText>{valueForDelete && (getFormLabel ? getFormLabel(valueForDelete) : '')}</DialogContentText>
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
    </div>;
};

Lists.propTypes = {
    values: PropTypes.array,
    onPositionChange: PropTypes.func,
    onFormOpen: PropTypes.func,
    onDelete: PropTypes.func,
    sortable: PropTypes.bool,
    bigAvatar: PropTypes.bool,
    maxLength: PropTypes.number,
    numeration: PropTypes.bool,
    title: PropTypes.string,
    getFormLabel: PropTypes.func
};

Lists.defaultProps = {
    values: [],
    onPositionChange: () => {},
    onFormOpen: () => {},
    onDelete: () => {},
    sortable: false,
    bigAvatar: false,
    maxLength: Infinity,
    numeration: false,
    title: ''
};

export default Lists;
