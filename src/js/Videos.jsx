import React, { useEffect, useState, useCallback } from 'react';
import Axios from 'axios';
import RingLoader from 'react-spinners/RingLoader';
import { Video } from './Video';
import { SearchField } from './SearchField';
import { Filters } from './Filters';

export const tagNames = [{id: 'wellbeing', name: 'Well-Being'}, {id: 'leadership', name: 'Leadership and Professional Development'}, {id: 'impact', name: 'Impact'}, {id: 'networks', name: 'Networks'}, {id: 'grit', name: 'Grit'}]

function isSuperset(set, subset) {
  let searchArray = [];
  let subsetFix = subset;

  for ( let subElem of subsetFix ) {
    if(set.includes(subElem)) {
      searchArray.push(true);
    } else {
      searchArray.push(false);
    }
  };

  if (searchArray.includes(false)) {
    return false;
  } else {
    return true;
  };
}

function App() {
  const [videos, setVideos ] = useState([]);
  const [loading, setLoading ] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState([]);

  useEffect(() => {
    const domain = window.location.hostname === 'cascade.itap.purdue.edu' || window.location.hostname === 'localhost' ? 'https://dev.www.purdue.edu' : '';
    Axios.get(`${domain}URL_TO_MIDDLEMAN_SERVICE_GOES_HERE`)
    .then((response) => {
      let data = response.data.videos === undefined ? JSON.parse(response.data.replace(/(\r\n|\n|\r)/gm, '')).videos : response.data.videos;
        setVideos(data);
        setLoading(false);
      })
  }, []);

  const updateSearch = useCallback((event) => {
    setSearch(event.target.value);
  }, []);

  const searchVideos = (video) => {
    let searchTerms = search.toLowerCase().split(' ');
    let title = video.title.toLowerCase();
    let description = video.description.toLowerCase();
    let tags = video.tags.value;
    
    // Filter button click
    if(filter.length > 0) {
      return isSuperset(video.tags.value, filter);
    }

    // Search field input
    if(search === '') {
      return true;
    } else {
      return isSuperset(description, searchTerms) === true ||
        isSuperset(title, searchTerms) === true || 
        tags.includes(search.toLowerCase()) === true;
    }
  };

  // Loading/Null check
  if (videos && videos.length > 0 && loading === false) {
    let videoNodes = videos.filter(searchVideos).map((x,i) => {
      return <Video key={i} {...x} />
    })
    return (
      <div>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
            rel="stylesheet" />
        <SearchField onKeyUp={(e) => updateSearch(e)} search={search}/>
        <Filters filter={filter} setFilter={setFilter} />
        <div className="stl-video__container">
          {videoNodes}
        </div>
      </div>
    )
  } else if (loading === true) {
    return <RingLoader />
  } else {
    return (
      <div>
        Fetch failed, refresh to try another stick.
      </div>
    )
  }
}

export default App;
