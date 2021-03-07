<template>
  <el-container
    style="height: 100%; border: 3px solid #ccc; padding: 0px; margin: 0px; width: 100%"
    class="upload"
  >
    <el-aside width="200px">
      <div class="drag-area" :style="{ opacity: changecss }">
        <div style="padding-top: 10px">
          <label style="font-weight: bold">请选择科目信息</label>
          <br /><br />
          <el-select
            v-model="paper_type"
            placeholder="请选择"
            style="width: 180px"
          >
            <el-option value="0" label="英语"></el-option>
            <el-option value="1" label="数学"></el-option>
          </el-select>
        </div>
        <!-- 数学文件输入的不同格式 -->
        <div v-if="paper_type == '1'">
          <el-row
            type="flex"
            justify="start"
            style="margin: 15px 0px; padding-left: 15px; padding-top: 20px"
          >
            <label>请选择文件输入格式</label>
          </el-row>
          <el-row
            type="flex"
            justify="start"
            style="margin: 15px 0px; padding-left: 15px"
          >
            <el-radio v-model="math_input" label="paper">
              只输入考题文件
            </el-radio>
          </el-row>
          <el-row
            type="flex"
            justify="start"
            style="margin: 15px 0px; padding-left: 15px"
          >
            <el-radio v-model="math_input" label="combine">
              考题与答案分开
            </el-radio>
          </el-row>
          <el-row
            type="flex"
            justify="start"
            style="margin: 15px 0px; padding-left: 15px"
          >
            <el-radio v-model="math_input" label="mix">
              考题与答案同卷
            </el-radio>
          </el-row>
        </div>
        <!-- 英语按钮 -->
        <div
          class="btn_file"
          :style="{ opacity: changecss }"
          v-if="paper_type == '0'"
        >
          <p v-if="paper_type == '0'">
            <icon name="file"></icon>选取文件(doc/docx)
          </p>
          <input
            type="file"
            @change="selectFile($event)"
            accept=".docx, .doc"
            ref="eng_input"
          />
          <span style="color:#000;" v-if="paper_type == '0'">{{
            fileName
          }}</span>
        </div>
        <!-- 数学按钮 -->
        <div
          class="btn_file"
          :style="{ opacity: changecss }"
          v-if="paper_type == '1' && math_input != '-1'"
        >
          <p><icon name="file"></icon>选取试题文件(zip)</p>
          <input
            type="file"
            @change="selectPaperFile($event)"
            accept=".zip"
            ref="math_paper_input"
          />
          <span style="color:#000;">{{ mathPaperName }}</span>
        </div>
        <div
          class="btn_file"
          :style="{ opacity: changecss }"
          v-if="paper_type == '1' && math_input == 'combine'"
          style="margin-top: 50px"
        >
          <p><icon name="file"></icon>选取参考答案文件(zip)</p>
          <input
            type="file"
            @change="selectAnswerFile($event)"
            accept=".zip"
            ref="math_answer_input"
          />
          <span style="color:#000;">{{ mathAnswerName }}</span>
        </div>
        <div
          class="select"
          v-if="Type_Visible() && paper_type == '0'"
          style="padding-top: 40px"
        >
          <el-col :span="12" style="padding-top: 8px; padding-left: 15px">
            下载格式：
          </el-col>
          <el-col :span="12">
            <el-row type="flex" justify="start">
              <el-radio
                v-model="format"
                label="1"
                style="font-size: 16px; font-weight: bold; margin: 10px 0px"
                >json格式</el-radio
              >
            </el-row>
            <el-row type="flex" justify="start">
              <el-radio
                v-model="format"
                label="0"
                style="font-size: 16px; font-weight: bold; margin: 10px 0px"
                >txt格式</el-radio
              >
            </el-row>
          </el-col>
        </div>
      </div>
      <div
        v-if="paper_type == '0'"
        class="download"
        v-loading="loading"
        element-loading-text="加载中，请等待"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <el-button @click="saveFile(format)" :disabled="Download_Show(format)"
          >下载文件</el-button
        >
      </div>
      <div
        v-if="paper_type == '1'"
        style="margin-top: 20px; margin-bottom: 20px;"
        v-loading="loading"
        element-loading-text="加载中，请等待"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <el-button :disabled="downloadPaper == ''" @click="saveMathFile(0)">
          下载试卷文件
        </el-button>
      </div>
      <div
        v-if="
          paper_type == '1' && (math_input == 'combine' || math_input == 'mix')
        "
        style="padding-bottom: 10px"
        v-loading="loading"
        element-loading-text="加载中，请等待"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <el-button :disabled="downloadAnswer == ''" @click="saveMathFile(1)">
          下载答案文件
        </el-button>
      </div>
    </el-aside>
    <el-main>
      <el-container>
        <el-header>题目分解预览</el-header>
        <el-main v-if="paper_type == '0'">
          <el-row>
            <el-col
              v-for="(item, index_out) in file_item"
              :key="index_out"
              class="area_border"
            >
              <el-col :span="21">
                <el-button
                  size="small"
                  @click="Transfer(index_out)"
                  class="btn_trans"
                  plain
                  >类型转换</el-button
                >
              </el-col>
              <el-col
                v-for="(i, index_in) in item"
                :key="index_in"
                :span="24"
                style="padding: 10px; margin: 1px;"
              >
                <el-col :span="21" v-if="i.length > 0">
                  <p class="title_message">
                    {{ i }}
                  </p>
                </el-col>
                <el-col
                  :span="21"
                  v-if="i.length == 0 && file_item_label[index_out] == -1"
                >
                  <label>{{ Get_Stem_Label(index_out) }}</label>
                </el-col>
                <el-col
                  :span="21"
                  v-if="i.length == 0 && file_item_label[index_out] != -1"
                >
                  <label>{{ Get_Title_Label(index_out) }}</label>
                </el-col>
                <el-col :span="2" v-if="i.length > 0">
                  <el-button
                    size="small"
                    class="btn_front_cut"
                    @click="Out_Frontward(index_out, index_in)"
                    plain
                    >前切</el-button
                  >
                </el-col>
                <el-col :span="1" v-if="i.length > 0">
                  <el-button
                    size="small"
                    class="btn_back_cut"
                    @click="Out_Backward(index_out, index_in)"
                    plain
                    >后切</el-button
                  >
                </el-col>
                <el-col :span="3" v-if="i.length == 0">
                  <div>
                    <el-button
                      size="small"
                      class="btn_merge"
                      @click="Del(index_out, index_in)"
                      v-if="index_in == 0 && index_out != 0"
                      plain
                      >向前合并</el-button
                    >
                    <el-button
                      size="small"
                      class="btn_merge"
                      @click="Del(index_out, index_in)"
                      v-if="
                        index_in == item.length - 1 &&
                          index_out != file_item.length - 1
                      "
                      plain
                      >向后合并</el-button
                    >
                  </div>
                </el-col>
              </el-col>
              <el-col :span="21">
                <el-button
                  size="small"
                  @click="Transfer(index_out)"
                  class="btn_trans"
                  plain
                  >类型转换</el-button
                >
              </el-col>
            </el-col>
          </el-row>
        </el-main>
        <el-main v-else-if="paper_type == '1'">
          <div
            v-for="(para, index) in json_content.doc"
            :key="index"
            :style="para.para_style"
          >
            <div v-if="para.para_type == '1'">
              <div :style="para.para_style">
                <span v-html="Table_Img_Get(para.table_raw_html)"></span>
              </div>
            </div>
            <div v-else-if="para.para_type == '0'">
              <span
                v-for="(message, index_i) in para.runs"
                :key="index_i + 'run'"
                :style="message.run_style"
              >
                <span
                  v-if="message.run_type == '0'"
                  v-html="message.run_text"
                ></span>
                <img
                  v-else-if="message.run_type == '1'"
                  :src="json_content.img[message.image.src]"
                  :width="message.image.width"
                  :height="message.image.height"
                  :style="message.image.style"
                  :alt="message.image.alt"
                />
              </span>
              <el-divider v-if="para.is_split == 1"></el-divider>
            </div>
          </div>
          <div
            v-for="(para, index) in answer_content.doc"
            :key="index"
            :style="para.para_style"
          >
            <div v-if="para.para_type == '1'">
              <div :style="para.para_style">
                <span v-html="Table_Img_Get(para.table_raw_html)"></span>
              </div>
            </div>
            <div v-else-if="para.para_type == '0'">
              <span
                v-for="(message, index_i) in para.runs"
                :key="index_i + 'run'"
                :style="message.run_style"
              >
                <span
                  v-if="message.run_type == '0'"
                  v-html="message.run_text"
                ></span>
                <img
                  v-else-if="message.run_type == '1'"
                  :src="answer_content.img[message.image.src]"
                  :width="message.image.width"
                  :height="message.image.height"
                  :style="message.image.style"
                  :alt="message.image.alt"
                />
                <span
                  v-else-if="message.run_type == '100'"
                  style="font-weight: bold; font-size: 16px; width: 50px; display: inline-block; margin: 0 1vw 0 0"
                >
                  |
                </span>
              </span>
              <el-divider v-if="para.is_split == 1"></el-divider>
            </div>
          </div>
        </el-main>
      </el-container>
    </el-main>
  </el-container>
