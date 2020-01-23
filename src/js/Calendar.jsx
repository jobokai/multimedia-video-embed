/* eslint-disable */
import React, { useState, useCallback, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faMapMarkerAlt, faCalendarAlt, faCalendarCheck, faCalendarTimes, faExternalLinkAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import stickybits from 'stickybits';
import ReactDrawer from 'react-drawer';
import MediaQuery from 'react-responsive';
import { HashRouter, Route, Switch } from 'react-router-dom';
import GoogleCalendar from '../lib/googleCalendar.js';
import ReactHtmlParser from 'react-html-parser';
import AddToCalendar from './ReactAddToCalendar.jsx';

const formattedNames = {
  'Steps to Leaps Calendar': 'Steps to Leaps',
};

const colorConfig = {
  'Steps to Leaps Calendar': 'campus-gold',
};

// Setup Constants
const GOOGLE_API_KEY = 'KEY_GOES_HERE';

const distinct = (value, index, self) => self.indexOf(value) === index;

const EventBadge = (props) => {
  const colorClass = colorConfig[props.calendar];
  if (!props.showPast && props.past) {
    return <div className={`itc-event-system__badge itc-u-bg-${colorClass} itc-u-bg-desaturate`} />;
  } else {
    return <div className={`itc-event-system__badge itc-u-bg-${colorClass}`} />;
  }
};

const DateCellWrapper = (Data, history) => (props) => {
  let eventClass = 'itc-event-system__month--day';
  const width = '14.28571429%';
  const style = {
    WebkitFlexBasis: width,
    flexBasis: width,
    maxWidth: width,
  };
  const events = Data.events;
  const cellDate = props.value;
  const calendars = Data.calendars;
  const basepath = Data.basepath;
  let showPast = Data.showPast;
  let eventCalendar = null;
  const eventBadge = [];

  events.forEach((event) => {
    calendars.forEach((y) => {
      if (event.meta.organizer.displayName === y.organizer.displayName) {
        eventCalendar = y.calendar;
      }
    });

    if (calendars[eventCalendar]) {
      if (moment(event.start).isSame(cellDate, 'day') && calendars[eventCalendar].select) {
        eventBadge.push(calendars[eventCalendar].organizer.displayName);
      }
    }
  });

  if (props.children.props.className === 'rbc-day-bg rbc-off-range-bg') {
    eventClass += ' itc-event-system__month__day--off-range';
  }
  const selected = moment(Data.selected).isSame(cellDate, 'day') ? ' isSelected' : '';
  const distinctEventBadges = eventBadge.filter(distinct);
  const badge = (
    <div className="itc-event-system__event-badges">
      {distinctEventBadges.map((x, i) => (<EventBadge showPast={showPast} key={i} calendar={x} past={moment(cellDate).isBefore(moment().subtract(1, 'day'))} />))}
    </div>
  );
  const onAction = () => {
    Data.setSelected(props.value);
    history.push(basepath + moment(props.value).format('MM/DD/YYYY'));
  };
  return (
    <div className={eventClass + selected} style={style}>
      <div className={props.children.props.className}>
        <button onClick={onAction} aria-label={moment(cellDate).format('dddd, MMMM D, YYYY')} className={`rbc-date-cell${props.children.props.className === 'rbc-day-bg rbc-off-range-bg' ? ' rbc-off-range' : ''}`}>
          {badge}
          {moment(props.value).format('D')}
        </button>
      </div>
    </div>
  );
};


const CustomToolbar = (toolbar) => {
  const goToBack = () => {
    let mDate = toolbar.date;
    let newDate = new Date(mDate.getFullYear(), mDate.getMonth() - 1);
    toolbar.onNavigate('prev', newDate);
  };
  const goToNext = () => {
    let mDate = toolbar.date;
    let newDate = new Date(mDate.getFullYear(), mDate.getMonth() + 1);
    toolbar.onNavigate('next', newDate);
  };
  const date = moment(toolbar.date);
  return (
    <div className="itc-event-system__toolbar--container">
      <button className="itc-event-system__toolbar--prev" aria-label="Scroll the calendar to the previous month." onClick={goToBack}>&#8249;</button>

      <div className="itc-event-system__toolbar--date">
        <span className="itc-event-system__date--month">{date.format('MMMM')}</span>
        <br />
        <span className="itc-event-system__date--year">
          {' '}
          {date.format('YYYY')}
        </span>
      </div>

      <button className="itc-event-system__toolbar--next" aria-label="Scroll the calendar to the next month." onClick={goToNext}>&#8250;</button>
    </div>
  );
};


class EventList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ref: null,
      filtered: false,
    };
    this.myRef = React.createRef();
  }

  componentDidMount() {
    this.scrollToMyRef();
  }

  componentDidUpdate() {
    this.scrollToMyRef();
  }

  scrollToMyRef = () => {
    if (this.myRef.current) {
      this.myRef.current.scrollIntoView();
    }
  };

  render() {
    const events = this.props.eventsArray;
    const current_month = this.props.current_view;
    const myRef = this.myRef;
    const params = this.props.match.params;
    let paramsDate;
    let stl;
    let message;
    let subMessage;
    this.props.calendars.forEach((cal) => {
      const stateCal = cal.organizer.displayName;
      if (stateCal === 'Steps to Leaps Calendar') {
        return stl = cal.select;
      }
    });
    if (params.year) {
      paramsDate = `${params.day}-${params.month}-${params.year}`;
    }
    let shouldReturn = [];
    const eventlist = events.map((x, i) => {
      if (moment(x.date, 'DD-MM-YYYY').isSame(current_month, 'month')) {
        let pastEvent = moment(x.date, 'DD-MM-YYYY').isBefore(moment().subtract(1, 'day'));
        let showPast = this.props.showPast;

        shouldReturn = x.calendar.map((y) => {
          if (y === 'Steps to Leaps Calendar' && stl && !pastEvent) {
            return true;
          }
          if (pastEvent && showPast) {
            return true;
          }
          return false;
        });
        if (shouldReturn.includes(true)) {
          return (
            <div className="itc-event-system__list-group" key={i} ref={moment(x.date, 'DD-MM-YYYY').isSame(moment(paramsDate, 'DD-MM-YYYY'), 'day') ? myRef : null}>
              <div className="itc-u-flex-item itc-event-system__date">
                <span className="itc-event-system__date--month">{moment(x.date, 'DD-MM-YYYY').format('MMM')}</span>
                <span className="itc-event-system__date--day">{moment(x.date, 'DD-MM-YYYY').format('DD')}</span>
                <span className="itc-event-system__date--year">{moment(x.date, 'DD-MM-YYYY').format('YYYY')}</span>
              </div>
              <div className="itc-u-flex-item itc-event-system__events">
                {x.events.map((y, i) => {
                  if ((y.eventType === 'Steps to Leaps Calendar' && stl)) {
                    return <Event key={i} {...y} />;
                  }
                  return null;
                })}
              </div>
            </div>
          );
        }
        return null;
      }

      return null;
    });

    // Setup messaging for null message, messages outside of data pull, and for filtered views
    if (shouldReturn.includes(false)) {
      // Check to see if things are filtered and being hidden
      message = 'No events match your filters.'
      subMessage = !this.props.showPast ?
        <div>
          <p>Not displaying past events, <button type="button" className={"itc-event-system__filters__actions itc-event-system__display-past"} onClick={() => this.props.showPastEvents()}>Display Past Events?</button> </p>
        </div>
        : '';
    } else {
      // Else things are null and default message
      message = 'No events are currently scheduled for this month.'
      subMessage = 'Please check again at a later time, or select a different month to view more upcoming events.';
    }

    const otherThanNull = eventlist.some(el => el !== null && el !== undefined);
    return (otherThanNull ? eventlist
      : (
        <div className="itc-event-system__no-events">
          <div className="itc-event-system__no-events--icon"><FontAwesomeIcon icon={faCalendarAlt} /></div>
          <div>
            <div className="itc-event-system__no-events--headline">
              {message}
            </div>
            <div className="itc-event-system__no-events--subline">
              {subMessage}
            </div>
          </div>
        </div>
      ));
  }
}

