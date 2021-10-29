<template>
  <div
    class="segmentation"
    v-loading="File_Uploading"
    element-loading-text="加载中，请等待..."
    element-loading-spinner="el-icon-loading"
    style="
      padding-top: 10px;

      min-height: 100vh;
    "
  >
    <!-- <div class="panel"> -->
    <div style="position: relative; padding-left: 10%; padding-right: 10%">
      <el-row justify="start" type="flex">
        <el-col>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>AI实验室</el-breadcrumb-item>
            <el-breadcrumb-item></el-breadcrumb-item>
          </el-breadcrumb>
        </el-col>
      </el-row>

      <el-row
        justify="start"
        type="flex"
        style="margin-top: 8px; margin-bottom: 48px"
      >
        <p style="font-size: 48px">
          试题打散入库
          <!-- <span @click="openInstructionDialog" style="cursor: pointer">
              <i class="el-icon-question"></i>
            </span> -->
        </p>
      </el-row>

      <div id="block_container">
        <div id="color_block">
          <p
            style="
              position: absolute;
              right: 24px;
              bottom: 24px;
              font-size: 10px;
            "
          >
            LUNA @2021
          </p>
        </div>
      </div>

      <el-row type="flex" justify="start" :gutter="40">
        <el-col :span="14">
          <el-row type="flex" justify="start">
            <el-col>
              <!-- 学段选择 -->
              <el-row type="flex" justify="start" style="margin-bottom: 32px">
                <el-col :span="3">
                  <el-row
                    type="flex"
                    justify="start"
                    style="height: 40px; line-height: 40px; font-size: 18px"
                  >
                    <label>学段</label>
                  </el-row>
                </el-col>
                <el-col :span="20" :offset="1">
                  <el-row type="flex" justify="start">
                    <el-select v-model="Period" placeholder="请选择学段">
                      <el-option
                        v-for="item in Period_List"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </el-row>
                </el-col>
              </el-row>
              <!-- 科目选择 -->
              <el-row type="flex" justify="start" style="margin-bottom: 32px">
                <el-col :span="3">
                  <el-row
                    type="flex"
                    justify="start"
                    style="height: 40px; line-height: 40px; font-size: 18px"
                  >
                    <label>科目</label>
                  </el-row>
                </el-col>
                <el-col :span="20" :offset="1">
                  <el-row type="flex" justify="start">
                    <el-select
                      v-model="Subject"
                      placeholder="请选择科目"
                      @change="default_paper"
                    >
                      <el-option
                        v-for="item in Subject_List"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </el-row>
                </el-col>
              </el-row>
              <!-- 标题输入 -->
              <!-- <el-row type="flex" justify="start" style="margin-bottom: 32px">
                <el-col :span="3">
                  <el-row
                    type="flex"
                    justify="start"
                    style="height: 40px; line-height: 40px; font-size: 18px"
                  >
                    <label>试卷标题</label>
                  </el-row>
                </el-col>
                <el-col :span="20" :offset="1">
                  <el-row type="flex" justify="start" style="width: 100%">
                    <el-input
                      v-model="Title"
                      placeholder="请输入试卷的标题信息"
                    ></el-input>
                  </el-row>
                </el-col>
              </el-row> -->
              <el-row type="flex" justify="start">
                <el-col :span="3">
                  <el-row
                    type="flex"
                    justify="start"
                    style="height: 40px; line-height: 40px; font-size: 18px"
                  >
                    <label>文件名称</label>
                  </el-row>
                </el-col>
                <el-col :span="20" :offset="1">
                  <el-row
                    type="flex"
                    justify="start"
                    style="height: 40px; line-height: 40px; width: 100%"
                  >
                    {{ File_Name }}
                  </el-row>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="8">
          <!-- <el-upload
            class="upload-demo"
            drag
            action="https://jsonplaceholder.typicode.com/posts/"
            multiple
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
          </el-upload> -->
          <el-row
            id="drop_area"
            :style="{ cursor: borderhover ? 'pointer' : 'auto' }"
            type="flex"
            justify="center"
            align="middle"
            class="upload"
            @click.native="File_Import()"
          >
            <input
              type="file"
              accept=".doc, .docx"
              id="fileSelect"
              :multiple="false"
              style="display: none"
            />
            <el-col :span="24">
              <el-row>
                <el-col :span="24">
                  <i
                    class="el-icon-upload"
                    style="font-size: 80px; width: 100%"
                  ></i>
                </el-col>
              </el-row>
              <el-row style="font-size: 15px"> 点击或拖拽上传 </el-row>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="2"></el-col>
        <!-- <el-col :span="2"></el-col> -->
      </el-row>

      <!-- 只打散，不入库 -->
      <!-- <el-row type="flex" justify="start" style="margin-top: 32px">
        <el-button type="primary" @click="Divider_Final_Check()">
          开始入库
        </el-button>
      </el-row> -->
    </div>
    <el-row v-show="Show_Result" style="margin-top: 112px; margin-bottom: 80px">
      <i
        class="el-icon-d-arrow-right"
        style="transform: rotate(90deg); font-size: 40px"
      ></i>
    </el-row>

    <el-row v-show="Show_Result" id="result" type="flex" justify="center">
      <el-col :span="5"></el-col>
      <el-col :span="14">
        <div
          style="
            min-height: 100vh;
            padding: 20px 2vw 20px 2vw;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12),
              0 0 6px rgba(0, 0, 0, 0.04);
            border-radius: 4px;
            border: 3px solid #409eff;
            background-color: #ffffff;
          "
        >
          <div style="min-height: 90vh">
            <el-row
              v-for="(Item, Item_Index) in Paper_Content"
              :key="'Line_' + Item_Index"
            >
              <el-col>
                <el-row
                  v-if="Item != 'DIVIDER_LINES' && Item.para_type == '0'"
                  :style="Item.para_style"
                >
                  <span
                    v-for="(message, index_i) in Item.runs"
                    :key="'Line_' + Item_Index + '_' + index_i + '_run'"
                    :style="message.run_style"
                  >
                    <span
                      v-if="message.run_type == '0'"
                      v-html="message.run_text"
                    ></span>
                    <img
                      class="image"
                      v-else-if="message.run_type == '1'"
                      :src="Paper_Image_Dict[message.image.src]"
                      :width="message.image.width"
                      :height="message.image.height"
                      :style="message.image.style"
                      :alt="message.image.alt"
                    />
                  </span>
                </el-row>
                <el-row v-if="Item != 'DIVIDER_LINES' && Item.para_type == '1'">
                  <div :style="Item.para_style">
                    <span v-html="Table_Img_Get(Item.table_raw_html)"></span>
                  </div>
                </el-row>
                <el-row
                  v-if="Item == 'DIVIDER_LINES'"
                  style="height: 30px; padding-top: 15px; padding-bottom: 15px"
                >
                  <el-col>
                    <el-row
                      :style="
                        'border-top: 2px dashed ' +
                        (Paper_Divider_Index == Item_Index ? 'red' : '#ccc') +
                        '; width: 100%;'
                      "
                    ></el-row>
                  </el-col>
                </el-row>
                <el-row
                  v-if="
                    Item != 'DIVIDER_LINES' &&
                    Item_Index != Paper_Content.length - 1 &&
                    Paper_Content[Item_Index + 1] != 'DIVIDER_LINES'
                  "
                  style="height: 14px; width: 100%; padding-top: 6px"
                >
                  <el-col>
                    <el-row
                      v-show="Paper_Divider_Index == Item_Index"
                      style="border-top: 2px dashed #409eff; width: 100%"
                    ></el-row>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
      <el-col :span="5">
        <div style="position: sticky; top: 5vw">
          <el-row
            type="flex"
            justify="start"
            style="margin-top: 80px; margin-bottom: 24px; margin-left: 32px"
          >
            <el-button icon="el-icon-arrow-up" @click="Up()"></el-button>
          </el-row>
          <!-- <el-row style="margin-bottom: 20px">
            <el-button
              icon="el-icon-refresh"
              @click="Paper_Data_Reset()"
              style="margin-right: 20px"
              >重置</el-button
            >
          </el-row> -->
          <el-row
            type="flex"
            justify="start"
            style="margin-bottom: 24px; margin-left: 32px"
          >
            <el-button icon="el-icon-delete" @click="Paper_Data_Clear()"
              >清空</el-button
            >
          </el-row>
          <el-row type="flex" justify="start" style="margin-left: 32px">
            <el-button
              type="primary"
              icon="el-icon-download"
              @click="Download()"
              >下载</el-button
            >
          </el-row>
          <!-- <el-row>
            <el-button
              type="primary"
              icon="el-icon-check"
              @click="Divider_Final_Check()"
              >提交</el-button
            >
          </el-row> -->
        </div>
      </el-col>
      <!-- <el-col :span="1"></el-col> -->
    </el-row>

    <!-- </div> -->
  </div>
