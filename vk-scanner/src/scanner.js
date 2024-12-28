import puppeteer from 'puppeteer';
import { db } from './database.js';
import config from './config.js';

export default class Scanner {
  postKeys = [];
  browser = null;
  page = null;
  totalHeight = 0;
  isScanning = true;

  constructor({ restartTime }) {
    this.restartTime = restartTime;
    this.start().catch((error) => {
      console.log(error);
    });
  }

  async waitForTimeout(time) {
    await new Promise((resolve) => setTimeout(resolve, time));
  }

  async scanning() {
    let scrollStep = 5000;
    while (true) {
      let sourceLogo = await this.page.$('.vkuiImageBase__img');

      await db('sources').insert({
        key: config.sourceKey,
        logoSrc: await sourceLogo.evaluate(element => element.src)
      }).onConflict(['key']).merge();

      while (this.isScanning) {
        await this.page.evaluate(scrollStep => {
          window.scrollBy(0, scrollStep);
        }, scrollStep);

        let postElements = await this.page.$$('.wall_item');
        let newPosts = [];

        await this.waitForTimeout(10000);

        for (let postElement of postElements) {
          let post = {
            text: null,
            images: [],
            createdAt: null,
          };

          try {
            if (!postElement) continue;
            post.key = Number((await postElement.evaluate(el => el.id)).split('_')[1]);

            if (this.postKeys.includes(post.key)) continue;

            let wiHead = await postElement.$('.wi_head');
            let postHeaderContentWrapper = await wiHead.$('.PostHeader__contentWrapper');
            let postHeaderInfoWrapper = await postHeaderContentWrapper.$('.PostHeader__infoWrapper');
            let PostHeaderInfo = await postHeaderInfoWrapper.$('.PostHeader__info');
            let postHeaderTime = await PostHeaderInfo.$('.PostHeaderTime');



            let postDate = await postHeaderTime.evaluate(element => {
              let currentYear = new Date().getFullYear();
              let currentMonth = new Date().getMonth();
              let today = new Date().getDay();
              const MONTH_NAMES = {
                'янв': 0, 'фев': 1, 'мар': 2, 'апр': 3, 'мая': 4, 'июн': 5,
                'июл': 6, 'авг': 7, 'сен': 8, 'окт': 9, 'ноя': 10, 'дек': 11
              };

              let dateString = element ? element.textContent.replace(/\s+в\s+\d+:\d+/, '') : '';

              if (!/\d\d\d\d/.test(dateString)) {
                dateString += ` ${MONTH_NAMES[dateString.split(/\s+/)[1]] <= currentMonth ? currentYear : currentYear - 1}`;
              }
              
              let parts = dateString.split(/\s+/);
              if (dateString.includes('сегодня')) {
                return new Date().toString();
              } else if (dateString.includes('вчера')) {
                return new Date().getTime() - 1000 * 60 * 60 * 24;
              } else if (/.*часа назад.*/.test(dateString)) {
                return new Date().toString();
              } else if (/.*часов назад.*/.test(dateString)) {
                  return new Date().toString();
              } else if (/.*час назад.*/.test(dateString)) {
                return new Date().toString();
              } else if (/.*минут назад.*/.test(dateString)) {
                return new Date().toString();
              } else if (/.*секунд.? назад.*/.test(dateString)) {
                return new Date().toString();
              } else if (/.*минуты назад.*/.test(dateString)) {
                return new Date().toString();
              } else if (/.*минуту назад.*/.test(dateString)) {
                return new Date().toString();
              } else if (/.*только что.*/.test(dateString)) {
                return new Date().toString();
              }

              dateString = `${parts[2]}-${MONTH_NAMES[parts[1]] + 1}-${parts[0].padStart(2, '0')}`;
              
              return dateString;
            });

            post.createdAt = new Date(postDate);

            let wiBody  = await postElement.$('.wi_body');

            if (!wiBody) continue;

            let postContentText = await wiBody.$('.pi_text');

            if (postContentText) {
              let processedText = await postContentText.evaluate(element => {
                let emojis = element.querySelectorAll('img.emoji');
                emojis.forEach(emoji => {
                  let alt = emoji.getAttribute('alt');
                  emoji.insertAdjacentHTML('beforebegin', alt);
                  emoji.remove();
                });
          
                let textWithBreaks = element.innerHTML.replace(/<br>/g, '\n');
                let textWithoutTags = textWithBreaks.replace(/<[^>]*>/g, '');
          
                return textWithoutTags.trim();
              });
              
              post.text = processedText;
            }

            let piMedias = await wiBody.$('.pi_medias');

            if (piMedias) {
              let imgSources = await piMedias.evaluate(node => {
                const lazyImages = Array.from(node.querySelectorAll('img[loading="lazy"]'));
                return lazyImages.map(img => img.src.replace(/&cs=\d+x\d+$/, ''));
              });

              post.images.push(imgSources);
            }

            console.log(post);
            newPosts.push(post);

          } catch (error) {
            console.log(error);
          }
        }

        let postsIntoDB = [];

        for (let post of newPosts) {
          if (!this.postKeys.includes(post.key)) {
            postsIntoDB.push({
              key: post.key,
              text: post.text,
              createdAt: post.createdAt,
              sourceKey: config.sourceKey,
              views: 1,
            });

            if (post.images.length > 0 && !this.postKeys.includes(post.key)) {
              await db('images').insert(
                post.images.map(src => {
                  return {
                    srcKey: config.sourceKey,
                    postKey: `${post.key}`,
                    src: src
                  }
                })
              ).onConflict().ignore();
            }
          }
        }

        if (postsIntoDB.length > 0) {
          await db('posts').insert(postsIntoDB).onConflict(['key', 'source_key']).merge({ text: db.raw('EXCLUDED.text') });
          this.postKeys.push(...postsIntoDB.map(obj => obj.key));
        }

        this.totalHeight += scrollStep;     
      }

      await this.page.reload({ timeout: 0, waitUntil: 'domcontentloaded' });
      console.log('Page was reloaded:', new Date());

      await this.waitForTimeout(1000 * 1);
      this.isScanning = true;
    }
  }

