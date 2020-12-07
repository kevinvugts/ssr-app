import React from 'react';
import useAxios from 'axios-hooks';
import ChatItem from '../elements/chatitem';

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
  endpoint: 'messages',
  channel: {
    id: false, // means new
  },
  me: null,
  query: {},
  _limit: 10,
  _sort: "createdAt:DESC",
  useCache: false,
}

export default (instanceProps) => {

  const props = {...defaultProps, ...instanceProps};

  /**
   * Is this a new channel, then wait
   *
   * @return html
   */
  if (!props.channel || !props.channel.id) {
    return <div />;
  }

  /**
   * Fetch history
   *
   * @return null
   */
  const [{ data, loading, error }] = useAxios({
    url: props.endpoint,
    params: {
      channel_eq: props.channel.id,
      _sort: props._sort,
      _limit: props._limit
    }
  }, {
    useCache: props.useCache,
  });

  /**
   * Array of the messages (TODO: infinite pagination)
   *
   * @return {Object}
   */
  // const [messages, setMessages] = useState([]);

  const isMe = (user) => {
    return user.id === props.me;
  }

  if (loading || error || !data) {
    return <div />;
  }

  return (
    <div className="d-flex flex-column-reverse">
    { data.map(message => (
      <ChatItem
        key={`message-item-${message.id}`}
        avatar={message.from.avatar}
        username={message.from.username}
        message={message.body}
        date={message.createdAt}
        unread={0}
        isMe={isMe(message.from)}
      />
    )) }
    </div>
  )

}