const Event = (props) => {
  const colorClass = colorConfig[props.eventType];
  const plainDescription = props.description ? props.description.replace(/<\/{0,1}[a-z]+>/gi, '') : '';
  const event = {
    title: props.title ? props.title : '',
    description: props.description ? props.description : '',
    location: props.location ? props.location : '',
    startTime: moment(props.start).format('YYYYMMDDTHHmmssZ'),
    endTime: moment(props.end).format('YYYYMMDDTHHmmssZ'),
  };
  const calendarname = formattedNames[props.eventType];
  return (
    <div className="itc-event-system__list-item">
      <div className={`itc-event-system__list-item-type  itc-u-bg-${colorClass}`} />
      <div className="itc-event-system__list-item-content">
        <h3>{props.title}</h3>
        <div><Description text={plainDescription} html={props.description} /></div>
      </div>
      <div className="itc-event-system__list-item-details">
        <div className="itc-event-system__list-item-details--type">
          <FontAwesomeIcon className={`itc-u-color-${colorClass}`} icon={faCalendarAlt} />
          {calendarname}
        </div>
        {props.location ? (
          <div className="itc-event-system__list-item-details--location">
            <FontAwesomeIcon className={`itc-u-color-${colorClass}`} icon={faMapMarkerAlt} />
            {props.location}
          </div>
        ) : null}
        <div className="itc-event-system__list-item-details--time">
          <FontAwesomeIcon className={`itc-u-color-${colorClass}`} icon={faClock} />
          {moment(props.start).format('h:mm a')}
          {' '}
          -
          {moment(props.end).format('h:mm a')}
        </div>
        <AddToCalendar color={`itc-u-color-${colorClass}`} event={event} />
      </div>
    </div>
  );
};

