/* eslint-disable import/default */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import ApiCall from '../../api/ApiCall';
import SemiForm from '../forms/SemiForm';
import Confirm from '../widgets/Confirm';

class SemiModal extends Component {
    constructor(props, context) {
        super(props, context);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.enableButton = this.enableButton.bind(this);
        this.disableButton = this.disableButton.bind(this);
        this.clickSubmit = this.clickSubmit.bind(this);
        this.state = {
            canSubmit: false
        }
    }

    enableButton() {
        this.setState({ canSubmit: true });
    }

    disableButton() {
        this.setState({ canSubmit: false });
    }

    handleOpen() {
        this.setState({ open: true });
    };

    handleClose() {
        Confirm('asdf', {
            description: 'Would you like to remove this item from the list?',
            confirmLabel: 'Yes',
            abortLabel: 'No'
        }).then(() => {
            console.log('them', 456);});
        // this.setState({ open: false });
        // this.context.router.push('/users');
    };

    clickSubmit() {
        this.refs.form.submit();
    }

    render() {
        let props = this.props;
        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.handleClose}
            />,
            <FlatButton
                label="Submit"
                primary={true}
                keyboardFocused={true}
                onTouchTap={this.clickSubmit}
                disabled={!this.state.canSubmit}
                type="submit"
            />
        ];
        return (
            <div>
                <ApiCall getUrl={['10','asdf']} />
                <Dialog
                    title={props.title}
                    actions={actions}
                    modal={false}
                    open={true}
                    onRequestClose={this.handleClose}
                    autoScrollBodyContent={true} >
                    <SemiForm ref="form" noSubmit onValidSubmit={props.submitForm} onValid={this.enableButton} onInvalid={this.disableButton} >
                        {props.children}
                    </SemiForm>
                </Dialog>
            </div>
        );
    }
}

SemiModal.propTypes = {
    openAlertBox: PropTypes.bool.isRequired,
    alertText: PropTypes.string.isRequired,
    alertFunction: PropTypes.func.isRequired
};

SemiModal.contextTypes = {
    router: PropTypes.object.isRequired
};

export default SemiModal;


