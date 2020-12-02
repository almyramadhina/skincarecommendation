const express = require('express')
const app = express();
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
var serveStatic = require('serve-static') //serve static files
var Promise = require('promise')
const { Pool, Client } = require('pg'); //database connection
const { query } = require('express');
const { read } = require('fs');
require('dotenv').config() //buat env

app.use(bodyParser.json());
app.use(cors());

app.use(serveStatic(path.join(__dirname,"/FE"))) //serve static files in FE Folder

function recommend(data){
  return new Promise((resolve,reject) => {
    if ((typeof data.umur == 'undefined' && data.umur == null) || (typeof data.hargabawah == 'undefined' && data.hargabawah == null) || (typeof data.hargaatas == 'undefined' && data.hargaatas == null) || !data.kategori || !data.skinprob || !data.skintype){
      reject(new Error("Request Variable Not Complete"))
    } else {
      if (!data.umur || (typeof data.umur != 'boolean')){ //if umur == false atau bukan boolean
        reject(new Error("Forbidden"))
      } else {
        var querytext, values
        if (!data.alergi1){ //tidak ada alergi
          if (data.alergi2){
            reject(new Error("Invalid Alergies"))
            return
          } else {
            querytext='SELECT DISTINCT p.id_produk, namaproduk, kategori, harga, images FROM produk p, profprod pp\n\
            WHERE harga>$1 AND harga<=$2 AND kategori = $3 AND p.id_produk = pp.id_produk AND id_profil IN\n\
            (SELECT id_profil FROM profile p\n\
            INNER JOIN skinproblem sp ON sp.id_skinprob=p.id_skinprob\n\
            INNER JOIN skintype st ON st.id_skintype=p.id_skintype\n\
            WHERE sp.skinprob=$4 AND st.skintype=$5)'
            values=[data.hargabawah, data.hargaatas, data.kategori, data.skinprob, data.skintype]
          }
        } else {
          if (!data.alergi2){ //ada 1 alergi
            querytext='SELECT DISTINCT p.id_produk, namaproduk, kategori, harga, images FROM produk p, profprod pp, produk_bahan pb\n\
            WHERE harga>$1 AND harga<=$2 AND kategori = $3 AND p.id_produk = pp.id_produk AND id_profil IN\n\
            (SELECT id_profil FROM profile p\n\
            INNER JOIN skinproblem sp ON sp.id_skinprob=p.id_skinprob\n\
            INNER JOIN skintype st ON st.id_skintype=p.id_skintype\n\
            WHERE sp.skinprob=$4 AND st.skintype=$5) AND\n\
            p.id_produk = pb.id_produk AND pb.id_produk NOT IN\n\
            (SELECT pb.id_produk FROM bahan b, produk_bahan pb\n\
            WHERE namabahan = $6 AND b.id_bahan = pb.id_bahan)'
            values=[data.hargabawah, data.hargaatas, data.kategori, data.skinprob, data.skintype, data.alergi1]
          } else { //ada 2 alergi
            querytext='SELECT DISTINCT p.id_produk, namaproduk, kategori, harga, images FROM produk p, profprod pp, produk_bahan pb\n\
            WHERE harga>$1 AND harga<=$2 AND kategori = $3 AND p.id_produk = pp.id_produk AND id_profil IN\n\
            (SELECT id_profil FROM profile p\n\
            INNER JOIN skinproblem sp ON sp.id_skinprob=p.id_skinprob\n\
            INNER JOIN skintype st ON st.id_skintype=p.id_skintype\n\
            WHERE sp.skinprob=$4 AND st.skintype=$5) AND\n\
            p.id_produk = pb.id_produk AND pb.id_produk NOT IN\n\
            (SELECT pb.id_produk FROM bahan b, produk_bahan pb\n\
            WHERE (namabahan = $6 OR namabahan = $7) AND b.id_bahan = pb.id_bahan)'
            values=[data.hargabawah, data.hargaatas, data.kategori, data.skinprob, data.skintype, data.alergi1, data.alergi2]
          }
        }
    
        const pool = new Pool() //create a DB connection
    
        pool.query(querytext,values).then(result => {
          resolve({"response-code":200,"message":"OK", "data":result.rows})
        }).catch(err =>{
          console.log(err)
          reject(new Error("Internal server error"))
        })
        pool.end()
      }
    }
  })
}

app.post('/recommend', async (req, res) => {
  await recommend(req.body).then(result =>{
    res.json(result)
  })
  .catch(err => {
    console.log(err)
    res.json({"response-code":500, "message":err.message.toString()})
  })
})

app.get('/', async (req, res) => { //home page
  res.sendFile(path.join(__dirname,"/FE/index.html"));
});

port = process.env.PORT

app.listen(port, () => {
  console.log(`App listening on port ${port}!`)
});