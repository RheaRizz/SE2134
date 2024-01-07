
import bcrypt from 'bcrypt';
import bodyParser from 'body-parser';
import express from 'express';
import * as jwt from 'jsonwebtoken';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: 'postgres://postgres:1234@localhost:5433/SE2134',
});

async function startServer() {
  const app = express();
  const connection = await pool.connect();

  app
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .post('/register', async (request, response) => {
      const { email, password } = request.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const { rows } = await connection.query(
        'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
        [email, hashedPassword],
      );
      response.json({ createdUser: rows[0] });
    })
    .post('/login', async (request, response) => {
      const { email, password } = request.body;
      const { rows } = await connection.query(
        'SELECT * FROM users WHERE email = $1',
        [email],
      );

      if (rows.length === 0) {
        response
          .status(401)
          .json({ message: 'Email or password is incorrect' });
      } else {
        const correctPassword = await bcrypt.compare(
          password,
          rows[0].password,
        );
        if (correctPassword) {
          const token = jwt.sign(
            { userId: rows[0].id, email: rows[0].email },
            'secret', // don't expose this secret
            {
              expiresIn: '1h',
            },
          );
          response.json({ token });
        } else {
          response
            .status(401)
            .json({ message: 'Email or password is incorrect' });
        }
      }
    })
    .get('/me', async (request, response) => {
      const authHeader = request.header('Authorization');
      const token = authHeader?.split(' ')[1]; 

      if (!token) {
        response.status(401).json({ message: 'Not authenticated' });
        return;
      }

      try {
        const claims = jwt.verify(token, 'secret');
        const { userId } = claims as any;
        const { rows } = await connection.query(
          'SELECT id, email, presidentialBet FROM users WHERE id = $1',
          [userId],
        );
        response.json({ me: rows[0] });
      } catch (error) {
        response.status(401).json({ message: 'Not authenticated' });
      }
    })
    .get('/channels', async (request, response) => {
      const result = await connection.query(
        'SELECT * FROM channels ORDER BY name',
      );
      response.json(result.rows);
    })
    .get('/messages/:channelName', async (request, response) => {
      const result = await connection.query(
        /* sql */ `
        select messages.* from messages 
        inner join channels on messages.channel_id = channels.id 
        where name = $1
      `,
        [request.params.channelName],
      );
      console.log('DB results', result.rows);
      response.json(result.rows);
    })

    .use(express.static('public'))
    .listen(3000, () => {
      console.log('Server has started at http://localhost:3000');
    });
}

startServer();