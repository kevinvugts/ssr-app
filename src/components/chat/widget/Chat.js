import React, { useState } from 'react';
import styled from 'styled-components';
import { Dropdown } from 'react-bootstrap';
import useAxios from 'axios-hooks';
import Image from '../../elements/image';
import Avatar from '../../elements/avatar';
import Messages from '../messages';

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
  endpoint: 'pusher/channel/',
  endpointMe: 'users/me',
  width: {
    closed: 300,
    open: 400
  }
}

export default (instanceProps) => {

  const props = {...defaultProps, ...instanceProps};
  const { user } = props;
  let channel;

  const [{ data, loading, error }, refetch] = useAxios({
    url: props.endpoint + user.id,
  }, {
    useCache: true,
  });

  const [{ data: me, loading: meLoading, error: meError }] = useAxios({
    url: props.endpointMe,
  }, {
    useCache: true,
  });

  if (meLoading || meError || loading) {
    return <div />;
  }

  if (error) {
    switch (error.statusCode) {
      case 400:
        // Unavailable
        channel = false;
        return <div />;
        break;
      case 404:
        // New chat
        channel = {
          id: false
        }
        break;
    }
  }

  if (data && !channel) {
    channel = data;
  }

  console.log('>>>', channel);

  const onCloseClick = () => {
    if (props.onCloseClick) {
      props.onCloseClick();
    }
  }

  const renderToggle = (user) => {
    return (
      <div className="bg-dark text-light rounded-0 d-flex align-middle px-3 py-1" style={{width:`${props.width.closed}px`}}>
        <div className="d-flex w-100">
          <div className="media w-100 text-truncate">
            <div className="d-flex w-100">
              <i className="fa fa-comment mt-1 pt-2 mr-2"></i>
              <div className="mr-1 text-truncate">
                <p className="my-2 mx-0 p">{user.name}</p>
              </div>
              <a className="ml-auto pt-2 text-light" onClick={onCloseClick}>
                <i className="fa fa-times"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderMe = (me) => {
    return (
      <div className="bg-dark text-light rounded-0 d-flex align-middle px-3 py-2" style={{width:`${props.width.open}px`}}>
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
    <Dropdown drop={"up"}>
      <Dropdown.Toggle as="a" className="m-0 p-0" style={{width:`${props.width.closed}px`}}>
        { renderToggle(user) }
      </Dropdown.Toggle>
      <Dropdown.Menu as="div" className="card shadow border-0 rounded-0 m-0 p-0" show={false} style={{width:`${props.width.open}px`}}>
        <div className="px-3 py-2 w-100 border-bottom">
          <Avatar {...user} subTitle="" classNameTitle="h4 text-dark p-0 m-0" />
        </div>
        <Messages
          channel={channel}
        />
      </Dropdown.Menu>
    </Dropdown>
  )
}
