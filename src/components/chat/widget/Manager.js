/* eslint-disable no-shadow,react/no-unused-state */
import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes, css } from 'styled-components';
import is from 'styled-is';

import Chat from './Chat';

const LIMIT = 3;
const HIDE_TIMEOUT = 7000;
const HIDE_LEAVE_TIMEOUT = 5000;

const fromBottomAnimation = keyframes`
  from {
    transform: translate(0, 1000px);
  }
  to {
    transform: translate(0, 0);
  }
`;

const toLeftAnimation = keyframes`
  from {
    transform: translate(0, 0);
  }
  to {
    transform: translate(-500px, 0);
  }
`;

const toRightAnimation = keyframes`
  from {
    transform: translate(0, 0);
  }
  to {
    transform: translate(500px, 0);
  }
`;

const Wrapper = styled.div`
  position: fixed;
  right: 20px;
  bottom: 0px;
  z-index: 1021;

  @media (min-width: 500px) {
    right: 30px;
    bottom: 0px;
  }
`;

const ChatContainer = styled.div`
  position: relative;
  display: block;
  padding-bottom: 0px;
  transition: transform 0.3s ease-out;

  ${is('isRight')`
    left: unset;
    right: 0;
  `};

  ${is('isInvisible')`
    visibility: hidden;
  `};
`;

const ChatWrapper = styled.div`
  ${is('isAppearing')`
    animation: ${fromBottomAnimation} 0.4s ease-out;
  `};

  ${({ isHiding, isRight }) => {
    if (isHiding) {
      return css`animation: ${isRight ? toRightAnimation : toLeftAnimation} 0.3s ease-in forwards;`;
    }

    return '';
  }};
`;

let instance;

function addChat(params) {
  if (!instance) {
    throw new Error('ChatsManager is not mounted');
  }

  setTimeout(() => {
    instance.addChat(params);
  }, 0);
}

function cleanupChat(params) {
  if (!instance) {
    throw new Error('ChatsManager is not mounted');
  }

  setTimeout(() => {
    instance.cleanupChat(params);
  }, 0);
}

/**
 * Chat Manager singleton
 */
export default class ChatsManager extends PureComponent {

  /**
   * Add a chat with this method. It returns a cleanup function
   */
  static compose(user) {
    addChat({
      type: 'compose',
      user,
    });
    return () => {
      cleanupChat(user);
    }
  }

  /**
   * Remove a chat with this method.
   */
  static remove(user) {
    cleanupChat(user);
  }

  static propTypes = {
    className: PropTypes.string,
    anchor: PropTypes.oneOf(['left', 'right']),
    renderChat: PropTypes.func,
  };

  static defaultProps = {
    className: undefined,
    anchor: 'right',
    renderChat: undefined,
  };

  lastId = 0;

  ChatsRefs = {};

  state = {
    currentChats: [],
    delayedQueue: [],
    heights: {},
    bottomOffsets: {},
    isHovered: false,
  };

  componentDidMount() {
    instance = this;

    window.addEventListener('blur', this.onLeave);
  }

  componentDidUpdate(_, prevState) {
    const { currentChats } = this.state;

    const prevLength = prevState.currentChats.length;

    if (currentChats.length && !prevLength) {
      window.addEventListener('resize', this.onResize);
    } else if (!currentChats.length && prevLength) {
      window.removeEventListener('resize', this.onResize);
    }

    this.checkHeights();
  }

  componentWillUnmount() {
    if (instance === this) {
      instance = null;
    }
  }

  onCloseClick = id => {
    this.removeChat(id);
  }

  onResize = () => {
    this.checkHeights();
  }

  getActiveChatsCount = () => {
    const { currentChats } = this.state;

    return currentChats.filter(Chat => !Chat.isHiding).length;
  }

  checkDelayedQueue = () => {
    const { delayedQueue } = this.state;

    if (delayedQueue.length && this.getActiveChatsCount() < LIMIT) {
      const [firstChat, ...other] = delayedQueue;

      this.setState(
        {
          delayedQueue: other,
        },
        () => {
          this.checkDelayedQueue();
        }
      );

      this.showChat(firstChat);
    }
  }

  // startChatsHiding(ids) {
  //   if (!(ids instanceof Set)) {
  //     // eslint-disable-next-line no-param-reassign
  //     ids = new Set([ids]);
  //   }
  //
  //   const { currentChats } = this.state;
  //
  //   this.setState(
  //     {
  //       currentChats: currentChats.map(Chat => {
  //         if (ids.has(Chat.id)) {
  //           return {
  //             ...Chat,
  //             isHiding: true,
  //           };
  //         }
  //
  //         return Chat;
  //       }),
  //     },
  //     () => {
  //       this.checkDelayedQueue();
  //     }
  //   );
  //
  //   this.clearingTimeouts.push(
  //     setTimeout(() => {
  //       this.removeChats(ids);
  //     }, 400)
  //   );
  // }

