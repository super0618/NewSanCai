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
import VisibilityIcon from '@material-ui/icons/Visibility';
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

import compose from 'ramda/src/compose';
import slice from 'ramda/src/slice';
import without from 'ramda/src/without';
import concat from 'ramda/src/concat';
import difference from 'ramda/src/difference';
import arrayMove from '../../utils/arrayMove';
import getRemovedItemName from './utils/getRemovedItemName';

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

const ROWS_PER_PAGE = 10;

const Row = props => {
    const { isSelected, classes, tableCells, value, sortable, voteCompleted } = props;

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
        <TableCell padding='checkbox' className={classes.tableCell}>
            <Checkbox checked={isSelected} onClick={props.onCheckboxClick(value)} />
        </TableCell>
        {tableCells.map((tableCell, i) =>
            <TableCell key={i} className={classes.tableCell} >{tableCell.prop(value)}</TableCell>) }
        <TableCell padding='checkbox' align='right' className={classNames(classes.tableCell, classes.tableCellActions)} >
            <div className={classes.valueActions}>

                {props.onClone && !voteCompleted && <IconButton onClick={props.onClone(value)}>
                    <FileCopy />
                </IconButton>}
                <IconButton onClick={props.onFormOpen(value)}>
                    {
                        !voteCompleted ? <EditIcon /> : <VisibilityIcon />
                    }
                </IconButton>
                <IconButton onClick={props.onDelete(value)}>
                    <DeleteIcon />
                </IconButton>
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
    onClone: PropTypes.func,
    voteCompleted: PropTypes.bool
};

const Rows = ({ values, checkIsSelected, emptyRows, classes, ...rest }) => {
    return <TableBody>
        {values
            .map((value, i) => {
                const isSelected = checkIsSelected(value._id);

                return <Row {...rest} classes={classes} isSelected={isSelected} value={value} key={i} />;
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
    checkIsSelected: PropTypes.func.isRequired
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
    const { headerRows, tableCells, values, headerText, noActions, voteCompleted } = props;
    const [selected, setSelected] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(values.length > ROWS_PER_PAGE ? ROWS_PER_PAGE : values.length);
    const [page, setPage] = useState(0);
    const [checkboxIndeterminate, setCheckboxIndeterminate] = useState(false);
    const [valueForDelete, setValueForDelete] = useState(false);
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, values.length - page * rowsPerPage);

    useEffect(() => {
        setRowsPerPage(values.length > ROWS_PER_PAGE ? ROWS_PER_PAGE : values.length);
        setSelected([]);
    }, [values]);

    const handleSelectAllClick = event => {
        if (event.target.checked && !checkboxIndeterminate) {
            const newSelected = compose(
                concat(selected),
                without(selected),
                slice(rowsPerPage * page, rowsPerPage * (page + 1))
            )(values);

            setSelected(newSelected);
            setCheckboxIndeterminate(true);

            return;
        }

        const newSelected = without(
            slice(rowsPerPage * page, rowsPerPage * (page + 1), values),
            selected
        );

        setSelected(newSelected);
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
        const checkboxIndeterminate = checkCheckboxIndeterminate({ page });

        setPage(page);
        setCheckboxIndeterminate(checkboxIndeterminate);
    };

    const handleChangeRowsPerPage = ({ target: { value } }) => {
        const rowsPerPage = values.length > value ? value : values.length;
        const checkboxIndeterminate = checkCheckboxIndeterminate({ rowsPerPage });

        setRowsPerPage(rowsPerPage);
        setCheckboxIndeterminate(checkboxIndeterminate);
    };

    const handleDelete = value => () => {
        setValueForDelete(value);
    };

    const handleWarningDisagree = () => {
        setValueForDelete(null);
    };

    const handleWarningAgree = () => {
        setValueForDelete(null);

        props.onDelete([valueForDelete._id]);
    };

    const checkCheckboxIndeterminate = (
        {
            newRowsPerPage = rowsPerPage,
            newPage = page,
            newSelected = selected
        } = {}
    ) => {
        const visibleValues = values
            .slice(newPage * newRowsPerPage, newPage * newRowsPerPage + newRowsPerPage);

        return !difference(visibleValues, newSelected).length;
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
                onSelectedCloseClick={handleSelectedCloseClick}
                onFormOpen={props.onFormOpen}
                onFiltersOpen={props.onFiltersOpen}
                sortable={isSortableTable}
                noActions={noActions}
                voteCompleted={voteCompleted}
            />
            <div className={classes.tableWrapper}>
                <Table className={classes.table} aria-labelledby='tableTitle'>
                    <TableHead>
                        <TableRow>
                            {isSortableTable && <TableCell padding='checkbox' />}
                            <TableCell padding='checkbox'>
                                <Checkbox
                                    indeterminate={checkboxIndeterminate}
                                    checked={false}
                                    onChange={handleSelectAllClick}
                                />
                            </TableCell>
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
                            onClone={props.onClone}
                            checkIsSelected={checkIsSelected}
                            values={values.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                            emptyRows={emptyRows}
                            voteCompleted={voteCompleted}
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
                            values={values.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                            emptyRows={emptyRows}
                            onSortEnd={onSortEnd}
                            useDragHandle
                        />}
                </Table>
            </div>
            <TablePagination
                rowsPerPageOptions={[10, 20, 30]}
                component='div'
                count={values.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
            <Dialog
                open={!!valueForDelete}
                onClose={handleWarningDisagree}
            >
                <DialogTitle><FormattedMessage id='adminTable.dialogTitle' /></DialogTitle>
                <DialogContent className={classes.warningContent}>
                    <DialogContentText>{ valueForDelete && getRemovedItemName(valueForDelete) }</DialogContentText>
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
        </Paper>
    );
};

AdminTable.propTypes = {
    headerRows: PropTypes.array,
    tableCells: PropTypes.array,
    values: PropTypes.array,
    headerText: PropTypes.string,
    onDelete: PropTypes.func,
    onSort: PropTypes.func,
    onFormOpen: PropTypes.func,
    onFiltersOpen: PropTypes.func,
    onClone: PropTypes.func,
    noActions: PropTypes.bool,
    voteCompleted: PropTypes.bool
};

AdminTable.defaultProps = {
    headerRows: [],
    tableCells: [],
    values: [],
    headerText: '',
    onDelete: () => {},
    onFormOpen: () => {}
};

export default AdminTable;
