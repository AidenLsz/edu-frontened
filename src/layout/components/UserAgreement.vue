<template>
  <div style="width: 60vw; margin-left: 20vw">
      <el-row
            v-for="i in numPages" 
            :key="i"
            style="padding: 0; margin: 10px; border: 1px solid #ccc">
        <el-col>
            <pdf
                :page="i"
                :src="pdfSrc"
                >
            </pdf>
            <el-row type="flex" justify="center">
                <p>第 {{i}} 页，共 {{numPages}} 页</p>
            </el-row>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" style="margin: 30px 0 30px 0">
        <el-button @click="ReadOverAgreement()" type="primary" :disabled="remaining > 0">确认{{GetRemainTimes()}}</el-button>
      </el-row>
  </div>
</template>
<script>
import pdf from 'vue-pdf'
export default {
  name: 'UserAgreement',
  components: {pdf},
  props: {

  },
  data() {
    return {
        pdfSrc: "/UserAgreement.pdf",
        numPages: -1,
        remaining: 10,
        remainingTracer: ""
    }
  },
  watch:{

  },
  mounted() {
      this.getNumPages();
      this.remainingTracer = setInterval(this.remainingCount, 1000);
  },
  methods: {
    ReadOverAgreement(){
        window.localStorage.setItem("UserAgreement", "1")
        window.close();
    },
    getNumPages() {
      let loadingTask = pdf.createLoadingTask(this.pdfSrc)
      loadingTask.promise.then(pdf => {
        this.numPages = pdf.numPages
      }).catch(err => {
        console.error('pdf 加载失败', err);
      })
    },
    GetRemainTimes(){
        if(this.remaining == 0){
            return ""
        }else{
            return " - 剩余" + this.remaining + "秒"
        }
    },
    remainingCount(){
        if(this.remaining > 0){
            this.remaining = this.remaining - 1
        }else{
            clearInterval(this.remainingTracer);
        }
    }
  },
}
</script>
<style >
</style>