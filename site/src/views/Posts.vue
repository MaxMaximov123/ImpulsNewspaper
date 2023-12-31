<template>
  <Header @updateFilters="render" :filters="filters" :loadingUpdate="isLoadingPosts"></Header>
  <div class="q-pa-md">
    <div class="news-container q-gutter-sm" @scroll="handleScroll">
      <div class="filters">
        <v-combobox
          single-line
          class="sorted-by"
          v-model="filters.sortedBy"
          label="Сортировать"
          :items="['Сначала новые', 'Сначала старые', 'Сначала популярные', 'Сначала непопулярные']"
          :loading="isLoadingPosts"
          density="compact"
          @update:modelValue="updateSortedBy"
        ></v-combobox>
        <v-combobox
          class="source-keys"
          v-model="filters.selectedSourceKeys"
          clearable
          chips
          multiple
          label="Источник"
          :items="['Импульс', 'ВШЭ', 'МГТУ', 'Иннополис']"
          :loading="isLoadingPosts"
          density="compact"
          @update:modelValue="selectSourceKey"
        ></v-combobox></div>
      
      <div
        @click="() => {
          console.log(post.key);
          openInNewTab(`post/${post.key}`) //this.$router.push(`../post/${post.key}`)
        }
        "
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
                <q-responsive :ratio="4/3">
                <q-img
                    class="rounded-borders large-image"
                    :src=post.images[0]
                    alt="large-image"
                /></q-responsive>
              </q-card-section>
            </div>
          </div>
          <div v-else-if="post.text[0]" class="news-info items-start">
            <div class="col" style="margin-top: auto; margin-bottom: auto;">
              <q-card-section>
                <div 
                  class="news-title" v-html="
                  post.text.slice(0, 10).join(' ') + (
                  post.text.length > 10 ? '...' : '')
                "></div>
              </q-card-section>
            </div>
          </div>
          <div v-else class="items-start">
            <div style="margin-left: auto; margin-right: auto;" class="once-image">
              <q-card-section>
                <q-responsive :ratio="16/9">
                <q-img
                    class="rounded-borders large-image"
                    :src=post.images[0]
                    alt="Large Image"
                /></q-responsive>
              </q-card-section>
            </div>
          </div>
        </q-card>
      </div>
      <div v-if="areAllPostsLoaded" style="
        display: flex;
        justify-content: center;
        align-items: center;">
        Посты закончились
      </div>
      <div
        v-else
        style="
        display: flex;
        justify-content: center;
        align-items: center;">
        <v-progress-circular
          style="display: flex;"
          color="dark-blue"
          indeterminate
          :size="40"
          :width="5"
        ></v-progress-circular>
      </div>
    </div>
  </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import Header from '@/components/Header.vue';
  
  export default {
    components: {
      Header,
    },

    data() {
        return {
          apiHost: 1 ? 'http://148.251.6.25:8000' : 'http://localhost:8000',
          postList: [],
          isLoadingPosts: false,
          queryParams: {},
          areAllPostsLoaded: false,
          filters: {
            context: '',
            selectedSourceKeys: [ "Импульс", "ВШЭ", "МГТУ", "Иннополис"],
            sortedBy: 'Сначала новые',
          }
        }
    },

    async mounted() {
      window.addEventListener('scroll', this.handleScroll);
      let queryParams = this.$route.query;
      this.filters.context = queryParams?.context || '';
      this.filters.sortedBy = queryParams?.sortedBy || 'Сначала новые';
      this.filters.selectedSourceKeys = (queryParams?.selectedSourceKeys || "Импульс,ВШЭ,МГТУ,Иннополис").split(',');

      await this.render();
    },

    beforeDestroy() {
        window.removeEventListener('scroll', this.handleScroll);
    },

    methods: {
      async render() {
        this.postList = [];
        
        await this.loadNewPosts();
      },

      async selectSourceKey() {
        this.$router.push({path: `/`, query: {
          context: this.filters.context,
          selectedSourceKeys: this.filters.selectedSourceKeys.join(',')
        }});

        await this.render();
      },

      openInNewTab(url) {
        window.open(url, '_blank').focus();
      },

      async updateSortedBy() {
        this.$router.push({path: `/`, query: {
          context: this.filters.context,
          selectedSourceKeys: this.filters.selectedSourceKeys.join(','),
          sortedBy: this.filters.sortedBy
        }});

        await this.render();
      },

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
        let requestResults = (await this.postRequest(`${this.apiHost}/api/posts`, {
          offset: this.postList.length,
          filters: this.filters,
        })).data;
        let newRequestResults = [];
        let timeFormatOptions = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        };

        for (let index=0;index<requestResults.length;index++) {
            (() => {
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
          })();
        }

        if (requestResults.length === 0) {
          this.areAllPostsLoaded = true;
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
  @import url('https://fonts.cdnfonts.com/css/gilroy-bold');
  .news-item {
    max-width: 70%;
    margin-bottom: 20px;
    background-color: #ebe1c583;
    border-radius: 5px;
    padding: 20px;
    margin-left: auto;
    margin-right: auto; 
  }

  .news-title {
    color: #1F3264;
    font-family: 'Gilroy-Medium', sans-serif;
    /*font-family: Courier;*/
    text-align: center;
    font-size: clamp(14px, 2vh, 30px);
  }

  .created-at {
    z-index: 1; 
    position:absolute;
    padding-left: 5px;
    color: #1F3264;
    font-family: 'Gilroy-Medium', sans-serif;
    font-size: clamp(10px, 2.5vw, 16px);
  }

  .filters {
    margin-left: auto;
    margin-right: auto;
    width: 70%;
    display: flex;
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
    margin-top: 70px;
  }

  .source-keys {
    /* font-size: clamp(20px, 5vw, 30px); */
    width: 60%;
    margin-left: auto;
    margin-right: auto;
  }
  .sorted-by {
    /* font-size: clamp(20px, 5vw, 30px); */
    width: 10%;
    margin-left: auto;
    margin-right: auto;
    padding-right: 5px;
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

    .source-keys {
      width: 95%;
    }

    .filters {
      display: block;
      width: 95%;
    }

    .source-keys {
      /* font-size: clamp(20px, 5vw, 30px); */
      width: 100%;
    }

    .sorted-by {
      /* font-size: clamp(20px, 5vw, 30px); */
      width: 100%;
      padding-right: 0px;
    }
  }
  </style>