const Description = (props) => {
  return (
    <div>
      {ReactHtmlParser(props.html)}
    </div>
  );
};

const Filters = (props) => {
  const [cal, setCal] = useState({
    'Steps to Leaps Calendar': 0
  });

  const setEventCount = () => {
    let current_month = props.current_view;
    let stl = 0;
    props.events.map((x) => {
      if (moment(x.start).isSame(current_month, 'month')) {
        if (x.eventType == 'Steps to Leaps Calendar') {
          stl = stl + 1;
        }
      }
    })
    setCal({
      'Steps to Leaps Calendar': stl
    })
  }

  useEffect(() => {
    setEventCount();
  }, [props.events, props.current_view]);

  let calendarButtons = props.calendars.map((x) => {
    let colorClass = colorConfig[x.organizer.displayName];
    let name = formattedNames[x.organizer.displayName];
    return (
      <button type="button" key={x.calendar} className={"itc-event-system__filters__actions " + (x.select ? '' : 'itc-u-color-gray-40')} onClick={() => props.selectCalendar(x.calendar)}>
        <FontAwesomeIcon className={"itc-event-system__filters__icon itc-u-color-" + (x.select ? colorClass : 'gray-40')} icon={x.select ? faCalendarCheck : faCalendarTimes} /> {name} ({cal[x.organizer.displayName]})
      </button>
    )
  })
  let showPastEventsButton = (
    <button type="button" className={"itc-event-system__filters__actions " + (props.showPast ? '' : 'itc-u-color-gray-40')} onClick={() => props.showPastEvents()}>
      <FontAwesomeIcon className={"itc-event-system__filters__icon itc-u-color-" + (props.showPast ? 'fountain-run-teal' : 'gray-40')} icon={props.showPast ? faCalendarCheck : faCalendarTimes} /> Show Past Events
      </button>
  );
  return (
    <section className="itc-event-system__filters">
      <header className="itc-event-system__filters--header"><h3>Filter Events by:</h3></header>
      <div className="itc-event-system__filters--main">
        {
          calendarButtons
        }
        {
          showPastEventsButton
        }
      </div>
      {/* <footer className="itc-event-system__filters--footer">
        <div>See what other events are taking place around campus!</div>
        <a href='https://calendar.purdue.edu/'>View all events at purdue <FontAwesomeIcon icon={faExternalLinkAlt}/></a>
      </footer> */}
    </section>
  )
}

