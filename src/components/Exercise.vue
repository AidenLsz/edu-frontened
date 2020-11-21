<template>

  <div class="exercise">

    <el-dialog width="80%" :visible.sync="helper_dialog" @close="helper_dialog = false; latex_now = ''; temp_latex = ''">
      <el-container style="height: 430px;">
        <el-header style="height: 30px; font-size: 20px; font-weight: bold">
          快速公式助手
        </el-header>
        <el-container style="height: 400px;" direction="horizontal">
          
          <el-aside width="25%" style="margin: 5px">
            <el-select style="height: 10px;" v-model="latex_now" placeholder="请选择">
              <el-option
                v-for="(item, index) in latex"
                :key="index"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
            <el-divider></el-divider>
            <div style="padding-top: -10px;" >常见数学希腊符号表（首字母可大写）</div><br/>
            <el-table max-height="160px" :show-header="false" :data="symbols" style="font-size: 3px">
              <el-table-column
                prop="col1"
                align="center"
                width="70">
              </el-table-column>
              <el-table-column
                prop="col2"
                align="center"
                width="70">
              </el-table-column>
              <el-table-column
                prop="col3"
                align="center"
                width="70">
              </el-table-column>
              <el-table-column
                prop="col4"
                align="center"
                width="70">
              </el-table-column>
            </el-table>
            <p style="text-align: left; padding-left: 30px;padding-top: 20px ; height: 30px">复制格式：{{ temp_latex }}</p>
            <Mathdown :content="'效果展示：'+temp_latex" style="text-align: left; padding-left: 30px; padding-top: 20px; height: 30px"></Mathdown>
          </el-aside>

          <el-main width="75%" style="margin: 5px; margin-left: 15px">
            
            <!-- 指数用DIV -->
            <div v-if="latex_now=='指数'">
              <el-form>
                <el-row :span="24">
                  <el-col :span="6">
                    <el-form-item label="底数">
                      <el-input v-model="latex.指数.param1" placeholder="请输入底数"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :span="24">
                  <el-col :span="6">
                    <el-form-item label="指数">
                      <el-input v-model="latex.指数.param2" placeholder="请输入指数"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-divider></el-divider>
                <el-row :span="24">
                  <el-col :span="6">
                    <el-form-item>
                      <el-button @click="Update_Exp()">点击刷新</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form> 
            </div>

            <!-- 对数用DIV -->
            <div v-if="latex_now=='对数'">
              <el-form>
                <el-row>
                  <el-col :span="9">
                    <el-form-item label="特殊底数">
                      <el-radio-group v-model="latex.对数.param1">
                        <el-radio label="e">e</el-radio>
                        <el-radio label="10">10</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="4">
                    <el-form-item label="底数">
                      <el-input v-model="latex.对数.param1" placeholder="请输入底数"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4" :offset="1">
                    <el-form-item label="指数">
                      <el-input v-model="latex.对数.param2" placeholder="请输入指数"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-divider></el-divider>
                <el-row :span="24">
                  <el-col :span="9">
                    <el-form-item>
                      <el-button @click="Update_Log()">刷新</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>

            <!-- 三角函数用DIV -->
            <div v-if="latex_now=='三角函数'">
              <el-form >
                <el-row :span="24" >
                  <el-col :span="24">
                    <el-form-item label="请选择三角函数类型">
                      <el-radio-group style="width: 800px; text-align: left; padding-top: 10px" v-model="latex.三角函数.param1">
                        <el-row :span="24" >
                          <el-col :span="4">
                            <el-radio label="\sin">正弦sin</el-radio>
                          </el-col>
                          <el-col :span="4" :offset="1">
                            <el-radio label="\cos">余弦cos</el-radio>
                          </el-col>
                          <el-col :span="4" :offset="1">
                            <el-radio label="\tan">正切tan</el-radio>
                          </el-col>
                          <el-col :span="4" :offset="1">
                            <el-radio label="\cot">余切cot</el-radio>
                          </el-col>
                          <el-col :span="4" :offset="1">
                            <el-radio label="\sec">正割sec</el-radio>
                          </el-col>                       
                        </el-row>
                        <el-row>
                          <el-col :span="4">
                            <el-radio label="\csc">余割csc</el-radio>
                          </el-col>
                          <el-col :span="4" :offset="1">
                            <el-radio label="\arcsin">反正弦arcsin</el-radio>
                          </el-col>
                          <el-col :span="4" :offset="1">
                            <el-radio label="\arccos">反余弦arccos</el-radio>
                          </el-col>
                          <el-col :span="4" :offset="1">
                            <el-radio label="\arctan">反正切arctan</el-radio>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="4">
                            <el-radio label="\sinh">双曲正弦sinh</el-radio>
                          </el-col>
                          <el-col :span="4" :offset="1">
                            <el-radio label="\cosh">双曲余弦cosh</el-radio>
                          </el-col>
                          <el-col :span="4" :offset="1">
                            <el-radio label="\tanh">双曲正切tanh</el-radio>
                          </el-col>
                          <el-col :span="4" :offset="1">
                            <el-radio label="\coth">双曲余切coth</el-radio>
                          </el-col>
                        </el-row> 
                      </el-radio-group>               
                    </el-form-item>     
                  </el-col>
                </el-row>
                <el-row :span="24">
                  <el-col :span="9">
                    <el-form-item label="参数">
                      <el-input v-model="latex.三角函数.param2" placeholder="请输入参数"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-divider></el-divider>
                <el-row :span="24">
                  <el-col :span="9">
                    <el-form-item>
                      <el-button @click="Update_Triangle()">刷新</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              
            </div>

            <div v-if="latex_now == '绝对值'">
              <el-form>
                <el-row :span="24">
                  <el-col :span="6">
                    <el-form-item label="参数">
                      <el-input v-model="latex.绝对值.param" placeholder="请输入参数"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-divider></el-divider>
                <el-row :span="24">
                  <el-col :span="6">
                    <el-form-item>
                      <el-button @click="Update_Absolute()">点击刷新</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>

            <div v-if="latex_now == '最值'">
              <el-form>
                <el-row :span="24" >
                  <el-col :span="24">
                    <el-form-item label="请选择最值类型">
                      <el-radio-group style="width: 800px; text-align: left; padding-top: 10px" v-model="latex.最值.param1">
                        <el-row :span="24" >
                          <el-col :span="3">
                            <el-radio label="min">最小</el-radio>
                          </el-col>
                          <el-col :span="3" :offset="1">
                            <el-radio label="max">最大</el-radio>
                          </el-col>
                          <el-col :span="3" :offset="1">
                            <el-radio label="sup">上确界</el-radio>
                          </el-col>
                          <el-col :span="3" :offset="1">
                            <el-radio label="inf">下确界</el-radio>
                          </el-col>                      
                        </el-row>
                      </el-radio-group>               
                    </el-form-item>     
                  </el-col>
                </el-row>
                <el-row :span="24">
                  <el-col :span="9">
                    <el-form-item label="参数">
                      <el-input v-model="latex.最值.param2" placeholder="请输入参数，多个参数请用英文逗号分隔"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-divider></el-divider>
                <el-row :span="24">
                  <el-col :span="9">
                    <el-form-item>
                      <el-button @click="Update_MinMax()">刷新</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>   
            </div>
          </el-main>
        </el-container>
      </el-container>
    </el-dialog>

    <!-- header -->
    <el-row style="padding-top: 15px;" v-if="simpleInput">
      <el-col :span="6">
        <div class="logo">
          <img src="../assets/title_exercise.png" alt="logo" />
        </div>
      </el-col>
      <el-col :span="14">
        <el-row type="flex" justify="center">
          <el-col :span="22">
            <el-input v-model="exercise_text" placeholder="请输入内容">
              <template slot="append">
                <span style="cursor:pointer" @click="changeInput">
                  切换多格式输入
                </span>
              </template>
            </el-input>
          </el-col>
          <el-button type="submit" value="提交" @click="submit"
            >检索
          </el-button>
        </el-row>
      </el-col>
    </el-row>
    <!-- <el-row v-if="!simpleInput" type="flex" justify="center">
      <el-col :span="3" style="margin-top: 100px;">
        <img src="../assets/title_exercise.png" alt="logo" />
      </el-col>
      <el-col
        :span="18"
        style="margin-top: 20px; margin-bottom: -20px;"
        v-if="!simpleInput"
      >
        <el-row>
          <el-tabs type="border-card" id="tabs">
            <el-tab-pane label="多格式文本">
              <el-input
                type="textarea"
                :rows="8"
                v-model="content"
                placeholder="请输入内容"
              >
              </el-input>
            </el-tab-pane>
            <el-tab-pane label="LaTex预览">
              <div style="height:180px; overflow-y:scroll;">
                <Mathdown :content="content"></Mathdown>
                <div
                  class="img-list-item"
                  v-for="(item, index) in src"
                  :key="index"
                >
                  <img :src="item" class="common" />
                  <i class="del-img" @click="forkImage(index)"></i>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
          <UploadImg
            style="position: absolute;left:250px;top:0px;"
            :src="src"
            :filelists="filelists"
            @uploadImg="imgInfo"
          ></UploadImg>
          <span
            style="cursor:pointer;position:absolute;right:5px;top:12px;font-size:12px;"
            @click="changeInput"
          >
            切换简单输入
          </span>
          <el-button
            size="small"
            style="position:absolute; right:90px; top:5px;"
          >
            检索
          </el-button>
        </el-row>
      </el-col>
    </el-row> -->
    <el-row style="padding-top: 15px;" v-if="!simpleInput" type="flex" justify="center">
      <el-col :span="2">
        <el-row style="margin-top: 40px;"><img src="../assets/title_exercise.png" alt="logo" /></el-row>
        <el-row>
          <el-button @click="helper_dialog = true">快速公式助手</el-button>           
        </el-row>
        <el-row><el-button @click="changeInput">切换简单输入</el-button></el-row>
        <el-row><el-button>检索</el-button></el-row>
      </el-col>
      <el-col :span="18"><mavon-editor v-model="content" @imgAdd="New_Img_In" @imgDel="Del_Img" /></el-col>
    </el-row>
    <!-- main -->
    <el-row type="flex" justify="center" style="border-top: 10px solid #111;">
      <el-col :span="22">
        <div class="result">
          <el-row type="flex" justify="start">
            <h5 style="color: #0a1612;">试题文本</h5>
          </el-row>
          <el-row type="flex" justify="start" class="title">
            {{ raw_text }}
          </el-row>
          <el-divider></el-divider>
          <el-row type="flex" justify="start">
            <el-col :span="24">
              <el-row>
                <h5 style="color: #0a1612; float: left;">知识点</h5>
              </el-row>
              <el-tabs
                value="rjb_new"
                @tab-click="dataSource"
                type="card"
                style="height: 200px; margin-top: -10px; margin-left: 0px;"
                id="tabs"
              >
                <el-tab-pane label="人教版新" name="rjb_new">
                  <el-row
                    v-for="(entities, group, group_index) in entities_groups"
                    :key="group_index"
                  >
                    <el-row v-if="group_index == 0" type="flex" justify="start">
                    </el-row>
                    <el-row
                      v-if="group_index == 0"
                      class="label"
                      type="flex"
                      justify="start"
                    >
                      <el-popover
                        placement="top-start"
                        v-for="(entity, index) in entities"
                        :key="index"
                        :title="entity.name"
                        width="200"
                        trigger="hover"
                        :content="entity.annotation"
                      >
                        <el-tag slot="reference" id="tag">{{
                          entity.name
                        }}</el-tag>
                      </el-popover>
                    </el-row>
                  </el-row>
                </el-tab-pane>
              </el-tabs>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
