import puppeteer from 'puppeteer';
import { db } from './database.js';

export default class Scanner {
  postKeys = [];

  constructor() {
    this.start().catch((error) => {
      console.log(error);
    });
  }

  async waitForTimeout(time) {
    await new Promise((resolve) => setTimeout(resolve, time));
  }

  async scanning() {
    let browser = await puppeteer.launch({headless: false});
    let page = await browser.newPage();

    await page.goto('https://vk.com/impulse131');

    let scrollStep = 500;
    let totalHeight = 0;

    while (totalHeight < await page.evaluate(() => document.body.scrollHeight)) {
      await page.evaluate(scrollStep => {
        window.scrollBy(0, scrollStep);
      }, scrollStep);

      let postElements = await page.$$('.post');
      let newPosts = [];

      for (let postElement of postElements) {
        let post = {
          text: null,
          images: [],
        };

        try {
          if (!postElement) continue;
          post.key = await postElement.evaluate(el => el.id);
          if (this.postKeys.includes(post.key)) continue;
          let postContent = await postElement.$('._post_content');
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
          });

          if (post.images.length > 0) {
            await db('images').insert(
              post.images.map(src => {
                return {
                  postKey: post.key,
                  src: src
                }
              })
            ).onConflict('src').ignore();
          }
        }
      }

      if (postsIntoDB.length > 0) {
        await db('posts').insert(postsIntoDB).onConflict('key').ignore();
        this.postKeys.push(...postsIntoDB.map(obj => obj.key));
      }
      
      totalHeight += scrollStep;
      await this.waitForTimeout(500);
      
    }

    await browser.close();
    return this.scanning();
}

  async start() {
    this.postKeys = (await db('posts').select('key')).map(obj => obj.key);
    this.scanning();
  }
}
