<!-- frontend/src/views/Home.vue -->
<template>
  <h1>Яндекс</h1>
</template>

<script>
  import { postRequest, apiHost } from '@/services/postRequest';

export default {
  data() {
    return {
      queryParams: null,
      apiHost: apiHost,
    };
  },
  async mounted() {
    this.queryParams = this.$route.query;
    if (this.queryParams.code) {
      console.log(this.queryParams.code);
      await this.postRequest(`${this.apiHost}auth`, {
        code: this.queryParams.code,
      });
      // console.log(
      //   await this.postRequest(
      //     `https://oauth.yandex.ru/token/?grant_type=authorization_code&code=${this.queryParams.code}&client_id=34a4fadda62f45a694dd6f6d20e144a6&client_secret=9e4eaa5263b84d38ad1c854774588ec1`,
      //     {}
      //     )
      //   );
    }

    // this.checkAuthStatus();
  },
  methods: {
    postRequest(url, data) {
      return postRequest(url, data);
    }
  },
};
</script>
