<template>
  <div style="margin-left: 10vw; margin-right: 10vw; min-height: 700px; margin-top: 50px;">
    <el-row>
      123
      <el-button type="primary" @click="Get_Reg_Test()"></el-button>
    </el-row>
    <!-- <el-row>
      <el-input 
        type="textarea" 
        v-model="TextLine" 
        ref="InputArea">
      </el-input>
    </el-row>
    <el-row style="margin-top: 20px; margin-bottom: 20px">
      <el-button @click="Get_Area_Class()">格式信息</el-button>
    </el-row>
    <el-row>
      <div v-html="Get_TextLine()">

      </div>
    </el-row> -->
    <!-- 知识点内容过滤的而部分，隐藏日期：20210808 -->
    <el-row style="display: none">
      <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterText">
      </el-input>
      <el-row type="flex" justify="start" style="margin-top: 30px; margin-bottom: 30px;">
        <label style="margin-top: -3px; margin-right: 10px;">
          选择方式：
        </label>
        <el-radio-group v-model="KnowledgeSelectType">
          <el-radio label="Single">单选</el-radio>
          <el-radio label="Multiple">多选</el-radio>
        </el-radio-group>
      </el-row>
      <el-row type="flex" justify="start" style="height: 60vh; overflow: scroll; width: 18vw">
        <!-- 关于el-tree的单选多选测试 -->
        <el-tree 
          :data="TreeData"
          check-strictly
          node-key="id"
          show-checkbox
          :props="defaultProps"
          default-expand-all
          check-on-click-node
          :filter-node-method="filterNode"
          @check-change="handleCheckChange"
          style="font-size: 10px;"
          ref="tree"
          v-loading="waiting"
          element-loading-text="正在获取知识树..."
          element-loading-spinner="el-icon-loading">
        </el-tree>
      </el-row>
    </el-row>
    <!-- 以下内容是20210719之前的测试内容，可能以后还会有用到的地方，先不删了 -->
    <el-row type="flex" justify="center" style="display: none; padding: 40px; padding-bottom: 40px; width: 90%; margin-left: 5%; border: 1px solid black">
      <el-image :src="Paste_Info"></el-image>
    </el-row>
    <el-row style="display: none;">
      <el-button @click="Send_Message()">123</el-button>
    </el-row>
    <el-row type="flex" justify="center" style="display: none; margin-top: 40px">
      鼠标移入移除测试
    </el-row>
    <el-row type="flex" justify="center" style="display: none; margin: 20px 0px">
      <el-button v-if="!Self_Cut" @click="Self_Cut = true" type="text" style="color: blue">开启自定义切分</el-button>
      <el-button v-if="Self_Cut" @click="Self_Cut = false" type="text" style="color: pink">关闭自定义切分</el-button>
    </el-row>
    <el-row v-for="(I, Index) in [0, 1, 2]" :key="Index" style="display: none;">
      <el-row type="flex" justify="start" style="font-size: 14px">
        待切分的第{{Index + 1}}部分
      </el-row>
      <el-row 
        v-if="Index != 2 && Self_Cut && !expand[Index]"
        style="height: 8px; padding: 0px; margin: 0px; border: 2px solid #ccc"
        @mouseenter.native="Expand_Change(Index)" 
        @mouseleave.native="Expand_Change(Index)">
        <span>&nbsp;</span>
      </el-row>
      <el-row
        v-if="Index != 2 && Self_Cut && expand[Index]" 
        type="flex" justify="center" 
        style="cursor: pointer" 
        @mouseleave.native="Expand_Change(Index)" 
        @mouseenter.native="Expand_Change(Index)"
        @click.native="Cut_Show(Index)">
          <span style="line-height: 30px; height: 30px;">-------------------------------</span>
          <i class="el-icon-scissors" style="font-size: 20px; padding-top: 5px"></i>
          <span style="line-height: 30px; height: 30px;">-------------------------------</span>
      </el-row>
    </el-row>
    <el-row style="display: none; margin-bottom: 30px; margin-top: 30px">
      题目题干合并测试
    </el-row>
    <el-row v-for="(Item, Item_Index) in TestList" :key="'TL' + Item_Index" style="display: none;">
      <el-row>
        <el-button type="text" v-if="Item_Index != 0" @click="Merge(Item_Index)">合并</el-button>
      </el-row>
      <el-row v-if="Item.is_Q == 0">
        题干
      </el-row>
      <el-row v-if="Item.is_Q == 1">
        题目
      </el-row>
    </el-row>
  </div>
</template>
<script>

// import FileSaver from "file-saver";

