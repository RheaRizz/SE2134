

import express from 'express';
import { Pool, QueryResult } from 'pg'

const app = express();
const PORT = process.env.PORT || 3000

app.use(express.json());

const pool = new Pool({
  user: 'postres',
  host: 'localhost',
  database: 'SE2134',
  password: '1234',
  port: 5433,
})

const checkChannelsTable = `
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_name = 'lab4'
  );
`;

pool.query(checkChannelsTable)
  .then(result => {
    const tableExists = result.rows[0]?.exists;

    if (!tableExists) {

      console.log('Lab4 table does not exist')
      
    } else {

      console.log('Lab4 table already exists')
      
    }
  })
  .catch(error => {

    console.error('Error checking lab4 table:', error)
   
  });

app.get('/channels', async (req: express.Request, res: express.Response) => {

  try {
    const query = 'SELECT * FROM lab4 ORDER BY name'; 
    const channels: QueryResult = await pool.query(query);
    res.json(channels.rows)

  } catch (error) {

    console.error('Error fetching channels:', error);
    res.status(500).json({ error: 'Failed to fetch channels' })

  }

})

app.listen(PORT, () => {

  console.log(`Server is running on port ${PORT}`)

})


