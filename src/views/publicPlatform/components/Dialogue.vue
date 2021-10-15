<template>
  <el-row>
    <div id="main">
      <div id="image">
        <!-- <i v-if="loading" class="el-icon-loading"></i> -->
        <img v-if="error" class="error" />
        <img
          v-else-if="identified == false"
          class="self_adaption"
          :src="image"
          alt="图片显示错误"
        />
        <Mathdown
          v-else
          :content="confirmed_content"
          class="content"
        ></Mathdown>
        <el-button type="primary" id="edit" @click="Open_Edit()"
          >编辑
        </el-button>
        <div id="shadow">
          <div class="dialog">
            <el-input
              style="position: absolute; left: 15px; top: 20px"
              type="text"
              size="large"
              placeholder="请输入url"
              v-model="url_input"
              clearable
            >
            </el-input>
          </div>
          <el-button
            type="primary"
            class="but"
            style="left: 41.25%"
            @click="url_update()"
          >
            url上传
          </el-button>
          <!-- <span style="position:absolute; color: #FFFFFF; font-size: 20px; top:25px; left: 450px;">或</span> -->
          <el-button
            type="primary"
            class="but"
            style="left: 57%"
            @click="Open_Pic_Search()"
          >
            本地上传
            <i class="el-icon-upload el-icon--right"></i>
          </el-button>
          <el-button
            type="primary"
            class="but"
            style="right: 20px"
            :disabled="identified"
            @click="identify()"
          >
            识别
          </el-button>
        </div>
      </div>

      <el-dialog
        :visible.sync="EditShow"
        title="LUNA输入助手"
        width="80%"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        @close="Reset_Interval()"
      >
        <ComplexInput
          @New_Content="UCI"
          :Get_Out_Content="content"
        ></ComplexInput>
        <el-button
          type="primary"
          style="position: relative; left: 500px"
          @click="confirm()"
        >
          确定
        </el-button>
      </el-dialog>

      <div id="option">
        <div
          v-for="(img, index) in optional_image"
          :key="img"
          class="optional_img"
          :style="{ left: index * 25 + 2.5 + '%' }"
          @click="ChooseDefaultImage(img)"
        >
          <img :src="img" :alt="'image' + index" class="self_adaption" />
        </div>
      </div>
    </div>

    <el-dialog
      :visible.sync="picSearchDialogShow"
      title="图片检索"
      width="80%"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      @close="Reset_Interval()"
    >
      <el-row type="flex" justify="start" style="margin-left: 2.4vw">
        <label style="margin-right: 3vw; margin-top: -0.3vh"
          >图片检索模式：</label
        >
      </el-row>
      <el-row style="margin: 0px; padding: 0px">
        <el-col :span="24">
          <el-row v-if="option.img != ''" type="flex" justify="center">
            <VueCropper
              style="
                width: 100%;
                height: 400px;
                margin-left: 2.4vw;
                margin-right: 2.4vw;
              "
              ref="cropper"
              :img="option.img"
              :autoCrop="option.autoCrop"
              :canMove="option.canMove"
              :centerBox="option.centerBox"
              :canScale="option.canScale"
              autoCropWidth="4096"
              autoCropHeight="2048"
            ></VueCropper>
          </el-row>
          <el-row v-else id="DragItem" type="flex" justify="center">
            <div class="btn_file" style="min-height: 400px">
              <div style="display: inline-block">
                <i
                  class="el-icon-plus"
                  style="margin: 125px auto 20px auto; font-size: 60px"
                ></i>
                <p style="font-size: 20px">点击区域或拖拽图片入内以上传</p>
                <p style="font-size: 20px">图片大小请不要超过1M</p>
              </div>
              <input
                id="loaded_image"
                class="inputSp"
                type="file"
                @change="pictureSearch($event)"
                accept=".jpeg, .png, .jpg"
                ref="picSearchInput"
              />
            </div>
          </el-row>
          <el-row type="flex" justify="start" style="margin-top: 30px">
            <el-col :span="4" :offset="4">
              <el-row type="flex" justify="center">
                <el-button
                  type="primary"
                  icon="el-icon-refresh-left"
                  @click="rotateLeft()"
                  plain
                >
                  向左旋转
                </el-button>
              </el-row>
            </el-col>
            <el-col :span="4">
              <el-row type="flex" justify="center">
                <el-button
                  type="primary"
                  icon="el-icon-refresh-right"
                  @click="rotateRight()"
                  plain
                >
                  向右旋转
                </el-button>
              </el-row>
            </el-col>
            <el-col :span="4">
              <el-row type="flex" justify="center">
                <el-button
                  type="warning"
                  icon="el-icon-delete"
                  @click="clearData()"
                  plain
                >
                  清空内容
                </el-button>
              </el-row>
            </el-col>
            <el-col :span="4">
              <el-row type="flex" justify="center">
                <el-button
                  v-if="option.img != ''"
                  type="success"
                  @click="ConfirmImg()"
                  plain
                >
                  确定
                </el-button>
                <el-button
                  v-else
                  type="danger"
                  icon="el-icon-close"
                  @click="Reset_Interval()"
                  plain
                >
                  关闭页面
                </el-button>
              </el-row>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-dialog>
  </el-row>