  async startReloadingPage() {
    while (true) {
      await this.waitForTimeout(1000 * 60 * this.restartTime);
      this.isScanning = false;
      this.totalHeight = 0;
    }
  }

  async start() {
    this.browser = await puppeteer.launch(
      {
        args: [
          '--disable-gpu',
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage'
        ],
        headless: 'new',
        // userDataDir: './user_data',
        // headless: false
      }
    );
    this.page = await this.browser.newPage();

    await this.page.setExtraHTTPHeaders({
      'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
    });

    const closeBrowser = async () => {
      if (this.browser && (await this.browser.isConnected())) {
        await this.browser.close();
      }
      console.log('Browser was closed', new Date());
    };

    process.on('exit', closeBrowser); // При нормальном завершении
    process.on('SIGINT', () => {
      console.log('Got SIGINT (Ctrl+C)');
      closeBrowser().then(() => process.exit(0)); // При принудительном завершении
    });
    process.on('SIGTERM', closeBrowser); // При остановке через kill
    process.on('uncaughtException', (error) => {
      console.error('Process was killed', new Date(), error);
      closeBrowser().then(() => process.exit(1));
    });
  

    await this.page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'language', { get: () => 'ru-RU' });
      Object.defineProperty(navigator, 'languages', { get: () => ['ru-RU', 'ru', 'en-US'] });
    });

    await this.page.goto(config.sourceUrl, { timeout: 0, waitUntil: 'domcontentloaded'});

    this.postKeys = (await db('posts').select('key')).map(obj => obj.key);
    this.startReloadingPage();
    this.scanning();
  }
}