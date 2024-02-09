import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

import find from 'ramda/src/find';

import checkSettings from '../../utils/checkSettings';

import BlocksConstructor from '../../../../components/BlocksConstructor';

const SETTINGS_MODEL = {
    catalog: [ // list of blocks
        'required',
        {
            id: ['required', 'string'], // id of the block
            name: ['required', 'string'], // name of the block
            hidden: ['boolean'], // is the block hidden
            component: ['required'] // block component
        }
    ],
    authorsOptions: ['array']
};

const FormFieldBLocksConstructor = props => {
    useEffect(() => {
        checkSettings('BlocksConstructor', settings, SETTINGS_MODEL);
    }, []);

    const handleChange = blocks => {
        props.onChange(blocks);
    };

    const { value, settings } = props;

    const catalog = settings.catalog.map(item => ({ ...item }));

    const blocks = useMemo(() => value.map(block => {
        const catalogBlock = find(catalogBlock => catalogBlock.id === block.id, settings.catalog);

        return {
            ...block,
            component: catalogBlock && catalogBlock.component
        };
    }), [value, settings]);

    return <BlocksConstructor
        blocks={blocks}
        onChange={handleChange}
        catalog={catalog}
        authorsOptions={props.settings.authorsOptions}
    />;
};

FormFieldBLocksConstructor.propTypes = {
    value: PropTypes.array,
    settings: PropTypes.object,
    onChange: PropTypes.func
};

FormFieldBLocksConstructor.defaultProps = {
    value: [],
    settings: {},
    onChange: () => {}
};

export const fieldName = 'blocksConstructor';
export const getInitialValues = (data, field, langs) => langs.reduce((result, lang) => {
    result[field.name] = data[lang][field.name] || [];
    return result;
}, {});
export const getPayload = (values, field) => values[field.name];
export const Component = FormFieldBLocksConstructor;

export default {
    Component,
    fieldName,
    getInitialValues,
    getPayload
};
