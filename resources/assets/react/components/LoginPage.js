import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col } from 'react-flexbox-grid';
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';
import { login, isAuthenticated, getError } from '../actions/userActions';

import Divider from 'material-ui/Divider';
import SemiText from './forms/SemiText';
import SemiForm from './forms/SemiForm';
import Alert from './widgets/Alert';

class LoginPage extends Component {
    constructor(props, context) {
        super(props, context);
        this.errorMessages = {
            wordsError: "Please only use letters",
            numericError: "Please provide a number",
            urlError: "Please provide a valid URL"
        };
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentWillMount() {
        // fix: wrong password no alert (for hashHistory)
        this.context.router.push('/login');
    }

    onSubmit = (data) => {
        console.log('data', data);
        this.props.actions.login(data.username, data.password).then((json)=>{
            console.log('json', json, this.props.user.error);
            if(this.props.actions.isAuthenticated()){
                this.context.router.replace(this.props.routing.locationBeforeTransitions.query.ref || '/');
            }
        });
    };
    
    render() {
        // console.log('render: login');
        let formTemplate = {
            data: {},
            values: {username: 'organizer1', password: 'asdfasdf'},
            components: [
                [{type: 'text', name: 'username', label: 'Username', required: true, hint: 'your username or email'}],
                [{type: 'password', name: 'password', label: 'Password', required: true}]
            ]
        };

        return (
            <Grid className="center">
                <Alert open={this.props.user.error !== null} title="Login Failed" description={this.props.user.error} />
                <Row className="center-inner">
                    <Col xs mdOffset={4} md={4}>
                        <Paper>
                            <AppBar
                                title="Login"
                                showMenuIconButton={false} />
                            <SemiForm onSubmit={this.onSubmit} style={{padding: '16px 24px'}} formTemplate={formTemplate} />
                        </Paper>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

LoginPage.propTypes = {
    actions: PropTypes.object.isRequired,
    routing: PropTypes.object.isRequired
};
LoginPage.contextTypes = {
    router: PropTypes.object.isRequired
};

export default connect(
    (state)=>{
        return {
            user: state.user,
            routing: state.routing
        };
    },
    (dispatch)=>{
        return {
            actions: {
                getError: bindActionCreators(getError, dispatch),
                login: bindActionCreators(login, dispatch),
                isAuthenticated: bindActionCreators(isAuthenticated, dispatch)
            }
        };
    }
)(LoginPage);