</template>

<script>
import ComplexInput from "@/common/components/ComplexInput.vue";
import Mathdown from "@/common/components/Mathdown.vue";
import { commonAjax } from "@/common/utils/ajax";
export default {
  components: {
    ComplexInput,
    Mathdown,
  },
  data() {
    return {
      content: "", // 用户输入试题文本
      confirmed_content: "", // 用户确认的文本
      identified: true, //false:显示要识别的图片  true:显示识别后的latex文本的数学形式
      filelists: [],
      EditShow: false,
      image: "",
      url_input: "",
      picSearchDialogShow: false,
      option: {
        img: "", // 裁剪图片的地址
        autoCrop: true, //是否默认生成截图框
        fixedBox: true, //固定截图框大小 不允许改变
        canMove: false,
        centerBox: true,
        canScale: false,
      },
      //图片是否需要转base64
      need_trans: 1,

      tableData: [
        {
          num: "1",
          content:
            "关 于 函 数 f ( x ) = 4 \\sin \\left ( 2 x + \\frac { \\pi } { 3 } \\right ) ( x \\in R ) ， 有 下 列 命 题 ：",
        },
        {
          num: "2",
          content:
            "① y = f ( x ) 的 表 达 式 可 改 写 为 y = 4 \\cos \\left ( 2 x - \\frac { \\pi } { 6 } \\right ) ；",
        },
        {
          num: "3",
          content:
            "② y = f ( x ) 是 以 2 π 为 最 小 正 周 期 的 周 期 函 数 ；,",
        },
        {
          num: "4",
          content:
            "2 y = f ( x ) 的 图 象 关 于 点 \\left ( - \\frac { \\pi } { 6 } , 0 \\right ) 对 称 ；",
        },
        {
          num: "5",
          content:
            "④ y = f ( x ) 的 图 象 关 于 直 线 x = - \\frac { \\pi } { 6 } 对 称 。",
        },
        {
          num: "6",
          content:
            "其 中 正 确 的 命 题 的 序 号 是 _ _ _ _ _ _ _ _ _ _ _ _ 。 （ 注 ： 把 你 认 为 正 确 的 命 题 的 序 号 都 填 上 上",
        },
      ],
      // loading: false,
      error: false,
      qid: 0,
      size: 0,
      type: "",
      base64_code: "",
    };
  },
  props: {
    optional_image: [
      // require("@/assets/default_image/0.png"),
      // require("@/assets/default_image/1.png"),
      // require("@/assets/default_image/2.png"),
      // require("@/assets/default_image/3.png")
    ],
  },
  watch: {
    confirmed_content(newVal) {
      setTimeout(() => {
        this.$emit("Update_CI", newVal);
      }, 10);
    },
  },
  methods: {
    Reset_Interval() {
      clearInterval(this.Paste_Catcher);
      this.EditShow = false;
      this.picSearchDialogShow = false;
      window.removeEventListener("paste", this.Paste_Function);
    },
    //打开LUNA输入助手
    Open_Edit() {
      this.EditShow = true;
      console.log("success\n");
    },
    confirm() {
      this.EditShow = false;
      this.confirmed_content = this.content;
      this.identified = true;
    },

    Open_Pic_Search() {
      this.Init_Img_Paster();
      this.Paste_Catcher = setInterval(() => {
        if (sessionStorage.getItem("PicPaste")) {
          this.option.img = sessionStorage.getItem("PicPaste");
        }
      }, 20);
      this.picSearchDialogShow = true;
      console.log("success\n");
    },
    // 尝试利用截图工具的粘贴板
    Init_Img_Paster() {
      window.addEventListener("paste", this.Paste_Function);
    },
    Paste_Function(e) {
      let Pic = e.clipboardData.items[0].getAsFile();
      // 保存读取内容用的临时变量
      var Picresult = "";
      // Promise方法避免异步操作
      var promise = new Promise(function (resolve) {
        // 用文件读取来读取图片的base64格式代码
        var reader = new FileReader();
        reader.readAsDataURL(Pic);
        reader.onloadend = function (e) {
          Picresult = e.target.result;
          resolve("1");
        };
      });
      promise
        .then(function () {
          // 用捕捉到的this对象来进行搜索
          sessionStorage.setItem("PicPaste", Picresult);
        })
        .catch(function (err) {
          // 报错了就打印错误
          console.log(err);
          alert("您最新的粘贴对象不是图片内容。");
        });
    },
    // 左旋转
    rotateLeft() {
      this.$refs.cropper.rotateLeft();
    },
    // 右旋转
    rotateRight() {
      this.$refs.cropper.rotateRight();
    },
    // 生成blob图片
    getCropData() {
      this.$refs.cropper.getCropData((data) => {
        this.submit(1, data);
        this.picSearchDialogShow = false;
      });
    },
    // 照片上传
    pictureSearch(event) {
      if (event.target.files) {
        // 获取图片
        let Pic = event.target.files[0];
        // 保存读取内容用的临时变量
        var Picresult = "";
        // 获取this对象
        const _this = this;
        // 重置input组件
        this.$refs.picSearchInput.value = "";
        // Promise方法避免异步操作
        var promise = new Promise(function (resolve) {
          // 用文件读取来读取图片的base64格式代码
          var reader = new FileReader();
          reader.readAsDataURL(Pic);
          reader.onloadend = function (e) {
            Picresult = e.target.result;
            resolve("1");
          };
        });
        promise
          .then(function () {
            // 用捕捉到的this对象来进行搜索
            _this.option.img = Picresult;
          })
          .catch(function (error) {
            // 报错了就打印错误
            console.log(error);
          });
      } else {
        return;
      }
    },

    clearData() {
      sessionStorage.setItem("PicPaste", "");
      this.option.img = "";
    },

    ConfirmImg() {
      this.error = false;
      this.identified = false;
      this.image = this.option.img;
      this.need_trans = 0;
      this.Reset_Interval();
    },

    url_update() {
      // this.image = this.url_input;
      this.error = false;
      this.image = require("@/assets/loading.gif");
      this.identified = false;
      var newImg = new Image();
      newImg.src = this.url_input;
      newImg.onload = () => {
        // 图片加载成功后把地址给原来的img
        this.image = newImg.src;
      };
      newImg.onerror = () => {
        console.log("error\n");
        this.error = true;
      };
      this.need_trans = 1;
    },

    ChooseDefaultImage(default_image) {
      this.error = false;
      this.image = default_image;
      this.need_trans = 1;
      this.identified = false;
    },

    getBase64(url) {
      return new Promise((resolve) => {
        var Img = new Image();
        var dataURL = "";
        Img.setAttribute("crossOrigin", "Anonymous");
        Img.src = url + "?v=" + Math.random();
        Img.onload = function () {
          // 要先确保图片完整获取到，这是个异步事件
          var canvas = document.createElement("canvas"); // 创建canvas元素
          var width = Img.width; // 确保canvas的尺寸和图片一样
          var height = Img.height;
          canvas.width = width;
          canvas.height = height;
          canvas.getContext("2d").drawImage(Img, 0, 0, width, height);
          var ext = Img.src
            .substring(Img.src.lastIndexOf(".") + 1)
            .toLowerCase();
          dataURL = canvas.toDataURL("image/" + ext); // 转换图片为dataURL
          //this.base64_code = dataURL;
          //console.log("size=" + this.size);
          resolve(dataURL);
        };
      });
    },

    async identify() {
      //let reader = new FileReader();
      this.identified = true;
      this.tableData = [];
      this.content = "";
      this.confirmed_content = "识别中...";
      let result, data;
      let res = "!!!";
      console.log("执行");
      console.log(this.image + "!!!");

      if (this.need_trans == 1) {
        //要转
        try {
          res = await this.getBase64(this.image);
        } catch (err) {
          console.log(err);
        }
        this.base64_code = res; // 将结果赋值给需要用的变量属性
        console.log(this.base64_code); // 获取到结果
      } else this.base64_code = this.image;

      console.log(this.base64_code.length);
      if (this.base64_code.length / 1024 > 1024) {
        alert("抱歉，您上传的图片过大，请重新上传");
        return;
      }

      try {
        data = await commonAjax(
          "https://formula-recognition-service-157-production.env.bdaa.pro/v1",
          {
            image: this.base64_code,
            qid: this.qid,
          }
        );
      } catch (err) {
        console.log(err);
      }

      console.log(data);
      result = data.data;
      this.qid++;
      console.log(result.qid);
      console.log(result.latex.length);
      if (result.success && result.is_formula && result.detect_formula) {
        console.log("success!");
        if (typeof result.latex == "object") {
          for (let i = 0; i < result.latex.length; i++) {
            // console.log(i,result.latex[i])
            this.tableData.push({
              content: result.latex[i],
              num: i + 1,
            });
            this.content += "$" + result.latex[i] + "$\\";
          }
        } else if (typeof result.latex == "string") {
          this.content = "$" + result.latex + "$";
        }
        this.confirmed_content = this.content;
      } else {
        console.log("fail!");
        this.confirmed_content = "识别失败";
        this.tableData.length = 0;
      }
      //console.log(this.tableData[0].content);
    },

    // Update Complex Input，将组合输入的内容复制到当前搜索框应该具有的内容里
    UCI(val) {
      this.content = val;
    },
    // Update Complex Input Image，将组合输入的内容的图片部分复制到当前页面的内容里，如果后续又要用到则进行调用
    UCII(val) {
      this.filelists = val;
    },
  },
};
</script>

