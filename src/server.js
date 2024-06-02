import express from 'express';
import pino from 'pino-http';
import env from './utils/env.js';
import cors from 'cors';
import mongoose from 'mongoose';

import { getAllContacts, getContactById } from './services/contacts.js';

const PORT = Number(env('PORT', 3000));
const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use((err, req, res, next) => {
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });

  app.get('/contacts', async (req, res) => {
    const students = await getAllContacts();
    res.status(200).json({
      data: students,
      message: 'Successfully found contacts!',
    });
  });

  app.get('/contacts/:contactId', async (req, res) => {
    const { contactId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return res.status(404).json({
        message: `Contact with id ${contactId} not found`,
      });
    }
    const contact = await getContactById(contactId);

    if (!contact) {
      return res.status(404).json({
        message: `Contact with id ${contactId} not found`,
      });
    }
    res.status(200).json({
      data: contact,
      message: `Successfully found contact with id ${contactId}!`,
    });
  });

  app.get('*', (req, res) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

  app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
  });
};

export default setupServer;
