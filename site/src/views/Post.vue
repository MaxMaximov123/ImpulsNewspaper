<template>
  <!-- <Header @updateFilters="() => {}" :filters="{context: ''}" id="header"></Header> -->
    <div class="q-pa-sm">
      <div class="news-container q-pa-xs">
        <div
          class="q-pa-sm"
        >
          <div class="created-at q-ml-md q-mt-sm">
              {{ post.createdAt }}
          </div>
          <q-card style="background-color: rgba(240, 235, 232, 0.797);">
            <div v-if="post.text[0] && post.images?.[0]" class="news-info">
              <div class="col">
                <q-card-section>
                  <div 
                    class="news-title" v-html="
                    post.text
                  "></div>
                </q-card-section>
              </div>

              <div class="col gallery q-my-md">
                <q-card-section>
                  <Gallery :images="post.images"></Gallery>
                </q-card-section>
              </div>
            </div>
            <div v-else-if="post.text[0]" class="news-info items-start">
              <div class="col" style="margin-top: auto; margin-bottom: auto;">
                <q-card-section>
                  <div 
                    class="news-title" v-html="
                    post.text
                  "></div>
                </q-card-section>
              </div>
            </div>

            <div v-else class="items-start">
              <div style="margin-left: auto; margin-right: auto;" class="once-image">
                <q-card-section>
                  <Gallery :images="post.images"></Gallery>
                </q-card-section>
              </div>
            </div>
          </q-card>
        </div>
      </div>
    </div>
</template>
<script>

import router from '@/router';
import Gallery from '@/components/Gallery.vue';
import GalleryN from '@/components/GalleryN.vue';
// import Header from '@/components/Header.vue';

export default {
    components: {
        Gallery,
        GalleryN,
        // Header
    },
    data(){
        return {
            postKey: null,
            apiHost: 1 ? '/api' : 'http://localhost:8000/api',
            post: {
                text: '',
                images: [],
                createdAt: null,
            }
        }
    },

    async mounted() {
        this.postKey = Number(this.$route.params.postKey);
        this.loadNewPost();
    },

    methods: {
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

        async loadNewPost() {
            let timeFormatOptions = {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            };
            this.isLoadingPosts = true;
            let requestResults = (await this.postRequest(`${this.apiHost}/post`, {postKey: this.postKey})).data;
            this.post = requestResults;

            this.post.text = this.post.text
              .replace(/Show more/g, `Показать ещё`)
              .replace(/Показать ещё/g, '');
            this.post.text = this.post.text.replace(/(https?:([A-z]|[0-9]|\.|\/|-)*)(\s|\n|\(|\)|.*)/g, `<a href="$1" target="_blank">$1</a>`);
            this.post.text = this.post.text.replace(/\n/g, "<br>")
            // obj.text = obj.text.replace(/Show more/g, `Показать ещё`);
            this.post.createdAt = new Date(this.post.createdAt).toLocaleString("ru", timeFormatOptions);
            this.post.text = this.post.text.replace(/#.*/g, ``);
            this.post.images = [...new Set(this.post.images)];
            this.isLoadingPosts = false;
        },
    },
}
</script>
<style scoped>@import url('https://fonts.cdnfonts.com/css/gilroy-bold');
  .news-title {
    color: #1F3264;
    font-family: 'Gilroy-Medium', sans-serif;
    text-align: left;
    margin-top: 40px;
    font-size: clamp(14px, 2vw, 20px);
  }


  .gallery {
    height: 86vh;
    overflow: auto;
  }

  .news-container {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 70px;
  }

 

  .created-at {
    z-index: 1; 
    position:absolute;
    color: #1F3264;
    font-family: 'Gilroy-Medium', sans-serif;
    font-size: clamp(10px, 2.5vw, 16px);
  }

  .news-info {
    height: 100%;
    display: flex;
  }

  .once-image {
    width: 100%;
  }

  @media (max-width: 700px) {
    .gallery {
      height: 100%;
      margin-bottom: 25px;
    }
    .news-info {
      display: block;
    }

    .news-title {
      text-align: center;
    }
  
    .news-item {
      width: 95%;
    }

    .once-image {
      max-width: 100vw;
    }
  }
  </style>