export default {
  name: 'ScreenShot',
  props: {

  },
  data() {
    return {
      // 开始尝试做一个输入框组件
      // 文本内容
      TextLine: "",
      // 等待变量
      waiting: false,
      // 知识体系单选或多选
      KnowledgeSelectType: "Single",
      // 要展示的知识点槽
      KnowledgeUnitList: [],
      // 输入框过滤
      filterText: '',
      // 测试树组件选择的数据
      TreeData: [{
        id: 1,
        label: '几何',
        children: [{
          id: 4,
          label: '圆',
          children: [{
            id: 9,
            label: '半径'
          }, {
            id: 10,
            label: '直径'
          }]
        }]
      }, {
        id: 2,
        label: '四则运算',
        children: [{
          id: 5,
          label: '加法'
        }, {
          id: 6,
          label: '减法'
        }]
      }, {
        id: 3,
        label: '积分',
        children: [{
          id: 7,
          label: '导数'
        }, {
          id: 8,
          label: '极限'
        }]
      }],
      // 这里用于定义哪些内容是用于生成树的，这里定义了字数的关键字为children，标签的标签值为label
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      Paste_Info: "测试粘贴文件内容2",
      Paste_Catcher: "",
      Self_Cut: false,
      expand: [false, false],
      TestList: [
        {
          "is_Q": 0
        },
        {
          "is_Q": 0
        },
        {
          "is_Q": 1
        },
        {
          "is_Q": 1
        }
      ]
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    KnowledgeSelectType(newVal, oldVal){
      if(newVal != oldVal){
        this.$refs.tree.setCheckedKeys([])
      }
    }
  },
  mounted() {
    this.Init();
    this.Paste_Catcher = setInterval(()=>{
      if(sessionStorage.getItem("PicPaste")){
        this.Paste_Info = sessionStorage.getItem("PicPaste")
      }
    }
    , 50)
    
  },
  methods: {
    // 尝试看Re的判别式对不对
    Get_Reg_Test(){
      let Count = 0
      let Str = " (    )  （   ）  （  )   (    ）______ _________ _ __ ___ ____"
      let Space_Reg = new RegExp("____+", 'g')
      let Quote_Reg = new RegExp("(\\(|\\（)(\\s*)(\\)|\\）)", "g")
      let res = Quote_Reg.exec(Str)
      while(res != null){
        console.log(res[0])
        res = Quote_Reg.exec(Str)
        Count = Count + 1
      }
      res = Space_Reg.exec(Str)
      while(res != null){
        console.log(res[0])
        res = Space_Reg.exec(Str)
        Count = Count + 1
      }
      console.log(Count)
      return Count
    },
    // 点击按钮后获取文本框的样式
    Get_Area_Class(){
      console.log(this.$refs.InputArea.$el.clientHeight)
    },
    // 随时盯着文本内容转化的方法
    Get_TextLine(){
      let TextList = this.TextLine.split("\n")
      let Result = ""
      for(let i = 0; i < TextList.length; i++){
        Result = Result + "<p>" + TextList[i] + "</p>"
      }
      return Result
    },
    Init(){

      let Flag = true
      if(Flag){
        return
      }

      this.waiting = true;

      let T_URL = "https://kg-edu-backend-44-review-latex-mw1s2b.env.bdaa.pro/v1"

      let config = {
          headers: {
              "Content-Type": "multipart/form-data"
          },
          emulateJSON: true
      }

      let param = new FormData();

      param.append('system', 'tiku');
      param.append('subject', '数学');

      this.$http
          .post(T_URL + "/api/getKnowledgeSystem", param, config)
          .then(function(data) {
            this.TreeData = data.body.knowledge_system
            this.waiting = false;
            // let file = new File(
            //   [JSON.stringify(this.TreeData, null, 4)],
            //   "Tree.json",
            //   { type: "text/plain;charset=utf-8" }
            // );
            // FileSaver.saveAs(file);
          })
    },
    // 点击节点后的方法
    handleCheckChange(data, checked) {
      console.log(checked)
      if (checked && this.KnowledgeSelectType == "Single") {
        this.$refs.tree.setCheckedKeys([data.id])
        this.KnowledgeUnitList = [data.label]
      }
      else if(checked){
        this.KnowledgeUnitList.push(data.label)
      }else{
        this.KnowledgeUnitList.splice(this.KnowledgeUnitList.indexOf(data.label), 1)
      }
      console.log(this.KnowledgeUnitList)
    },
    // 这里是输入过滤用的方法
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    Init_Img_Paster(){
      window.addEventListener('paste', function(e){
        let Pic = e.clipboardData.items[0].getAsFile();
        // 保存读取内容用的临时变量
        var Picresult = "";
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
          sessionStorage.setItem("PicPaste", Picresult)
          alert("已粘贴")
        }).catch(function(err){
          // 报错了就打印错误
          console.log(err)
          alert("您最新的粘贴对象不是图片内容。")
        })
      })
    },
    Send_Message(){
      console.log(this.Paste_Info)
    },
    Expand_Change(Index){
      this.expand.splice(Index, 1, !this.expand[Index]);
    },
    Cut_Show(Index){
      alert("从第" + (Index+1) + "处切分")
    },
    Merge(Item_Index){
      if(this.TestList[Item_Index-1].is_Q != this.TestList[Item_Index].is_Q){
        this.$confirm("类型不一致，请选择合并后的类型", "提示", {
          distinguishCancelAndClose: true,
          confirmButtonText: '题干',
          cancelButtonText: '题目',
          type: "info",
          confirmButtonClass: "confirmButton",
          cancelButtonClass: "confirmButton"
        }).then(() => {
          this.TestList.splice(Item_Index, 1)
          this.TestList[Item_Index - 1].is_Q = 0;
        })
        .catch((action) => {
          if(action == "cancel"){
            this.TestList.splice(Item_Index, 1)
            this.TestList[Item_Index - 1].is_Q = 1;
          }
        })
        }
        else{
          this.TestList.splice(Item_Index, 1)
        }
    }
  },
}
</script>
<style >
.confirmButton{
  font-size: 14px !important;
  color: #409EFD !important;
  background: transparent !important;
  border: 1px solid #409EFD !important;
}
</style>