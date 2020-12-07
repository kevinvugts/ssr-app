import React from 'react';
import { Dropdown } from 'react-bootstrap';
import useAxios from 'axios-hooks';
import Image from '../../elements/image';

import Channels from '../channels';

/**
 * @name Chat
 * Chat channel list
 *
 * @constructor
 * @param {object} props                      - The properties object.
 * @param {string} [props.endpoint]             - Optionally the image format to use.
 * @param {boolean} [props.useCache=true]     - Enable or disable cache
 * @return {html}                             - The html element.
 */
const defaultProps = {
  endpointMe: 'users/me',
}

const width = 300;

export default (instanceProps) => {

  const props = {...defaultProps, ...instanceProps};

  const [{ data: me, loading: meLoading, error: meError }] = useAxios({
    url: props.endpointMe,
  }, {
    useCache: true,
  });

  if (meLoading || meError) {
    return <div />;
  }

  const renderToggle = (me) => {
    return (
      <div className="bg-dark text-light rounded-0 d-flex align-middle px-3 py-2" style={{width:`${width}px`}}>
        <div className="d-flex w-100">
          <Image images={me.avatar}
            className={`ml-1 mr-3 avatar avatar-sm avatar-border-white p-0`}
          />
          <div className="media w-100 text-truncate">
            <div className="d-flex w-100">
              <div className="mr-1 text-truncate">
                <p className="my-2 mx-0 p">Berichten</p>
              </div>
              <a className="ml-auto pt-2 text-light" href="#">
                <i className="fa fa-paper-plane"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Dropdown className="fixed-bottom" drop="up">
      <div className="container-fluid">
        <div className="d-flex flex-row-reverse">
          <Dropdown.Toggle as="a" className="m-0 p-0" style={{width:`${width}px`}}>
            { renderToggle(me) }
          </Dropdown.Toggle>
          <Dropdown.Menu as="div" className="card shadow border-0 rounded-0 m-0 p-0" drop="up" show={true} style={{width:`${width}px`}}>
            <Channels />
          </Dropdown.Menu>
        </div>
      </div>
    </Dropdown>
  )

}
