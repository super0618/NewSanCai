import React from 'react';

import PropTypes from 'prop-types';

import Form from '../../../Form/Form';
import getFields from './getFields';

const InputForm = props => {
    const handleSubmit = payload => {
        props.onSubmit(payload);
    };

    return <div>
        <Form
            data={props.data}
            fields={getFields()}
            onSubmit={handleSubmit}
        />
    </div>;
};

InputForm.propTypes = {
    data: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired
};

export default InputForm;
