$(() => {
  const socket = io();

  socket.on('connect', () => {
    console.log('Connected to server!');
  });

  socket.on('new-message', (message) => {
    console.log('New Message Received', message);

    $('.messages ul').append(`<li>${message}</li>`);
  });

  $('#form').on('submit', (e) => {
    e.preventDefault();

    const message = $('#message').val();

    if (!message) {
      return false;
    }

    $('#message').val('');
    $('.messages ul').append(`<li class='me'>${message}</li>`);
    socket.emit('new-message', message);
  });
});
