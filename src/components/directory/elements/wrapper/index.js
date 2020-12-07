/** @flow */

import React from 'react';

export default (props) => {
  const { results, renderLoading, renderPagination, renderFilters } = props;
  return (
    <div className={props.classNameWrapper}>
      { (!props.renderTitle) ? null : props.renderTitle() }
      <div className={props.classNameRow}>
        <div className={props.classNameSearchform}>
          { renderFilters() }
        </div>
        <div className={props.classNameResults}>
          <div className={props.classNameRow}>
            { renderLoading() }
            { results() }
          </div>
        </div>
      </div>
      <div className={props.classNamePagination}>
        { renderPagination() }
      </div>
    </div>
  )
}
