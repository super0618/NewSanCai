import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import blue from '@material-ui/core/colors/blue';

import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper/Paper';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

import { ReactSortable } from 'react-sortablejs';

import { makeStyles } from '@material-ui/core/styles';

import remove from 'ramda/src/remove';
import CloseIcon from '@material-ui/icons/Close';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import uniqId from 'uniqid';

const useStyles = makeStyles(theme => ({
    block: {
        display: 'flex'
    },
    catalogTitle: {
        margin: theme.spacing(0, 2, 2)
    },
    blocksSide: {
        width: '70%',
        padding: '0 20px 33px'
    },
    catalogSide: {
        width: '30%',
        padding: '0 20px'
    },
    list: {
        width: '100%',
        height: '100%'
    },
    listItem: {
        cursor: 'pointer',
        backgroundColor: 'white'
    },
    listItemBlock: {
        '&:hover': {
            backgroundColor: blue[50]
        },
        '&:hover $listItem': {
            backgroundColor: blue[50]
        }
    },
    ghostClass: {
        backgroundColor: blue[200],
        transition: 'background-color 0.5s',
        '& $listItem': {
            backgroundColor: blue[200]
        }
    },
    blockNameInput: {
        width: '100%'
    },
    sticky: {
        position: 'sticky',
        top: '10px'
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
    },
    addButton: {
        height: '33px'
    }
}));

const BlocksConstructor = (props) => {
    const classes = useStyles();
    const [blocks, setBlocks] = useState(props.blocks);
    const [editableBlock, setEditableBlock] = useState(null);
    const [isSortingNow, setIsSortingNow] = useState(false);

    const onChange = () => {
        props.onChange(blocks);
    };

    useEffect(onChange, [blocks]);

    const handleSortStart = () => {
        setIsSortingNow(true);
    };

    const handleSortEnd = () => {
        setIsSortingNow(false);
    };

    const handleBlocksChange = blocks => {
        setBlocks(blocks);
    };

    /*
    const handleBlockNameChange = index => event => {
        blocks[index].name = event.target.value;
        setBlocks([...blocks]);
    };
    */

    const handleBlockEdit = index => () => {
        setEditableBlock({
            ...blocks[index],
            index
        });
    };

    const handleBlockSubmit = data => {
        blocks[editableBlock.index].data = data;
        setBlocks([...blocks]);
        setEditableBlock(null);
    };

    const handleCloseBlockForm = () => {
        setEditableBlock(null);
    };

    const handleBlockVisibleToggle = index => () => {
        blocks[index].hidden = !blocks[index].hidden;

        setBlocks([...blocks]);
    };

    const handleBlockDelete = index => () => {
        setBlocks(remove(index, 1, blocks));
    };

    const handleInputAdd = () => {
        handleBlocksChange([...blocks, { ...props.catalog[0], variantId: uniqId() }]);
    };

    const EditableBlock = editableBlock && editableBlock.component;

    return <div className={classes.root}>
        <div className={classes.block}>
            <div className={classes.blocksSide}>
                <ReactSortable
                    group="shared"
                    list={blocks}
                    setList={handleBlocksChange}
                    className={classes.list}
                    tag='ul'
                    ghostClass={classes.ghostClass}
                    onStart={handleSortStart}
                    onEnd={handleSortEnd}
                >
                    {blocks.map((block, i) =>
                        <ListItem key={i} className={classNames(classes.listItem, {
                            [classes.listItemBlock]: !isSortingNow
                        })} divider>
                            <InputBase
                                className={classes.blockNameInput}
                                value={`${block.name} ${i + 1}`}
                                readOnly={true}
                            />
                            <ListItemSecondaryAction>
                                <IconButton edge="end" aria-label="delete" onClick={handleBlockVisibleToggle(i)}>
                                    {block.hidden ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </IconButton>
                                {block.component && <IconButton edge="end" aria-label="delete" onClick={handleBlockEdit(i)}>
                                    <EditIcon />
                                </IconButton>}
                                <IconButton edge="end" aria-label="delete" onClick={handleBlockDelete(i)}>
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    )}
                </ReactSortable>
                <div className={classes.addButton}>
                    <Fab color='primary' size='small' onClick={handleInputAdd}>
                        <AddIcon />
                    </Fab>
                </div>
            </div>
        </div>
        <Modal open={!!editableBlock} onClose={handleCloseBlockForm} className={classes.modal} disableEnforceFocus disableAutoFocus disablePortal>
            <Paper className={classes.modalContent}>
                {editableBlock && <EditableBlock data={editableBlock.data} onSubmit={handleBlockSubmit} authorsOptions={props.authorsOptions}/>}
                <IconButton onClick={handleCloseBlockForm} className={classes.closeButton}>
                    <CloseIcon />
                </IconButton>
            </Paper>
        </Modal>
    </div>;
};

BlocksConstructor.propTypes = {
    catalog: PropTypes.array,
    blocks: PropTypes.array,
    onChange: PropTypes.func,
    authorsOptions: PropTypes.array
};

BlocksConstructor.defaultProps = {
    catalog: [],
    blocks: [],
    onChange: () => {}
};

export default BlocksConstructor;
