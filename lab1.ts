// Why does readFileSync won't work on a web app with tons of users?

// - The readFileSync is a synchronous function that reads files in Node.js. 
// - Synchronous operations actually block code executions until they are completed. 
// - In a web app with a lot of users, synchronous operations might lead to problems because it blocks the execution thread. 
// - This leads to performance malfunctions and issues also increased response times. 
// - As a result, using readFileSync in a web app with a ton of users will cause delays and reduce the app's responsiveness.
 
//Three solutions are shown below:


import * as fs from 'fs'

import * as readline from 'readline'

const file = 'debts.txt'


function addDebtUsingCallback(name: string, amount: number, callback: (err: NodeJS.ErrnoException | null) => void) {

  fs.appendFile(file, `${name}: $${amount}\n`, callback)

}

function addDebtUsingPromise(name: string, amount: number): Promise<void> {

  return new Promise((resolve, reject) => {

    fs.appendFile(file, `${name}: $${amount}\n`, (err) => {

      if (err) {

        reject(err)

      } else {

        resolve()

      }

    })

  })

}


async function addDebtUsingAsyncAwait(name: string, amount: number) {

  try {

    await fs.promises.appendFile(file, `${name}: $${amount}\n`)

    console.log('Debt added using Async/Await.')

  } catch (err) {

    console.error('Error adding debt:', err)

  }

}


function listDebts() {

  const readStream = fs.createReadStream(file)

  const rl = readline.createInterface({

    input: readStream,
    output: process.stdout,
    terminal: false,

  })

  console.log('Listing debts:')

  rl.on('line', (line) => {

    console.log(line)

  })

}



// Test

addDebtUsingCallback('Lois Alonsagay', 100000, (err) => {

  if (err) {

    console.error('Error adding debt:', err)

  } else {

    console.log('Debt added using callback.')
    listDebts();

  }
});

addDebtUsingPromise('Jala Lisa', 763763)
  .then(() => {

    console.log('Debt added using Promise.')

    listDebts()

})

  .catch((err) => {

    console.error('Error adding debt:', err)

})

addDebtUsingAsyncAwait('Maria Clara', 989787)

