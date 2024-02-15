
<template>
</template>

<script>
import { postRequest, apiHost } from '@/services/postRequest';
import VueCookies from 'vue-cookies';

export default {
  data() {
    return {
      queryParams: null,
      apiHost: apiHost,
    };
  },
  async mounted() {
    this.queryParams = this.$route.query;
    let res = null;
    if (this.$route.params.key === 'yandex') {
      if (this.queryParams.code) {
        res = await this.postRequest(`${this.apiHost}api/auth/`, {
          code: this.queryParams.code,
          key: this.$route.params.key,
        });
        // this.$router.push(`../../`);
      }
    }

    this.$cookies.set("token", res.data.token, "expiring time");
    this.$router.push(`../../`);
  },
  methods: {
    postRequest(url, data) {
      return postRequest(url, data);
    },
  },
};
</script>
