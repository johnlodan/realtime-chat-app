import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
const roomRoutes = require('../routes/roomRoutes');
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const sanitizedInputs = require("../middleware/sanitizedInputs");
const {
  socketSanitizerMiddleware,
  withSanitization
} = require('../middleware/sanitizedSocket');

const prisma = new PrismaClient();
const app = express();
const server = http.createServer(app); // Create the server instance

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware and routes setup
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(sanitizedInputs); // sanitized REST
io.use(socketSanitizerMiddleware); // sanitized SOCKET

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later.",
  headers: true,
});
app.use(limiter);
app.set('trust proxy', 1);

app.use('/room', roomRoutes);
app.get('/', (req, res) => {
  res.send('Real-time Chat Server');
});

const typingUsersMap = new Map<string, Set<string>>(); // roomId -> Set of users
const typingTimeoutsMap = new Map<string, Map<string, NodeJS.Timeout>>(); // roomId -> Map<sender, timeout>

io.on('connection', (socket) => {
  // IMPORTANT! The client must emit the 'joinRoom' event with a valid room ID
  // to establish a connection specific to that room. This is essential for ensuring
  // that all subsequent events (like sending messages and receiving updates)
  // are scoped to the correct room. By joining the room, the socket can listen
  // and emit events that only affect users in that room.
  // This setup helps maintain organized communication within the chat application.
  socket.on('joinRoom', (roomId, callback) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
    callback({ success: true, roomId });
  });

  // Fetch messages from the database
  socket.on('getMessages', async ({ roomId }: { roomId: string }) => {
    console.log("getMessages", roomId)

    const messages = await prisma.messages.findMany({
      where: {
        roomId: roomId
      }
    });

    socket.emit(`loadMessages`, messages);
  });

  // Handle new messages
  socket.on('sendMessage', withSanitization(async (messageData: { content: string; sender: string; roomId: string }) => {
    const { content, sender, roomId } = messageData;

    if (content && sender) {
      const message = await prisma.messages.create({
        data: {
          content,
          sender,
          roomId,
        },
      });

      io.emit('newMessage', message);
    } else {
      console.error('Content and sender must be provided.');
    }
  }));

  socket.on('typing', ({ sender, roomId }: { sender: string, roomId: string }) => {
    // Initialize typingUsers and typingTimeouts if they do not exist for the room
    if (!typingUsersMap.has(roomId)) {
      typingUsersMap.set(roomId, new Set());
    }
    if (!typingTimeoutsMap.has(roomId)) {
      typingTimeoutsMap.set(roomId, new Map());
    }

    const typingUsers = typingUsersMap.get(roomId)!;
    const typingTimeouts = typingTimeoutsMap.get(roomId)!;

    // Log the typing event
    typingUsers.add(sender); // Add the sender to the typing users []

    // Emit the current list of typing users to the room
    socket.to(roomId).emit(`userTyping`, Array.from(typingUsers));

    // Clear previous timeout for the sender if it exists
    if (typingTimeouts.has(sender)) {
      clearTimeout(typingTimeouts.get(sender)!);
    }

    // Set a timeout to remove the sender after 1.5 second of inactivity
    const timeout = setTimeout(() => {
      typingUsers.delete(sender); // Remove sender from typing users
      typingTimeouts.delete(sender); // Clear the timeout for the sender

      // Emit the updated list of typing users to the room
      socket.to(roomId).emit(`userTyping`, Array.from(typingUsers));
    }, 1500);

    typingTimeouts.set(sender, timeout); // Store the timeout for the sender
  });

  socket.on('disconnect', () => {
    // Remove the user from typing if they disconnect
    typingUsersMap.forEach((users, roomId) => {
      if (users.has(socket.id)) {
        users.delete(socket.id); // Remove user from Set
        // Emit updated typing users to the room
        socket.to(roomId).emit(`userTyping.${roomId}`, Array.from(users));
      }
    });
  });
});

// Start the server on port 8001
const PORT = 8001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { app, server, io };