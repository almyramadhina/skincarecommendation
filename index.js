const express = require('express')
const app = express();
const path = require('path');
const cors = require('cors');
var serveStatic = require('serve-static') //serve static files
const { Pool, Client } = require('pg') //database connection
require('dotenv').config() //buat env

app.use(serveStatic(path.join(__dirname,"/FE"))) //serve static files in FE Folder

const pool = new Pool() //create DB connection from env

/*
  parameterized query
  const text = 'INSERT INTO users(name, email) VALUES($1, $2) RETURNING *'
  const values = ['brianc', 'brian.m.carlson@gmail.com']

  pool.query(text, values)
*/
app.get('/test', async (req, result) => {
  pool.query('SELECT * FROM skintype', (err, res) => {
    if (err){
      throw err
    }
    console.log(res) //erase later
    result.json(res.rows)
  })
  await pool.end()
})

app.get('/', (req, res) => { //home page
  res.sendFile(path.join(__dirname,"/FE/index.html"));
});

port = process.env.PORT
app.use(cors());

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});