
<template>
  <div style="display: flex;">
    <q-space></q-space>
    <q-spinner-bars
      v-if="!this.pdf.pages"
      color="cyan"
      size="xl"
    />
    <q-space></q-space>
  </div>
  <div class="pdf-viewer">
    <VuePDF 
      class="q-mb-sm"
      :pdf="this.pdf.pdf" 
      :page="page" 
      :key="page" 
      :width="window.innerWidth < 700 ? window.innerWidth * 0.9 : window.innerWidth * 0.6" 
      v-for="page in this.pdf.pages"/>
  </div>
</template>

<script>
import PDF from "pdf-vue3";
import { VuePDF, usePDF } from '@tato30/vue-pdf';
import '@tato30/vue-pdf/style.css';

export default {
  components: {
    PDF,
    VuePDF
  },

  data() {
    return {
      pdf: null,
    }
  },

  created() {
    this.paperEditionPath = this.$reqire('assets/paperEdition/' + this.$route.params.pathMatch.join('/') + '.pdf');
    this.pdf = usePDF({
      url: this.paperEditionPath,
      enableXfa: false,
    })
    this.window = window;
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
  width: fit-content;
}

</style>