</template>

<script>
//import $ from "jquery";
import Chinese from "@/assets/语文.json";
import English from "@/assets/英语.json";
import Physics from "@/assets/物理.json";
import History from "@/assets/历史.json";
import Geography from "@/assets/地理.json";
import Politics from "@/assets/政治.json";
import Biology from "@/assets/生物.json";
import Chemistry from "@/assets/化学.json";
import Math from "@/assets/数学.json";
import FileSaver from "file-saver";
//import { commonAjax } from "@/common/utils/ajax";
//require("./../assets/background_pagenum.png");
export default {
  components: {},
  name: "Segmentation",
  data() {
    return {
      // 试卷标题
      Title: "",
      // 用于显示最终录入科目的变量
      Subject: "语文",
      // 用于显示最终录入学段的变量
      Period: "高中",
      // 待选科目
      Subject_List: [
        { value: "语文", label: "语文" },
        { value: "数学", label: "数学" },
        { value: "英语", label: "英语" },
        { value: "历史", label: "历史" },
        { value: "政治", label: "政治" },
        { value: "地理", label: "地理" },
        { value: "物理", label: "物理" },
        { value: "化学", label: "化学" },
        { value: "生物", label: "生物" },
        { value: "其他", label: "其他" },
      ],
      // 待选学段
      Period_List: [
        { value: "小学", label: "小学" },
        { value: "初中", label: "初中" },
        { value: "高中", label: "高中" },
        { value: "大学", label: "大学" },
        { value: "成人", label: "成人" },
        { value: "其他", label: "其他" },
      ],
      // 获取文件的组件
      File_Selector: "",
      // 文件名称
      File_Name: "",
      // 是否正在等待文件切分完成
      File_Uploading: false,
      // 用于存放拿来显示的变量
      Paper_Content: [],
      // 用来进行初始结果的备份
      Paper_Content_BackUp: [],
      // 存放拿来进行显示的图片
      Paper_Image_Dict: {},
      // 标记切分点的变量
      Paper_Divider_Index: -1,
      // 是否显示切分结果
      Show_Result: false,
      // 拖拽是否到区域内
      borderhover: false,
      // 存放处理结果
      result: {},
    };
  },
  mounted() {
    this.ToTop();
    this.Init_File_Selector();
    this.Init_Dropbox();
    this.default_paper(this.Subject);
  },
  methods: {
    ToTop() {
      window.scrollTo(0, 0);
    },
    // 清空试卷数据
    Paper_Data_Clear() {
      this.$confirm(
        "您点击了清空当前试卷切分内容的按钮，当前的切分结果将被清空，您将需要重新导入其他试卷，确定要清空吗？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.Show_Result = false;
          this.File_Name = "";
          this.File_Uploading = false;
          this.Paper_Content = [];
          this.Paper_Image_Dict = {};
          this.Paper_Divider_Index = -1;
        })
        .catch(() => {
          this.$message.info("已取消");
        });
    },
    Up() {
      document.querySelector(`#result`).scrollIntoView({
        behavior: "smooth", // 平滑过渡
        block: "start", // 上边框与视窗顶部平齐。默认值
      });
    },
    //下载
    Download() {
      let filename = this.File_Name.slice(0, this.File_Name.indexOf("."));
      let file = new File(
        [JSON.stringify(this.result, null, 4)],
        filename + ".json",
        { type: "text/plain;charset=utf-8" }
      );
      FileSaver.saveAs(file, filename + ".json");
    },
    //
    eventDrop(e) {
      this.borderhover = false;
      e.stopPropagation();
      e.preventDefault(); //必填字段
      let file = e.dataTransfer.files[0];
      if (file) {
        this.File_Uploading = true;
        console.log(file);
        this.File_Upload(file);
        this.File_Selector.value = "";
      }
    },
    // 上传文件
    File_Upload(file) {
      this.Paper_Content = [];
      this.Paper_Image_Dict = {};
      this.Paper_Divider_Index = -1;

      // this.Using_Part = "Fileinput";
      this.File_Name = file.name;

      let formData = new FormData();

      // 对应的切分编号，是约定好的，别动就好
      let Num_Dict = {
        英语: "0",
        数学: "1",
        文综: "2",
        政治: "2",
        历史: "2",
        地理: "2",
        理综: "3",
        物理: "3",
        化学: "3",
        生物: "3",
        语文: "4",
      };

      formData.append("files", file);
      formData.append("paper_type", Num_Dict[this.Subject]);
      formData.append("data_format", "0");
      // 为了防止需要老版本的地方崩溃，先加了这个，以后用不到了再说
      formData.append("paper_Cut_New", true);

      let config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      this.uploadFile(formData, config);
    },
    // 触发上传事件
    File_Import() {
      this.File_Selector.click();
    },
    // 选择上传
    uploadFile(formData, config) {
      this.$http
        .post(
          "https://file-upload-backend-88-production.env.bdaa.pro/v1/paperProcessing/upload",
          formData,
          config
        )
        .then(function (data) {
          this.result = data;
          this.Paper_Content = data.data.paper;
          this.Paper_Image_Dict = data.data.image_dict;
          let Lists = [];
          for (let i = 0; i < data.data.paper.length; i++) {
            for (let j = 0; j < data.data.paper[i].sub_para.length; j++) {
              // 这是切分格式的结果，我也不知道为什么sub_para会是一个数组，但是这样读取就没问题
              let Para = data.data.paper[i].sub_para[j];
              // 把每个大段里面的每个小内容抽出来，单独塞到List里面
              for (let k = 0; k < Para.length; k++) {
                Lists.push(Para[k]);
              }
            }
            if (i != data.data.paper.length - 1) {
              Lists.push("DIVIDER_LINES");
            }
          }
          this.Paper_Content = Lists;
          this.Paper_Content_BackUp = Lists;
          this.File_Uploading = false;
          this.Show_Result = true;
        })
        .catch((e) => {
          console.log(e);
          this.$alert(
            "切分过程出现错误，这可能是由于服务器原因导致目前暂时无法提供服务，请重新提交文件或稍后再试。",
            "提示"
          );
          this.Show_Result = false;
          this.File_Uploading = false;
          this.File_Name = "";
          this.Paper_Content = [];
          this.Paper_Image_Dict = {};
          this.Paper_Divider_Index = -1;
        });
    },
    // 初始化选择器
    Init_File_Selector() {
      this.File_Selector = document.getElementById("fileSelect");
      this.File_Selector.addEventListener("change", (e) => {
        if (e.target.files[0]) {
          this.File_Uploading = true;
          this.File_Upload(e.target.files[0]);
          this.File_Selector.value = "";
        }
      });
    },
    Init_Dropbox() {
      let _this = this;
      var dropbox = document.getElementById("drop_area");
      dropbox.addEventListener("drop", this.eventDrop, false);
      dropbox.addEventListener("dragleave", function (e) {
        e.stopPropagation();
        e.preventDefault();
        _this.borderhover = false;
      });
      dropbox.addEventListener("dragenter", function (e) {
        e.stopPropagation();
        e.preventDefault();
        _this.borderhover = true;
      });
      dropbox.addEventListener("dragover", function (e) {
        e.stopPropagation();
        e.preventDefault();
        _this.borderhover = true;
      });
    },
    // 更新表格中的图片文件
    Table_Img_Get(Table_Html) {
      for (var key in this.Paper_Image_Dict) {
        var Img_Name_Catcher = new RegExp('<img src="' + key + '"');
        if (Img_Name_Catcher.exec(Table_Html) != null) {
          Table_Html = Table_Html.replace(
            Img_Name_Catcher,
            '<img src="' + this.Paper_Image_Dict[key] + '"'
          );
        }
      }
      return Table_Html;
    },
    default_paper(subject) {
      console.log("change to " + subject);
      let data;
      switch (subject) {
        case "语文":
          data = Chinese;
          this.File_Name = "语文.doc";
          break;
        case "英语":
          data = English;
          this.File_Name = "英语.doc";
          break;
        case "物理":
          data = Physics;
          this.File_Name = "物理.doc";
          break;
        case "地理":
          data = Geography;
          this.File_Name = "地理.doc";
          break;
        case "政治":
          data = Politics;
          this.File_Name = "政治.doc";
          break;
        case "历史":
          data = History;
          this.File_Name = "历史.doc";
          break;
        case "生物":
          data = Biology;
          this.File_Name = "生物.doc";
          break;
        case "化学":
          data = Chemistry;
          this.File_Name = "化学.doc";
          break;
        case "数学":
          data = Math;
          this.File_Name = "数学.doc";
          break;
        default:
          this.Show_Result = false;
          this.File_Name = "";
          this.File_Uploading = false;
          this.Paper_Content = [];
          this.Paper_Image_Dict = {};
          this.Paper_Divider_Index = -1;
          return;
      }

      this.result = data;
      this.Paper_Content = data.paper;
      this.Paper_Image_Dict = data.image_dict;
      let Lists = [];
      for (let i = 0; i < data.paper.length; i++) {
        for (let j = 0; j < data.paper[i].sub_para.length; j++) {
          // 这是切分格式的结果，我也不知道为什么sub_para会是一个数组，但是这样读取就没问题
          let Para = data.paper[i].sub_para[j];
          // 把每个大段里面的每个小内容抽出来，单独塞到List里面
          for (let k = 0; k < Para.length; k++) {
            Lists.push(Para[k]);
          }
        }
        if (i != data.paper.length - 1) {
          Lists.push("DIVIDER_LINES");
        }
      }
      this.Paper_Content = Lists;
      this.Paper_Content_BackUp = Lists;
      this.File_Uploading = false;
      this.Show_Result = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-select,
.el-input {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  border-radius: 4px;
}

.el-breadcrumb-item {
  font-size: 16px;
  color: rgba(0, 0, 0, 0.45);
}

.el-input ::v-deep input::-webkit-input-placeholder {
  color: rgba(0, 0, 0, 0.6);
}

/* .el-divider {
    display: hidden;
  } */

#block_container {
  position: absolute;
  right: -2%;
  top: -30%;
  width: 100%;
  height: 200%;
  //overflow: hidden;
  z-index: -10;
}

#color_block {
  position: absolute;
  right: 0;
  top: 0;
  width: 60%;
  height: 80%;
  background-color: #c9dffc;
  transform: rotate(12deg);
  border-radius: 20px;
  -ms-transform: rotate(12deg); /* IE 9 */
  -webkit-transform: rotate(12deg); /* Safari and Chrome */
}

.upload {
  //margin: 0 auto;
  //display:flex;
  //justify-content:center;
  height: 100%;
  cursor: pointer;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  border-radius: 4px;
}

#result {
  background-image: url("~@/assets/background_pagenum.png");
  width: 100%;
}
</style>