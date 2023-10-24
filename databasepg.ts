

// import { Client } from 'pg';

// const client = new Client({

//     host: "localhost",
//     user: "postgres",
//     port: 5433,
//     password: "1234",
//     database: "SE2134"
// });

// client.connect();

// client.query(`Select * from loan`, (err, res) => {

//     if (!err) {
//         console.log(res.rows);
//     } else {
//         console.log(err.message);
//     }
//     client.end(); // Note: You should call the `end` method as a function, like this.
// });

import * as http from 'http';
import { Pool, PoolClient } from 'pg';
import * as fs from 'fs';
import { URLSearchParams } from 'url';

// Create a PostgreSQL database connection pool
const pool = new Pool({

  user: 'postgres',
  host: 'localhost',
  database: 'SE2134',
  password: '1234',
  port: 5433

});

async function handleRequest(request: http.IncomingMessage, response: http.ServerResponse) {
  const url = request.url;
  const method = request.method;

  if (url === '/apply-loan-success') {
    fs.readFile('lab2-2.html', (err, data) => {
      if (err) {
        response.writeHead(500, { 'Content-Type': 'text/plain' });
        response.end('Internal Server Error');
      } else {
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(data);
      }
    });
  } else if (url === '/apply-loan-success' && method === 'POST') {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk.toString();
    });

    request.on('end', async () => {
      try {
        const formData = new URLSearchParams(body);
        const name = formData.get('name');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const loan_amount = formData.get('loan_amount');
        const reason = formData.get('reason');
        const status = formData.get('status');
        

        const insertQuery = `
          INSERT INTO loan (name, email, phone, loan_amount, purpose, status)
          VALUES ($1, $2, $3, $4, $5, 'APPLIED')
          RETURNING id`;
        const values = [name, email, phone, loan_amount, reason, status];

        try {
          const client: PoolClient = await pool.connect();
          try {
            const result = await client.query(insertQuery, values);
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.end(`Loan application submitted successfully. Your Loan ID is: ${result.rows[0].id}`);
          } finally {
            client.release();
          }
        } catch (error) {
          console.error('Error executing SQL query:', error);
          response.writeHead(500, { 'Content-Type': 'text/plain' });
          response.end('Internal Server Error');
        }
      } catch (error) {
        console.error('Error parsing form data:', error);
        response.writeHead(400, { 'Content-Type': 'text/plain' });
        response.end('Bad Request');
      }
    });
  }
}

const server = http.createServer(handleRequest);

server.listen(3000, () => {
  console.log('Server started at http://localhost:3000');
});
