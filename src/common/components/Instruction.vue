<template lang="html">
  <el-dialog
      :visible.sync="visible"
      title="使用说明"
      top="5%"
      width="80%"
      :modal-append-to-body="false"
      :close-on-click-modal="true"
      >
      <el-carousel :autoplay="false" arrow="always" height="70vh">
        <el-carousel-item v-for="(item,i) in data" :key="i">
          <div class="desc">{{i+1}}、{{item.desc}} </div>
          <div class="img-container">
            <img :src="item.imgSrc" alt="">
          </div>
        </el-carousel-item>
      </el-carousel>
  </el-dialog>
</template>

<script>

export default {
  data(){
    return {
      visible:false,
    }
  },
  props:{
    data:{
      type:Array
    },
  },
  methods:{
    openDialog(){
      this.visible=true
    },
  }
}
</script>

<style lang="scss" scoped="">
.el-carousel__item {
  .desc{
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    text-align: left;
    text-indent: 2em;
  }
  .img-container{
    height:100%;
    display: flex;
    align-items: center;
    img{
      max-width: 100%;
      max-height: 100%;
      // overflow-y: scroll;
      padding:5vh;
      margin: auto;
    }
  }

}

</style>
