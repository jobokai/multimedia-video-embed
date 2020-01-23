import React, { useCallback } from 'react';
import { tagNames } from './Videos';
function Tag(props) {
  let active = props.filter.includes(props.id) ? ' active' : '';
  return (<button className={"stl-video__filters--tag" + active} onClick={() => props.updateFilters(props.id)}>{props.name}</button>);
}
export function Filters(props) {
  const updateFilters = useCallback((tag) => {
    const index = props.filter.indexOf(tag);
    if (index === -1) {
      props.setFilter([...props.filter, tag]);
    }
    else {
      let removed = props.filter.filter(e => e !== tag);
      props.setFilter(removed);
    }
  }, [props]);
  let tagControls = tagNames.map((x, i) => {
    return (<Tag key={i} filter={props.filter} {...x} updateFilters={updateFilters} />);
  });
  return (<div className="stl-video__filters">
    <h3>Filter by tags:</h3>
    <div className="stl-video__filters--container">
      {tagControls}
    </div>
  </div>);
}
