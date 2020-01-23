import React, { useState, useCallback } from 'react';
import RingLoader from 'react-spinners/RingLoader';
import ReactHtmlParser from 'react-html-parser';
import VisibilitySensor from 'react-visibility-sensor';
import { tagNames } from './Videos';

function decodeHTML(html) {
	var txt = document.createElement('textarea');
	txt.innerHTML = html;
	return txt.value;
};

export function Video(props) {
  const [visible, setVisibility] = useState(false);
  const [active, setActive] = useState(true);
  let tags;
  if (Array.isArray(props.tags.value)) {
    tags = props.tags.value.map((x, i) => {
      const index = tagNames.map(e => e.id).indexOf(x);
      return (<div key={i} className="stl-video__details__tags--tag">{tagNames[index].name}</div>);
    });
  }
  else {
    const index = tagNames.map(e => e.id).indexOf(props.tags.value);
    tags = <div className="stl-video__details__tags--tag">{tagNames[index].name}</div>;
  }
  const onChange = useCallback((isVisible) => {
    isVisible ? setVisibility(true) : setVisibility(false);
    isVisible ? setActive(false) : setActive(true);
  }, []);

// convert description into valid html
 /* eslint-disable */
  let updatedContent = props.description;
  let hrefMatched = props.description ? props.description.match(/href=(?:\'.*?\'|\".*?\")/gi) : null;
  let srcMatched = props.description ? props.description.match(/src=(?:\'.*?\'|\".*?\")/gi) : null;

  hrefMatched ? hrefMatched.forEach((y) => {
    if (y.includes('site://PRV - Steps To Leaps')) {
      let replacement = y.substring(0, y.length - 1).replace('site://PRV - Steps To Leaps', '') + ".php'";
      updatedContent = props.description.replace(y, replacement);
    }
  }) : null;
  srcMatched ? srcMatched.forEach((y) => {
    if (y.includes('site://PRV - Steps To Leaps')) {
      let replacement = y.substring(0, y.length).replace('site://PRV - Steps To Leaps', '');
      updatedContent = props.description.replace(y, replacement);
    }
  }) : null;

  /* eslint-enable */

  // Render
  if (props.type === 'kaltura') {
    return (<div className="stl-video">
      <div className="stl-video__embed">
        <VisibilitySensor onChange={onChange} active={active} partialVisibility={true} delayedCall={true}>
          {visible ?
            <iframe id="kaltura_player" className="stl-video__embed--kaltura" src={"https://cdnapisec.kaltura.com/p/983291/sp/98329100/embedIframeJs/uiconf_id/29134031/partner_id/983291?iframeembed=true&playerId=kaltura_player&entry_id=" + props.id + "&flashvars[streamerType]=auto&amp;flashvars[localizationCode]=en&amp;flashvars[leadWithHTML5]=true&amp;flashvars[sideBarContainer.plugin]=true&amp;flashvars[sideBarContainer.position]=left&amp;flashvars[sideBarContainer.clickToClose]=true&amp;flashvars[chapters.plugin]=true&amp;flashvars[chapters.layout]=vertical&amp;flashvars[chapters.thumbnailRotator]=false&amp;flashvars[streamSelector.plugin]=true&amp;flashvars[EmbedPlayer.SpinnerTarget]=videoHolder&amp;flashvars[dualScreen.plugin]=true&amp;flashvars[Kaltura.addCrossoriginToIframe]=true&amp;&wid=1_36xwbl2m"} allowFullScreen frameBorder="0" title={props.title}></iframe>
            :
            <div className="stl-video__embed--kaltura"><div  className="loading"><RingLoader /></div></div>}
        </VisibilitySensor>
      </div>
      <div className="stl-video__details">
        <h3 className="stl-video__details--title">{props.title}</h3>
        <div className="stl-video__details--description">
          {ReactHtmlParser(decodeHTML(updatedContent))}
        </div>
        <div className="stl-video__details__tags">
          {tags}
        </div>
      </div>
    </div>);
  }
  else if (props.type === 'youtube') {
    return (<div className="stl-video">
      <div className="stl-video__embed">
        <VisibilitySensor onChange={onChange}>
          {visible ?
            <iframe title={props.title} className="stl-video__embed--youtube" src={"https://www.youtube.com/embed/" + props.id} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            :
            <div className="stl-video__embed--youtube"><div  className="loading"><RingLoader /></div></div>}
        </VisibilitySensor>

      </div>
      <div className="stl-video__details">
        <h3 className="stl-video__details--title">{props.title}</h3>
        <div className="stl-video__details--description">
          {ReactHtmlParser(decodeHTML(updatedContent))}
        </div>
        <div className="stl-video__details__tags">
          {tags}
        </div>
      </div>
    </div>);
  }
  else {
    return (<div className="stl-video">
      <div className="stl-video__embed">
        <VisibilitySensor onChange={onChange}>
          {visible ?
            <iframe title={props.title} className="stl-video__embed--vimeo" src={"https://player.vimeo.com/video/" + props.id + "?title=0&byline=0&portrait=0"} frameBorder="0" allow="autoplay; fullscreen" allowFullScreen></iframe>
            :
            <div className="stl-video__embed--vimeo"><div  className="loading"><RingLoader /></div></div>}
        </VisibilitySensor>
      </div>
      <div className="stl-video__details">
        <h3 className="stl-video__details--title">{props.title}</h3>
        <div className="stl-video__details--description">
          {ReactHtmlParser(decodeHTML(updatedContent))}
        </div>
        <div className="stl-video__details__tags">
          {tags}
        </div>
      </div>
    </div>);
  }
}
