import React, { useState, useCallback } from 'react';
export const SearchField = props => {
  const [focused, setFocused] = useState(false);
  const onBlur = useCallback(() => {
    setFocused(false);
  }, []);
  const onFocus = useCallback(() => {
    setFocused(true);
  }, []);
  const { className, onKeyUp } = props;
  return <div className={className + ' c-search-field' + (focused === true ? ' c-search-field--focused' : '')}>
    <div className="c-search-field__text-field-wrapper" style={{
      overflow: "hidden"
    }}>
      <div className="c-search-field__text-field-wrappper__background">
        <div className="c-search-field__text-field-wrapper__search-icon"><i className="material-icons">&#xE8B6;</i></div>
        <div className="c-search-field__text-field-wrapper__search-label">{props.search === '' && focused === false ? "Search" : null}</div>
        <input type="text" className="c-search-field__text-field" onBlur={onBlur.bind(this)} onFocus={onFocus.bind(this)} onKeyUp={onKeyUp} />
      </div>
    </div>
  </div>;
};
