import io from 'socket.io-client';

let socket;

const connectSocket = (userID, token) => {
    socket = io(import.meta.env.VITE_APP_NODE_SERVER_URL, {
        query: {
            token,
            userID,
        },
    });
};

export { socket, connectSocket };
