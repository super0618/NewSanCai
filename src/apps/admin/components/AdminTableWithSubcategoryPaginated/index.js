import React from 'react';
import PropTypes from 'prop-types';

import ExampleCategoriesNavbar from '../ExampleCategoriesNavbar';

import getItemName from '../../utils/getItemName';

import { makeStyles } from '@material-ui/core/styles';

import AdminTable from '../AdminTablePaginated';

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
        maxWidth: 'calc(100% - 350px)',
        '@media (max-width:1600px)': {
            maxWidth: 'calc(100% - 350px)'
        },
        '@media (max-width:1200px)': {
            maxWidth: 'unset'
        },
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

const AdminTableWithSubcategory = props => {
    const {
        headerRows,
        tableCells,
        values,
        activeCategory,
        setActiveCategory,
        activeSubcategory,
        setActiveSubcategory,
        categories,
        subcategories,
        onDelete,
        onClone,
        onFormOpen,
        onCategoryFormOpen,
        onCategoriesDelete,
        onCategoriesSort,
        onSubcategoryFormOpen,
        onSubcategoriesDelete,
        onSubcategoriesSort,
        setRequestOptions,
        requestOptions,
        count,
        handleAddNewsClick,
        readonly,
        isMultimedia,
        search,
        handleSearchChange,
        handleStatusChange,
        status,
        dateStart,
        handleDateStartChange,
        dateEnd,
        handleDateEndChange,
        onCategorySelectorOpen
    } = props;
    const classes = useStyles();

    const handleCategoryClick = category => () => {
        setActiveCategory(category);
        setActiveSubcategory(null);
    };

    const handleSubcategoryClick = subcategory => () => {
        setActiveSubcategory(subcategory);
    };

    const handleBackToCategories = () => {
        setActiveCategory(null);
        setActiveSubcategory(null);
    };

    const renderTable = () => {
        const activeCategoryObj = activeCategory && categories.find(category => category._id === activeCategory._id);

        return <AdminTable
            headerRows={headerRows}
            tableCells={tableCells}
            values={values}
            headerText={!activeCategoryObj ? 'All categories' : `Category: ${getItemName(activeCategoryObj)}`}
            onDelete={onDelete}
            onClone={onClone}
            onFormOpen={(item, type) => onFormOpen(item, activeCategory, activeSubcategory, type)}
            onCategoryFormOpen={onCategoryFormOpen}
            setRequestOptions={setRequestOptions}
            requestOptions={requestOptions}
            count={count}
            isMultimedia={isMultimedia}
            handleAddNewsClick={handleAddNewsClick}
            search={search}
            handleSearchChange={handleSearchChange}
            handleStatusChange={handleStatusChange}
            status={status}
            dateStart={dateStart}
            handleDateStartChange={handleDateStartChange}
            dateEnd={dateEnd}
            handleDateEndChange={handleDateEndChange}
            onCategorySelectorOpen={onCategorySelectorOpen}
            className={'articles'}
        />;
    };

    return <main className={classes.root}>
        <div className={classes.content}>
            {renderTable()}
        </div>

        {activeCategory
            ? (
                <ExampleCategoriesNavbar
                    title='adminTableWithCategories.subcategories'
                    activeCategory={activeSubcategory}
                    categories={subcategories}
                    handleCategoryClick={handleSubcategoryClick}
                    onCategoryFormOpen={onSubcategoryFormOpen}
                    onCategoriesDelete={(ids) => onSubcategoriesDelete(ids, activeCategory._id)}
                    onCategoriesSort={(ids) => onSubcategoriesSort(ids, activeCategory._id)}
                    onBack={handleBackToCategories}
                    readonly={readonly}
                />
            )
            : (
                <ExampleCategoriesNavbar
                    title='adminTableWithCategories.categories'
                    activeCategory={activeCategory}
                    categories={categories}
                    handleCategoryClick={handleCategoryClick}
                    onCategoryFormOpen={onCategoryFormOpen}
                    onCategoriesDelete={onCategoriesDelete}
                    onCategoriesSort={onCategoriesSort}
                    readonly={readonly}
                />
            )}
    </main>;
};

AdminTableWithSubcategory.propTypes = {
    headerRows: PropTypes.array,
    tableCells: PropTypes.array,
    activeCategory: PropTypes.object,
    setActiveCategory: PropTypes.func,
    activeSubcategory: PropTypes.object,
    setActiveSubcategory: PropTypes.func,
    values: PropTypes.array,
    categories: PropTypes.array,
    subcategories: PropTypes.array,
    onDelete: PropTypes.func,
    onFormOpen: PropTypes.func,
    onClone: PropTypes.func,
    onCategoryFormOpen: PropTypes.func,
    onCategoriesDelete: PropTypes.func,
    onCategoriesSort: PropTypes.func,
    onSubcategoryFormOpen: PropTypes.func,
    onSubcategoriesDelete: PropTypes.func,
    onSubcategoriesSort: PropTypes.func,
    setRequestOptions: PropTypes.func,
    requestOptions: PropTypes.object,
    count: PropTypes.number,
    handleAddNewsClick: PropTypes.func,
    readonly: PropTypes.bool,
    isMultimedia: PropTypes.bool,
    search: PropTypes.string,
    handleSearchChange: PropTypes.func,
    handleStatusChange: PropTypes.func,
    status: PropTypes.string,
    dateStart: PropTypes.string,
    handleDateStartChange: PropTypes.func,
    dateEnd: PropTypes.string,
    handleDateEndChange: PropTypes.func,
    onCategorySelectorOpen: PropTypes.func
};

AdminTableWithSubcategory.defaultProps = {
    headerRows: [],
    tableCells: [],
    values: [],
    onDelete: () => {},
    onFormOpen: () => {},
    onCategoryFormOpen: () => {},
    onCategoriesDelete: () => {},
    onCategoriesSort: () => {}
};

export default AdminTableWithSubcategory;
