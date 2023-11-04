<template>
    <div class="q-pa-md">
      <div class="news-container justify-center q-gutter-sm" @scroll="handleScroll" >
        <div
          v-for="(post, index) in postList"
          :key="post.key"
          :data-id="index - 1"
          class="news-item q-pa-sm flex-center relative-position"
        >
          <transition name="q-transition--scale">
            <q-card>
              <div v-if="post.text[0]">
                <q-card-section>
                  <div v-html="post.text[0] + (
                    post.text[1] && post.allText ? post.text[1] : ''
                  )"></div>
                  <div v-if="post.text[1] && !post.allText">
                    <a :onClick="() => showAllText(post)" style="color: rgb(0, 119, 255);">Показать больше</a>
                  </div>
                </q-card-section>
              </div>

              <!-- <div class="q-pa-md">
                <q-carousel
                  swipeable
                  animated
                  v-model="post.slide"
                  thumbnails
                  infinite
                >
                  <q-carousel-slide v-for="(image, index) in post.images" :name="index+1" :img-src="image">{{index + 1}}</q-carousel-slide>
                </q-carousel>
              </div> -->

              <div v-if="post.images.length > 0">
                <q-card-section>
                  <div v-if="post.images.length === 1">
                    <q-img
                        class="rounded-borders"
                        :src=post.images[0]
                        alt="Large Image"
                    />
                  </div>
                  <div v-if="post.images.length === 2" class="q-col-gutter-md row items-start">
                    <div v-for="index in 2" class="col-6">
                      <q-img
                          :src=post.images[index-1]
                          class="rounded-borders"
                          alt="Large Image"
                          :ratio="4/3"
                      />
                    </div>
                  </div>
                  <div v-if="post.images.length >= 3" class="q-col-gutter-md">
                    <div>
                      <q-img
                          class="rounded-borders"
                          :src=post.images[0]
                          alt="Large Image"
                      />
                    </div>
                    <div class="q-col-gutter-md row items-start">
                      <div v-for="index in Math.min(3, post.images.length-1)" class="col">
                        <q-img
                            :src=post.images[index]
                            class="rounded-borders"
                            alt="Large Image"
                            :ratio="Math.max(1, 10/(post.images.length-1)/3)"
                        />
                      </div>
                      <div v-if="post.images.length-5 === 0" class="col">
                        <q-img
                            :src=post.images[4]
                            class="rounded-borders"
                            alt="Large Image"
                            :ratio="Math.max(1, 10/(post.images.length-1)/3)"
                        />
                      </div>
                      <div v-if="post.images.length-1 > 4" class="col">
                        <q-img 
                            :src=post.images[4]
                            class="rounded-borders"
                            alt="Large Image"
                            :ratio="Math.max(1, 10/(post.images.length-1)/3)">
                          <div class="absolute-full text-subtitle2 flex flex-center" style="backdrop-filter: blur(2px);">
                            +{{ post.images.length - 4 }}
                          </div>
                        </q-img>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </div>
            </q-card>
          </transition>
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
        console.log(post);
        post.allText = !post.allText;
      },

      async loadNewPosts() {
        this.isLoadingPosts = true;
        let requestResults = (await this.postRequest(`${this.apiHost}/api/posts`, {offset: this.postList.length})).data;
        let newRequestResults = [];
        for (let index=0;index<requestResults.length;index++) {
          newRequestResults.push((() => {
            let obj = requestResults[index];
            obj.images = Array.from(new Set(obj.images)) || [];
            obj.text = obj.text.replace(/\n/g, "<br>");
            obj.text = obj.text.replace(/Show more/g, `Показать ещё`);
            obj.text = obj.text.split(`Показать ещё`);
            obj.allText = false;
            obj.slide = ref(1);
            return obj;
          })());
        }

        this.postList.push(...requestResults);
        this.isLoadingPosts = false;
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
    font-size: 1em;
    width: 30%; /* Используем проценты вместо px */
    margin-bottom: 20px;
    background-color: #f4f4f4;
    border-radius: 10px;
    padding: 20px;
    margin-left: auto;
    margin-right: auto;
    
  }

  @media (max-width: 900px) {
  
    .news-item {
      width: 60%;
    }
  }

  @media (max-width: 700px) {
  
    .news-item {
      width: 95%;
    }
  }

  .news-container {
    margin-top: 80px;
    justify-content: center;
  }

  .small-images {
      display: flex;
      justify-content: space-between;
  }

  .small-image {
      max-width: 50%; /* Ширина меньших фотографий */
      height: auto;
  }
  </style>