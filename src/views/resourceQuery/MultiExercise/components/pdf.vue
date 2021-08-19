<template lang="html">
  <div class="pdf" v-show="fileType === 'pdf'" style=" position:relative;">
    <div class="pagenation">
        <span :class="{grey: currentPage==1}">
          <i @click="changePdfPage(0)" class="el-icon-arrow-left"></i>
        </span>
        {{currentPage}} / {{pageCount}}
        <span :class="{grey: currentPage==pageCount}">
          <i @click="changePdfPage(1)" class="el-icon-arrow-right"></i>
        </span>
    </div>
    <span class="info">
      现在尚未能对pdf文件进行查重。
    </span>
    <pdf
      :src="src"
      :page="currentPage"
      class="pdf-content"
      @num-pages="pageCount=$event"
      @page-loaded="currentPage=$event"
      @loaded="loadPdfHandler">
    </pdf>
  </div>
</template>
<script>
import pdf from 'vue-pdf'
export default {
  components: {
    pdf
  },
  data() {
    return {
      currentPage: 0, // pdf文件页码
      pageCount: 0, // pdf文件总页数
      fileType: 'pdf'
    }
  },
  props: {
    src: {
      type: String,
      // default: function(){
      // }
    }
  },
  methods: {
    changePdfPage(val) {
      // console.log(val)
      if (val === 0 && this.currentPage > 1) {
        this.currentPage--
        // console.log(this.currentPage)
      }
      if (val === 1 && this.currentPage < this.pageCount) {
        this.currentPage++
        // console.log(this.currentPage)
      }
    },
    loadPdfHandler(e) {
      console.log(e);
      this.currentPage = 1 // 加载的时候先加载第一页
    }

  }
}
</script>

<style lang="css" scoped>
.grey{
  color: grey
}
.pdf-content{
  border: 1px solid grey;
}
.pagenation{
  position:absolute;
  font-size: 22px;
  font-weight: 700;
  top:60px;
  left:48%;
  z-index:3
}
.info{
  display: inline-block;
  width: 100%;
  padding: 10px;
  text-align: left;
  color: #c04851;;
}
</style>
