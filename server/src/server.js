import express from 'express';

import { fileURLToPath } from 'url';
import path from 'path';
// import { OAuth2Client } from 'google-auth-library';
// import oauth2Client from new OAuth2Client()

import { db } from './database.js';

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

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const staticFilesPath = path.join(__dirname, '../../site', 'dist');
// console.log(staticFilesPath)

// console.log(__dirname, staticFilesPath)

// app.use(express.static(staticFilesPath));
// app.use(cors());

app.get('/', async (req, res) => {
  res.send('1');
});

app.get('/api/', async (req, res) => {
  res.send('2');
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

// Запустите сервер на указанном порту
const port = 81;
const server = app.listen(port, () => {
  const address = server.address();
  console.log(`Сервер запущен на порту ${address.port}`);
});