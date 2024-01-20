
<template>
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
    let res = null;
    if (this.$route.params.key === 'yandex') {
      if (this.queryParams.code) {
        res = await this.postRequest(`${this.apiHost}auth/`, {
          code: this.queryParams.code,
          key: this.$route.params.key,
        });
        // this.$router.push(`../../`);
      }
    }

    console.log(res);
    localStorage.setItem('token', res.data.token);
    this.$router.push(`../../`);
  },
  methods: {
    postRequest(url, data) {
      return postRequest(url, data);
    },
  },
};
</script>
