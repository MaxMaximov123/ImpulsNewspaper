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
      while (this.isScanning) {
        await this.page.evaluate(scrollStep => {
          window.scrollBy(0, scrollStep);
        }, scrollStep);

        let postElements = await this.page.$$('.post');
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

            let postContent = await postElement.$('._post_content');
            let postHeader = await postElement.$('.PostHeader');
            let postHeaderInfo = await postHeader.$('.PostHeaderInfo');
            let postHeaderSubtitle = await postHeaderInfo.$('.PostHeaderSubtitle');
            let PostHeaderSubtitleLink = await postHeaderSubtitle.$('.PostHeaderSubtitle__link');
            let PostHeaderSubtitleItem = await PostHeaderSubtitleLink.$('.PostHeaderSubtitle__item');



            let postDate = await PostHeaderSubtitleItem.evaluate(element => {
              let currentYear = new Date().getFullYear();
              let currentMonth = new Date().getMonth();
              let today = new Date().getDay();
              const MONTH_NAMES = {
                'янв': 0, 'фев': 1, 'мар': 2, 'апр': 3, 'мая': 4, 'июн': 5,
                'июл': 6, 'авг': 7, 'сен': 8, 'окт': 9, 'ноя': 10, 'дек': 11
              };

              let dateString = element ? element.textContent.replace(/ в \d+:\d+/, '') : '';
              if (!/\d\d\d\d/.test(dateString)) {
                dateString += ` ${MONTH_NAMES[dateString.split(' ')[1]] <= currentMonth ? currentYear : currentYear - 1}`;
              } else {
                return [dateString, (dateString + ' ').split(' '), 8];
              }
              
              let parts = dateString.split(' ');
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
              } else if (/.*минуты назад.*/.test(dateString)) {
                return new Date().toString();
              } else if (/.*минуту назад.*/.test(dateString)) {
                return new Date().toString();
              }

              dateString = `${parts[2]}-${MONTH_NAMES[parts[1]] + 1}-${parts[0].padStart(2, '0')}`;
              
              return dateString;
            });

            console.log(postDate);

            post.createdAt = new Date(postDate);


            if (!postContent) continue;

            let postContentBody = await postContent.$('.post_content');

            if (!postContentBody) continue;

            postContentBody = await postContentBody.$('.post_info');

            if (!postContentBody) continue;

            postContentBody = await postContentBody.$('.wall_text');

            if (!postContentBody) continue;

            let postContentText = await postContentBody.$('.wall_post_text');

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

            let onceImageBlock = await postContentBody.$('.PrimaryAttachment');
            if (onceImageBlock) {
              onceImageBlock = await onceImageBlock.$('.PhotoPrimaryAttachment__interactive');
              let image = await onceImageBlock.$('.PhotoPrimaryAttachment__imageElement');
              post.images.push(await image.evaluate(element => element.src));
            }

            let postContentImageBlock = await postContentBody.$('.MediaGridContainerWeb--post');

            if (postContentImageBlock) {
              postContentImageBlock = await postContentImageBlock.$('.MediaGrid');

              if (postContentImageBlock) {
                let postContentImages = await postContentImageBlock.$$('.MediaGrid__thumb');

                if (postContentImages) {
                
                  for (let image of postContentImages) {
                    if (image) {
                      image = await image.$('.MediaGrid__interactive');
                      image = await image.$('.MediaGrid__imageElement');
                      post.images.push(await image.evaluate(element => element.src));
                    }
                  }
                }
              }
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
                    postKey: post.key,
                    src: src
                  }
                })
              ).onConflict().ignore();
            }
          }
        }

        if (postsIntoDB.length > 0) {
          await db('posts').insert(postsIntoDB).onConflict().ignore();
          this.postKeys.push(...postsIntoDB.map(obj => obj.key));
        }

        this.totalHeight += scrollStep;     
      }

      await this.waitForTimeout(1000 * 1);
      this.isScanning = true;
    }
  }

  async startReloadingPage() {
    while (true) {
      await this.waitForTimeout(1000 * 60 * this.restartTime);
      this.isScanning = false;

      // await this.page.reload();

      await this.browser.close();

      this.browser = await puppeteer.launch(
        {
          args: ['--no-sandbox'],
          headless: 'new',
          // headless: false
        }
      );

      this.page = await this.browser.newPage();
      await this.page.setExtraHTTPHeaders({
        'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
      });
      await this.page.goto(config.sourceUrl);
      this.totalHeight = 0;
    }
  }

  async start() {
    this.browser = await puppeteer.launch(
      {
        args: ['--no-sandbox'],
        headless: 'new',
        // headless: false
      }
    );
    this.page = await this.browser.newPage();

    await this.page.setExtraHTTPHeaders({
      'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
    });
    await this.page.goto(config.sourceUrl);

    this.postKeys = (await db('posts').select('key')).map(obj => obj.key);
    this.startReloadingPage();
    this.scanning();
  }
}
