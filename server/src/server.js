import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import { db } from './database.js';
import { constants } from 'buffer';
import jwt from 'jsonwebtoken';


const sourceLinks = {
  'IMPULS': 'https://vk.com/impulse131',
  'HSE': 'https://vk.com/hseolymp',
  'BMSTU': 'https://vk.com/olymp_bmstu',
  "INNOPOLIS": "https://vk.com/innopolisu",
  "BMSTU_APPLY": 'https://vk.com/ab_bmstu1830',
  "SPECIAL": "https://vk.com/club224926448",
  "DISTOLYMP": "https://vk.com/distolymp",
  "LOMONOSOV_OLYMP_CHEMISTRY": "https://vk.com/chemistry_olymp_lomonosov",
  "OLYMP_SPBU": "https://vk.com/olympspbu",
  "INNOPOLIS_OPEN_IS": "https://vk.com/iuiso",
  "OLYMP_GAZPROM": "https://vk.com/olymp_gazprom",
  "OLYMP_NTI": "https://vk.com/nticontest",
  "ABOUT_PROJECT": "https://vk.com/club225033050",
};

const sourceKeys = {
  'Импульс': 'IMPULS',
  'ВШЭ': 'HSE',
  'ШВБ МГТУ': 'BMSTU',
  'МГТУ': 'BMSTU_APPLY',
  "Иннополис": "INNOPOLIS",
  "Спец.": "SPECIAL",
  "Онлайн олимп. физ.": "DISTOLYMP",
  "Олимп. Ломоносов химия": "LOMONOSOV_OLYMP_CHEMISTRY",
  "Олимп. СПбГУ": "OLYMP_SPBU",
  "Иннополис Open ИБ": "INNOPOLIS_OPEN_IS",
  "Олимп. газпром": "OLYMP_GAZPROM",
  "Олимп. НТИ": "OLYMP_NTI",
  "О проекте": "ABOUT_PROJECT",
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
      }]).onConflict(['token', 'source_key']).merge().returning('id');

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
  
  try {
    let result = {
      data: await 
      db.select('posts.*', 'sources.logo_src')
      .column(db.raw('array_agg(images.src) as images'))
      .from('posts')
      .leftJoin('sources', function () {
        this.on('posts.sourceKey', '=', 'sources.key');
      })
      .leftJoin('images', function () {
        this.on('posts.key', '=', 'images.postKey')
          .andOn('posts.sourceKey', '=', 'images.srcKey');
      })
      .where('posts.text', 'ilike', `%${requestData?.filters?.context || ''}%`)
      .whereIn('posts.sourceKey', requestData.filters.selectedSourceKeys)
      .orderBy(...sortedBy[requestData.filters.sortedBy])
      .orderBy('posts.createdAt', 'desc')
      .orderBy('posts.id', 'desc')
      .groupBy('posts.key', 'posts.id', 'sources.logo_src')
      .offset(requestData.offset)
      .limit(Math.max(0, (requestData?.filters?.currentPost || 0 - requestData.offset)) + 10),
    };

    result.data.forEach(obj => obj.sourceLink = sourceLinks[obj.sourceKey]);

    await Promise.all(result.data.map(async post => {
      post.likesCount = (await db('likes')
      .count('* as likesCount')
      .where('postId', post.id))[0].likesCount;

      post.isLiked = (await db('likes')
      .count('* as isLiked')
      .where('postId', post.id)
      .where('userId', requestData.userId))[0].isLiked;
    }));

    result.time = (new Date().getTime()) - stTime,
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
      data: (await db('users').select('*').where('token', req.body.token))[0] || {},
      time: (new Date().getTime()) - stTime
    };

    result.data.logoSrc = (await db('sources').select('logo_src').where('key', 'IMPULS'))[0].logoSrc;
    res.send(JSON.stringify(result));
  } catch(e){
    console.log(e);
    res.send(JSON.stringify({time: (new Date().getTime()) - stTime, data: {}}));
  }
});

app.post('/api/setLike', async (req, res) => {
  const stTime = new Date().getTime();
  try{
    let result = {
      data: await (async () => {
        if (!req.body.userId) {
          return 'User is not authorized';
        }

        if ((await db('users').where({
          id: req.body.userId
        })).length === 0) {
          return 'User is not exist';
        }

        if (req.body.isLiked) {
          if ((await db('likes').where({
            userId: req.body.userId,
            postId: req.body.postId,
          })).length > 0) {
            return 'Like already added';
          }

          await db('likes').insert({
            userId: req.body.userId,
            postId: req.body.postId,
            createdAt: new Date()
          });

          return 'Added';
        } else {
          await db('likes').delete()
          .where({
            userId: req.body.userId,
            postId: req.body.postId,
          });

          return 'Deleted';
        }
      })(),
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
    await db('posts').where('id', requestData.postId).increment('views', 1);
    let result = {
      data: (await 
      db.select('posts.*', 'sources.logo_src')
      .column(db.raw('array_agg(images.src) as images'))
      .from('posts')
      .leftJoin('images', function () {
        this.on('posts.key', '=', 'images.postKey')
          .andOn('posts.sourceKey', '=', 'images.srcKey');
      })
      .leftJoin('sources', function () {
        this.on('posts.sourceKey', '=', 'sources.key');
      })
      .groupBy('posts.key', 'posts.id', 'sources.logo_src').where('posts.id', requestData.postId))[0],
    };

    result.data.sourceLink = sourceLinks[result.data.sourceKey];

    
    result.data.likesCount = (await db('likes')
      .count('* as likesCount')
      .where('postId', result.data.id))[0].likesCount;

    result.data.isLiked = (await db('likes')
    .count('* as isLiked')
    .where('postId', result.data.id)
    .where('userId', requestData.userId))[0].isLiked;

    result.time = (new Date().getTime()) - stTime,

    console.log(result);

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
const port = 8081;
const server = app.listen(port, () => {
  const address = server.address();
  console.log(`Сервер запущен на порту ${address.port}`);
});