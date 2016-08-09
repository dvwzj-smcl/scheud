import React, { PropTypes, Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { Form } from 'formsy-react';
import ReactDOM from 'react-dom';
import Loading from '../widgets/Loading';

class SemiForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            canSubmit: false,
            ready: props.onLoad ? false : true // for loading spinner
        };
        this.enableButton = this.enableButton.bind(this);
        this.disableButton = this.disableButton.bind(this);
        this.notifyFormError = this.notifyFormError.bind(this);
        this.resetForm = this.resetForm.bind(this);
        this.submit = this.submit.bind(this);
        this.ajax = this.ajax.bind(this);
        this.onLoad = this.onLoad.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    enableButton() {
        this.setState({
            canSubmit: true
        });
    }

    disableButton() {
        this.setState({
            canSubmit: false
        });
    }

    componentDidMount() {
        if(this.props.onLoad) {
            this.props.onLoad(this.context.ajax).then( (/*data*/) => {
                this.setState({ready: true})
            });
        }
    }

    ajax(method, url, data) {
        // todo: add Loading... to submit button
        return this.context.ajax.call(method, url, data);
    }
    
    onLoad(urls) { // called only once when mount
        if(Array.isArray(urls)) {
            return this.context.ajax.getAll(urls);
        }
        return this.context.ajax.call('get', urls);
    }

    onSubmit(data) {
        if(this.props.onSubmit) {
            this.props.onSubmit(data, this.context.ajax).then( response => {
                // todo: submit loading here...
            }).catch( error => {
                this.context.dialog.alert(error, 'Error!');
            });
        }
    }

    notifyFormError(/*data*/) {}

    // for triggering submit button using ref
    submit() {
        ReactDOM.findDOMNode(this.refs.submitBtn).click();
    }

    resetForm() {
        this.refs.form.reset();
    }

    render() {
        // console.log('render: form');
        let props = this.props;
        let resetBtn = props.hasReset && !props.noButton ? (
            <RaisedButton
                label="Reset"
                style={{marginTop: 24, marginLeft: 24}}
                onClick={this.resetForm}
            />
        ) : null;

        let submitBtn = props.noSubmitButton || props.noButton ? null : (
            <RaisedButton
                formNoValidate
                secondary={true}
                style={{marginTop: 24}}
                type="submit"
                label={props.submitLabel || 'Submit'}
                disabled={!this.state.canSubmit}
            />);

        let buttonRight = props.buttonRight? 'btn-right' : '';
        let styleClass = props.compact? 'compact' : '';
        return (
            <Form
                className={`semiForm ${buttonRight} ${styleClass}`}
                onValid={this.enableButton}
                onInvalid={this.disableButton}
                onValidSubmit={this.onSubmit}
                onInvalidSubmit={this.notifyFormError}
                ref="form"
                {...props} 
            >
                {(()=>{
                    if(this.state.ready) return props.children;
                    else return <Loading inline />;
                })()}
                <div className="btn-wrap">
                    {submitBtn}
                    {resetBtn}
                </div>
                <button style={{display:'none'}} ref="submitBtn" type="submit">Submit</button>
            </Form>);
    }
}

SemiForm.propTypes = {
    hasReset: PropTypes.bool,
    submitLabel: PropTypes.string,
    enableButton: PropTypes.func,
    disableButton: PropTypes.func,
    getUrls: PropTypes.array,
    getCallback: PropTypes.func,
    submitUrl: PropTypes.object,
    submitForm: PropTypes.func,
    submitCallback: PropTypes.func,
    resetForm: PropTypes.func,
    notifyFormError: PropTypes.func,
    children: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array
    ]),
    noSubmitButton: PropTypes.bool
};
SemiForm.contextTypes = {
    ajax: PropTypes.object,
    dialog: PropTypes.object.isRequired
};

export default SemiForm;