<template>
  <div style="margin: 30px">
        <el-row style="margin: 0px; padding: 0px">
          <el-col :span="15">
            <el-row type="flex" justify="center" style="margin-bottom: 10px; font-size: 16px; line-height: 30px">
              <label>待裁剪图片</label>
            </el-row>
            <el-row v-if="option.img != ''">
              <VueCropper
                style="width: 100%; height: 400px"
                ref="cropper"
                :img="option.img"
                :autoCrop="option.autoCrop"
                :canMove="option.canMove"
                :centerBox="option.centerBox"
                :canScale="option.canScale"
                :autoCropWidth="1"
                :autoCropHeight="1"
              ></VueCropper>
            </el-row>
            <el-row v-else id="DragItem">
              <div class="btn_file" style="min-height: 400px">
                <div style="display: inline-block">
                  <i class="el-icon-plus" style="margin: 125px auto 20px auto; font-size: 60px"></i>
                  <p style="font-size: 20px">点击区域或拖拽图片入内以上传</p>
                </div>
                <input
                class="inputSp"
                  type="file"
                  @change="pictureSearch($event)"
                  accept=".jpeg, .png, .jpg"
                  ref="picSearchInput"
                  />  
              </div>
            </el-row>
          </el-col>
          <el-col :span="8" :offset="1">
            <el-row type="flex" justify="center" style="margin-bottom: 10px; font-size: 16px; line-height: 30px">
              <label>裁剪结果预览</label>
            </el-row>
            <el-row>
              <el-image class="pic" :src="imgUrl" alt="" style="width: 100%; height: 200px; border: 2px dashed black; background: #F8FBFF" :fit="'contain'">
                <div slot="error">
                  <i class="el-icon-loading" style="margin: 60px auto 10px auto; font-size: 30px"></i>
                  <p style="font-size: 20px">等待图片内容</p>
                </div>
              </el-image>
            </el-row>
            <el-row type="flex" justify="start" style="margin-top: 20px; margin-bottom: 20px">
              <el-col :span="12">
                <el-row type="flex" justify="center">
                  <el-button
                    type="primary"
                    icon="el-icon-refresh-left"
                    @click="rotateLeft()"
                    plain>
                    向左旋转
                  </el-button>
                </el-row>
              </el-col>
              <el-col :span="12">
                <el-row type="flex" justify="center">
                  <el-button
                    type="primary"
                    icon="el-icon-refresh-right"
                    @click="rotateRight()"
                    plain>
                    向右旋转
                  </el-button>
                </el-row>
              </el-col>
            </el-row>
            <el-row type="flex" justify="start" style="margin-top: 20px; margin-bottom: 20px"> 
              <el-col :span="12">
                <el-row type="flex" justify="center">
                  <el-button 
                    type="primary" 
                    icon="el-icon-scissors"
                    @click="getCropData()"
                    plain>
                    裁剪图片
                  </el-button>
                </el-row>
              </el-col>
              <el-col :span="12">
                <el-row type="flex" justify="center">
                  <el-button 
                    type="primary" 
                    icon="el-icon-refresh"
                    @click="refresh()"
                    plain>
                    重置裁剪
                  </el-button>
                </el-row>
              </el-col>
            </el-row>
            <el-row type="flex" justify="start" style="margin-top: 20px; margin-bottom: 20px"> 
              <el-col :span="12">
                <el-row type="flex" justify="center">
                  <el-button 
                    type="warning" 
                    icon="el-icon-delete"
                    @click="clearData()"
                    plain>
                    清空内容
                  </el-button>
                </el-row>
              </el-col>
              <el-col :span="12">
                <el-row type="flex" justify="center">
                  <el-button 
                    type="success" 
                    icon="el-icon-search"
                    @click="getCropData()"
                    plain>
                    确认提交
                  </el-button>
                </el-row>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
    </div>

</template>
<script>

export default {

    components: {},
    name: "TestPageList",
    data(){
        return {
            option: {
                img: "", // 裁剪图片的地址
                autoCrop: true, //是否默认生成截图框
                fixedBox: true, //固定截图框大小 不允许改变
                canMove: false,
                centerBox: true,
                canScale: false
            },
            imgUrl: "",
            imgCut: false
        };
    },
    mounted() {
      let upload = document.querySelector('#DragItem');
      upload.addEventListener('dragenter', this.onDragIn, true);
      upload.addEventListener('dragleave', this.onDragOut, true);
      upload.addEventListener('drop', this.onDrop, false);
    },
    methods: {
        clearData(){
          this.imgUrl = "";
          this.option.img = "";
        },
        onDragIn (e) {
          e.stopPropagation();
          e.preventDefault();
        },
        onDragOut (e) {
          e.stopPropagation();
          e.preventDefault();
        },
        onDrop (e) {
          e.stopPropagation();
          e.preventDefault();
          this.imgPreview(e.dataTransfer.files);
          this.$refs.picSearchInput.value = "";
          this.$refs.cropper.refresh();
        },
        //图片预览
        imgPreview (files) {
          const _this = this;
          let read = new FileReader();
          read.readAsDataURL(files[0]);
          read.onloadend = function () {  
            _this.show = true
            _this.option.img = read.result;
            _this.imgUrl = read.result;
          }
        },
        // 左旋转
        rotateLeft() {
          this.$refs.cropper.rotateLeft();
        },
        // 右旋转
        rotateRight() {
          this.$refs.cropper.rotateRight();
        },
        // 重置
        refresh() {
          this.$refs.cropper.refresh();
          this.imgUrl = this.option.img;
        },
        // 生成blob图片
        getCropData() {
          this.$refs.cropper.getCropData((data) => {
              this.imgUrl = data;
          })
        },
        // 照片上传
    pictureSearch(event){
      if(event.target.files){
        // 获取图片
        let Pic = event.target.files[0];
        // 保存读取内容用的临时变量
        var Picresult = "";
        // 获取this对象
        const _this = this;
        // 重置input组件
        this.$refs.picSearchInput.value = "";
        // Promise方法避免异步操作
        var promise = new Promise(function(resolve){
          // 用文件读取来读取图片的base64格式代码
          var reader = new FileReader();
          reader.readAsDataURL(Pic);
          reader.onloadend = function (e) { 
            Picresult = e.target.result;
            resolve('1');
          };
        });
        promise.then(function(){
          // 用捕捉到的this对象来进行搜索
          console.log(Picresult);
          _this.option.img = Picresult;
          _this.imgUrl = Picresult;
        }).catch(function(error){
          // 报错了就打印错误
          console.log(error)
        })
        
      }else{
        return 
      }
    }
    

    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.crop,
.pic {
  width: 600px;
  height: 400px;
  object-fit: cover;
}
.btn {
  display: flex;
  flex-direction: column;
}
.btn button {
  margin: 10px 0;
}
.btn_file {
  position: relative;
  min-height: 400px;
  width: 100%;
  background-color: #F8FBFF;
  border-radius: 2px;
  border: 2px dashed black;
  cursor: pointer;
}
.inputSp {
  position: absolute;
  top: 0;
  right: 0;
  height: 400px;
  width: 100%;
  overflow: hidden;
  cursor: pointer;
  opacity: 0;
}
</style>