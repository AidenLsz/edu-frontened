<template>
  <div class="similarity"  style="margin-top: 5vh">
    <div class="panel">
      <el-row justify="start" type="flex">
        <el-col style="padding-left: 25px">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>相似试题评估</el-breadcrumb-item>
          </el-breadcrumb>
        </el-col>
      </el-row>

      <el-row style="padding: 1vh 3vw 0 3vw">
        <el-col :span="11">
          <ComplexInput @Update_CI="UCI_Left" @Update_Image="UCII_Left" @Full_Change="FullChange_L" ref="CI_Left" :class="OpacityCheck(0)"></ComplexInput>
        </el-col>

        <el-col :span="11" :offset="2">
          <ComplexInput @Update_CI="UCI_Right" @Update_Image="UCII_Right" @Full_Change="FullChange_R" ref="CI_Right" :class="OpacityCheck(1)"></ComplexInput>
        </el-col>
      </el-row>

      <el-row type="flex" justify="end" style="padding: 1vh 3vw 0 3vw">
        <el-button type="primary" value="提交" @click="submit">评估</el-button>
      </el-row>

      <div id="result" style="border-top: 3px solid #ccc; margin: 3vh 3vw 0 3vw; padding-top: 2vh">
        <el-row type="flex" justify="start">
          <h4 style="color: black">评估结果：</h4>
        </el-row>
        <el-row v-if="show_result">
          <el-col :span="11">
            <el-card class="box-card" style="background: #F8FBFF">
              <div slot="header" style="text-align:left;">
                <span>相似度</span>
              </div>
              <div style="text-align:left;">
                <el-tag style="background: #F8FBFF; border: 0px; color: black; font-size: 14px" 
                  v-for="(item, index) in similarity_result" :key="index" effect="plain" id="tag">{{ item }}</el-tag>
              </div>
            </el-card>
          </el-col>
          <el-col :span="11" :offset="2"> </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
// import Mathdown from "./Mathdown.vue";
// import UploadImg from "./UploadImg.vue";
import ComplexInput from "./ComplexInput.vue"
export default {
  components: {ComplexInput},
  name: "similarity",
  data() {
    return {
      content_1: "", // 用户输入试题1文本
      content_2: "", // 用户输入试题2文本
      similarity_result: "", // 相似度预估返回值
      show_result: false,
      loading: false,
      // src_0: [],
      // src_1: [],
      images_Left: [],
      images_Right: [],
      // index_0: 0,
      // index_1: 0,
      visibleList: [false, false]
    };
  },
  methods: {
    OpacityCheck(Index){
      if(this.visibleList[Index]){
        return "unvisible"
      }
    },
    FullChange_L(val){
      this.visibleList.splice(1, 1, val); 
    },
    FullChange_R(val){
      this.visibleList.splice(0, 1, val); 
    },
    // 提交评估按钮，向后端发送请求
    submit() {
      document.documentElement.scrollTop = 200;
      this.loading = true;
      this.show_result = true;
      let param = new FormData();
      let config = {
        headers: { "Content-Type": "multipart/form-data" }
      };

      var temp_image_left = []
      var temp_image_right = []

      for (var i = 0; i < this.images_Left.length; i++) {
        temp_image_left.push(this.images_Left[i]);
      }

      for (var j = 0; j < this.images_Right.length; j++) {
        temp_image_right.push(this.images_Right[j]);
      }

      param.append("image_left", JSON.stringify(temp_image_left));
      param.append("image_right",JSON.stringify(temp_image_right));
      param.append("content_1", this.content_1); // 后端接收content1字段
      param.append("content_2", this.content_2); // 后端接收content2字段
      // 请求相似度预估接口
      this.$http
        .post(this.backendIP + "/api/similarity", param, config, {
          emulateJSON: true
        })
        .then(function(data) {
          this.similarity_result = data.data.similarity;
          this.loading = false;
        });
    },
    // imgInfo_0(e) {
    //   this.src_0 = e.src;
    //   this.images_0 = e.filelists;
    // },
    // imgInfo_1(e) {
    //   this.src_1 = e.src;
    //   this.images_1 = e.filelists;
    // },
    // del_image_0(){
    //   this.src_0.splice(this.index_0, 1);
    //   this.images_0.splice(this.index_0, 1);
    // },
    // del_image_1(){
    //   this.src_1.splice(this.index_1, 1);
    //   this.images_1.splice(this.index_1, 1);
    // },
    // change_index_0: function(key1){
    //   this.index_0 = key1;
    // },
    // change_index_1: function(key1){
    //   this.index_1 = key1;
    // },
    UCI_Left(val){
      this.content_1 = val;
    },
    UCII_Left(val){
      this.images_Left = val;
    },
    UCI_Right(val){
      this.content_2 = val;
    },
    UCII_Right(val){
      this.images_Right = val;
    }
  }
};
</script>

<style scoped lang="scss">
.similarity {
  // background: url("../assets/sub_bg.png");
  background-size: 100%;
  // padding: 20px 20px 0px 20px;
}
.panel {
  background-color: #fff;
  border-radius: 4px;
  min-height: 700px;
  box-shadow: none;
}
.logo {
  margin-left: 50px;
}
.format_content {
  margin-top: 20px;
  border: 1px solid #999;
  height: 350px;
  overflow: scroll;
}
.el-row {
  margin-bottom: 20px;
  & :last-child {
    margin-bottom: 0;
  }
}
.title {
  text-align: left;
  font-weight: bold;
  font-size: 22px;
  color: #0a1612;
}
.el-col {
  border-radius: 4px;
}
.unvisible{
  opacity: 0;
}
// .el-button {
//   background-color: #1a2930;
//   color: #fff;
//   border-color: #1a2930;
// }
// .el-button:hover {
//   background-color: #008080;
//   color: #fff;
//   border-color: #fff;
// }
// .el-button:focus {
//   outline: none;
//   background-color: #008080;
//   color: #fff;
//   border-color: #fff;
// }
</style>
<style scoped>
#tabs /deep/ .el-tabs__item {
  color: #0a1612;
  font-weight: 900;
}
#tabs /deep/ .el-tabs__item.is-active {
  background-color: #0a1612;
  color: #fff;
  font-weight: 900;
}
#tag /deep/ .el-tag {
  background-color: #fff !important;
  color: #000 !important;
  border-color: #c5c1c0 !important;
}
</style>
