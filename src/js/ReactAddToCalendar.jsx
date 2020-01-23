import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  faApple, faGoogle, faYahoo, faWindows,
} from '@fortawesome/free-brands-svg-icons';
import { faCalendarPlus } from '@fortawesome/free-regular-svg-icons';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
/* eslint-disable */
export default class ReactAddToCalendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      optionsOpen: props.optionsOpen || false,
      isCrappyIE: false,
    };

    this.toggleCalendarDropdown = this.toggleCalendarDropdown.bind(this);
    this.handleDropdownLinkClick = this.handleDropdownLinkClick.bind(this);
  }

  componentDidMount() {
    // polyfill for startsWith to fix IE bug
    if (!String.prototype.startsWith) {
      String.prototype.startsWith = function (searchString, position) {
        position = position || 0;
        return this.indexOf(searchString, position) === position;
      };
    }

    let isCrappyIE = false;
    if (
      typeof window !== 'undefined'
      && window.navigator.msSaveOrOpenBlob
      && window.Blob
    ) {
      isCrappyIE = true;
    }

    this.setState({ isCrappyIE });
  }

  getRandomKey = () => {
    const n = Math.floor(Math.random() * 999999999999).toString();
    return `${new Date().getTime().toString()}_${n}`;
  }

formatTime = (date) => {
    const formattedDate = moment.utc(date).format('YYYYMMDDTHHmmssZ');
    return formattedDate.replace('+00:00', 'Z');
  }

  calculateDuration = (startTime, endTime) => {
    // snag parameters and format properly in UTC
    const end = moment.utc(endTime).format('DD/MM/YYYY HH:mm:ss');
    const start = moment.utc(startTime).format('DD/MM/YYYY HH:mm:ss');

    // calculate the difference in milliseconds between the start and end times
    const difference = moment(end, 'DD/MM/YYYY HH:mm:ss').diff(
      moment(start, 'DD/MM/YYYY HH:mm:ss'),
    );

    // convert difference from above to a proper momentJs duration object
    const duration = moment.duration(difference);

    return (
      Math.floor(duration.asHours()) + moment.utc(difference).format(':mm')
    );
  }

  buildUrl = (event, type, isCrappyIE) => {
    let calendarUrl = '';

    // allow mobile browsers to open the gmail data URI within native calendar app
    // type = (type === "google" && this.isMobile()) ? "outlook" : type;
    let duration;

    switch (type) {
      case 'google':
        calendarUrl = 'https://calendar.google.com/calendar/render';
        calendarUrl += '?action=TEMPLATE';
        calendarUrl += `&dates=${this.formatTime(event.startTime)}`;
        calendarUrl += `/${this.formatTime(event.endTime)}`;
        calendarUrl += `&location=${encodeURIComponent(event.location)}`;
        calendarUrl += `&text=${encodeURIComponent(event.title)}`;
        calendarUrl += `&details=${encodeURIComponent(event.description)}`;
        break;

      case 'yahoo':
        // yahoo doesn't utilize endTime so we need to calulate duration

        duration = this.calculateDuration(event.startTime, event.endTime);
        calendarUrl = 'https://calendar.yahoo.com/?v=60&view=d&type=20';
        calendarUrl += `&title=${encodeURIComponent(event.title)}`;
        calendarUrl += `&st=${this.formatTime(event.startTime)}`;
        calendarUrl += `&dur=${duration}`;
        calendarUrl += `&desc=${encodeURIComponent(event.description)}`;
        calendarUrl += `&in_loc=${encodeURIComponent(event.location)}`;
        break;

      case 'outlookcom':
        calendarUrl = 'https://outlook.live.com/owa/?rru=addevent';
        calendarUrl += `&startdt=${this.formatTime(event.startTime)}`;
        calendarUrl += `&enddt=${this.formatTime(event.endTime)}`;
        calendarUrl += `&subject=${encodeURIComponent(event.title)}`;
        calendarUrl += `&location=${encodeURIComponent(event.location)}`;
        calendarUrl += `&body=${encodeURIComponent(event.description)}`;
        calendarUrl += '&allday=false';
        calendarUrl += `&uid=${this.getRandomKey()}`;
        calendarUrl += '&path=/calendar/view/Month';
        break;

      default:
        calendarUrl = [
          'BEGIN:VCALENDAR',
          'VERSION:2.0',
          'BEGIN:VEVENT',
          `URL:${document.URL}`,
          `DTSTART:${this.formatTime(event.startTime)}`,
          `DTEND:${this.formatTime(event.endTime)}`,
          `SUMMARY:${event.title}`,
          `DESCRIPTION:${event.description}`,
          `LOCATION:${event.location}`,
          'END:VEVENT',
          'END:VCALENDAR',
        ].join('\n');

        if (!isCrappyIE && this.isMobile()) {
          calendarUrl = encodeURI(
            `data:text/calendar;charset=utf8,${calendarUrl}`,
          );
        }
    }

    return calendarUrl;
  }

  // determine if a mobile browser is being used
  isMobile = () => {
    let mobile = false;

    (function check(a) {
      if (
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
          a,
        )
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw(n|u)|c55\/|capi|ccwa|cdm|cell|chtm|cldc|cmd|co(mp|nd)|craw|da(it|ll|ng)|dbte|dcs|devi|dica|dmob|do(c|p)o|ds(12|d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(|_)|g1 u|g560|gene|gf5|gmo|go(\.w|od)|gr(ad|un)|haie|hcit|hd(m|p|t)|hei|hi(pt|ta)|hp( i|ip)|hsc|ht(c(| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i(20|go|ma)|i230|iac( ||\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|[a-w])|libw|lynx|m1w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|mcr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|([1-8]|c))|phil|pire|pl(ay|uc)|pn2|po(ck|rt|se)|prox|psio|ptg|qaa|qc(07|12|21|32|60|[2-7]|i)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h|oo|p)|sdk\/|se(c(|0|1)|47|mc|nd|ri)|sgh|shar|sie(|m)|sk0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h|v|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl|tdg|tel(i|m)|tim|tmo|to(pl|sh)|ts(70|m|m3|m5)|tx9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas|your|zeto|zte/i.test(
          a.substr(0, 4),
        )
      ) mobile = true;
    }(window.navigator.userAgent || window.navigator.vendor || window.opera));

    return mobile;
  }


  toggleCalendarDropdown = () => {
    let optionsOpen = !this.state.optionsOpen;
    if (optionsOpen) {
      document.addEventListener('click', this.toggleCalendarDropdown, false);
    } else {
      document.removeEventListener('click', this.toggleCalendarDropdown);
    }

    this.setState({ optionsOpen: optionsOpen });
  }

  handleDropdownLinkClick = (e) => {
    e.preventDefault();
    const url = e.currentTarget.getAttribute('href');
    if (
      !this.isMobile()
      && (url.startsWith('data') || url.startsWith('BEGIN'))
    ) {
      const filename = 'download.ics';
      const blob = new Blob([url], { type: 'text/calendar;charset=utf-8' });
      if (this.state.isCrappyIE) {
        window.navigator.msSaveOrOpenBlob(blob, filename);
      } else {
        /** **************************************************************
        // many browsers do not properly support downloading data URIs
        // (even with 'download' attribute in use) so this solution
        // ensures the event will download cross-browser
        *************************************************************** */
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } else {
      window.open(url, '_blank');
    }

    this.toggleCalendarDropdown();
  }

  renderDropdown = () => {
    const self = this;

    const items = this.props.listItems.map((listItem) => {
      const currentItem = Object.keys(listItem)[0];
      const currentLabel = listItem[currentItem];

      let icon = null;
      if (self.props.displayItemIcons) {
        let currentIcon = currentItem === "outlook" || currentItem === "outlookcom" ? faWindows : currentItem === "apple" ? faApple : currentItem === "google" ? faGoogle : faYahoo;
        icon = <FontAwesomeIcon className="ratc-dropdown--icon" icon={currentIcon} />;
      }

      return (
        <li key={this.getRandomKey()}>
          <a
            className={`${currentItem}-link`}
            onClick={self.handleDropdownLinkClick}
            href={this.buildUrl(
              self.props.event,
              currentItem,
              self.state.isCrappyIE,
            )}
            target="_blank"
          >
            {icon}
            {currentLabel}
          </a>
        </li>
      );
    });

    return (
      <div className={this.props.dropdownClass}>
        <ul>{items}</ul>
      </div>
    );
  }

  renderButton = () => {
    let buttonLabel = this.props.buttonLabel;
    let buttonIcon = null;
    const template = Object.keys(this.props.buttonTemplate);

    if (template[0] !== 'textOnly') {
      buttonIcon = <FontAwesomeIcon className={this.props.color} icon={faCalendarPlus} />;
      buttonLabel =
        <span>
          {buttonIcon}
          {` ${buttonLabel}`}
          <FontAwesomeIcon className="ratc-dropdown--caret" icon={faCaretDown} />
        </span>
      ;
    }

    const buttonClass = this.state.optionsOpen
      ? `${this.props.buttonClassClosed} ${this.props.buttonClassOpen}`
      : this.props.buttonClassClosed;

    return (
      <div className={this.props.buttonWrapperClass}>
        <a className={buttonClass} onClick={this.toggleCalendarDropdown}>
          {buttonLabel}
        </a>
      </div>
    );
  }

  render() {
    let options = null;
    if (this.state.optionsOpen) {
      options = this.renderDropdown();
    }
    let addToCalendarBtn = null;
    if (this.props.event) {
      addToCalendarBtn = this.renderButton();
    }

    return (
      <div className={this.props.rootClass}>
        {addToCalendarBtn}
        {options}
      </div>
    );
  }
}

