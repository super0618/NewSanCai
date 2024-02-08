import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import classNames from 'classnames';

import DialogTitle from '@material-ui/core/DialogTitle';
import AddIcon from '@material-ui/icons/Add';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Tooltip from '@material-ui/core/Tooltip';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import ReorderIcon from '@material-ui/icons/Reorder';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import FolderIcon from '@material-ui/icons/Folder';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';

import { DEFAULT_LOCALE } from '../../../client/constants';

import getItemName from '../../utils/getItemName';

import { makeStyles } from '@material-ui/core/styles';

import arrayMove from '../../utils/arrayMove';

import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        '@media (max-width:1200px)': {
            flexDirection: 'column-reverse'
        }
    },
    drawer: {
        maxWidth: '400px',
        minWidth: '350px',
        flexShrink: 0,
        '@media (max-width:1200px)': {
            width: 'calc(100% - 60px)',
            maxWidth: 'unset',
            margin: '30px 30px 0 30px',
            boxShadow: '0px 1px 5px 0px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12)'
        },
        '@media (max-width:600px)': {
            width: 'calc(100% - 30px)',
            margin: '15px 15px 0 15px'
        },
        '@media (max-width:400px)': {
            width: '100%',
            margin: '15px 0 0 0'
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
    hiddenMark: {
        width: '64px',
        height: '24px',
        borderRadius: '52px',
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontSize: '14px',
        textAlign: 'center',
        padding: '5px 0px 0px 0px',
        background: '#3f51b5',
        color: 'white'
    },
    toolbar: {
        height: '0px'
    },
    toolbarNav: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '5px 30px 5px 30px',
        '@media (max-width:460px)': {
            padding: '5px 16px 5px 16px'
        }
    },
    categoryTitle: {
        height: '30px'
    },
    buttonBack: {
        marginLeft: 'auto'
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
        zIndex: 1201,
        '&:hover $valueActions': {
            visibility: 'visible'
        },
        '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.07)'
        }
    },
    rowActive: {
        backgroundColor: 'rgba(0, 0, 0, 0.07)'
    },
    valueActions: {
        visibility: 'hidden',
        '@media (max-width:780px)': {
            visibility: 'visible'
        }
    },
    categoryOptions: {
        height: '100%'
    },
    listItemText: {
        '@media (max-width:600px)': {
            maxWidth: '120px'
        },
        '@media (max-width:400px)': {
            padding: '0'
        }
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
    },
    loader: {
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
}));

const ButtonSortable = SortableHandle(({ classes }) => (
    <ReorderIcon className={classes.buttonSortable}> <FormattedMessage id='adminTable.reorder' /> </ReorderIcon>
));

const ItemSortable = SortableElement(({ onFormOpen, onCategoryDelete, name, onCategoryClick, value, classes, activeCategory, readonly }) => (
    <ListItem onClick={onCategoryClick(value)} button className={classNames(classes.row, { [classes.rowActive]: activeCategory?._id === value._id })}>
        {
            !readonly &&
            <ButtonSortable classes={classes}/>
        }
        <ListItemIcon>
            <FolderIcon/>
        </ListItemIcon>
        <ListItemText
            className={classes.listItemText}
            primary={name}
        />
        {
            value.data[DEFAULT_LOCALE].hidden && <div className={classes.hiddenMark}>
                <FormattedMessage id='adminTableWithCategories.hidden' />
            </div>
        }
        {
            !readonly &&
            <div className={classes.valueActions}>
                <ListItemSecondaryAction className={classes.categoryOptions}>
                    <IconButton onClick={onFormOpen(value)}>
                        <EditIcon/>
                    </IconButton>
                    <IconButton onClick={onCategoryDelete(value)} edge="end" aria-label="delete">
                        <DeleteIcon/>
                    </IconButton>
                </ListItemSecondaryAction>
            </div>
        }
    </ListItem>
));

const SortableWrapper = SortableContainer((
    {
        categories,
        ...rest
    }) =>
    <List>
        {
            categories.map((value, i) => {
                const name = getItemName(value);
                return <ItemSortable key={i} name={name} value={value} index={i} {...rest}/>;
            })
        }
    </List>
);

const ExampleCategoriesNavbar = props => {
    const {
        title,
        onBack,
        activeCategory,
        categories,
        handleCategoryClick,
        onCategoryFormOpen,
        onCategoriesDelete,
        onCategoriesSort,
        readonly
    } = props;
    const [categoryForDelete, setCategoryForDelete] = useState(null);
    const classes = useStyles();

    const handleCategoryDelete = category => (event) => {
        event.stopPropagation();
        setCategoryForDelete(category);
    };

    const handleWarningDisagree = () => {
        setCategoryForDelete(null);
    };

    const handleWarningAgree = () => {
        onCategoriesDelete([categoryForDelete._id]);
        setCategoryForDelete(null);
    };

    const handleDragEnd = ({ oldIndex, newIndex }) => {
        const newCategories = arrayMove(categories, oldIndex, newIndex);

        onCategoriesSort(newCategories.map(({ _id }) => _id));
    };

    return <>
        <Drawer
            className={classes.drawer}
            variant="permanent"
            anchor="right"
            classes={{
                paper: classes.drawerPaper
            }}
        >
            <div className={classes.toolbarNav}>
                <Typography variant='h6' className={classes.categoryTitle}>
                    <FormattedMessage id={title} />
                </Typography>
                {onBack && (
                    <Tooltip title='Back'>
                        <IconButton aria-label='Back' className={classes.buttonBack} onClick={onBack}>
                            <ArrowBackIcon/>
                        </IconButton>
                    </Tooltip>
                )}
                {
                    !readonly &&
                    <Tooltip title='Add'>
                        <IconButton aria-label='Add' onClick={onCategoryFormOpen()}>
                            <AddIcon/>
                        </IconButton>
                    </Tooltip>
                }
            </div>
            <Divider/>
            <div className={classes.toolbar}/>
            <SortableWrapper
                axis='xy'
                onFormOpen={onCategoryFormOpen}
                onCategoryDelete={handleCategoryDelete}
                onCategoryClick={handleCategoryClick}
                onSortEnd={handleDragEnd}
                categories={categories}
                useDragHandle
                classes={classes}
                activeCategory={activeCategory}
                readonly={readonly}
            />
        </Drawer>
        <Dialog
            open={!!categoryForDelete}
            onClose={handleWarningDisagree}
        >
            <DialogTitle><FormattedMessage id='adminTable.dialogTitle' /></DialogTitle>
            <DialogContent className={classes.warningContent}>
                <DialogContentText>{getItemName(categoryForDelete)}</DialogContentText>
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
    </>;
};

ExampleCategoriesNavbar.propTypes = {
    title: PropTypes.string,
    onBack: PropTypes.func,
    activeCategory: PropTypes.object,
    categories: PropTypes.array,
    handleCategoryClick: PropTypes.func,
    onCategoryFormOpen: PropTypes.func,
    onCategoriesDelete: PropTypes.func,
    onCategoriesSort: PropTypes.func,
    readonly: PropTypes.bool
};

ExampleCategoriesNavbar.defaultProps = {
    title: '',
    activeCategory: {},
    categories: [],
    handleCategoryClick: () => {},
    onCategoryFormOpen: () => {},
    onCategoriesDelete: () => {},
    onCategoriesSort: () => {}
};

export default ExampleCategoriesNavbar;
