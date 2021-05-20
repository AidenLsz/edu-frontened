<template>
  <div class="ScreenShot">
    <div v-show="!show" class="pasteInputDiv" @paste="handlePaste">
      <input type="text" class="pasteInput" autosize 
      placeholder="请粘贴图片到此处" maxlength="0">
    </div>
    <div v-if="show" class="pasteImgDiv">
      <el-image
        class="pasteImg"
        :src="imgUrl"
        fit="fill"
        :preview-src-list="srcList"
        :z-index="3"
      >
      </el-image>
    </div>
    <el-row>
      <div id="upload" :class="DragAreaClass()">
        拖拽上传
      </div>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'ScreenShot',
  props: {
    url: {
      type: String,
      default: ''
    },
    httpRequest: {
      type: Function,
      default: function() {
        return 'null'
      }
    }
  },
  data() {
    return {
      show: false,
      srcList: [],
      file: null,
      imgUrl: this.url,
      dragArea: false
    }
  },
  watch:{
    imgUrl() {
      if (this.imgUrl === '') {
        this.show = false
        this.srcList = []
      } else {
        this.show = true
        if(this.srcList.length > 0){
            this.srcList.splice(0, 1, this.imgUrl)}
        else{
            this.srcList.push(this.imgUrl);
        }
      }
    }
  },
  mounted() {
    let upload = document.querySelector('#upload');
    upload.addEventListener('dragenter', this.onDragIn, true);
    upload.addEventListener('dragleave', this.onDragOut, true);
    upload.addEventListener('drop', this.onDrop, false);
  },
  methods: {
    DragAreaClass(){
      if(this.dragArea){
        return "uploadIn"
      }else{
        return "uploadOut"
      }
    },
    onDragIn (e) {
      this.dragArea = true;
      console.log("In");
      e.stopPropagation();
      e.preventDefault();
    },
    onDragOut (e) {
      this.dragArea = false;
      console.log("Out");
      e.stopPropagation();
      e.preventDefault();
    },
    onDrop (e) {
      e.stopPropagation();
      e.preventDefault();
      this.imgPreview(e.dataTransfer.files);
    },
    //图片预览
    imgPreview (files) {
      const _this = this;
      let read = new FileReader();
      read.readAsDataURL(files[0]);
      read.onloadend = function () {  
        _this.show = true
        _this.imgUrl = read.result;
      }
    },
    Action(resp, file, fileList){
      fileList
      const _this = this;
      var promise = new Promise(function(resolve, reject){

        // 此时file就是我们的剪切板中的图片对象
        const reader = new FileReader();
        reader.readAsDataURL(file)
        reader.onloadend = (event) => {
            _this.show = true
            _this.imgUrl = event.target.result;
            if(_this.imgUrl != ""){
                resolve('1')
            }else{
                reject('0')
            }
        }}
        )
        promise.then(function(){
            console.log(_this.imgUrl);
          }).catch(function(){
              console.log("Load Error")
          })
          
    },
    handlePaste(event) {
      const _this = this;
      const items = (event.clipboardData || window.clipboardData).items
      let file = null
      if (!items || items.length === 0) {
        this.$message.error('当前浏览器不支持本地')
        return
      }
      // 搜索剪切板items
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          file = items[i].getAsFile()
          break
        }
      }
      if (!file) {
        this.$message.error('粘贴内容非图片')
        return
      }
      var promise = new Promise(function(resolve, reject){

        // 此时file就是我们的剪切板中的图片对象
        const reader = new FileReader();
        reader.readAsDataURL(file)
        reader.onloadend = (event) => {
            _this.show = true
            _this.imgUrl = event.target.result;
            if(_this.imgUrl != ""){
                resolve('1')
            }else{
                reject('0')
            }
        }}
        )
        promise.then(function(){
            console.log(_this.imgUrl);
          }).catch(function(){
              console.log("Load Error")
          })
          

      },
      
        deleteImg() {

        }
    },
}
</script>
<style scoped>
    .ScreenShot{
        margin-top: 10px;
    }
    .pasteInputDiv{
        box-sizing: border-box;
        width: 158px;
        height: 158px;

    }
    .pasteInput{
        background-color: #fbfdff;
        border: 1px dashed #c0ccda;
        border-radius: 6px;
        height: 158px;
        line-height: 156px;
        vertical-align: top;
        width: 158px;
        font-size: 19px;
    }
    .pasteInput:hover{
        cursor: pointer;
        border: 1px dashed #409EFF;
    }
    .pasteImgDiv{
        position: relative;
        width: 158px;
        height: 158px;
    }
    .pasteImg{
        position: relative;
        width: 158px;
        height: 158px;
        border: 1px solid #c0ccda ;
        border-radius: 5px;
    }
    .close-position{
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 22px;
        background: #fff;
        border-radius: 50%;
        color: red;
        font-weight: bold;
        z-index: 9999;
    }
    .close-position:hover{
        cursor: pointer;
    }
    .uploadIn {
      margin: 100px auto;
      width: 400px;
      height: 400px;
      border: 2px dashed #f00;
    }
    .uploadOut {
      margin: 100px auto;
      width: 400px;
      height: 400px;
      border: 2px dashed blue;
    }
</style>