</template>

<script>
/* eslint-disable */
import FileSaver from "file-saver";
export default {
  name: "FileUpload",
  inject: ["reload"],
  data() {
    return {
      changecss: 1,
      json_content: "",
      // 数学专用，答案JSON
      answer_content: "",
      txt_content: "",
      fileName: "",
      format: "3",
      loading: false,
      file_data: [],
      file_item: [],
      // 题目编号
      title_index: [],
      // file_item属于的标签号
      file_item_label: [],
      json_return: {
        "paper_title": "",
        "type": "",
        "segment_num": 0,
        "paper": []
      },
      // 试卷的分类
      paper_type: '',
      // 数学试卷的输入类型
      math_input: "-1",
      mathPaperName: "",
      mathAnswerName: "",
      // 标记试题与答案分段上传的进度
      // "-1": 都没上传; "0": 上传了试卷; "1": 上传了答案; "2": 都上传完了
      math_standby: "-1",
      // 临时中转试题与答案文件
      temp_File: "",
      // 存储用于给用户下载的JSON文件的变量
      downloadPaper: "",
      downloadAnswer: ""
    };
  },
  watch: {
    paper_type(newVal, oldVal){
      if(newVal != oldVal){
        this.Clear();
        this.fileName = "";
        this.mathPaperName = "";
        this.mathAnswerName = "";
        this.paper_type = newVal;
      }
    },
    math_input(newVal, oldVal){
      if(newVal != oldVal){
        this.Clear();
        this.fileName = "";
        this.mathPaperName = "";
        this.mathAnswerName = "";
        this.math_input = newVal;
      }
    },
  },
  methods: {
    // 更新表格中的图片文件
    Table_Img_Get(Table_Html){
      for(var key in this.json_content.img){
        var Img_Name_Catcher = new RegExp('<img src="' + key + '"')
        if(Img_Name_Catcher.exec(Table_Html) != null){
          Table_Html = Table_Html.replace(Img_Name_Catcher,'<img src="' + this.json_content.img[key] + '"')
        }
      }
      return Table_Html
    },
    // 选择上传
    uploadFile(formData, config, e) {
      this.loading = true;
      this.$http
        .post("https://file-upload-backend-88-production.env.bdaa.pro/v1/paperProcessing/upload", formData, config)
        .then(function(data) {

          this.Clear();

          console.log(data);

          // 这里是处理英语试卷的逻辑部分，数学试卷的逻辑部分另写
          if(this.paper_type == '0'){

            // 捕捉数据，关闭等待，并初始化各种返回用的标签特征值，用换行符切分
            this.json_content = data.data;
            this.txt_content = data.data.text;
            this.loading = false;

            this.file_data = this.txt_content.split("\n");
            this.json_return.type = this.json_content.type;
            this.json_return.paper_title = this.json_content.paper_title;

            // 从txt中分离段落和框体
            var reps = new RegExp("第(一|二|三|四|五|六|七|八|九|十)");
            var reps2 = new RegExp("第[0-9]+段");

            var divrep = new RegExp("^={4,}");

            var item_count = 0;
            var div_recoder = [0];

            // 根据换行符和切分标签切分大段，但由于第一大段前面是没有切分符的，所以要先准备一个头部为零的初始值
            // 在这里面记录的是这段的首行和末行的位置

            for (var i = 0; i < this.file_data.length; i++) {

              if(divrep.test(this.file_data[i])){
                item_count = item_count + 1;
                this.file_item.push([""]);
                div_recoder.push(i);
              }

            }

            div_recoder.push(this.file_data.length);

            var text_count = 0;

            // 根据大段结果准备往里面塞东西

            for (var ic = 0; ic < item_count; ic++){

              var div_tester_border_front = div_recoder[ic];
              var div_tester_border_back = div_recoder[ic+1];

              // 检测是否是题干段，如果是题干段就加一个题干标签并进入下一轮循环，否则循环完了以后就加一个题目标签
              // 题干标签用-1表示，题目标签用当前大段的标号表示

              for(var t = div_tester_border_front; t < div_tester_border_back; t++){

                if(reps.test(this.file_data[t])){
                  this.file_item_label.push(-1);
                  break;
                }
                
                else if(reps2.test(this.file_data[t])){
                  this.file_item_label.push(-1);
                  break;
                }
                
                else if(t == div_tester_border_back - 1){
                  this.title_index.push(ic);
                  this.file_item_label.push(ic);
                }  

              }

              // 开始塞东西，把每段的内容塞到大段里面去

              while(text_count < this.file_data.length && this.file_data[text_count][0] != "="){
                if(this.file_data[text_count] != ""){
                  this.file_item[ic].push(this.file_data[text_count]);
                }
                text_count = text_count + 1;
              }
              text_count = text_count + 1;
              this.file_item[ic].push("");

            }

            // 最后是一个收尾用的标记标签，没有实际意义，但有功能意义
            this.file_item_label.push(-1)
          } else if (this.paper_type == '1'){

            if(this.math_input == 'paper'){
              this.json_content = data.body.Paper;
              this.downloadPaper = data.body.Download_Paper;
              this.loading = false;
            }else{
              this.json_content = data.body.Paper;
              this.downloadPaper = data.body.Download_Paper;
              this.answer_content = data.body.Answer;
              this.downloadAnswer = data.body.Download_Answer;
              this.loading = false;
            }

          }
          
        }); 

      
      this.fileName = e.target.files[0].name;

    },
    selectFile(e) {

      if(e.target.files.length > 0){

        let formData = new FormData();

        console.log(e.target.files);

        formData.append("files", e.target.files[0]);
        formData.append("paper_type", this.paper_type);
        if(this.paper_type == '1'){
          formData.append("math_input", this.math_input)
        }

        let config = {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        };

        this.uploadFile(formData, config, e);

      }else{

        this.$alert('  请正确选择要进行分析的文件。', '提示', {
          confirmButtonText: '确定',
          callback: action => {}
        });

      }
    },
    selectPaperFile(e) {

      if(this.temp_File && this.math_standby == "0"){
        this.temp_File = "";
      }

      if(e.target.files.length > 0){

        let formData = new FormData();
        
        this.mathPaperName = e.target.files[0].name;

        if(this.math_input != 'combine'){

          formData.append("paper", e.target.files[0])
          formData.append("paper_type", this.paper_type);
          if(this.math_input == 'paper'){
            formData.append("math_input", '0');
          }else{
            formData.append("math_input", "2");
          }

          let config = {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          };

          this.uploadFile(formData, config, e);

        }else{

          if(this.math_standby == "1"){

            formData.append("paper", e.target.files[0]);
            formData.append("answer", this.temp_File);
            formData.append("paper_type", this.paper_type);
            formData.append("math_input", "1");

            let config = {
              headers: {
                "Content-Type": "multipart/form-data"
              }
            };

            this.uploadFile(formData, config, e);

          }else if(this.math_standby == "-1"){

            this.math_standby = "0"
            this.temp_File = e.target.files[0];

          }

        }

      }else{

        this.$alert('  请正确选择要进行分析的文件。', '提示', {
          confirmButtonText: '确定',
          callback: action => {}
        });

      }
    },
    selectAnswerFile(e) {

      if(this.temp_File && this.math_standby == "1"){
        this.temp_File = "";
      }

      if(e.target.files.length > 0){

        let formData = new FormData();
        
        this.mathAnswerName = e.target.files[0].name;

        if(this.math_standby == "0"){

          formData.append("answer", e.target.files[0]);
          formData.append("paper", this.temp_File);
          formData.append("paper_type", this.paper_type);
          formData.append("math_input", "1");

          let config = {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          };

          this.uploadFile(formData, config, e);

        }else if(this.math_standby == "-1"){

          this.math_standby = "1";
          this.temp_File = e.target.files[0];

        }

      }else{

        this.$alert('  请正确选择要进行分析的文件。', '提示', {
          confirmButtonText: '确定',
          callback: action => {}
        });

      }
    },
    saveFile(f){

      this.$confirm(
        "   确认当前分段正确无误吗？正确无误请点击确认，仍要修改请点击取消。", "提示", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "info"
        }
      ).then(() => {

          if(f == 0){
            this.saveTxtFile()
          }else{
            this.saveJsonFile();
          }

          this.save_This_To_Database()

        }).catch();

    },
    save_This_To_Database(){

      this.json_return.segment_num = this.file_item.length;
      this.json_return.paper = [];

      for(var i = 0; i < this.file_item.length; i++){

        var Item = {"is_question": -1, "text": "", "additional": ""}

        if(this.file_item_label[i] != -1){
          Item.is_question = 1;
        }else{
          Item.is_question = 0;
        }

        for(var j = 1; j < this.file_item[i].length - 1; j++){
          Item.text = Item.text + this.file_item[i][j] + "\n";
        }

        this.json_return.paper.push(Item);

      }

      let formData = new FormData();
      formData.append("paper", JSON.stringify(this.json_return));
      formData.append("type", this.json_return.type);

      let config = {
          headers: {
            "Content-Type": "multipart/form-data"
          }
      };

      this.$http.post(this.backendIP + "/paperProcessing/savePaper", formData, config, {
          emulateJSON: true
        }).then(
        function(data){
          console.log(data);
        }
      );

    },
    // 存储为txt文件并下载
    saveTxtFile() {
      var output_string = "";
      for (var i = 0; i < this.file_item.length; i++) {
        for (var j = 0; j < this.file_item[i].length; j++) {
          if (
            this.file_item[i][j].length == 0 &&
            (j == this.file_item[i].length - 1 || j == 0) &&
            this.file_item_label[i] == -1
          ) {
            output_string += this.Get_Stem_Label(i);
            output_string += "\n";
          } 

          else if(
            this.file_item[i][j].length == 0 &&
            (j == this.file_item[i].length - 1 || j == 0) &&
            this.file_item_label[i] != -1
          ) {
            output_string += this.Get_Title_Label(i);
            output_string += "\n"
          } 
          
          else {
            output_string += this.file_item[i][j] + "\n";
          }
        }
      }

      this.txt_content = output_string;

      var file = new File(
        [this.txt_content],
        this.fileName.split(".")[0] + ".txt",
        { type: "text/plain;charset=utf-8" }
      );
      FileSaver.saveAs(file);
    },
    // 对数学的json文件进行下载
    saveMathFile(part){

      var json = "";
      if(part == 0){
        json = this.downloadPaper;
      }else{
        json = this.downloadAnswer
      }

      var file = new File(
        [JSON.stringify(json, null, 4)],
        this.fileName.split(".")[0] + ".json",
        { type: "text/plain;charset=utf-8" }
      );
      FileSaver.saveAs(file);
      
    },
    // 存储为json文件并下载
    saveJsonFile() {

      this.json_return.segment_num = this.file_item.length;
      this.json_return.paper = [];

      for(var i = 0; i < this.file_item.length; i++){

        var Item = {"is_question": -1, "text": "", "additional": ""}

        if(this.file_item_label[i] != -1){
          Item.is_question = 1;
        }else{
          Item.is_question = 0;
        }

        for(var j = 1; j < this.file_item[i].length - 1; j++){
          Item.text = Item.text + this.file_item[i][j] + "\n";
        }

        this.json_return.paper.push(Item);

      }

      var file = new File(
        [JSON.stringify(this.json_return, null, 2)],
        this.fileName.split(".")[0] + ".json",
        { type: "text/plain;charset=utf-8" }
      );
      FileSaver.saveAs(file);
    },
    
    // 切分位置在这一点的前面
    Out_Frontward(index_out, index_in) {

      // 先获取这个点是否是题目的部分
      var title_now = this.title_index.indexOf(this.file_item_label[index_out]);

      // 现在所有题目的分界线已经不存在前后切的可能性，都是删除选项，所以只需要判断是不是第一个元素即可
      if (index_in == 1) {
        return 
      } 
      // 判断是否是题目
      else if(title_now != -1){
          
        // 压入此段，此节之前的那部分内容，并压入file_item段
        var list_forward = [];
        for (var i = 0; i < index_in; i++) {
          list_forward.push(this.file_item[index_out][i]);
        }
        list_forward.push("");

        // 剪切当前行，使被切走的部分为分界线需要的格式
        // 把切出来的部分插入数组
        this.file_item[index_out].splice(0, index_in, "");
        this.file_item.splice(index_out, 0, list_forward);
          
        // 放弃花样玩法，直接给后面加新的部分

        this.file_item_label.splice(index_out, 0, this.file_item_label[index_out]);

        for(var i = index_out + 1; i < this.file_item_label.length; i++){
          if(this.file_item_label[i] != -1){
            this.file_item_label[i] = this.file_item_label[i] + 1;
          }
        }

        this.title_index.splice(title_now, 0, this.file_item_label[index_out]);
        for(var j = title_now + 1; j < this.title_index.length; j++){
          this.title_index[j] = this.title_index[j] + 1
        }

      }
      // 如果这段部分是题干的话
      else {

        // 还是压入并插入前面的部分
        
        var list_forward = [];
        
        for (var i = 0; i < index_in; i++) {     
          list_forward.push(this.file_item[index_out][i]);     
        }

        list_forward.push("");
        
        this.file_item[index_out].splice(0, index_in, "");
        this.file_item.splice(index_out, 0, list_forward);

        // 这里开始处理标签
        // 由于是题干，不涉及title相关的部分，所以status不动，title_index也不需要动，只需要更改file_item_label标签，多一个-1就可以了

        this.file_item_label.splice(index_out, 0, -1);

        for (var j = index_out + 1; j < this.file_item_label.length; j++){
          if(this.file_item_label[j] != -1){
            this.file_item_label[j] = this.file_item_label[j] + 1
          }
        }

        // 查找此位置之前的一道题目的label
        var front_title_label = -1;

        for(var i = index_out; i > 0; i--){
          if(this.file_item_label[i] != -1){
            front_title_label = this.file_item_label[i];
            break;
          }
        }

        // 如果还是-1，说明这个位置前面是没有题目的
        if(front_title_label == -1){
          for(var m = 0; m < this.title_index.length; m++){
            this.title_index[m] = this.title_index[m] + 1;
          }
        }else{
          for(var n = this.title_index.indexOf(front_title_label) + 1; n < this.title_index.length; n++){
            this.title_index[n] = this.title_index[n] + 1;
          }
        }

      }

      this.Show_TITLE();

    },

    // 切分位置在这一点的后面
    Out_Backward(index_out, index_in) {

      // 不排除第一段就是第一题的可能性
      var title_now = this.title_index.indexOf(this.file_item_label[index_out]);;

      // 现在已经不存在分界线是否可以前后切的问题，所以只需要考虑是不是最后一个位置即可
      if (index_in == this.file_item[index_out].length - 2) {
          return 
      } 
      // 虽然可能性很小，这段也有可能是题目
      else if(title_now != -1){
          
          var list_forward = [];

          for (var i = 0; i < index_in + 1; i++) {
            list_forward.push(this.file_item[index_out][i]);
          }

          list_forward.push("");
          
          this.file_item[index_out].splice(0, index_in + 1, "");
          this.file_item.splice(index_out, 0, list_forward);
          
          // 如果后面的题目位置标签为true，说明这个位置本身就是一道题目要开始切分子集
          // 如果后面的题目位置标签为false，说明这个位置本身其实是两道题目的集合，现在要切开
          // label和status操作放到这里来
          this.file_item_label.splice(index_out, 0, this.file_item_label[index_out]);

          for(var i = index_out + 1; i < this.file_item_label.length; i++){
            if(this.file_item_label[i] != -1){
              this.file_item_label[i] = this.file_item_label[i] + 1;
            }
          }

          this.title_index.splice(title_now, 0, this.file_item_label[index_out]);
          for(var j = title_now + 1; j < this.title_index.length; j++){
            this.title_index[j] = this.title_index[j] + 1
          }
          
      }
      // 如果这段部分是题干的话
      else {

        var list_forward = [];
        
        for (var i = 0; i < index_in + 1; i++) {
          list_forward.push(this.file_item[index_out][i]);
        }

        list_forward.push("");
        
        this.file_item[index_out].splice(0, index_in + 1, "");
        this.file_item.splice(index_out, 0, list_forward);

        // 这里开始处理标签
        // 由于是题干，不涉及title相关的部分，所以status不动，title_index也不需要动，只需要更改file_item_label标签，多一个-1就可以了
        
        this.file_item_label.splice(index_out + 1, 0, -1);

        for (var j = index_out + 1; j < this.file_item_label.length; j++){
          if(this.file_item_label[j] != -1){
            this.file_item_label[j] = this.file_item_label[j] + 1
          }
        }

        // 查找此位置之前的一道题目的label
        var front_title_label = -1;

        for(var i = index_out; i > 0; i--){
          if(this.file_item_label[i] != -1){
            front_title_label = this.file_item_label[i];
            break;
          }
        }

        // 如果还是-1，说明这个位置前面是没有题目的
        if(front_title_label == -1){
          for(var m = 0; m < this.title_index.length; m++){
            this.title_index[m] = this.title_index[m] + 1;
          }
        }else{
          for(var n = this.title_index.indexOf(front_title_label) + 1; n < this.title_index.length; n++){
            this.title_index[n] = this.title_index[n] + 1;
          }
        }
      
      }

      this.Show_TITLE();
    
    },
    
    // 合并相邻的两个位置
    Del(index_out, index_in) {

      if (this.file_item[index_out][index_in].length != 0) {
        console.log("It's not a divider.");
      } 

      else {
        // 去掉前切分线
        if (index_in == 0) {

          var index_index = this.title_index.indexOf(this.file_item_label[index_out]);

          // 最开始的位置没有前切功能

          if (index_out != 0) {

            // 首先确认这两道题是属于题目
            // 然后确认两道题的label不一致
            // 确定属于合并不同题目项

            if(this.file_item_label[index_out] != -1 && this.file_item_label[index_out-1] != -1){
              
              // 去掉用于作为边界线的符号
              this.file_item[index_out - 1].splice(
                this.file_item[index_out - 1].length - 1,
                1
              );

              // 去掉用于作为边界线的符号
              this.file_item[index_out].splice(0, 1);

              // 内容合并
              for (var i = 0; i < this.file_item[index_out].length; i++) {
                this.file_item[index_out - 1].push(this.file_item[index_out][i]);
              }

              // 删除原先“后面”的那一项
              this.file_item.splice(index_out, 1);

              // 在我们和前面一项合并的时候，应当满足什么情况，应当把这个位置改成false
              // 1：两个位置的标签不一样，并且都是【完整的题目】
              // 问题来了，如果一方是有小题的状态，另一方是完整题目，怎么处理
              // 修改原先后面那一项的状态为false，表示这道题目的位置空出来了
              // 修改方案：如果这个位置的后面仍然有同值，则放弃修改

              for(var i = index_out + 1; i < this.file_item_label.length; i++){
                if(this.file_item_label[i] != -1){
                  this.file_item_label[i] = this.file_item_label[i] - 1;
                }
              }
              this.file_item_label.splice(index_out, 1);

              for(var j = index_index + 1; j < this.title_index.length; j++){
                this.title_index[j] = this.title_index[j] - 1
              }
              this.title_index.splice(index_index, 1)

            }
            // 此时status_index只可能为-1，因为这里只可能是题干项了，略去
            // 题干项没有status记录，省去
            // 题干之间本身没有区分，标签都是-1，需要返回分割线内容的话用函数去做
            // 具体做法为读出label栏内这个题干标签和下一个题干标签之间的头尾
            // 然后读出头尾的index，用true做计数值，最终返回题目栏范围
            else if(this.file_item_label[index_out] == -1 && this.file_item_label[index_out-1] == -1){

              // 去掉用于作为边界线的符号
              this.file_item[index_out - 1].splice(
                this.file_item[index_out - 1].length - 1,
                1
              );

              // 去掉用于作为边界线的符号
              this.file_item[index_out].splice(0, 1);

              // 内容合并
              for (var i = 0; i < this.file_item[index_out].length; i++) {
                this.file_item[index_out - 1].push(this.file_item[index_out][i]);
              }

              // 删除原先“后面”的那一项
              this.file_item.splice(index_out, 1);

              // 最后去掉后一项在label中的标记
              this.file_item_label.splice(index_out, 1);

              // 查找此位置之前的一道题目的label
              var front_title_label = -2;

              for(var i = index_out; i > 0; i--){
                if(this.file_item_label[i] != -1){
                  front_title_label = this.file_item_label[i];
                  break;
                }
              }

              if(front_title_label == -2){
                for(var i = 0; i < this.file_item_label.length; i++){
                  if(this.file_item_label[i] != -1){
                    this.title_index[this.title_index.indexOf(this.file_item_label[i])] -= 1;
                    this.file_item_label[i] -= 1;
                  }
                }
              }else{
                for(var i = this.file_item_label.indexOf(front_title_label); i < this.file_item_label.length; i++){
                  if(this.file_item_label[i] != -1){
                    var index_temp = this.title_index.indexOf(this.file_item_label[i])
                    this.title_index[index_temp] = i;
                    this.file_item_label[i] = i;
                  }
                }
              }

            }
            // 两项所处位置不一样
            else{
              this.Show_CANT();
            }
          }
        
        }
        // 去掉后切分线
        else {

          var index_index = this.title_index.indexOf(this.file_item_label[index_out]);

          // 最后面的位置没有后切功能

          if (index_out != this.file_item.length - 1) {

            // 首先确认这两道题是属于题目
            // 然后确认待合并的两项都在题目项，用的是label项是因为要确定两道题的标签不一定不一样
            // 接着确认两道题目的状态都是true，说明两道题目的范围都还是原先的范围
            // 最后确认两道题的label不一致
            // 确定属于合并不同题目项

            if(this.file_item_label[index_out] != -1 && this.file_item_label[index_out+1] != -1){
              
              // 去掉用于作为边界线的符号
              this.file_item[index_out].splice(
                this.file_item[index_out].length - 1,
                1
              );

              // 去掉用于作为边界线的符号
              this.file_item[index_out + 1].splice(0, 1);

              // 内容合并
              for (var i = 0; i < this.file_item[index_out + 1].length; i++) {
                this.file_item[index_out].push(this.file_item[index_out + 1][i]);
              }

              // 删除原先“后面”的那一项
              this.file_item.splice(index_out+1, 1);

              for(var i = index_out + 1; i < this.file_item_label.length; i++){
                if(this.file_item_label[i] != -1){
                  this.file_item_label[i] = this.file_item_label[i] - 1;
                }
              }
              this.file_item_label.splice(index_out, 1);

              for(var j = index_index + 1; j < this.title_index.length; j++){
                this.title_index[j] = this.title_index[j] - 1
              }
              this.title_index.splice(index_index, 1)
            }
            
            // 此时status_index只可能为-1，因为这里只可能是题干项了，略去
            // 题干项没有status记录，省去
            // 题干之间本身没有区分，标签都是-1，需要返回分割线内容的话用函数去做
            // 具体做法为读出label栏内这个题干标签和下一个题干标签之间的头尾
            // 然后读出头尾的index，用true做计数值，最终返回题目栏范围

            else if(this.file_item_label[index_out] == -1 && this.file_item_label[index_out+1] == -1){

              // 去掉用于作为边界线的符号
              this.file_item[index_out].splice(
                this.file_item[index_out].length - 1,
                1
              );

              // 去掉用于作为边界线的符号
              this.file_item[index_out + 1].splice(0, 1);

              // 内容合并
              for (var i = 0; i < this.file_item[index_out + 1].length; i++) {
                this.file_item[index_out].push(this.file_item[index_out + 1][i]);
              }

              // 删除原先“后面”的那一项
              this.file_item.splice(index_out + 1, 1);

              // 最后去掉后一项在label中的标记
              this.file_item_label.splice(index_out, 1);

              // 查找此位置之前的一道题目的label
              var front_title_label = -2;

              for(var i = index_out; i > 0; i--){
                if(this.file_item_label[i] != -1){
                  front_title_label = this.file_item_label[i];
                  break;
                }
              }

              if(front_title_label == -2){
                for(var i = 0; i < this.file_item_label.length; i++){
                  if(this.file_item_label[i] != -1){
                    this.title_index[this.title_index.indexOf(this.file_item_label[i])] -= 1;
                    this.file_item_label[i] -= 1;
                  }
                }
              }else{
                for(var i = this.file_item_label.indexOf(front_title_label); i < this.file_item_label.length; i++){
                  if(this.file_item_label[i] != -1){
                    var index_temp = this.title_index.indexOf(this.file_item_label[i])
                    this.title_index[index_temp] = i;
                    this.file_item_label[i] = i;
                  }
                }
              }

            }
            // 两项所处类型不一样
            else{
              this.Show_CANT();
            }
          }
          
        }
      }

      this.Show_TITLE();

    },

    // 获取题干或其他内容应当显示的分界线内容
    Get_Stem_Label(index_out){

      var Front_Pos = index_out;
      var Next_Pos = -1;

      for(var i = index_out + 1; i < this.file_item_label.length; i++){
        if(this.file_item_label[i] == -1){
          Next_Pos = i;
          break;
        }
      }

      if(Next_Pos - Front_Pos == 1){

        return "-------------------- 提示信息 --------------------"
      
      }else{

        var First_Title_Label = this.title_index.indexOf(this.file_item_label[Front_Pos + 1]);
        var Last_Title_Label = this.title_index.indexOf(this.file_item_label[Next_Pos - 1]);

        var First_Label = 0;
        var Last_Label = 0;

        for(var k = 0; k < Last_Title_Label + 1; k++){

          if(k <= First_Title_Label){

            First_Label = First_Label + 1;
            Last_Label = Last_Label + 1;

          }else if( k > First_Title_Label){

            Last_Label = Last_Label + 1;

          }

        }

        if(First_Label != Last_Label){

          return  "--------------------第【 " + First_Label + " - " + Last_Label + " 】题题干分界线--------------------";

        }else{

          return  "--------------------第【 " + First_Label + " 】题题干分界线--------------------";

        }
      }
    },
    
    // 获取题目部分应当显示的分界线内容
    Get_Title_Label(index_out){

      var Now_Label = this.file_item_label[index_out];
      var sub_count = 0;

      for(var j = 0; j < this.file_item_label.length; j++){

        if(this.file_item_label[j] == Now_Label){
          sub_count = sub_count + 1;
        }

        if(sub_count > 1){
          break;
        }

      }

      var Title_I = this.title_index.indexOf(this.file_item_label[index_out]);
      var index_count = 0;

      for(var j = 0; j < Title_I + 1; j++){

        index_count = index_count + 1;

      }

      if(sub_count == 1){

        return "--------------------第 " + index_count + " 题题目分界线--------------------";

      }

    },
    // 将题干和题目类型互相转化
    Transfer(index_out){
      // 当这个部分是题目内容时
      if(this.file_item_label[index_out] != -1){

        var file_item_label_now = this.file_item_label[index_out];
        var title_index_now = this.title_index.indexOf(file_item_label_now);
        
        this.file_item_label[index_out] = -1;

        this.title_index.splice(title_index_now, 1);

      }else{

        var new_title_index = 0;
        
        for(var i = 0; i < index_out; i++){
          if(this.file_item_label[i] != -1){
            new_title_index = new_title_index + 1;
          }
        }

        this.file_item_label[index_out] = index_out;

        this.title_index.splice(new_title_index, 0, index_out);

      }

      this.Show_TITLE();

    },
    Show_CANT(){
      this.$alert('   题干与题目之间不可进行合并操作。', '提示', {
          confirmButtonText: '确定',
          callback: action => {}
        });
    },
    Download_Show(form_at){
      if(form_at == 0 || form_at == 1){
        return false    
      }
      else{
        return true     
      }
    },
    Type_Visible(){
      if(this.fileName != "" && !(this.loading)){
        return true
      }
      else{
        return false
      }
    },
    Clear(){

      this.json_content = ""
      // 数学专用，答案JSON
      this.answer_content = ""
      this.txt_content = ""

      this.downloadPaper = ""
      this.downloadAnswer = ""

      this.format = "3"
      this.loading = false
      this.file_data = []
      this.file_item = []
      // 题目编号
      this.title_index = []
      // file_item属于的标签号
      this.file_item_label = []
      this.json_return = {
        "paper_title": "",
        "type": "",
        "segment_num": 0,
        "paper": []
      }

      setTimeout(()=>{
        if(this.$refs.eng_input){
          this.$refs.eng_input.value = "";
        }
        if(this.$refs.math_paper_input){
          this.$refs.math_paper_input.value = "";
        }
        if(this.$refs.math_answer_input){
          this.$refs.math_answer_input.value = "";}
        }
      , 1);

    },
    Show_TITLE(){
      console.log("-----------------");
      console.log(this.title_index);
      console.log(this.file_item_label);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
.drag-area {
  width: 196px;
  height: 550px;
  border: 2px dashed #aaafb4;
  margin-bottom: 400px;
  margin: auto;
  background-color: #ebebeb;
}
.download {
  margin-top: 30px;
  padding-bottom: 20px;
}
.area_border{
  background-color: rgba(0,255,255,0.04); 
  border: 2px dashed black; 
  padding: 8px; 
  margin: 18px;
}
.title_message{
  line-height: 25px; 
  margin: 5px; 
  padding: 3px;
}
.btn_merge{
  margin-left: 30px;
  border: 1px dashed black;
}
.btn_front_cut{
  margin-left: 6px;
  border: 1px dashed black;
}
.btn_back_cut{
  border: 1px dashed black;
}
.btn_file {
  position: relative;
  margin-top: 10%;
  margin-left: auto;
  margin-right: auto;
  background-color: #fff;
  height: 50px;
  width: 180px;
  border-radius: 2px;
  cursor: pointer;
}
.btn_trans {
  border: 1px dashed black;
  margin: 15px;
}
input {
  position: absolute;
  top: 0;
  right: 0;
  height: 50px;
  width: 180px;
  overflow: hidden;
  cursor: pointer;
  opacity: 0;
}
.select {
  margin-top: 10px;
}
p {
  line-height: 50px;
  font-weight: normal;
}
</style>