<style lang="scss" scoped>
#main {
  position: absolute;
  margin: auto;
  width: 100%;
  height: 100%;
  //margin-bottom: 100px;
}

#image {
  position: absolute;
  background-color: #eef5fe;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 77%;
  border-color: #777a7f;
  border-width: 2px 2px 2px 2px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  border-radius: 4px;
}

.content {
  position: absolute;
  word-break: break-all;
  margin: 10px 10px 10px 10px;
  max-width: 90%;
  /* text-align: center; */
  top: 16%;
  // transform: translate(-50%,0);
}

#option {
  position: absolute;
  top: 77%;
  left: 0px;
  width: 100%;
  height: 23%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  border-radius: 4px;
}

#shadow {
  position: absolute;
  display: block;
  /* background-color: rgba($color: #535353, $alpha: 0.5); */
  background-color: rgba(83, 83, 83, 0.5);
  bottom: 0px;
  width: 100%;
  height: 80px;
}

.dialog {
  position: absolute;
  width: 37.5%;
  height: 30px;
}

.but {
  position: absolute;
  display: block;
  bottom: 20px;
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

.optional_img {
  position: absolute;
  top: 20%;
  width: 20%;
  height: 60%;
}

.self_adaption {
  position: absolute;
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}

.optional_img img {
  opacity: 0.4;
  transition: width 1s, height 1s, opacity 1s;
  -webkit-transition: width 1s, height 1s, opacity 1s;
}

.optional_img img:hover {
  opacity: 1;
  cursor: pointer;
  max-width: 110%;
  max-height: 110%;
}

#image img.error::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background-color: #ffffff;
  background-image: url("../../../assets/failure.png");
  background-repeat: no-repeat;
  background-position: 20% 50%;
  background-size: 30%;
}

#image img.error::after {
  content: "加载失败！\A\D 请确认输入的url有效！";
  position: absolute;
  left: 25%;
  top: 36%;
  width: 100%;
  line-height: 2;
  color: black;
  font-size: 20px;
  text-overflow: ellipsis;
  white-space: pre;
}

#edit {
  position: absolute;
  //background-color: #000000;
  right: 20px;
  top: 20px;
}

// #edit /deep/ .el-button--goon {
// 	background-color: #000000;
// }
</style>
