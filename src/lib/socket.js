import io from 'socket.io-client';

let socket;

const connectSocket = (userID, token) => {
    socket = io(import.meta.env.VITE_APP_SERVER_DOMAIN, {
        query: {
            token,
            userID,
        },
    });
};

export { socket, connectSocket };