  /**
   * Try to add the chat if we don't have it already
   * or queue if we have too many.
   */
  addChat = (ChatParams) => {
    const { delayedQueue, currentChats, isHovered } = this.state;
    const { user } = ChatParams;

    if (currentChats.filter(Chat => user == Chat.user).length > 0) {
      return;
    }

    if (this.getActiveChatsCount() >= LIMIT) {
      this.setState({
        delayedQueue: delayedQueue.concat(ChatParams),
      });
      return;
    }

    this.showChat(ChatParams);
  }

  /**
   * Show the actual chat
   */
  showChat = ({ type, user, renderer }) => {
    const { currentChats, isHovered } = this.state;

    if (currentChats.filter(Chat => user == Chat.user).length > 0) {
      return;
    }

    this.lastId += 1;

    const id = this.lastId;

    this.ChatsRefs[id] = createRef();

    // if (!isHovered) {
    //   this.startChatHideTimeout(id);
    // }

    this.setState({
      currentChats: currentChats.concat({
        id,
        type,
        user,
        renderer,
      }),
    });
  }

  /**
   * Remove a chat that needs removing
   */
  removeChat = (id) => {
    const { currentChats } = this.state;

    this.setState({
      currentChats: currentChats.filter(Chat => id !== Chat.id),
    });
  }

  /**
   * Remove multiple chats
   */
  removeChats = (ids) => {
    const { currentChats } = this.state;

    this.setState({
      currentChats: currentChats.filter(Chat => !ids.has(Chat.id)),
    });
  }

  /**
   * Cleanup a chat (for use in unmount or useState hook return)
   */
  cleanupChat = (user) => {
    const { currentChats } = this.state;
    const matches = currentChats.filter(Chat => user == Chat.user);
    if (matches.length) {
      this.removeChat(matches[0].id);
    }
  }

  calcOffsets(heights) {
    const { currentChats, bottomOffsets } = this.state;

    const newBottomOffsets = {};
    let totalOffset = 0;

    for (let i = currentChats.length - 1; i >= 0; i -= 1) {
      const { id, isHiding } = currentChats[i];

      if (isHiding) {
        newBottomOffsets[id] = bottomOffsets[id];
      } else {
        const height = heights[id];
        let bottomOffset;

        if (height) {
          bottomOffset = totalOffset;
          totalOffset += height;
        } else {
          // TODO:
          bottomOffset = 0;
        }

        newBottomOffsets[id] = bottomOffset;
      }
    }

    this.setState({
      heights,
      bottomOffsets: newBottomOffsets,
    });
  }

  checkHeights() {
    const { currentChats, heights } = this.state;

    const newHeights = {};
    let heightsUpdated = false;

    for (const id of Object.keys(this.ChatsRefs)) {
      const ref = this.ChatsRefs[id];

      if (ref.current) {
        const Chat = currentChats.find(Chat => Chat.id === Number(id));
        const height = Chat.isHiding ? 0 : ref.current.clientHeight;

        newHeights[id] = height;

        if (heights[id] === undefined || heights[id] !== height) {
          heightsUpdated = true;
        }
      }
    }

    if (heightsUpdated) {
      this.calcOffsets(newHeights);
    }
  }

  // startChatHideTimeout(id) {
  //   const timeoutId = setTimeout(() => {
  //     this.startChatsHiding(id);
  //   }, HIDE_TIMEOUT);
  //
  //   this.hideTimeouts.push(timeoutId);
  // }

  renderChats() {
    const { renderChat, anchor } = this.props;
    const { currentChats, bottomOffsets } = this.state;

    const isRight = anchor === 'right';

    return currentChats.map(({ id, type, user, renderer, isHiding }) => {
      const bottomOffset = bottomOffsets[id];
      const isOffsetCalculated = bottomOffset !== undefined;

      const render = renderer || renderChat;

      return (
        <ChatContainer
          key={id}
          ref={this.ChatsRefs[id]}
          isInvisible={!isOffsetCalculated}
          isRight={isRight}
          bottomOffset={bottomOffset}
        >
          <ChatWrapper isRight={isRight} isAppearing={isOffsetCalculated} isHiding={isHiding}>
            {render ? (
              render({ type, user, onClose: () => this.onCloseClick(id) })
            ) : (
              <Chat user={user} type={type} onCloseClick={() => this.onCloseClick(id)}>{user.username}</Chat>
            )}
          </ChatWrapper>
        </ChatContainer>
      );
    });
  }

  render() {
    const { className } = this.props;

    return (
      <Wrapper className={className} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onLeave}>
        {this.renderChats()}
      </Wrapper>
    );
  }
}
