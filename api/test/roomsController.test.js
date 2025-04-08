const request = require('supertest');
const { PrismaClient } = require('@prisma/client');
const { app, server, io } = require('../bin/www');

const prisma = new PrismaClient();

describe('RoomsController', () => {
    beforeAll(async () => {
        // await prisma.rooms.deleteMany(); // Clear existing rooms before tests
    });
    afterAll(async () => {
        console.log("Disconnecting Prisma client...");
        // await prisma.$disconnect(); // Disconnect Prisma client after tests
        console.log("Closed Prisma client.");
        console.log("Active Socket Connections:", io.engine.clientsCount); // Log active socket connections
        console.log("Closing server...");
        await new Promise((resolve) => {
            server.close((err) => {
                if (err) {
                    console.error("Error closing server:", err);
                }
                console.log("Server closed successfully.");
                resolve();
            });
        });
    });

    describe('GET /room/:name', () => {
        it('should return room data when a room with the given name exists', async () => {
            const roomName = 'TestRoom';

            // Create a test room
            await prisma.rooms.create({
                data: {
                    name: roomName,
                },
            });

            const res = await request(app)
                .get(`/room/${roomName}`);

            expect(res.status).toBe(200);
            expect(res.body).toBeInstanceOf(Object);
            expect(res.body.name).toBe(roomName);
        });

        it('should return null when a room with the given name does not exist', async () => {
            const res = await request(app)
                .get('/room/NonExistentRoom');

            expect(res.status).toBe(200);
            expect(res.body).toBeNull();
        });
    });

    describe('POST /room', () => {
        it('should create a new room and return it', async () => {
            const newRoom = { name: 'NewRoom' };
            const res = await request(app)
                .post('/room')
                .send(newRoom);

            expect(res.status).toBe(200);
            expect(res.body).toBeInstanceOf(Object);
            expect(res.body.name).toBeDefined();
            expect(res.body.name.length).toBe(5);
        });
    });
});
