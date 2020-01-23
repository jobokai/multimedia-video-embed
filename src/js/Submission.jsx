import React, { useState } from 'react';
import moment from 'moment';
// import ReactDOM from 'react-dom';
import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
// import Radio from '@material-ui/core/Radio';
// import RadioGroup from '@material-ui/core/RadioGroup';
import FormGroup from '@material-ui/core/FormGroup';
// import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
// import InputAdornment from '@material-ui/core/InputAdornment';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import axios from 'axios';
import MomentUtils from '@date-io/moment';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import swal from 'sweetalert';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import BlueGrey from '@material-ui/core/colors/blueGrey';
import Amber from '@material-ui/core/colors/amber';

const useStyles = makeStyles({
  appBar: {
    position: 'relative',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    minWidth: 120,
  },
  highlight: {
    fontWeight: 'bold',
    color: '#f00',
  },
  emphasis: {
    fontWeight: '500',
    fontStyle: 'italic',
  },
  textField: {
    width: '100%',
  },
});


function Root() {
  const [state, setState] = useState({
    fname: '',
    lname: '',
    email: '',
    phone: '',
    department: '',
    affiliation: '',
    otherAffiliation: '',
    pillar: '',
    programName: '',
    description: '',
    dates: [{ datetime: new Date(), description: '' }],
    delivery: [{ active: false, id: 'inperson', label: 'In person facilitated workshop' }, { active: false, id: 'selfguided', label: 'Self-guided online module' }, { active: false, id: 'resourceperson', label: 'Resource for students to access in person' }, { active: false, id: 'resourceonline', label: 'Resource for students to access online' }, { active: false, id: 'service', label: 'Service provided for students' }],
    marketing: [{ active: false, id: 'preidentified', label: 'A specific pre-identified group of students. I am only seeking access to Steps to Leaps branding materials' }, { active: false, id: 'opentoall', label: 'Open to all students on campus. I would like to have my service/program/resource/event promoted on the Steps to Leaps website and in other Steps to Leaps publications.' }, { active: false, id: 'openonline', label: 'Open to all students on campus. I am designing content for an online module to be hosted on the Steps to Leaps website.' }, { active: false, id: 'other', label: 'Other. Please provide additional details.' }],
    audienceOther: '',
    count: 1,

    sending: false,
  });

  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);
  React.useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  function inProgress() {
    setState({ ...state, sending: true });
  }

  function handleMultipleAction(action) {
    if (action === 'add') {
      let newDates = { datetime: new Date(), description: '' };
      setState({ ...state, count: state.count + 1, dates: [...state.dates, newDates] })
    } else if (state.count !== 1) {
      state.dates.pop();
      setState({ ...state, count: state.count - 1, dates: [...state.dates] })
    }
  }

  const handleDeliveryCheck = (type) => (event) => {
    let delivery = state.delivery;
    const idx = state.delivery.findIndex(x => x.id === type);
    delivery[idx].active = event.target.checked;
    setState({ ...state, delivery: delivery });
  }

  const handleMarketingCheck = (type) => (event) => {
    let marketing = state.marketing;
    const idx = state.marketing.findIndex(x => x.id === type);
    marketing[idx].active = event.target.checked;
    setState({ ...state, marketing: marketing });
  }

  const handleDateChange = (index, type) => (event) => {
    let newDates = state.dates;
    if (type === 'datetime') {
      newDates[index].datetime = event.toDate();
    } else {
      newDates[index].description = event.target.value;
    }

    setState({ ...state, ...newDates });
  }

  function handleSubmit() {
    inProgress();

    // use axios to send an email through webform mailer.
    const instance = axios.create();
    instance.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    let formattedDates = '';
    state.dates.forEach((x, i) => {
      let count = i + 1;
      formattedDates = formattedDates + `Relavant Dates (date/time) - ${count}=${moment(x.datetime).format('MMM DD, YYYY hh:mm a')}&Relavant Dates (description) - ${count}=${encodeURIComponent(x.description)}&`;
    });

    let formattedDelivery = 'Mode of Delivery=';
    state.delivery.forEach((x, i) => {
      if (x.active) {
        formattedDelivery = formattedDelivery + `${x.label},    `
      }
    });
    formattedDelivery = formattedDelivery + '&';

    let formattedMarketing = 'Target audience and marketing support=';
    state.marketing.forEach((x) => {
      if (x.active) {
        formattedMarketing = formattedMarketing + `${x.label},    `
      }
    });
    formattedMarketing = formattedMarketing + '&';

    // "Other Target audience and marketing support": state.audienceOther

    let data = `First Name=${encodeURIComponent(state.fname)}&` +
      `Last Name=${encodeURIComponent(state.lname)}&` +
      `Purdue E-mail=${encodeURIComponent(state.email)}&` +
      `Phone=${encodeURIComponent(state.phone)}&` +
      `Department/Unit/Organization/Program=${encodeURIComponent(state.department)}&` +
      `Purdue Affiliation=${state.affiliation}&` +
      `Other Affiliation=${encodeURIComponent(state.otherAffiliation)}&` +
      `Pillar Closely Aligns=${state.pillar}&` +
      `Program/Service Name=${encodeURIComponent(state.programName)}&` +
      `Program/Service Description=${encodeURIComponent(state.description)}&` +
      formattedDates +
      formattedDelivery +
      formattedMarketing +
      `Other Target audience and marketing support=${encodeURIComponent(state.audienceOther)}`;

    instance({
      method: 'post',
      url: 'https://www.hfs.purdue.edu/WebFormMailer/FormMailer/Process/5d8e7565-f0d1-4eb7-bad5-f7dfc037b24c',
      data: data
    })
      .then(() => {
        swal('Thanks!', 'Your Content Submission was sent!', 'success');
        // reset form state
        setState({
          fname: '',
          lname: '',
          email: '',
          phone: '',
          department: '',
          affiliation: '',
          otherAffiliation: '',
          pillar: '',
          programName: '',
          description: '',
          dates: [{ datetime: new Date(), description: '' }],
          delivery: [{ active: false, id: 'inperson', label: 'In person facilitated workshop' }, { active: false, id: 'selfguided', label: 'Self-guided online module' }, { active: false, id: 'resourceperson', label: 'Resource for students to access in person' }, { active: false, id: 'resourceonline', label: 'Resource for students to access online' }, { active: false, id: 'service', label: 'Service provided for students' }],
          marketing: [{ active: false, id: 'preidentified', label: 'A specific pre-identified group of students. I am only seeking access to Steps to Leaps branding materials' }, { active: false, id: 'opentoall', label: 'Open to all students on campus. I would like to have my service/program/resource/event promoted on the Steps to Leaps website and in other Steps to Leaps publications.' }, { active: false, id: 'openonline', label: 'Open to all students on campus. I am designing content for an online module to be hosted on the Steps to Leaps website.' }, { active: false, id: 'other', label: 'Other. Please provide additional details.' }],
          audienceOther: '',
          count: 1,

          sending: false,
        });
      })
      .catch(() => {
        swal('Sorry about that!', "We've encountered an error, please try again.", 'error');
        // reset sending state
        setState({
          ...state, sending: false,
        });
      });
  }

  const handleChange = (name) => (event) => {
    setState({ ...state, [name]: event.target.value });
  };

  const classes = useStyles();
  const audienceOtherIndex = state.marketing.findIndex(x => x.id === 'other');

  let disabled = state.fname !== '' && state.lname !== '' && state.email !== '' ? state.marketing[audienceOtherIndex].active && state.audienceOther === '' ? true : false : true;

  return (
    <div className="app">
      <Typography component="h2" variant="h5" align="left">
        Primary Contact Information
            </Typography>
      <div className="flexFour">
        <div className="child">
          <TextField
            label="First Name"
            required
            className={`${classes.textField} required`}
            value={state.fname}
            onChange={handleChange('fname')}
            margin="normal"
            variant="outlined"
            helperText="Required"
          />
        </div>
        <div className="child">
          <TextField
            label="Last Name"
            required
            className={`${classes.textField} required`}
            value={state.lname}
            onChange={handleChange('lname')}
            margin="normal"
            variant="outlined"
            helperText="Required"
          />
        </div>
        <div className="child">
          <TextField
            label="Email"
            required
            className={`${classes.textField} required`}
            value={state.email}
            onChange={handleChange('email')}
            margin="normal"
            variant="outlined"
            helperText="Required"
          />
        </div>
        <div className="child">
          <TextField
            label="Phone"
            className={classes.textField}
            value={state.phone}
            onChange={handleChange('phone')}
            margin="normal"
            variant="outlined"
          />
        </div>
      </div>
      <div className="flexTwo">
        <div className="child flex-justify-override">
          <Typography component='p' variant='body1'>Please Identify the department/unit/organization/program that is hosting or supporting this program/service:</Typography>
          <TextField
            label="Department/Unit/Organization/Program Name"
            className={classes.textField}
            value={state.department}
            onChange={handleChange('department')}
            margin="normal"
            variant="outlined"
          />
        </div>
        <div className="child flex-justify-override">
          <Typography component='p' variant='body1'>Please Identify your affiliation with Purdue University:</Typography>
          <FormControl variant="outlined" margin="normal" className={`${classes.formControl} dropdown`}>
            <InputLabel
              ref={inputLabel}
              htmlFor="affiliation"
            >Affiliation</InputLabel>
            <Select
              value={state.affiliation}
              className="mui-fixed"
              onChange={handleChange('affiliation')}
              input={(
                <OutlinedInput
                  name="affiliation"
                  labelWidth={labelWidth}
                  id="affiliation"
                />
              )}
            >
              <MenuItem value="Student">Student</MenuItem>
              <MenuItem value="Faculty">Faculty</MenuItem>
              <MenuItem value="Staff">Staff</MenuItem>
              <MenuItem value="Alumni">Alumni</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
          {
            state.affiliation === 'Other' ?
              <div><Typography component='p' variant='body1'>Please provide additional details:</Typography>
                <TextField
                  label="Other Affiliation *"
                  className={`${classes.textField} required`}
                  value={state.otherAffiliation}
                  onChange={handleChange('otherAffiliation')}
                  margin="normal"
                  required
                  variant="outlined"
                  helperText="Required"
                  style={{marginBottom: '-12px'}}
                />
              </div> : null
          }
        </div>
      </div>
      <Divider />
      <Typography component="h2" variant="h5" align="left">
        Program/Service Information
            </Typography>
      <div className="flexTwo">
        <div className="child aligner-item--bottom">
          <TextField
            label="Name of Program or Service"
            className={classes.textField}
            value={state.programName}
            onChange={handleChange('programName')}
            margin="normal"
            variant="outlined"
          />
        </div>
        <div className="child">
          <Typography component='p' variant='body1'>Please Identify with which pillar this most closely aligns:</Typography>
          <FormControl variant="outlined" margin="normal" className={`${classes.formControl} dropdown`}>
            <InputLabel
              ref={inputLabel}
              htmlFor="pillar"
            >Pillar</InputLabel>
            <Select
              value={state.pillar}
              className="mui-fixed"
              onChange={handleChange('pillar')}
              input={(
                <OutlinedInput
                  name="pillar"
                  labelWidth={labelWidth}
                  id="pillar"
                />
              )}
            >
              <MenuItem value="Well-Being">Well-Being</MenuItem>
              <MenuItem value="Leadership and Professional Development">Leadership and Professional Development</MenuItem>
              <MenuItem value="Impact">Impact</MenuItem>
              <MenuItem value="Networks">Networks</MenuItem>
              <MenuItem value="Grit">Grit</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
      <TextField
        fullWidth
        label="Brief Program Description"
        className={classes.textField}
        value={state.description}
        onChange={handleChange('description')}
        margin="normal"
        variant="outlined"
        multiline
        rows="4"
      />
      <Divider />
      <div>
        <Typography component="h2" variant="h5" align="left">
          Relevant Dates
        </Typography>
        <Typography component='p' variant='body1'>Please provide any relevant dates and times for your program:</Typography>
        <div className="flexTwo">
          <div className="child">
            <Button onClick={() => handleMultipleAction('add')} variant="contained" color="secondary">Add Dates</Button>
          </div>
          <div className="child">
            <Button onClick={() => handleMultipleAction('remove')} variant="contained" color="primary">Remove Dates</Button>
          </div>
        </div>
        {
          state.dates.map((x, i) => {
            return <div className="flexTwo datetime-space" key={i}>
              <div className="child aligner-item--bottom datetime-space-fix">
                <DateTimePicker
                  label="DateTimePicker"
                  inputVariant="outlined"
                  value={x.datetime}
                  fullWidth
                  onChange={handleDateChange(i, 'datetime')}
                />
              </div>
              <div className="child aligner-item--bottom">
                <TextField
                  label="Description"
                  className={`${classes.textField}`}
                  value={x.description}
                  onChange={handleDateChange(i, 'description')}
                  margin="normal"
                  variant="outlined"
                />
              </div>
            </div>
          })

        }
      </div>
      <Divider />
      <Typography component="h2" variant="h5" align="left">
        Delivery & Audience  
      </Typography>
      <div className="flexTwo">
        <div className="child">
          <FormControl component="fieldset">
            <FormLabel component="legend" className='form-checkbox-title'>Please identify the mode of delivery</FormLabel>
            <FormGroup>
              {
                state.delivery.map((x) => {
                  return <FormControlLabel
                    className={'form-checkbox-label'}
                    key={x.id}
                    control={<Checkbox checked={x.active} onChange={handleDeliveryCheck(x.id)} value={x.label} />}
                    label={x.label}
                  />
                })
              }
            </FormGroup>
          </FormControl>
        </div>
        <div className="child">
          <FormControl component="fieldset">
            <FormLabel component="legend" className='form-checkbox-title'>Please identify your target audience and how Steps to Leaps can support your marketing efforts.</FormLabel>
            <FormGroup>
              {
                state.marketing.map((x) => {
                  return <FormControlLabel
                    className={'form-checkbox-label'}
                    key={x.id}
                    control={<Checkbox checked={x.active} onChange={handleMarketingCheck(x.id)} value={x.label} />}
                    label={x.label}
                  />
                })
              }
            </FormGroup>
          </FormControl>
          {
            state.marketing[audienceOtherIndex].active ?
              <TextField
                fullWidth
                label="Please provide details *"
                className={`${classes.textField} required`}
                value={state.audienceOther}
                onChange={handleChange('audienceOther')}
                margin="normal"
                variant="outlined"
                multiline
                required
                rows="4"
                helperText="Required"
              /> :
              null
          }
        </div>
      </div>
      <div className="flexThree">
        <div className="child"></div>
        <div className="child"><Button style={{width:'100%'}} disabled={disabled} onClick={() => handleSubmit()} variant="contained" color="secondary">Submit</Button></div>
        <div className="child"></div>
      </div>
    </div>

  );
}

function App() {
  const theme = createMuiTheme({
    palette: {
      primary: {
        main: BlueGrey[800],
      },
      secondary: {
        main: Amber[600],
      }
    },
    status: {
      danger: 'red',
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        {
          Root()
        }
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  );
}

export default App;
