import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import { db } from './database.js';
import passport from 'passport';
import expressSession from 'express-session';

import GoogleStrategy from 'passport-google-oauth20';

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

app.use(expressSession({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());

passport.use(new GoogleStrategy({
  clientID: '286378377685-dmbah97qnjji3m0i5r485meevoci4egt.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: 'http://localhost:81/auth/google/callback',
},
(accessToken, refreshToken, profile, done) => {
  console.log(accessToken, refreshToken, profile, done);
  // По желанию: обработка данных профиля, сохранение пользователя в базе данных и т.д.
  return done(null, profile);
}));

// Сериализация и десериализация пользователя
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Маршрут для начала аутентификации через Google
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Обработка колбэка аутентификации от Google
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Пользователь успешно аутентифицирован, выполните необходимые действия
    // res.redirect('/');
  }
);

// Маршрут для выхода
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// Маршрут для проверки статуса аутентификации
app.get('/api/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: 'Unauthorized' });
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