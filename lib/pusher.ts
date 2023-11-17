// var Pusher = require("pusher");

import PusherServer from 'pusher'
import PusherClient from 'pusher-js'

export const pusherServer = new PusherServer({
  appId: "1688548",
  key: "4a2fb5109938d987e2e9",
  secret: "265270d7aef447123fba",
  cluster: "ap2",
  useTLS: true
});

export const pusherClient = new PusherClient("4a2fb5109938d987e2e9",{
    cluster: "ap2"
})
// pusher.trigger("my-channel", "my-event", { message: "hello world" });