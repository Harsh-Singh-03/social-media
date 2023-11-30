// var Pusher = require("pusher");

import PusherServer from 'pusher'
import PusherClient from 'pusher-js'

export const pusherServer = new PusherServer({
  appId: `${process.env.CHAT_APP_ID}`,
  key: `${process.env.CHAT_KEY}`,
  secret: `${process.env.CHAT_SECRET}`,
  cluster: `${process.env.CHAT_CLUSTER}`,
  useTLS: true
});

export const pusherClient = new PusherClient("4a2fb5109938d987e2e9",{
    cluster: "ap2"
})
// pusher.trigger("my-channel", "my-event", { message: "hello world" });