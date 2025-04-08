import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const generateRandomName = (len: number) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let username = '';
  for (let i = 0; i < len; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    username += characters[randomIndex];
  }
  return username;
};

const RoomsController = {
  findByName: async (req: any, res: any) => {
    try {
      const name = req.params.name
      const roomData = await prisma.rooms.findFirst({
        where: {
          name: name
        }
      })
      res.json(roomData)
    } catch (err: any) {
      res.status(400).json({ message: "An error has occurred.", error: err?.toString() })
    }
  },

  create: async (req: any, res: any) => {
    try {
      const roomName = await prisma.rooms.create({
        data: {
          name: generateRandomName(5),
        },
      });
      res.json(roomName)
    } catch (err: any) {
      res.status(400).json({ message: "An error has occurred.", error: err?.toString() })
    }
  },
}

export default RoomsController
