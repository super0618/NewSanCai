import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';

const CloseFormDialog = props => {
    const { text, open, onClose, onDone } = props;

    return <Dialog
        open={open}
        onClose={() => onClose(false)}
    >
        <DialogTitle>
            {text}
        </DialogTitle>
        <DialogActions>
            <Button onClick={() => onClose(false)} color='primary'>
                <FormattedMessage id='no' />
            </Button>
            <Button onClick={() => onDone()} color='primary' autoFocus>
                <FormattedMessage id='yes' />
            </Button>
        </DialogActions>
    </Dialog>;
};

CloseFormDialog.propTypes = {
    text: PropTypes.string,
    open: PropTypes.bool,
    onClose: PropTypes.func,
    onDone: PropTypes.func
};

export default CloseFormDialog;
