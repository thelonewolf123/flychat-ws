'use strict'
var socket = null;
var name = null;

function generateName() {
  const adjectives = ['Happy', 'Clever', 'Swift', 'Bright', 'Kind', 'Brave'];
  const nouns = ['Penguin', 'Dolphin', 'Fox', 'Owl', 'Lion', 'Eagle'];
  const randomNum = Math.floor(Math.random() * 1000);
  return `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}${randomNum}`;
}

function connect() {
  var serverUrl;
  var scheme = 'ws';
  var location = document.location;

  if (location.protocol === 'https:') {
    scheme += 's';
  }

  serverUrl = `${scheme}://${location.hostname}:${location.port}`;
  socket = new WebSocket(serverUrl, 'json');

  // Generate and set name when connecting
  name = generateName();
  $('#n').val(name);
  $('#n').prop('disabled', true);
  $('#n').css('background', 'grey');
  $('#n').css('color', 'white');

  socket.onmessage = event => {
    const msg = JSON.parse(event.data);
    const latency = Date.now() - msg.timestamp;
    $('#messages').append($('<li>').text(
      `${msg.name}: ${msg.message} (latency: ${latency}ms)`
    ));
    window.scrollTo(0, document.body.scrollHeight);
  }
  $('form').submit(sendMessage);
}

function sendMessage() {
  if (name == '') {
    return;
  }
  const msg = {
    type: 'message',
    name: name,
    message: $('#m').val(),
    timestamp: Date.now()
  };
  socket.send(JSON.stringify(msg));
  $('#m').val('');
  return false;
}
