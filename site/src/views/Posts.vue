<template>
  <div class="q-pa-md">
    <div class="news-container q-gutter-sm" @scroll="handleScroll">
      <div class="filters">
        <v-select
          variant="outlined"
          class="sorted-by"
          v-model="filters.sortedBy"
          label="Сортировать"
          :items="['Сначала новые', 'Сначала старые', 'Сначала популярные', 'Сначала непопулярные']"
          :loading="isLoadingPosts"
          density="compact"
          @update:modelValue="updateSortedBy"
        ></v-select>
        <!-- chips -->
        <v-select
          class="source-keys"
          variant="outlined"
          v-model="filters.selectedSourceKeys"
          clearable
          multiple
          label="Источник"
          :items="Object.values(this.sourceKeys)"
          :loading="isLoadingPosts"
          density="compact"
          @update:modelValue="selectSourceKey"
          chips
          :closable-chips="true"
        >
        </v-select></div>
      
      <div ref="postsContainer" @keydown="(event) => {console.log(event)}">
        <div
          v-for="(post, index) in postList"
          :ref="`post-${index}`"
          :key="post.id"
          :data-id="index - 1"
          class="news-item q-pa-sm"
        >
        <!-- <a :href="`#${index}`">d;fljghblfdglksdbfnglksbndfgjbsdfjgbsd.fkg</a> -->
          <div class="info-block">
            <div class="created-at">
              {{ post.createdAt }}
            </div>
          </div>
          <div class="info-block">
            <div style="margin-left: auto; margin-right: auto;">
              {{ sourceKeys[post.sourceKey] }}
            </div>
          </div>
          <q-card style="background-color: #f3efed;" >
          <button style="width: 100%; margin-bottom: -2lvh;"
          @click="async () => {
            // openInNewTab(`post/${post.key}`);
            await this.$router.push({path: `/`, query: {
              context: this.filters.context,
              selectedSourceKeys: this.filters.selectedSourceKeys.join(','),
              sortedBy: this.filters.sortedBy,
              currentPost: index,
            }});
            await this.$router.push(`../post/${post.id}`)
          }
          ">
            <div v-if="post.text[0] && post.images?.[0]" class="news-info items-start">
              <div class="col" style="margin-top: auto; margin-bottom: auto;">
                <q-card-section>
                  <div 
                    class="news-title" v-html="
                    post.text.slice(0, 30).join(' ') + (
                    post.text.length > 30 ? '...' : '')
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
                  >
                  <template v-slot:loading>
                    <q-spinner-bars
                    style="color: #1b867a"
                      size="xl"
                      />
                  </template>
                  </q-img>
                </q-responsive>
                </q-card-section>
              </div>
            </div>
            <div v-else-if="post.text[0]" class="news-info items-start">
              <div class="col" style="margin-top: auto; margin-bottom: auto;">
                <q-card-section>
                  <div 
                    class="news-title" v-html="
                    post.text.slice(0, 60).join(' ') + (
                    post.text.length > 60 ? '...' : '')
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
                  >
                  <template v-slot:loading>
                    <q-spinner-bars
                      color="cyan"
                      size="xl"
                      />
                  </template>
                  </q-img>
                </q-responsive>
                </q-card-section>
              </div>
            </div>
          </button>
          <div style="display: flex;">
            <q-btn flat color="grey-7" rounded class="q-ml-sm q-my-xsm" @click="async () => {
                if (!this.$storage.user.authorized) {
                  this.authDialog.isOpen = true;
                  return;
                }
                await this.postRequest(`${this.apiHost}api/setLike`, {
                  userId: this.$storage.user.id,
                  postId: post.id,
                  isLiked: !this.postList[index].isLiked,
                });

                this.postList[index].isLiked = !this.postList[index].isLiked
                
                if (this.postList[index].isLiked) {
                  this.postList[index].likesCount++;
                } else {
                  this.postList[index].likesCount--
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
      <!-- <div>{{ (() => {
        console.log(99923)
        this.goToPost();
      })()
      }}</div> -->
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
        <!-- <v-progress-circular
          style="display: flex;"
          color="dark-blue"
          indeterminate
          :size="40"
          :width="5"
        ></v-progress-circular> -->
        <q-spinner-bars
        style="color: #e4fffc"
        size="xl"
        />
      </div>
    </div>
  </div>
</template>
  
<script>
  import { ref } from 'vue';
  import MenuBar from '@/components/MenuBar.vue';
  import { postRequest, apiHost } from '@/services/postRequest';
  
  export default {
    components: {
      MenuBar,
    },

    watch: {
      $route(to, from) {
        this.render();
      },
    },

    mounted() {
      this.$refs.postsContainer.addEventListener('DOMNodeInserted', () => 
      this.postContainerUpdated(), false);
      window.addEventListener('keydown', this.handleKeyPress);
    },

    data() {
        return {
          apiHost: apiHost,
          postList: [],
          isLoadingPosts: false,
          queryParams: {},
          areAllPostsLoaded: false,
          authDialog: this.$storage.authDialog,
          wentedToCurrentPoss: false,
          sourceKeys: {
            'IMPULS': 'Импульс',
            'HSE': 'ВШЭ',
            'BMSTU': 'МГТУ',
            "INNOPOLIS": "Иннополис",
            "SPECIAL": "Спец.",
            "DISTOLYMP": "Онлайн олимп. физ.",
            "LOMONOSOV_OLYMP_CHEMISTRY": "Олимп. Ломоносов химия",
            "OLYMP_SPBU": "Олимп. СПбГУ",
            "INNOPOLIS_OPEN_IS": "Иннополис Open ИБ",
            "OLYMP_GAZPROM": "Олимп. газпром",
            "OLYMP_NTI": "Олимп. НТИ",
            "ABOUT_PROJECT": "О проекте",
          },
          filters: {
            context: '',
            selectedSourceKeys: [],
            sortedBy: 'Сначала новые',
          },
        }
    },

    async created() {
      window.addEventListener('scroll', this.handleScroll);
      await this.render();
    },

    beforeDestroy() {
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('keydown', this.handleKeyPress);
    },

    methods: {
      handleKeyPress(event) {
        if (event.key === 'PageDown' || event.key === 'ArrowRight') {
          event.preventDefault();
          if (this.filters.currentPost < this.postList.length) {
            this.filters.currentPost++;
          }
        } else if (event.key === 'PageUp' || event.key === 'ArrowLeft') {
          event.preventDefault();
          if (this.filters.currentPost > 0) {
            this.filters.currentPost--;
          }
        }

        this.goToPost();
      },

      goToPost() {
        if (this.$refs[`post-${this.filters.currentPost}`]?.[0]) {
          let currentPost = this.$refs[`post-${this.filters.currentPost}`]?.[0];
          currentPost = currentPost.getBoundingClientRect();
          window.scrollTo({
            top: currentPost.top + currentPost.height / 2 - window.innerHeight / 2 + window.scrollY,
            left: currentPost.left + window.scrollX,
            behavior: 'smooth'
          });
        }
      },

      postContainerUpdated() {
        if (!this.wentedToCurrentPoss && this.$refs[`post-${this.filters.currentPost}`]?.[0]) {
          this.wentedToCurrentPoss = true;
          let currentPost = this.$refs[`post-${this.filters.currentPost}`]?.[0];
          currentPost = currentPost.getBoundingClientRect();
          window.scrollTo({
            top: currentPost.top + currentPost.height / 2 - window.innerHeight / 2 + window.scrollY,
            left: currentPost.left + window.scrollX,
            behavior: 'instant'
          });
        }
        
      },

      async render() {
        this.filters.context = this.$route.query?.context || '';
        this.filters.currentPost = Number(this.$route.query?.currentPost || '0');
        this.filters.sortedBy = this.$route.query?.sortedBy || 'Сначала новые';
        this.filters.selectedSourceKeys = (this.$route.query?.selectedSourceKeys || 'Импульс,МГТУ,Спец.,ВШЭ,Иннополис').split(',');
        this.postList = [];
        await this.loadNewPosts();
      },

      async selectSourceKey() {
        this.$router.push({path: `/`, query: {
          context: this.filters.context,
          selectedSourceKeys: this.filters.selectedSourceKeys.join(','),
          sortedBy: this.filters.sortedBy,
          count: this.filters.count,
        }});
      },

      openInNewTab(url) {
        window.open(url, '_blank').focus();
      },

      async updateSortedBy() {
        this.$router.push({path: `/`, query: {
          context: this.filters.context,
          selectedSourceKeys: this.filters.selectedSourceKeys.join(','),
          sortedBy: this.filters.sortedBy,
          count: this.filters.count,
        }});
      },

      async postRequest(url, data) {
        return await postRequest(url, data)
      },

      async loadNewPosts() {
        this.isLoadingPosts = true;
        let requestResults = (await this.postRequest(`${this.apiHost}api/posts`, {
          offset: this.postList.length,
          filters: this.filters,
          userId: this.$storage.user?.id || null,
        })).data;
        let timeFormatOptions = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        };

        for (let index=0;index<requestResults.length;index++) {
            (() => {
            let obj = requestResults[index];
            obj.images = Array.from(new Set(obj.images)) || [];
            obj.text = obj.text
              .replace(/Show more/g, `Показать ещё`)
              .replace(/Показать ещё/g, '')
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
            
            if (obj.sourceKey !== 'ABOUT_PROJECT') {
              obj.text = obj.text
                .replace(/\n/g, "<br>")
                .replace(/(https?:[0-9a-zA-Z_/.-]*)/g, ` 👉 <a href="$1" target="_blank">ссылка</a> `)
                .split(/[\n\s]/);
            } else {
              obj.text = [obj.text];

              // obj.images = [];
              // obj.text = [
              //   `<h4 style="">Модули сканирования</h4>
              //   <div style="margin-top: 5%; margin-botton: 5%; text-align: left">
              //     <h6><b>Источники:</b>
              //       <br>
              //       <div style="margin-left: 20px">
              //         <table>
              //           <tbody>
              //             <tr id="r-1">
              //               <td>
              //                 <img src="https://tinylinks.ru/8eb0g" style="border-radius: 20%; margin-bottom: -5px; width: 25px; margin-right: 5px">
              //                 Импульс
              //               </td>
              //               <td style="padding-left: 20px;">
              //                 <img src="https://tinylinks.ru/7x199" style="border-radius: 20%; margin-bottom: -5px; width: 25px; margin-right: 5px">
              //                 Иннополис
              //               </td>
              //             </tr>
              //             <tr id="r-2">
              //               <td>
              //                 <img src="https://tinylinks.ru/4gj99" style="border-radius: 20%; margin-bottom: -5px; width: 25px; margin-right: 5px">
              //                 Олимпиада МГТУ
              //               </td>
              //               <td style="padding-left: 20px;">
              //                 <img src="https://tinylinks.ru/pcxn5" style="border-radius: 20%; margin-bottom: -5px; width: 25px; margin-right: 5px">
              //                 Олимпиада ВШЭ
              //               </td>
              //             </tr>
                          
              //             <tr id="r-3">
              //               <td>
              //                 <img src="https://tinylinks.ru/z8svi" style="border-radius: 20%; margin-bottom: -5px; width: 25px; margin-right: 5px">
              //                 Олимпиада газпром
              //               </td>
              //               <td style="padding-left: 20px;">
              //                 <img src="https://tinylinks.ru/a6bd9" style="border-radius: 20%; margin-bottom: -5px; width: 25px; margin-right: 5px">
              //                 Онлайн олимпиада ф.
              //               </td>
              //             </tr>
              //             <tr id="r-3">
              //               <td>
              //                 <img src="https://tinylinks.ru/sld5o" style="border-radius: 20%; margin-bottom: -5px; width: 25px; margin-right: 5px">
              //                 Олимпиада НТИ
              //               </td>
              //               <td style="padding-left: 20px;">
              //                 <img src="https://tinylinks.ru/xngym" style="border-radius: 20%; margin-bottom: -5px; width: 25px; margin-right: 5px">
              //                 Ломоносов хим.
              //               </td>
              //             </tr>
              //             <tr id="r-3">
              //               <td>
              //                 <img src="https://tinylinks.ru/2t9ao" style="border-radius: 20%; margin-bottom: -5px; width: 25px; margin-right: 5px">
              //                 Иннополис ИБ
              //               </td>
              //               <td style="padding-left: 20px;">
              //                 <img src="https://tinylinks.ru/x3j18" style="border-radius: 20%; margin-bottom: -5px; width: 25px; margin-right: 5px">
              //                 Олимпиада СПбГУ
              //               </td>
              //             </tr>
              //           </tbody>
              //         </table>
              //       </div>
              //     </h6>
              //   </div>`
              // ]
            }
            obj.allText = false;
            obj.slide = ref(1);
            obj.createdAt = new Date(obj.createdAt).toLocaleString("ru", timeFormatOptions);
            obj.likeIcon = obj.isLiked ? 'mdi-heart' : 'mdi-heart-outline';
            return obj;
          })();
        }

        if (requestResults.length <= 10) {
          this.areAllPostsLoaded = true;
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
  @import url('https://fonts.cdnfonts.com/css/gilroy-bold');
  .news-item {
    max-width: 75%;
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
    font-size: clamp(14px, 1.8vw, 20px);
  }

  .created-at {
    padding-left: 5px;
    font-size: clamp(10px, 2.5vw, 16px);
  }

  .info-block {
    top: -21px;
    height: 0px;
    z-index: 1; 
    position:relative;
    font-family: 'Gilroy-Medium', sans-serif;
    font-size: 16px;
    color: #1F3264;
    display: flex;
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
      max-width: 100%;
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