const EventSystem = (props) => {
  // state and static variables
  stickybits('#sticky-calendar');
  const [basepath] = useState(props.basepath);
  const [open, setOpen] = useState(false);
  const [noOverlay] = useState(false);
  const [current_view, setCurrentView] = useState(moment().endOf('month'));
  const [events, setEvents] = useState([]);
  const [calendars, setCalendars] = useState([
    { calendar: 0, select: true, organizer: { displayName: 'Steps to Leaps Calendar', email: 'np8iseg4a32akn72l3ba5mkbh8@group.calendar.google.com' } },
  ]);
  const [showPast, setShowPast] = useState(false);
  const [selected, setSelected] = useState(moment());

  // componentDidUpdate
  useEffect(() => {
    setOpen(false);
  }, [selected]);

  // functions
  const selectCalendar = useCallback((calendar) => {
    calendars[calendar].select = !calendars[calendar].select;
    setCalendars([...calendars]);
  }, [calendars]);

  const toggleDrawer = useCallback(() => {
    document.body.classList.add('itc-event-system-no-scroll');
    setOpen(!open);
  }, [open]);

  const closeDrawer = useCallback(() => {
    document.body.classList.remove('itc-event-system-no-scroll');
    setOpen(false);
  }, []);

  const onDrawerClose = useCallback(() => {
    document.body.classList.remove('itc-event-system-no-scroll');
    setOpen(false);
  }, []);

  const showPastEvents = useCallback(() => {
    setShowPast(!showPast);
  }, [showPast])

  const onNavigate = useCallback((date) => {
    const new_date = moment(date);
    setCurrentView(new_date);
  }, []);

  const getGoogleCalendarEvents = useCallback(() => {
    const calendarList = calendars.map(x => ({ name: x.organizer.displayName, url: x.organizer.email }));
    const calendar_configuration = {
      api_key: GOOGLE_API_KEY,
      calendars: calendarList,
      dailyRecurrence: 700,
      weeklyRecurrence: 100,
      monthlyRecurrence: 20
    }

    GoogleCalendar.getAllCalendars(calendar_configuration)
      .then(response => setEvents(response.sort((a, b) => ((a.start > b.start) ? 1 : ((b.start > a.start) ? -1 : 0)))))
      .catch((err) => { throw new Error(err); });
  }, [calendars]);

  // ComponentDidMount
  useEffect(() => {
    getGoogleCalendarEvents();
  }, [])

  useEffect(() => {
    const params = props.match.params;
    if (params.month !== undefined && params.day !== undefined && params.year !== undefined) {
      const date = `${params.month}/${params.day}/${params.year}`;
      setCurrentView(moment(date, 'MM/DD/YYYY'));
      setSelected(moment(date, 'MM/DD/YYYY'));
    }
  }, [props]);

  // variables and settings
  const eventsArray = [];
  if (events.length > 0) {
    events.forEach((x) => {
      const elementPos = eventsArray.map(x => x.date).indexOf(moment(x.start).format('DD-MM-YYYY'));
      if (elementPos === -1) {
        eventsArray.push({ date: moment(x.start).format('DD-MM-YYYY'), events: [x], calendar: [x.eventType] });
      } else {
        eventsArray[elementPos].events.push(x);
        eventsArray[elementPos].calendar.push(x.eventType);
      }
    });
  }

  /*
   * Setup the localizer by providing the moment (or globalize) Object
   * to the correct localizer.
   */
  const localizer = momentLocalizer(moment);

  const formats = {
    dateFormat: ' ',
    weekdayFormat: 'ddd',
  };

  return (
    <div className="itc-event-system">
      <MediaQuery maxWidth={1290}>
        <div>
          <button aria-label="Open Calendar" label="Open Calendar" className="itc-event-system__fab" style={{ margin: 20 }} onClick={toggleDrawer} disabled={open && !noOverlay}>
            <FontAwesomeIcon className="itc-event-system__fab--icon" icon={faCalendarAlt} />
          </button>
        </div>
      </MediaQuery>
      <div className="itc-event-system__list">
        <EventList events={events} eventsArray={eventsArray} showPastEvents={showPastEvents} showPast={showPast} calendars={calendars} current_view={current_view} {...props} />
      </div>

      <MediaQuery maxWidth={1290}>
        {(matches) => matches ?
          <ReactDrawer className="itc-event-system__drawer" open={open} position="right" onClose={onDrawerClose} noOverlay={noOverlay}>
            <div className="itc-event-system__drawer-header">
              <h2>Event Calendar</h2>
              <button type="button" onClick={closeDrawer} className="itc-event-system__drawer-close">
                <FontAwesomeIcon className="itc-event-system__drawer-close--icon" icon={faTimes} />
                {' '}
                <span className="itc-event-system__drawer-close--text">Close</span>
              </button>
            </div>
            <div className="itc-event-system__interaction">
              <div className="itc-event-system__calendar" id="sticky-calendar">
                <div className="itc-event-system__calendar--wrapper">
                  <Calendar
                    localizer={localizer}
                    formats={formats}
                    views={['month']}
                    date={new Date(current_view)}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    popup
                    onNavigate={onNavigate}
                    components={{
                      toolbar: CustomToolbar,
                      dateCellWrapper: DateCellWrapper({ events, calendars, selected, setSelected, showPast, basepath }, props.history),
                    }}
                  />
                </div>
                <Filters events={events} showPast={showPast} showPastEvents={showPastEvents} eventsArray={eventsArray} current_view={current_view} selectCalendar={selectCalendar} calendars={calendars} />
              </div>
            </div>
          </ReactDrawer> :
          <div className="itc-event-system__interaction">
            <div className="itc-event-system__calendar" id="sticky-calendar">
              <div className="itc-event-system__calendar--wrapper">
                <Calendar
                  localizer={localizer}
                  formats={formats}
                  views={['month']}
                  date={new Date(current_view)}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  popup
                  onNavigate={onNavigate}
                  components={{
                    toolbar: CustomToolbar,
                    dateCellWrapper: DateCellWrapper({ events, calendars, selected, setSelected, showPast, basepath }, props.history),
                  }}
                />
              </div>
              <Filters events={events} showPastEvents={showPastEvents} showPast={showPast} eventsArray={eventsArray} current_view={current_view} selectCalendar={selectCalendar} calendars={calendars} />
            </div>
          </div>
        }
      </MediaQuery>
    </div>
  );
};

function withProps(Component, props) {
  return function (matchProps) {
    return <Component basepath={props.basepath} {...matchProps} />
  }
}

const App = () => {
  let basepath = '/';
  return (
    <HashRouter basename='/'>
      <Switch>
        <Route exact path={`/:month?/:day?/:year?/`} component={withProps(EventSystem, { basepath })} />
        <Route component={withProps(EventSystem, { basepath })} />
      </Switch>
    </HashRouter>
  );
};

export default App;
