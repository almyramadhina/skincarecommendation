const express = require('express')
const app = express();
const path = require('path');
const cors = require('cors');
var serveStatic = require('serve-static') //serve static files
const { Pool, Client } = require('pg') //database connection
require('dotenv').config() //buat env

app.use(serveStatic(path.join(__dirname,"/FE"))) //serve static files in FE Folder

const pool = new Pool() //create DB connection from env

app.get('/test', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM skintype')
    await pool.end()
    console.log(result) //erase later
    res.json(result)
  } catch (error) {
    console.log(error)
		res.json({"response-code":404,"message":"not found"})
  }
})

app.get('/', (req, res) => { //home page
  res.sendFile(path.join(__dirname,"/FE/index.html"));
});

port = process.env.PORT
app.use(cors());

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});