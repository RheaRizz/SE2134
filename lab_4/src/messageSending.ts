import express, { Request, Response } from 'express';
import { Pool } from 'pg';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const pool = new Pool({
  user: 'postres',
  host: 'localhost',
  database: 'SE2134',
  password: '1234',
  port: 5433,
});

// POST endpoint to send messages
app.post('/send-message', async (req: Request, res: Response) => {
  try {
    const { content, animalIdentity, colorIdentity } = req.body;

    const sendMessageQuery = `
      INSERT INTO messages (content, animal_identity, color_identity)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;

    const values = [content, animalIdentity, colorIdentity];
    const result = await pool.query(sendMessageQuery, values);

    res.status(201).json({ message: 'Message sent successfully', data: result.rows[0] });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
