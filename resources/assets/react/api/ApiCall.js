import React, {PropTypes, Component} from 'react';
// import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import api from './index';
import $ from 'jquery';

class ApiCall extends Component {
    constructor(props) {
        super(props);
        this.callAjax = this.callAjax.bind(this);
        // this.isActiveMenu = this.isActiveMenu.bind(this);
    }
    
    componentDidMount() {
        if(this.props.getUrl) {
            let promises = [];
            console.log('this.props.promises', this.props.getUrl);
            for (let url of this.props.getUrl) {
                promises.push(this.ajax('get', api.baseUrl(url), null, (response)=>{
                    let state = Object.assign({}, this.state, {doctors: response.doctors});
                    this.setState(state);
                }, error=>{}));
            }
            // Promise.all(this.props.promises).then(()=> {
            //     console.log('78978979', 78978979);
            // });
        }
    }

    ajax(method, url, data, success, error) {
        data = JSON.stringify(data);
        let state = Object.assign({}, this.state, {loading: true});
        this.setState(state);
        let access_token = this.props.user.access_token;
        // console.log('access_token',access_token);
        $.ajax({
            method,
            url,
            data,
            dataType: 'json',
            headers: {
                'Access-Token': access_token,
                'Content-Type': 'application/json'
            }
        }).done(response=>{
            setTimeout(()=>{
                let state = Object.assign({}, this.state, {loading: false});
                this.setState(state);
            }, 1000);
            if (response.status == "error"){
                this.setState({alertText: response.data.error});
                // this.handleOpen();
            }
            if(success) success(response);
        }).fail(message=>{
            if(error) error(message);
        });
    }

    callAjax() {
        console.log('123456789', 123456789);
    }

    render() {
        return (null);
    }
}

const mapStateToProps = ({ user }) => ({ user });

// const mapDispatchToProps = dispatch => ({
// });

// WrappedApi.propTypes = {
//     location: PropTypes.object.isRequired
// };
//
// WrappedApi.contextTypes = {
//     router: PropTypes.object
// };


export default connect(mapStateToProps)(ApiCall);