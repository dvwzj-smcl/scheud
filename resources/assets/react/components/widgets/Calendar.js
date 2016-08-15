/* eslint-disable import/default */
import React, { Component, PropTypes } from 'react';

import $ from 'jquery';
import 'jquery-ui/themes/base/draggable.css';
import 'jquery-ui/ui/widgets/draggable';
import 'jquery-ui/ui/widgets/droppable';
import 'fullcalendar';
import 'fullcalendar/dist/lang-all';
import moment from 'moment';

class Calendar extends Component {
    constructor(props, context) {
        super();
        this.state = {};
    }

    shouldComponentUpdate(nextProps, nextState) {
        return false;
    }

    // --- exposed functions

    addEventSource(source) {
        $('#calendar').fullCalendar('addEventSource', source);
    }

    setEventSource(source) {
        let calendar = $('#calendar');
        calendar.fullCalendar('removeEvents');
        calendar.fullCalendar('addEventSource', source);
        calendar.fullCalendar('addEventSource', source);
    }

    onViewChange = () => {

    };
    
    getViewStartDate = () => {
        return this.viewStartDate;
    };

    gotoDate = (date) => {
        $('#calendar').fullCalendar('gotoDate', date);
    };

    // --- callback functions
    
    viewRender = (view, element) => { // called when next/prev
        this.viewStartDate = this.toDate(view.start);
        if(this.props.onViewChange) this.props.onViewChange(this.viewStartDate);
        // console.log('view, element', view, element);
    };

    // helper
    toDate = (date) => {
        return new Date(date.format('YYYY-MM-DD H:mm:ss'));
    };
    
    componentDidMount() {
        let props = this.props;
        let settings = Object.assign({}, {
            lang: 'en',
            timezone: 'Asia/Bangkok',
            defaultView: 'agendaWeek',
            height: 'auto',
            minTime: '06:00',
            maxTime: '21:00',
            allDaySlot: false,
            slotDuration: '00:10:00',
            editable: true,
            selectable: true,
            droppable: true,
            unselectAuto: true,
            slotEventOverlap: false,
            forceEventDuration: true,
            events: [],
            defaultTimedEventDuration: '02:00:00',
            viewRender: this.viewRender
        }, props);

        $('#calendar').fullCalendar(settings);

        // trying to detect data in background event
        // $("#calendar").on("click",".fc-bgevent",function(event){
        //     console.log('---', $(this).data());
        // });
    }

    render() {
        // console.log('render: calendar');
        let state = this.state;
        return (
            <div id="calendar"></div>
        );
    }
}

Calendar.propTypes = {
    // openAlertBox: PropTypes.bool.isRequired
};

Calendar.contextTypes = {
    // router: PropTypes.object.isRequired
};

export default Calendar;


