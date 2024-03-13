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
              <div class="col q-py-md" style="width: 100%; margin-left: auto; margin-right: auto;">
                <q-card-section>
                  <Gallery :images="post.images"></Gallery>
                </q-card-section>
              </div>
            </div>
            <div style="display: flex;">
              <q-btn flat color="grey-7" rounded class="q-ml-sm q-my-xsm" @click="async () => {
                if (!this.$storage.user.authorized) {
                  this.authDialog.isOpen = true;
                  console.log(this.authDialog);
                  return;
                }
                await this.postRequest(`${this.apiHost}api/setLike`, {
                  userId: this.$storage.user.id,
                  postId: this.post.id,
                  isLiked: !this.post.isLiked,
                });

                this.post.isLiked = !this.post.isLiked
                
                if (this.post.isLiked) {
                  this.post.likesCount++;
                } else {
                  this.post.likesCount--
                };
              }">
              <q-icon class="q-mr-sm" :color="post.isLiked ? 'red' : 'grey'" :name="post.isLiked ? 'mdi-heart' : 'mdi-heart-outline'"/>
              <span>{{ post.likesCount }}</span>
            </q-btn>
            <q-space></q-space>
            <div class="q-my-auto">
              <q-icon name="mdi-eye-outline" size="25px" color="grey-7"></q-icon>
              <span style="color: rgb(107, 107, 107);" class="q-mx-md">{{ post.views }}</span>
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
import { postRequest, apiHost } from '@/services/postRequest';

export default {
    components: {
        Gallery,
        GalleryN,
        // Header
    },
    data(){
        return {
            postId: null,
            apiHost: apiHost,
            authDialog: this.$storage.authDialog,
            post: {
                text: '',
                images: [],
                createdAt: null,
            }
        }
    },

    async created() {
        this.postId = Number(this.$route.params.postId);
        this.loadNewPost();
    },

    methods: {
        postRequest(url, data){
            return postRequest(url, data);
        },

        async loadNewPost() {
            let timeFormatOptions = {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            };
            this.isLoadingPosts = true;
            let requestResults = (await this.postRequest(`${this.apiHost}api/post`, {
              postId: this.postId,
              userId: this.$storage.user?.id || null,
            })).data;
            this.post = requestResults;
            
            this.post.text = this.post.text
              .replace(/Show more/g, `Показать ещё`)
              .replace(/Показать ещё/g, '')
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
            
            if (this.post.sourceKey !== 'ABOUT_PROJECT') {
              this.post.text = this.post.text
                .replace(/\n/g, "<br>")
                .replace(/(https?:[0-9a-zA-Z_/.-]*)/g, ` 👉 <a href="$1" target="_blank">ссылка</a> `);
            }

            this.post.createdAt = new Date(this.post.createdAt).toLocaleString("ru", timeFormatOptions);
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
    height: 80vh;
    overflow: auto;
  }

  .news-container {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
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