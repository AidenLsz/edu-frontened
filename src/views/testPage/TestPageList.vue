<template>
  <div class="box">
      <el-dialog
        :visible.sync="imgCut"
        width="65%"
        :modal-append-to-body="false"
        :close-on-click-modal="false">
        <div slot="title" style="margin-bottom: -25px">
          <label style="font-size: 16px">预览或裁剪要用于搜索的图片</label>
        </div>
        <el-row style="margin: 0px; padding: 0px">
          <el-col :span="15">
            <el-row type="flex" justify="center" style="margin-bottom: 10px">
              <label>待裁剪图片</label>
            </el-row>
            <el-row>
              <VueCropper
                style="width: 100%; height: 400px"
                ref="cropper"
                :img="option.img"
                :autoCrop="option.autoCrop"
                :canMove="option.canMove"
                :centerBox="option.centerBox"
                :canScale="option.canScale"
              ></VueCropper>
            </el-row>
          </el-col>
          <el-col :span="8" :offset="1">
            <el-row type="flex" justify="center" style="margin-bottom: 10px">
              <label>裁剪结果预览</label>
            </el-row>
            <el-row>
              <el-image class="pic" :src="imgUrl" alt="" style="width: 100%; height: 200px; border: 1px dashed black" :fit="'contain'">
                <div slot="error">
                  <span>等待截屏内容</span>
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
            <el-row type="flex" justify="center" style="margin-top: 33px">
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
        <!-- <div class="btn">
        <el-button type="primary" @click="getCropData()">截图</el-button>
        <el-button
            type="primary"
            icon="el-icon-refresh-left"
            @click="rotateLeft()"
        ></el-button>
        <el-button
            type="primary"
            icon="el-icon-refresh-right"
            @click="rotateRight()"
        ></el-button>
        <el-button type="primary" @click="refresh()">重置</el-button>
        </div> -->
          </el-dialog>
    <input
        type="file"
        @change="pictureSearch($event)"
        accept=".jpeg, .png, .jpg"
        ref="picSearchInput"
        />
    </div>

</template>
<script>


export default {

    components: {},
    name: "TestPageList",
    mounted(){
    },
    data(){
        return {
            option: {
                img: "https://sucai.suoluomei.cn/sucai_zs/images/20201009165025-bg.png", // 裁剪图片的地址
                autoCrop: true, //是否默认生成截图框
                fixedBox: true, //固定截图框大小 不允许改变
                canMove: false,
                centerBox: true,
                canScale: false,
            },
            imgUrl: "",
            imgCut: false
        };
    },
    methods: {
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
          _this.imgCut = true;
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
.box {
  margin: 30px auto 0;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
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
</style>