/* eslint-disable */
import Mathdown from "./Mathdown.vue";
import UploadImg from "./UploadImg.vue";
export default {
  components: { Mathdown, UploadImg },
  name: "exercise",
  data() {
    return {
      exercise_text: "",
      raw_text: "",
      entities_groups: {},
      entity_type: "kp2.0",
      sour: "",
      content: "",
      simpleInput: true,
      // 老版本用到的UploadImg方法，我们这里暂时保留防止万一出问题需要还原
      src: [], // 图片数组
      filelists: [],
      // 新版本用的mavon-editor带来的自带回调函数用的json格式
      // name: 图片名
      // info: base64转换后的数据段
      image_infos: [],
      // 记录当前是否打开数学助手对话框
      helper_dialog: false,
      // 记录当前应当显示的LaTex公式的结果
      temp_latex: "$2^3$",
      // 记录当前应当显示哪一个LaTex公式的对话框的变量
      latex_now: "",
      // 保存所有快速生成LaTex文本参数的Json段
      latex: {
        "指数":{
          name: "指数",
          param1: "",
          param2: ""
        },
        "对数": {
          name: "对数",
          param1: "",
          param2: ""
        },
        "三角函数": {
          name: "三角函数",
          param1: "",
          param2: ""
        },
        "绝对值": {
          name: "绝对值",
          param: ""
        },
        "最值": {
          name: "最值",
          param1: "",
          param2: ""
        }
      },
      // 保存显示数学希腊符号的符号段
      symbols: [
        {
          'col1': "\\alpha",
          'col2': "\\beta",
          'col3': "\\gamma",
          'col4': "\\delta"
        },
        {
          'col1': "\\epsilon",
          'col2': "\\zeta",
          'col3': "\\eta",
          'col4': "\\theta"
        },{
          'col1': "\\iota ",
          'col2': "\\kappa",
          'col3': "\\lambda",
          'col4': "\\mu"
        },{
          'col1': "\\nu",
          'col2': "\\omicron",
          'col3': "\\xi",
          'col4': "\\pi"
        },{
          'col1': "\\rho",
          'col2': "\\sigma",
          'col3': "\\tau",
          'col4': "\\upsilon"
        },{
          'col1': "\\phi",
          'col2': "\\chi",
          'col3': "\\psi",
          'col4': "\\omega"
        }
      ]
    };
  },
  watch:{
    sour(val) {
      this.submit();
    },
    latex_now(newVal, oldVal){
      if(newVal != oldVal){
        this.temp_latex = "";
        this.latex_now = newVal;
      }
    }
  },
  methods: {
    dataSource(tab, event) {
      this.sour = tab.name;
      //黄小青师兄12月提供数据
      if(this.sour == 'rjb_new'){
        this.entity_type = "kp2.0";
      }
      return tab.name;
    },
    changeInput() {
      this.simpleInput = !this.simpleInput;
    },
    imgInfo(e) {
      this.src = e.src;
      this.filelists = e.filelists;
      console.log(e.src);
      console.log(e.filelists);
    },
   // 删除图片并保持图片数组顺序
    forkImage(index) {
      this.src.splice(index, 1);
      for (var i = 0; i < this.filelists.length; i++) {
        if (typeof this.filelists[i] === "undefined") {
          this.filelists.splice(i, 1);
          i = i - 1;
        }
      }
      this.filelists.splice(index, 1);
      document.getElementsByTagName("input").value = "";
      console.log(this.src);
      console.log(this.filelists);
      console.log(document.getElementsByTagName("input").value);
    },
    submit() {
      this.$http
        .post(
          this.backendIP + "/api/surface",
          { exercise_text: this.exercise_text, entity_type: this.entity_type },
          { emulateJSON: true }
        )
        .then(function(data) {
          console.log(data.data);
          this.raw_text = data.data.raw_text;
          this.entities_groups = data.data.entities_groups;
      });    
    },
    New_Img_In(imgname, img){
      this.image_infos.push(
        {
          "name": img.name,
          "info": img.miniurl
        }
      );
      console.log(this.image_infos);
    },
    Del_Img(imgname){
      for(var i = 0; i < this.image_infos.length; i++){
        if(this.image_infos[i].name == imgname[1].name){
          this.image_infos.splice(i, 1)
          break;
        }
      }
    },
    // 参数
    Update_Exp(){
      this.temp_latex = "$" + this.latex.指数.param1 + "^{" + this.latex.指数.param2 + "}$";
    },
    // 对数
    Update_Log(){
      if(this.latex.对数.param1 == 'e'){
        this.temp_latex = "$\ln" + this.latex.对数.param2 + "$";
      }else if(this.latex.对数.param1 == '10'){
        this.temp_latex = "$\lg" + this.latex.对数.param2 + "$";
      }else{
        this.temp_latex = "$\log_{" + this.latex.对数.param1 + "}" + this.latex.对数.param2 + "$";
      }
    },
    // 三角函数
    Update_Triangle(){
      this.temp_latex = "$" + this.latex.三角函数.param1 + " " + this.latex.三角函数.param2 + "$";
    },
    // 绝对值
    Update_Absolute(){
      this.temp_latex = "$|" + this.latex.绝对值.param + "|$";
    },
    // 最值
    Update_MinMax(){
      if( this.latex.最值.param1 == 'min' && this.latex.最值.param2.indexOf(',') != -1 ){
        this.temp_latex = "$\min(" + this.latex.最值.param2 + ")$";
      }else if( this.latex.最值.param1 == 'max' && this.latex.最值.param2.indexOf(',') != -1 ){
        this.temp_latex = "$\max(" + this.latex.最值.param2 + ")$";
      }else if( this.latex.最值.param1 == 'min' && this.latex.最值.param2.indexOf(',') == -1 ){
        this.temp_latex = "$\min " + this.latex.最值.param2 + "$";
      }else if( this.latex.最值.param1 == 'max' && this.latex.最值.param2.indexOf(',') == -1 ){
        this.temp_latex = "$\max " + this.latex.最值.param2 + "$";
      }else if( this.latex.最值.param1 == 'sup' && this.latex.最值.param2.indexOf(',') == -1 ){
        this.temp_latex = "$\sup " + this.latex.最值.param2 + "$";
      }else if( this.latex.最值.param1 == 'inf' && this.latex.最值.param2.indexOf(',') == -1 ){
        this.temp_latex = "$\inf " + this.latex.最值.param2 + "$";
      }else if( this.latex.最值.param1 == 'sup' && this.latex.最值.param2.indexOf(',') != -1 ){
        this.temp_latex = "上确界不支持多参数";
      }else if( this.latex.最值.param1 == 'inf' && this.latex.最值.param2.indexOf(',') != -1 ){
        this.temp_latex = "下确界不支持多参数";
      }
    },
  }
};
</script>