ReactAddToCalendar.displayName = 'Add To Calendar';

ReactAddToCalendar.propTypes = {
  buttonClassClosed: PropTypes.string,
  buttonClassOpen: PropTypes.string,
  buttonLabel: PropTypes.string,
  buttonTemplate: PropTypes.object,
  buttonIconClass: PropTypes.string,
  color: PropTypes.string,
  useFontAwesomeIcons: PropTypes.bool,
  buttonWrapperClass: PropTypes.string,
  displayItemIcons: PropTypes.bool,
  optionsOpen: PropTypes.bool,
  dropdownClass: PropTypes.string,
  event: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    location: PropTypes.string,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
  }).isRequired,
  listItems: PropTypes.arrayOf(PropTypes.object),
  rootClass: PropTypes.string,
};

ReactAddToCalendar.defaultProps = {
  buttonClassClosed: 'react-add-to-calendar__button',
  buttonClassOpen: 'react-add-to-calendar__button--light',
  buttonLabel: 'Add to My Calendar',
  buttonTemplate: { caret: 'right' },
  buttonIconClass: 'react-add-to-calendar__icon--',
  useFontAwesomeIcons: true,
  buttonWrapperClass: 'react-add-to-calendar__wrapper',
  displayItemIcons: true,
  optionsOpen: false,
  dropdownClass: 'react-add-to-calendar__dropdown',
  event: {
    title: 'Sample Event',
    description: 'This is the sample event provided as an example only',
    location: 'Portland, OR',
    startTime: '2016-09-16T20:15:00-04:00',
    endTime: '2016-09-16T21:45:00-04:00',
  },
  listItems: [
    { apple: 'Apple Calendar' },
    { google: 'Google' },
    { outlook: 'Outlook' },
    { outlookcom: 'Outlook.com' },
    { yahoo: 'Yahoo' },
  ],
  rootClass: 'react-add-to-calendar',
};
