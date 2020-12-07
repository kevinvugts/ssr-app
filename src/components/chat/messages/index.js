import React, { useState, useEffect, useRef } from 'react';
import ChatItem from '../elements/chatitem';
import Input from '../elements/input';
import History from './History';
import Realtime from './Realtime';
import ScrollToBottom from 'react-scroll-to-bottom';
import { css } from 'glamor';

import { usePresenceChannel, useEvent } from "@harelpls/use-pusher";

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
  endpoint: 'channels',
  channel: {
    id: false, // means new
  },
  filters: [],
  query: {},
  _limit: 10,
  _sort: "messages.updatedAt:DESC",
  useCache: false,
}

export default (instanceProps) => {

  // let messagesListRef = useRef(null);

  const props = {...defaultProps, ...instanceProps};
  // const [channelID, setChannelID] = useState();
  //
  // /**
  //  * Array of the messages
  //  *
  //  * @return {Object}
  //  */
  // const [messages, setMessages] = useState([]);
  //
  // /**
  //  * Clear old messages of channel changes.
  //  *
  //  * @return {Object}
  //  */
  // useEffect(() => {
  //   if (!channelID || channelID !== props.channel.id) {
  //     setChannelID(props.channel.id);
  //     setMessages([]);
  //   }
  // }, [props.channel.id, channelID, messages, setMessages]);
  //
  // /**
  //  * Subscribe to a presence channel
  //  *
  //  * @params {string}   - Channel identifier
  //  * @return {Object}
  //  */
  // const channel = usePresenceChannel('presence-chat-' + props.channel.id);
  //
  // /**
  //  * Bind to events on a channel with a callback.
  //  *
  //  * @return null
  //  */
  // useEvent(channel.channel, "message", (msg) => {
  //   setMessages([...messages, msg]);
  // });
  //
  // const getUserInfo = (msg) => {
  //   return channel.members[msg.user];
  // }
  //
  // const isMe = (msg) => {
  //   return channel.me.id === msg.user;
  // }

  const ROOT_CSS = css({
    height: 'calc(100vh - 300px)',
    width: '100%'
  });

  return (
    <div className="chat-messages">
      <ScrollToBottom className={ROOT_CSS} scrollViewClassName="d-flex flex-column p-4">
        <Realtime
          {...props}
        />
      </ScrollToBottom>
      <div className="align-bottom p-3 bg-primary-light border-top">
        <Input channel={props.channel} />
      </div>
    </div>
  )

}
