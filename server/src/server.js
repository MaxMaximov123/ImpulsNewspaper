import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import { db } from './database.js';
import { constants } from 'buffer';
import jwt from 'jsonwebtoken';

const sourceKeys = {
  'Импульс': 'IMPULS',
  'ВШЭ': 'HSE',
  'МГТУ': 'BMSTU',
  "Иннополис": "INNOPOLIS",
};

const sortedBy = {
  'Сначала новые': ['posts.createdAt', 'desc'], 
  'Сначала старые': ['posts.createdAt', 'asc'],
  'Сначала популярные': ['posts.views','desc'],
  'Сначала непопулярные': ['posts.views', 'asc'],
}

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Замените * на адрес вашего сайта, если нужно ограничить доступ
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(cors());



app.post('/api/auth', async (req, res) => {
  const stTime = new Date().getTime();
  const requestData = req.body;
  console.log(requestData);
  if (requestData.key === 'yandex') {
    try {
      let clientId = '34a4fadda62f45a694dd6f6d20e144a6';
      let clientSecret = '9e4eaa5263b84d38ad1c854774588ec1';
      let authorizationHeader = `Basic ${btoa(`${clientId}:${clientSecret}`)}`;

      let requestBody = new URLSearchParams({
        grant_type: 'authorization_code',
        code: requestData.code
      });

      let tokenObject = await ((await fetch('https://oauth.yandex.ru/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': authorizationHeader,
        },
        body: requestBody,
      })).json());

      let userData = await (
        await fetch(`https://login.yandex.ru/info?format=json`, {
          method: 'GET',
          headers: {
            'Authorization': `OAuth ${tokenObject.access_token}`,
          },
        }
        )
      ).json();

      console.log({
        local_id: userData.id,
        client_id: userData.client_id,
        key: userData.psuid,
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.default_email,
        avatar_id: userData.default_avatar_id,
        phone_number: userData.default_phone.number,
        source_key: 'YANDEX',
        created_at: new Date(),
      });
      
      let userId = await db('users').insert([{
        local_id: userData.id,
        client_id: userData.client_id,
        token: userData.psuid,
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.default_email,
        avatar_id: userData.default_avatar_id,
        phone_number: userData.default_phone.number,
        source_key: 'YANDEX',
        created_at: new Date(),
      }]).onConflict(['client_id', 'source_key']).merge().returning('id');

      console.log(userId);

      res.cookie('user', 'john_doe', { maxAge: 900000, httpOnly: true });
      res.send(JSON.stringify({
        time: (new Date().getTime()) - stTime,
        data: {
          token: userData.psuid,
        }
      }));
    } catch(e) {
      res.send(JSON.stringify({
        time: (new Date().getTime()) - stTime,
        data: {}
      }));
      console.log(e);
    }
  }
});

app.post('/api/posts', async (req, res) => {
  const stTime = new Date().getTime();
  const requestData = req.body;

  requestData.filters.selectedSourceKeys = requestData.filters.selectedSourceKeys.map(
    sourceKey => sourceKeys[sourceKey]
  );
  
  try{
    let result = {
      data: await db.select('posts.*').column(db.raw('array_agg(images.src) as images'))
      .from('posts')
      .leftJoin('images', 'posts.key', 'images.postKey')
      .where('posts.text', 'ilike', `%${requestData?.filters?.context || ''}%`)
      .whereIn('posts.sourceKey', requestData.filters.selectedSourceKeys)
      .orderBy(...sortedBy[requestData.filters.sortedBy])
      .orderBy('posts.createdAt', 'desc')
      .groupBy('posts.key', 'posts.id').offset(requestData.offset).limit(10),
      time: (new Date().getTime()) - stTime,};
    res.send(JSON.stringify(result));
  } catch(e){
    console.log(e);
    res.send(JSON.stringify({time: (new Date().getTime()) - stTime, data: []}));
  }
});

app.post('/api/user', async (req, res) => {
  const stTime = new Date().getTime();
  console.log(req.body);
  try{
    let result = {
      data: (await db('users').select('*').where('token', req.body.token))[0],
      time: (new Date().getTime()) - stTime
    };
    res.send(JSON.stringify(result));
  } catch(e){
    console.log(e);
    res.send(JSON.stringify({time: (new Date().getTime()) - stTime, data: {}}));
  }
});

app.post('/api/post', async (req, res) => {
  const stTime = new Date().getTime();
  const requestData = req.body;
  
  try{
    await db('posts').where('key', requestData.postKey).increment('views', 1);
    let result = {
      data: (await 
      db.select('posts.*')
      .column(db.raw('array_agg(images.src) as images'))
      .from('posts')
      .leftJoin('images', 'posts.key', 'images.postKey')
      .groupBy('posts.key', 'posts.id').where('posts.key', requestData.postKey))[0],
      time: (new Date().getTime()) - stTime,};
    res.send(JSON.stringify(result));
  } catch(e){
    console.log(e);
    res.send(JSON.stringify({time: (new Date().getTime()) - stTime, data: []}));
  }
});

function postRequest(url, data) {
  return new Promise((resolve, reject) => {
  const options = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify(data)
  };
  
  fetch(url, options)
  .then(response => response.json())
  .then(result => {
      resolve(result);
  })
  .catch(error => {
      reject(error);
  });
  })
}

// Запустите сервер на указанном порту
const port = 81;
const server = app.listen(port, () => {
  const address = server.address();
  console.log(`Сервер запущен на порту ${address.port}`);
});