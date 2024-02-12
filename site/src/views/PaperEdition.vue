
<template>
  <div class="pdf-viewer">
    <PDF :src="this.paperEditionPath"/>
  </div>
  {{ paperEditionPath }}
</template>

<script>
import PDF from "pdf-vue3";

export default {
  components: {
    PDF
  },

  created() {
    this.paperEditionPath = this.$reqire('assets/paperEdition/' + this.$route.params.pathMatch.join('/') + '.pdf');
  },

  watch: {
      $route(to, from) {
        this.paperEditionPath = this.$reqire('assets/paperEdition/' + this.$route.params.pathMatch.join('/') + '.pdf');
        this.$router.go()
      }
    },
};
</script>

<style>
.pdf-viewer {
  margin-left: auto;
  margin-right: auto;
  width: 60lvw;
}
</style>
