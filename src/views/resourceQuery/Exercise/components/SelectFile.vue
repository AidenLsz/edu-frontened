<template lang="html">
  <el-row type="flex" justify="start" style="margin-top:3px;height:20px;">
    <div class="btn_file">
      <p style="display: inline-block">
        <i class="el-icon-files"></i>选取文件
      </p>
      <input
        type="file"
        @change="selectFile($event)"
        accept=".docx, .doc"
        ref="eng_input"
      />
    </div>
    <p class="file-name">名称：{{fileName}}</p>

    <el-button type="text" v-if="fileName" @click="clearFile" style="color: LightGrey"><i class="el-icon-close"></i></el-button>
  </el-row>
</template>

<script>
export default {
  data(){
    return{
      fileName:'',
    }
  },
  methods:{
    // 导入大多数试卷时的方法
    selectFile(e){
      if(e.target.files.length <= 0){
        this.$alert('  请正确选择要进行分析的文件。', '提示', {
          confirmButtonText: '确定',
        });
        return;
      }
      this.fileName = e.target.files[0].name;
      let formData = new FormData();

      formData.append("files", e.target.files[0]);
      formData.append("data_format", '0')

      let config = {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      };
      this.$emit('upload',formData, config, e)
      // this.uploadFile();
    },
    clearFile(){
      this.fileName=""
      this.$emit('clearFile')
    }
  }
}
</script>

<style lang="scss" scoped>
.btn_file {
  position: relative;
  padding-top: 5px;
  background-color: #fff;
  height: 40px;
  width: 120px;
  line-height: 30px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  cursor: pointer;
}
input {
  position: absolute;
  top: 0;
  left: 0;
  height: 40px;
  width: 120px;
  overflow: hidden;
  cursor: pointer;
  opacity: 0;
}
.file-name{
  display: inline-block;
  margin-left: 30px;
  line-height:40px;
}
</style>
