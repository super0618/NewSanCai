export const categories = [
    {
        id: '152',
        alias: 'news-2',
        subCategories: [
            { id: '173', alias: 'china', additional: [{ id: '118', alias: '274-china' }] },
            { id: '2', alias: 'world', additional: [{ id: '11', alias: '274-hotopic' }] },
            { id: '37', alias: 'editorial' },
            { id: '38', alias: 'finance' },
            { id: '133', alias: '274-entertainment', newAlias: 'entertainment' },
            { id: '103', alias: '274-fashion', newAlias: 'fashion' }
        ]
    },
    {
        id: '162',
        alias: 'world-3',
        subCategories: [
            { id: '24', alias: 'overseas' },
            { id: '18', alias: 'vision' },
            { id: '25', alias: 'schools' },
            { id: '23', alias: 'global', additional: [{ id: '142', alias: '274-world' }] },
            { id: '146', alias: 'beliefs' }
        ]
    },
    {
        id: '164',
        alias: 'media',
        subCategories: [
            { id: '119', alias: 'music-2' },
            { id: '32', alias: 'video' },
            { id: '48', alias: 'news' },
            { id: '49', alias: 'mtv' } // possible id - 45262
        ]
    },
    {
        id: '155',
        alias: 'science', // possible id - 32450
        subCategories: [
            { id: '43', alias: 'cosmos' },
            { id: '44', alias: 'mystery' },
            { id: '112', alias: 'environment' },
            { id: '4', alias: 'discovery' } // possible id - 45722
        ]
    },
    {
        id: '156',
        alias: 'life', // possible id - 82331
        subCategories: [
            { id: '138', alias: 'technology' },
            { id: '7', alias: 'longevity' },
            { id: '5', alias: 'family' },
            { id: '8', alias: 'interests' },
            { id: '26', alias: 'enlightenment' },
            { id: '9', alias: 'talent' },
            { id: '6', alias: 'pedia' },
            { id: '27', alias: 'relationship' },
            { id: '28', alias: 'etiquette', newAlias: 'workplace' },
            { id: '10', alias: 'cooking', newAlias: 'health' }
        ]
    },
    {
        id: '161',
        alias: 'history-2',
        subCategories: [
            { id: '22', alias: 'world-2' },
            { id: '21', alias: 'place' },
            { id: '20', alias: 'past', additional: [{ id: '134', alias: '274-oldays' }] },
            { id: '17', alias: 'people' }
        ]
    },
    {
        id: '154',
        alias: 'traditional',
        subCategories: [
            { id: '?', alias: '今生来世（暂停）' },
            { id: '36', alias: 'people-2' },
            { id: '35', alias: 'history' },
            { id: '144', alias: 'harmony' },
            { id: '34', alias: 'prosperity' },
            { id: '33', alias: 'culture' },
            { id: '3', alias: 'folk' }
        ]
    },
    {
        id: '160',
        alias: 'literature-2',
        subCategories: [
            { id: '147', alias: 'columnist' },
            { id: '16', alias: 'novels' },
            { id: '14', alias: 'music' }, // possible id - 72621
            { id: '50', alias: 'new' },
            { id: '29', alias: 'masterpiece' }, // possible id - 44584
            { id: '47', alias: 'folkarts' },
            { id: '12', alias: 'painting' },
            { id: '31', alias: 'modern' },
            { id: '15', alias: 'sculpture' }, // possible id - 56692
            { id: '13', alias: 'dance' }, // possible id - 72036
            { id: '30', alias: 'poem' }, // possible id - 47499
            { id: '96', alias: 'series' }
        ]
    },
    {
        id: '165',
        alias: 'education',
        subCategories: [
            { id: '46', alias: 'drawing' },
            { id: '140', alias: 'path' },
            { id: '45', alias: 'literature' },
            { id: '151', alias: 'musicteach' },
            { id: '143', alias: 'ways' },
            { id: '139', alias: 'stories' },
            { id: '141', alias: 'lifetopic' }
        ]
    }
];

export const subCategoriesMap = categories.reduce((result, category) => {
    category?.subCategories?.forEach(subCategory => {
        result[subCategory.id] = {
            categoryId: category.id,
            subCategory
        };
    });

    return result;
}, {});

export const mergedCategories = categories.reduce((result, category) => {
    category?.subCategories?.forEach(subCategory => {
        subCategory.additional && subCategory.additional.forEach(({ id }) => {
            result[id] = subCategory.id;
        });
    });

    return result;
}, {});

export default categories;
