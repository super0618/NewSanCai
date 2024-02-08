import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import classNames from 'classnames';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckIcon from '@material-ui/icons/Check';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import ReorderIcon from '@material-ui/icons/Reorder';
import FileCopy from '@material-ui/icons/FileCopy';

import AdminTableHeader from '../AdminTableHeader';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import difference from 'ramda/src/difference';
import arrayMove from '../../utils/arrayMove';
import getRemovedItemName from './utils/getRemovedItemName';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles(theme => ({
    paper: {
        margin: '30px 0 0 0',
        width: '100%',
        display: 'inline-block',
        paddingRight: theme.spacing(1),
        '@media (max-width:1200px)': {
            paddingRight: '0',
            display: 'block'
        }
    },
    table: {
        width: '100%',
        '@media (max-width:1200px)': {
        }
    },
    articles: {
        width: '100%',
        '& $tableCell:nth-child(1)': {
            width: '42px'
        },
        '& $tableCell:nth-child(2)': {
            width: '42px'
        },
        '& $tableCell:nth-child(3)': {
            width: '40%'
        },
        '& $tableCell:nth-child(4)': {
            width: '30%'
        },
        '& $tableCell:nth-child(5)': {
            width: '10%'
        },
        '& $tableCell:nth-child(6)': {
            width: '10%'
        },
        '& $tableCell:nth-child(7)': {
            width: '10%'
        },
        '& $tableCell:nth-child(8)': {
            width: '10%'
        }
    },
    tableWrapper: {
        overflowX: 'auto'
    },
    valueActions: {
        visibility: 'hidden',
        '@media (max-width:780px)': {
            visibility: 'visible'
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
    tableCell: {
        color: 'rgba(0, 0, 0, 0.87)',
        fontSize: '0.9125rem',
        fontWeight: '400',
        display: 'table-cell',
        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
        textAlign: 'left',
        width: '438px',
        '@media (max-width:780px)': {
            width: 'auto',
            padding: '4px 12px'
        }
    },
    tableCellActions: {
        textAlign: 'right'
    },
    tableCellHead: {
        '@media (max-width:780px)': {
            width: 'auto',
            padding: '4px 24px'
        },
        '@media (max-width:500px)': {
            width: 'auto',
            padding: '4px 12px'
        }
    },
    row: {
        backgroundColor: '#fff',
        width: '1912px',
        '&:hover $valueActions': {
            visibility: 'visible'
        }
    },
    tabButtonSortable: {
        paddingLeft: '13px',
        paddingRight: '13px'
    },
    buttonSortable: {
        position: 'relative',
        top: '3px',
        cursor: 'pointer'
    }
}));

const Row = props => {
    const { isSelected, classes, tableCells, value, sortable, index, noCheckbox, isComment } = props;

    return <TableRow
        hover
        role='checkbox'
        aria-checked={isSelected}
        tabIndex={-1}
        selected={isSelected}
        className={classes.row}
    >
        {sortable && <TableCell className={classes.tabButtonSortable} padding='checkbox'>
            <ButtonSortable imageClassName={classes.buttonSortable}/>
        </TableCell>}
        {
            !noCheckbox &&
            <TableCell padding='checkbox' className={classes.tableCell}>
                <Checkbox checked={isSelected} onClick={props.onCheckboxClick(value)} />
            </TableCell>
        }
        {tableCells.map((tableCell, i) =>
            <TableCell key={i} className={classes.tableCell} >{tableCell.prop(value, index)}</TableCell>) }
        <TableCell padding='checkbox' align='right' className={classNames(classes.tableCell, classes.tableCellActions)} >
            <div className={classes.valueActions}>
                {props.onClone && <IconButton onClick={props.onClone(value)}>
                    <FileCopy />
                </IconButton>}
                <IconButton onClick={props.onFormOpen(value)}>
                    <EditIcon />
                </IconButton>
                { !isComment &&
                    <IconButton onClick={props.onDelete(value)}>
                        <DeleteIcon />
                    </IconButton>
                }
                { isComment &&
                    <Tooltip title='Approve'>
                        <IconButton onClick={props.onApprove(value)}>
                            <CheckIcon />
                        </IconButton>
                    </Tooltip>
                }
                { isComment &&
                    <Tooltip title='Delete'>
                        <IconButton onClick={props.onDelete(value)}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                }
            </div>
        </TableCell>
    </TableRow>;
};

Row.propTypes = {
    isSelected: PropTypes.bool.isRequired,
    sortable: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    tableCells: PropTypes.array.isRequired,
    value: PropTypes.object.isRequired,
    onCheckboxClick: PropTypes.func.isRequired,
    onFormOpen: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onApprove: PropTypes.func.isRequired,
    onClone: PropTypes.func,
    index: PropTypes.number,
    noCheckbox: PropTypes.bool,
    isComment: PropTypes.bool
};

const Rows = ({ values, checkIsSelected, emptyRows, classes, noCheckbox, isComment, ...rest }) => {
    return <TableBody>
        {values
            .map((value, i) => {
                const isSelected = checkIsSelected(value._id);

                return <Row {...rest} classes={classes} isSelected={isSelected} value={value} key={i} index={i} noCheckbox={noCheckbox} isComment={isComment}/>;
            })}
        {emptyRows > 0 && (
            <TableRow style={{ height: 49 * emptyRows }}>
                <TableCell colSpan={6} className={classes.tableCell} />
            </TableRow>
        )}
    </TableBody>;
};

Rows.propTypes = {
    values: PropTypes.array.isRequired,
    emptyRows: PropTypes.number.isRequired,
    classes: PropTypes.object.isRequired,
    checkIsSelected: PropTypes.func.isRequired,
    noCheckbox: PropTypes.bool,
    isComment: PropTypes.bool
};

const ButtonSortable = SortableHandle(({ imageClassName }) => (
    <ReorderIcon className={imageClassName}> <FormattedMessage id='adminTable.reorder' /> </ReorderIcon>
));

const ItemSortable = SortableElement(props => (
    <Row {...props} sortable />
));

const SortableWrapp = SortableContainer((
    {
        values,
        checkIsSelected,
        emptyRows,
        classes,
        ...rest
    }) => <TableBody>
    {values
        .map((value, i) => {
            const isSelected = checkIsSelected(value._id);

            return (
                <ItemSortable
                    {...rest}
                    classes={classes}
                    key={i}
                    index={i}
                    isSelected={isSelected}
                    value={value}
                />
            );
        })}
    {emptyRows > 0 && (
        <TableRow style={{ height: 49 * emptyRows }}>
            <TableCell colSpan={6} className={classes.tableCell} />
        </TableRow>
    )}
</TableBody>
);

const AdminTable = props => {
    const classes = useStyles();
    const {
        headerRows, tableCells, values, headerText, count, setRequestOptions, requestOptions, handleAddNewsClick, isMultimedia,
        search, handleSearchChange,
        dateStart, handleDateStartChange,
        dateEnd, handleDateEndChange,
        isComment,
        noCheckbox,
        className,
        handleStatusChange, status,
        onCategorySelectorOpen
    } = props;
    const [selected, setSelected] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(requestOptions.size);
    const [page, setPage] = useState(requestOptions.page);
    const [checkboxIndeterminate, setCheckboxIndeterminate] = useState(false);
    const [valueForDelete, setValueForDelete] = useState(false);
    const [valueForApprove, setValueForApprove] = useState(false);
    const [emptyRows, setEmptyRows] = useState(rowsPerPage - values.length);

    useEffect(() => {
        setSelected([]);
        setEmptyRows(rowsPerPage - values.length);
    }, [values]);

    useEffect(() => {
        setPage(requestOptions.page);
    }, [requestOptions.page]);

    const handleSelectAllClick = event => {
        if (event.target.checked && !checkboxIndeterminate) {
            setSelected(values);
            setCheckboxIndeterminate(true);

            return;
        }

        setSelected(values);
        setCheckboxIndeterminate(false);
    };

    const handleSelectedCloseClick = () => {
        setSelected([]);
        setCheckboxIndeterminate(false);
    };

    const handleCheckboxClick = selectedValue => () => {
        const selectedIndex = selected.findIndex(value => value._id === selectedValue._id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, selectedValue);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }

        const checkboxIndeterminate = checkCheckboxIndeterminate({ selected: newSelected });

        setSelected(newSelected);
        setCheckboxIndeterminate(checkboxIndeterminate);
    };

    const handleChangePage = (event, page) => {
        const checkboxIndeterminate = checkCheckboxIndeterminate({ page: page + 1 });

        setPage(page + 1);
        setCheckboxIndeterminate(checkboxIndeterminate);
        setRequestOptions({ ...requestOptions, page: page + 1 });
    };

    const handleChangeRowsPerPage = ({ target: { value } }) => {
        const checkboxIndeterminate = checkCheckboxIndeterminate({ value });

        setRowsPerPage(value);
        setEmptyRows(value - values.length);
        setCheckboxIndeterminate(checkboxIndeterminate);
        setRequestOptions({ ...requestOptions, size: value });
    };

    const handleDelete = value => () => {
        setValueForDelete(value);
    };

    const handleApprove = value => () => {
        setValueForApprove(value);
    };

    const handleWarningDisagree = () => {
        setValueForDelete(null);
        setValueForApprove(null);
    };

    const handleWarningAgree = () => {
        if (valueForDelete) {
            setValueForDelete(null);

            if (!isComment) {
                props.onDelete([valueForDelete._id]);
            }

            if (isComment) {
                props.onDelete([valueForDelete]);
            }
        }

        if (valueForApprove && isComment) {
            setValueForApprove(null);

            props.onApprove([valueForApprove]);
        }
    };

    const checkCheckboxIndeterminate = (
        { newSelected = selected } = {}
    ) => {
        return !difference(values, newSelected).length;
    };

    const checkIsSelected = id => selected.some(item => item._id === id);

    const onSortEnd = ({ oldIndex, newIndex }) => {
        const newValues = arrayMove(values, oldIndex, newIndex).map((value, i) => {
            return { ...value, positionIndex: i };
        });

        props.onSort(newValues.map(({ _id }) => _id));
    };

    const isSortableTable = !!props.onSort;

    return (
        <Paper className={classes.paper}>
            <AdminTableHeader
                headerText={headerText}
                selected={selected}
                onDelete={props.onDelete}
                onApprove={props.onApprove}
                onSelectedCloseClick={handleSelectedCloseClick}
                onFormOpen={props.onFormOpen}
                onFiltersOpen={props.onFiltersOpen}
                sortable={isSortableTable}
                handleAddNewsClick={handleAddNewsClick}
                isMultimedia={isMultimedia}
                isComment={isComment}
                search={search}
                handleSearchChange={handleSearchChange}
                handleStatusChange={handleStatusChange}
                status={status}
                dateStart={dateStart}
                handleDateStartChange={handleDateStartChange}
                dateEnd={dateEnd}
                handleDateEndChange={handleDateEndChange}
                onCategorySelectorOpen={onCategorySelectorOpen}
            />
            <div className={classes.tableWrapper}>
                <Table className={classNames(classes.table, {
                    [classes[className]]: className
                })} aria-labelledby='tableTitle'>
                    <TableHead>
                        <TableRow>
                            {isSortableTable && <TableCell padding='checkbox' />}
                            {
                                !noCheckbox &&
                                <TableCell padding='checkbox'>
                                    <Checkbox
                                        indeterminate={checkboxIndeterminate}
                                        checked={false}
                                        onChange={handleSelectAllClick}
                                    />
                                </TableCell>
                            }
                            {headerRows.map(
                                (row, i) => (
                                    <TableCell key={i} className={classes.tableCellHead}>
                                        {row.label}
                                    </TableCell>
                                )
                            )}
                            <TableCell align='right' />
                        </TableRow>
                    </TableHead>
                    {!isSortableTable
                        ? <Rows
                            classes={classes}
                            tableCells={tableCells}
                            onCheckboxClick={handleCheckboxClick}
                            onFormOpen={props.onFormOpen}
                            onDelete={handleDelete}
                            onApprove={handleApprove}
                            onClone={props.onClone}
                            checkIsSelected={checkIsSelected}
                            values={values}
                            emptyRows={emptyRows}
                            noCheckbox={noCheckbox}
                            isComment={isComment}
                        />
                        : <SortableWrapp
                            axis='xy'
                            classes={classes}
                            tableCells={tableCells}
                            onCheckboxClick={handleCheckboxClick}
                            onFormOpen={props.onFormOpen}
                            onDelete={handleDelete}
                            onClone={props.onClone}
                            checkIsSelected={checkIsSelected}
                            values={values}
                            emptyRows={emptyRows}
                            onSortEnd={onSortEnd}
                            useDragHandle
                        />}
                </Table>
            </div>
            <TablePagination
                rowsPerPageOptions={[10, 20, 30]}
                component='div'
                count={count}
                rowsPerPage={rowsPerPage}
                page={page - 1}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                onPageChange={handleChangePage}
            />
            <Dialog
                open={!!valueForDelete}
                onClose={handleWarningDisagree}
            >
                <DialogTitle>{!isComment
                    ? <FormattedMessage id='adminTable.dialogTitle' />
                    : 'Are you sure you want to delete comment? Deleted comment will be removed from the article and cannot be restored'}
                </DialogTitle>
                <DialogContent className={classes.warningContent}>
                    <DialogContentText>
                        { valueForDelete && (!isComment && getRemovedItemName(valueForDelete)) }
                    </DialogContentText>
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
                <DialogTitle>{'Are you sure you want to approve comment? Approved comment will not be shown on this page anymore'}</DialogTitle>
                <DialogActions>
                    <Button onClick={handleWarningDisagree} color='primary'>
                        <FormattedMessage id='no' />
                    </Button>
                    <Button onClick={handleWarningAgree} color='primary' autoFocus>
                        <FormattedMessage id='yes' />
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

AdminTable.propTypes = {
    headerRows: PropTypes.array,
    tableCells: PropTypes.array,
    values: PropTypes.array,
    headerText: PropTypes.string,
    onDelete: PropTypes.func,
    onApprove: PropTypes.func,
    onSort: PropTypes.func,
    onFormOpen: PropTypes.func,
    onFiltersOpen: PropTypes.func,
    onClone: PropTypes.func,
    setRequestOptions: PropTypes.func,
    requestOptions: PropTypes.object,
    count: PropTypes.number,
    handleAddNewsClick: PropTypes.func,
    isMultimedia: PropTypes.bool,
    isComment: PropTypes.bool,
    search: PropTypes.string,
    handleSearchChange: PropTypes.func,
    handleStatusChange: PropTypes.func,
    status: PropTypes.string,
    dateStart: PropTypes.string,
    handleDateStartChange: PropTypes.func,
    dateEnd: PropTypes.string,
    handleDateEndChange: PropTypes.func,
    onCategorySelectorOpen: PropTypes.func,
    noCheckbox: PropTypes.bool,
    className: PropTypes.string
};

AdminTable.defaultProps = {
    headerRows: [],
    tableCells: [],
    values: [],
    headerText: '',
    onDelete: () => {},
    onApprove: () => {},
    onFormOpen: () => {},
    noCheckbox: false
};

export default AdminTable;
