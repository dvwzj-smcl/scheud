import React, { PropTypes, Component } from 'react';
import FormsyText from 'formsy-material-ui/lib/FormsyText';
import { Form } from 'formsy-react';

// verification on every change is slow, so debouncing helps
const debounceFunc = function(fn, delay) {
    let timer = null;
    return function () {
        const args = arguments;
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
};

// fix formsy text for form update
class SemiForm extends Component {
    constructor(props) {
        super(props);
        // this.onChange = this.onChange.bind(this);
    }

    // componentDidMount() {
    //     const { debounce = 200 } = this.props;
    //     this.setValidate = debounceFunc(this.refs.input.setValue, debounce);
    // }
    //
    // componentWillReceiveProps() {
    //     const input = this.refs.input;
    //     input.setState({ value: input.getValue() || '' });
    // }

    // onChange(event) {
    //     if (this.props.onChange)
    //         this.props.onChange(event);
    //     this.setValidate(event.currentTarget.value);
    // }

    render() {
        return <Form ref="form" {...this.props} />;
    }
}

SemiForm.propTypes = {
    onChange: PropTypes.func,
    debounce: PropTypes.number
};

export default SemiForm;