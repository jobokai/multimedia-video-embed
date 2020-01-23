import "core-js/stable";
import "regenerator-runtime/runtime";

import React from 'react';
import ReactDOM from 'react-dom';
import Videos from './js/Videos';
import Calendar from './js/Calendar';
import Submission from './js/Submission';
import 'isomorphic-fetch';
import './scss/styles.scss';

if(document.getElementById('video-root')) {
  ReactDOM.render(<Videos />, document.getElementById('video-root'));
}

if(document.getElementById('calendar-root')) {
  ReactDOM.render(<Calendar />, document.getElementById('calendar-root'));
}

if(document.getElementById('submission-root')) {
  ReactDOM.render(<Submission />, document.getElementById('submission-root'));
}
