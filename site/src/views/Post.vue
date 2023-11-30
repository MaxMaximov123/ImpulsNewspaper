<template style="height: 100%;">
    <div class="q-pa-md" style="width: 100%; height: 100%; margin-top: 80px;">
      <div class="news-container justify-center q-gutter-sm" style="width: 100%; height: 100%;">
        <div
          class="news-item q-pa-sm"
        >
          <q-card style="background-color: rgba(240, 235, 232, 0.797); height: 100%">
            <div class="news-info items-start">
              <div class="col" style="margin-top: auto; margin-bottom: auto;">
                <q-card-section>
                  <div 
                    class="news-title"
                    v-html="post.text">
                </div>
                </q-card-section>
              </div>
            </div>
            <div style="margin-left: auto; margin-right: auto;">
              <Gallery :images="post.images"></Gallery>
            </div>
            
          </q-card>
        </div>
      </div>
    </div>
</template>
<script>

import router from '@/router';
import Gallery from '@/components/Gallery.vue';

export default {
    components: {
        Gallery
    },
    data(){
        return {
            postKey: null,
            apiHost: 1 ? 'http://localhost:8005' : 'https://e0fa-149-57-16-45.ngrok-free.app',
            post: {
                text: '',
                images: [],
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
            this.isLoadingPosts = true;
            let requestResults = (await this.postRequest(`${this.apiHost}/api/post`, {postKey: this.postKey})).data;
            this.post = requestResults;

            this.post.text = this.post.text.replace(/\n/g, "<br>")
              .replace(/Show more/g, `Показать ещё`)
              .replace(/Показать ещё/g, '');
            // obj.text = obj.text.replace(/Show more/g, `Показать ещё`);
            this.post.text = this.post.text.replace(/#.*/g, ``);
            this.isLoadingPosts = false;
        },
    },
}
</script>
<style scoped>
  .news-title {
    color: #1F3264;
    font-family: Courier;
    text-align: center;
    font-size: clamp(14px, 2vw, 20px);
  }

  .news-info {
    display: flex;
  }

  .large-image {
    max-height: 400px;
  }

  .news-container {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
  }

  @media (max-width: 700px) {
  }
  </style>