/**
 * CleverScript stub — div[data-relay-park-native=fb-chat-app].
 */
import React from 'react'

export default function ChatApp(props) {
  const p = props || {}
  let channel = 'pt'
  if (p.channel !== null && p.channel !== undefined && ('' + p.channel).length > 0) {
    channel = '' + p.channel
  }
  return (
    <div
      className="fb-chat-app-host"
      data-relay-park-native="fb-chat-app"
      data-channel={channel}
    />
  )
}
