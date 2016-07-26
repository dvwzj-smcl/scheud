import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Panel from './widgets/Panel';
import PageHeading from './widgets/PageHeading';
import Loading from './widgets/Loading';

import {List, ListItem} from 'material-ui/List';
import {ContentInbox, ActionGrade, ContentSend, ContentDrafts, ActionInfo, ActionDelete} from 'material-ui/svg-icons';
import {ActionHome, ActionEvent, ActionEventSeat, ContentSave} from 'material-ui/svg-icons';
// import Paper from 'material-ui/Paper';
// import Divider from 'material-ui/Divider';
// import Dialog from 'material-ui/Dialog';
// import FlatButton from 'material-ui/FlatButton';

import {ajax} from '../api/ApiCall';
import * as scheduleActions from '../actions/scheduleActions';

// Forms
import SemiSelect from './forms/SemiSelect';
// import MultiSelect from './forms/MultiSelect';
import Calendar from './widgets/Calendar';
import SemiModal from './widgets/SemiModal';

class SchedulePage extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};

        // variables
        this.initCalendar = false;
        this.data = {};

        this.initialized = this.initialized.bind(this);
        this.ajax = this.ajax.bind(this);
        this.loadSlots = this.loadSlots.bind(this);
        this.onSelectSubcategory = this.onSelectSubcategory.bind(this);
        this.onClose = this.onClose.bind(this);

        this.eventClick = this.eventClick.bind(this);
        this.dayClick = this.dayClick.bind(this);
    }

    ajax(method, url, data, success, error) {
        ajax(method, url, data, success, error, this.props.user.access_token);
    }
    
    loadSlots(doctor_id) {
        this.ajax('get', `calendar/doctors/${doctor_id}/slot`, null, (response)=>{
            var me = this;
            var slots = response.slots;
            for(let slot of slots) {
                slot.rendering = 'background';
            }
            // avoid refs.calendar undefined
            var interval = setInterval(function(){
                if(me.refs.calendar) {
                    console.log('slots', slots);
                    me.refs.calendar.addEventSource(slots);
                    clearInterval(interval);
                }
            }, 500);
        }, error=>{});
    }

    initialized() {
        return this.props.schedule && this.props.schedule.init;
    }

    componentWillReceiveProps(nextProps) {
    }

    componentDidUpdate() {
        // if(this.initialized() && !this.initCalendar) {
        //     this.initCalendar = true;
        //     this.loadSlots(1);
        // }
    }

    componentDidMount() {
        if(!this.initialized()) {
            this.props.actions.init();
        }
        this.loadSlots(1);
    }

    onSelectSubcategory(data) {
        console.log('data from modal', data);
        this.refs.modal.close();
        return data;
    }

    onClose() {
        console.log('close modal');
    }

    // --- Calendar Functions
    eventClick(calEvent) {
        this.refs.modal.open();
    }

    dayClick(date, jsEvent, view, resourceObj) {
        console.log('dayClick', date);
    }

    render() {
        let props = this.props;
        let data = props.schedule.data;
        console.log('render: sc page', this.props.schedule);
        if(!this.initialized()) return <Loading />;
        return (
            <div>
                <SemiModal submitForm={this.onSelectSubcategory} onClose={this.onClose} ref="modal">
                    <SemiSelect
                        name="subcat"
                        data={data.categories}
                        required
                        floatingLabelText={'branch'}
                        fullWidth={true}
                    />
                </SemiModal>
                <PageHeading title="Schedule" description="description" />
                <Grid fluid className="content-wrap">
                    <Row>
                        <Col md={3}>
                            <Panel>
                                <div style={{padding: 12}}>
                                </div>
                            </Panel>
                        </Col>
                        <Col md={9}>
                            <Panel title="Schedule">
                                <div className="con-pad">
                                    <Calendar droppable={false} editable={false} ref="calendar"
                                              eventClick={this.eventClick}
                                              dayClick={this.dayClick}
                                    />
                                </div>
                            </Panel>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

SchedulePage.propTypes = {};

const mapStateToProps = ({schedule, user}) => ({schedule, user});
const mapDispatchToProps = (dispatch) => ({actions: {
    init: bindActionCreators(scheduleActions.initSchedule, dispatch)
}});
export default connect(mapStateToProps, mapDispatchToProps)(SchedulePage);