<style scoped lang="scss">
.exercise {
  background: url("../assets/sub_bg.png") repeat;
  background-size: 100%;
}
.logo {
  margin-left: 70px;
}
.result {
  border: 1px solid #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding-left: 5%;
  padding-right: 5%;
  padding-top: 5%;
  height: 780px;
  background-color: #fff;
  margin-left: 20px;
  border-right: 14px solid #fff;
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
.el-tag {
  margin-left: 10px;
}
.el-col {
  border-radius: 4px;
}
</style>

<style scoped type="text/css">
.el-button {
  background-color: #1a2930;
  color: #fff;
  border-color: #1a2930;
}
.el-button:hover {
  background-color: #008080;
  color: #fff;
  border-color: #fff;
}
.el-button:focus {
  background-color: #008080;
  color: #fff;
  border-color: #fff;
  outline: none;
}
.img-list-item {
  position: relative;
  margin: auto;
  display: inline-block;
}
.img-list-item img {
  width: 200px;
  height: 200px;
  box-sizing: border-box;
  vertical-align: middle;
  border: 0;
}
.img-list-item i.del-img {
  width: 20px;
  height: 20px;
  display: inline-block;
  background: rgba(0, 0, 0, 0.1);
  background-image: url(../assets/delete.jpeg);
  background-size: 10px;
  background-repeat: no-repeat;
  background-position: 50%;
  position: relative;
  top: 0;
  right: 0;
}
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