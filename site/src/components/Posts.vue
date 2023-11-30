<template>
    <div class="q-pa-md">
      <div class="news-container justify-center q-gutter-sm" @scroll="handleScroll">
        <div
          @click="() => this.$router.push(`../post/${post.key}`)"
          v-for="(post, index) in postList"
          :key="post.key"
          :data-id="index - 1"
          class="news-item q-pa-sm"
        >
          <div class="created-at">
              {{ post.createdAt }}
            </div>
          <q-card style="background-color: rgba(240, 235, 232, 0.797);">
            <div v-if="post.text[0] && post.images?.[0]" class="news-info items-start">
              <div class="col" style="margin-top: auto; margin-bottom: auto;">
                <q-card-section>
                  <div 
                    class="news-title" v-html="
                    post.text.slice(0, 10).join(' ') + (
                    post.text.length > 10 ? '...' : '')
                  "></div>
                </q-card-section>
              </div>

              <div class="col">
                <q-card-section>
                  <q-img
                      class="rounded-borders large-image"
                      :src=post.images[0]
                      alt="large-image"
                  />
                </q-card-section>
              </div>
            </div>
            <div v-else-if="post.text[0]" class="news-info items-start">
              <div style="margin-top: auto; margin-bottom: auto; margin-left: auto; margin-right: auto;" class="col-6">
                <q-card-section>
                  <div class="news-title" v-html="post.text"></div>
                  <div v-if="post.text && !post.allText">
                    <a :onClick="() => showAllText(post)" style="color: rgb(0, 119, 255);">Показать больше</a>
                  </div>
                </q-card-section>
              </div>
            </div>
            <div v-else class="items-start">
              <div style="margin-left: auto; margin-right: auto;" class="once-image">
                <q-card-section>
                  <q-img
                      class="rounded-borders large-image"
                      :src=post.images[0]
                      alt="Large Image"
                  />
                </q-card-section>
              </div>
            </div>
          </q-card>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue'
  
  export default {
    data() {
        return {
          apiHost: 1 ? 'http://localhost:8005' : 'https://e0fa-149-57-16-45.ngrok-free.app',
          postList: [],
          isLoadingPosts: false,
        }
    },

    async mounted() {
      await this.loadNewPosts();

      window.addEventListener('scroll', this.handleScroll);
    },

    beforeDestroy() {
        window.removeEventListener('scroll', this.handleScroll);
    },

    methods: {
      formatCountPictures(n) {
        if ([2, 3, 4, 6].includes(n)) {
          return n;
        }
        for (let i of [2, 3, 4, 6]) {
          if (n % i === 0) {
            return this.formatCountPictures(n / i);
          }
        }

        return n;
      },

      postRequest(url, data){
        return new Promise((resolve, reject) => {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
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
      },

      showAllText(post) {
        post.allText = !post.allText;
      },

      async loadNewPosts() {
        this.isLoadingPosts = true;
        let requestResults = (await this.postRequest(`${this.apiHost}/api/posts`, {offset: this.postList.length})).data;
        let newRequestResults = [];
        let timeFormatOptions = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        };

        for (let index=0;index<requestResults.length;index++) {
          newRequestResults.push((() => {
            let obj = requestResults[index];
            obj.images = Array.from(new Set(obj.images)) || [];
            obj.text = obj.text.replace(/\n/g, "<br>");
            // obj.text = obj.text.replace(/Show more/g, `Показать ещё`);
            obj.text = obj.text.replace(/#.*/g, ``);
            obj.text = obj.text.split(` `);
            obj.allText = false;
            obj.slide = ref(1);
            obj.createdAt = new Date(obj.createdAt).toLocaleString("ru", timeFormatOptions);
            return obj;
          })());
        }

        this.postList.push(...requestResults);
        this.isLoadingPosts = false;
      },

      goToFullPost(postKey) {
        console.log(postKey);
      },

      handleScroll(event) {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
          if (!this.isLoadingPosts) {
            this.loadNewPosts();
          }
        }
      },
    },
  }
  </script>
  
  <style scoped>
  .news-item {
    max-width: 80%;
    max-height: 500px;
    margin-bottom: 20px;
    background-color: #ebe1c583;
    border-radius: 5px;
    padding: 20px;
    margin-left: auto;
    margin-right: auto; 
  }

  .news-title {
    color: #1F3264;
    font-family: Courier;
    text-align: center;
    font-size: clamp(14px, 2.5vw, 30px);
  }

  .created-at {
    color: #1F3264;
    font-family: Courier;
    font-size: clamp(12px, 2.5vw, 20px);
  }

  .news-info {
    display: flex;
  }

  .large-image {
    max-height: 400px;
  }

  .once-image {
    max-width: 50%;
  }

  .news-container {
    margin-left: auto;
    margin-right: auto;
    margin-top: 80px;
  }

  @media (max-width: 700px) {

    .news-info {
      display: block;
    }

    .large-image {
      max-height: 300px;
    }
  
    .news-item {
      max-width: 95%;
    }

    .once-image {
      max-width: 100%;
    }
  }
  </style>