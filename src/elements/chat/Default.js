import React, { useState } from 'react'
import useAxios from 'axios-hooks'

import { Button, Popover, OverlayTrigger } from 'react-bootstrap'

import { Chat, Channel, Thread, Window } from 'stream-chat-react'
import { MessageList, MessageInput } from 'stream-chat-react'
import { StreamChat } from 'stream-chat'

import 'stream-chat-react/dist/css/index.css'

export default (props) => {
  const [popoverOpen, setPopoverOpen] = useState(false)
  const toggle = () => setPopoverOpen(!popoverOpen)

  const chatClient = new StreamChat('vu32ju9ntg49')
  const [{ data, loading, error }] = useAxios('users/me')

  if (loading || error) {
    return <div className=""></div>
  }

  chatClient.setUser(
    {
      id: '' + data.id,
      name: data.email,
    },
    data.token
  )

  const channel = chatClient.channel('commerce', 'hque', {
    // add as many custom fields as you'd like
    // image: 'https://cdn.chrisshort.net/testing-certificate-chains-in-go/GOPHER_MIC_DROP.png',
    // name: 'Stel je vraag',
  })

  const popover = (
    <Popover
      placement="bottom"
      isOpen={popoverOpen}
      toggle={toggle}
      className="m-0 p-0 w-50"
    >
      <Popover.Content className="w-100">
        <Chat client={chatClient} theme={'commerce light h-25 w-100 m-0 p-0'}>
          <Channel channel={channel}>
            <Window>
              <MessageList />
              <MessageInput />
            </Window>
            <Thread />
          </Channel>
        </Chat>
      </Popover.Content>
    </Popover>
  )

  return (
    <div className="">
      <OverlayTrigger trigger="click" placement="top" overlay={popover}>
        <Button variant="success">Stel direct je vraag</Button>
      </OverlayTrigger>
    </div>
  )
}
