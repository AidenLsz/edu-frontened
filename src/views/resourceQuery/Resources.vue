<template>
    <div
        id="Page"
        v-loading="Waiting_Param"
        :element-loading-text="Waiting_Text"
        element-loading-spinner="el-icon-loading">
      <div class="RS_SearchInput">
        <el-input
            prefix-icon="el-icon-search"
            v-model="Search_Content"
            @keyup.enter.native="Search_Do()"
            placeholder="请输入想要检索的资源关键字"
            style="width: 55.1vw;"
            class="Search_Input"
            suffix-icon="el-icon-camera"
        >
        </el-input>
        <el-tabs v-model="activeName"
                 @tab-click="handleClick"
                 style="width: 23vw;position: relative;right: 1.9vw;">
          <el-tab-pane label="知识点" name="first"></el-tab-pane>
          <el-tab-pane label="试题" name="second"></el-tab-pane>
          <el-tab-pane label="试卷" name="third"></el-tab-pane>
          <el-tab-pane label="教材教辅" name="fourth"></el-tab-pane>
        </el-tabs>
        <div class="RS_result">最匹配结果</div>
      </div>
        <div id="Filter" class="Top_Nav">

        </div>
        <!-- 我们写一个完全固定定死的右下角的变栏来跳转 -->
        <div class="Jump_Bar">
            <el-row
                class="Jump_Item"
                @click.native="Jump_To('Filter')">
                <i class="el-icon-download" style="transform: rotate(180deg);"></i>
            </el-row>
            <el-row
                v-if="Resource_Info_List.length > 0"
                class="Jump_Item"
                @click.native="Jump_To('Resources')">
                <i class="el-icon-tickets"></i>
            </el-row>
            <el-row
                class="Jump_Item"
                v-if="Resource_Info_List.length > 0"
                @click.native="Jump_To('Page_Seg')">
                <i class="el-icon-download"></i>
            </el-row>
        </div>
        <instruction
            ref="instruction"
        />
        <div class="RS_container">
        <el-row type="flex" justify="center" style="padding-top: 90px" class="Main_Background">

              <div class="RS_left_container">

                <!-- 功能区 -->
                <el-row class="Padding_Width">
                    <el-col style="padding-left: 82vw;margin-top:-14.3vh;width:80%">
                        <!-- 不同功能 -->
                        <!-- 学段检索 -->
                        <el-row type="flex" justify="start" class="Filter_Line">
                        <span class="Filter_Label">学科</span>
                        <div>
                          <div class="Filter_Item_Shadow">
                                <div
                                    v-for="(Resource_Subject_Item, Resource_Subject_Item_Index) in All_Options.Resource_Subject_Part1" :key="'Filter_Resource_Subject_Part1_' + Resource_Subject_Item_Index"
                                    :class="Focus_Filter('Resource_Subject_Part1', Resource_Subject_Item)"
                                    :style="Filter_Item('Resource_Subject_Part1', Resource_Subject_Item_Index, Resource_Subject_Item)"
                                    @click="Filter_Change('Resource_Subject_Part1', Resource_Subject_Item)">
                                    {{Resource_Subject_Item}}
                                </div>
                            <div
                                v-for="(Resource_Subject_Item, Resource_Subject_Item_Index) in All_Options.Resource_Subject_Part2" :key="'Filter_Resource_Subject_Part2_' + Resource_Subject_Item_Index"
                                :class="Focus_Filter('Resource_Subject_Part2', Resource_Subject_Item)"
                                :style="Filter_Item('Resource_Subject_Part2', Resource_Subject_Item_Index, Resource_Subject_Item)"
                                @click="Filter_Change('Resource_Subject_Part2', Resource_Subject_Item)">
                                    {{Resource_Subject_Item}}
                                </div>
                          </div>

                        </div>
                      </el-row>
                      <el-row type="flex" justify="start" class="Filter_Line">
                        <span class="Filter_Label">适用年级</span>
                        <div class="Filter_Item_Shadow">
                                <span
                                    v-for="(Resource_Period_Item, Resource_Period_Item_Index) in All_Options.Resource_Period" :key="'Filter_Resource_Period_' + Resource_Period_Item_Index"
                                    :class="Focus_Filter('Resource_Period', Resource_Period_Item)"
                                    :style="Filter_Item('Resource_Period', Resource_Period_Item_Index, Resource_Period_Item)"
                                    @click="Filter_Change('Resource_Period', Resource_Period_Item)">
                                    {{Resource_Period_Item}}
                                </span>
                        </div>
                      </el-row>
                        <el-row type="flex" justify="start" class="Filter_Line">
                            <span class="Filter_Label">资源类型</span>
                            <div class="Filter_Item_Shadow">
                                <span
                                    v-for="(Resource_Type_Item, Resource_Type_Item_Index) in All_Options.Resource_Type" :key="'Filter_Resource_Type_' + Resource_Type_Item_Index"
                                    :class="Focus_Filter('Resource_Type', Resource_Type_Item)"
                                    :style="Filter_Item('Resource_Type', Resource_Type_Item_Index, Resource_Type_Item)"
                                    @click="Filter_Change('Resource_Type', Resource_Type_Item)">
                                    {{Resource_Type_Item}}
                                </span>
                            </div>
                        </el-row>


                        <el-row type="flex" justify="start" class="Filter_Line" style="margin-top: 36px;">
                          <el-input
                              v-model="Search_Content"
                              @keyup.enter.native="Search_Do()"
                              placeholder="请输入想要检索的资源关键字"
                              style="width: 760px;"
                              class="Search_Input"></el-input>
                            <!-- 开始检索的按钮 -->
                            <el-button
                                type=""
                                style="border-radius: 10px; margin-left: 32px; width: 100px"
                                @click="Search_Do()">
                                <i class="el-icon-search" style="margin-right: 4px"></i>检索
                            </el-button>
                        </el-row>
                    </el-col>
                </el-row>

                <el-row
                    v-if="Resource_Info_List.length == 0"
                    style="height: 200px; line-height: 200px; width: 100%; font-weight: bold; font-size: 24px; color: #ccc"
                    type="flex" justify="center">
                    暂无检索结果
                </el-row>
              </div>


        </el-row>
        <div v-if="Resource_Info_List.length != 0">
            <el-row
                type="flex"
                justify="center"
                class="Padding_Width"
                style="width: 100%;padding-bottom: 5vh"
                v-for="Resource_Info_Index in 10"
                :key="'Resource_Info_' + Resource_Info_Index">
                <div style="background-image:linear-gradient(to right,#FAFAFC,#F7F8FA)" class="RS_card">
                  <div class="Resource_Label">
                    {{Resource_Info_List[(Page_Index - 1) * 10 + Resource_Info_Index - 1].subject}}
                      {{Resource_Info_List[(Page_Index - 1) * 10 + Resource_Info_Index - 1].publisher}}
                      {{Resource_Info_List[(Page_Index - 1) * 10 + Resource_Info_Index - 1].period}}
                      {{Resource_Info_List[(Page_Index - 1) * 10 + Resource_Info_Index - 1].name}}
                  </div>
                  <div class="RS_card_btm">
                  <div class="RS_period" style="width: 100px" >
                    {{Resource_Info_List[(Page_Index - 1) * 10 + Resource_Info_Index - 1].period}}
                  </div>
                    <div class="RS_type" style="width: 100px" >
                      {{Resource_Info_List[(Page_Index - 1) * 10 + Resource_Info_Index - 1].type}}
                    </div>
                    <div class="Resource_Label" style="width: 160px">
                        <el-button style="display: none" type="success" size="mini" @click="Resource_Preview(Resource_Info_List[(Page_Index - 1) * 10 + Resource_Info_Index - 1])">预览</el-button>
                        <el-button style="margin-left:25vw"
                                   type="primary"
                                   size="mini"
                                   icon="el-icon-download"
                                   @click="Resource_Download(Resource_Info_List[(Page_Index - 1) * 10 + Resource_Info_Index - 1])">
                          下载</el-button>
                    </div>
                    </div>
                </div>
            </el-row>
            <el-row
                id="Page_Seg"
                style="padding-top: 20px; padding-right:24vw;padding-bottom: 20px; background: transparent">
                <el-pagination
                    @current-change="Page_Index_Change"
                    :current-page.sync="Page_Index"
                    :page-size="Page_Length"
                    layout="prev, pager, next"
                    :total="Total_Count">
                </el-pagination>
            </el-row>
        </div>
        </div>
    </div>

</template>

<script>

import * as variable from '@/common/utils/variable'

import Instruction from '@/views/resourceQuery/components/InstructionExercise.vue'

import {commonAjax} from '@/common/utils/ajax'
import {LRStrip} from '@/common/utils/strip'

export default {
  name: "",
  components:{
      Instruction
  },
  data() {
    return {
        // 用于等待进度条
        Loading_Status: false,
        Loading_Status_2: false,
        // 全部选项，用于显示
        All_Options:{
            Resource_Type: ["教材", "课件", "教案", "学案", "其他"],
            Resource_Period: ["一年级", "二年级", "三年级", "四年级", "五年级", "六年级", "七年级", "八年级", "九年级"],
            Resource_Subject_Part1: ["语文", "数学", "英语", "物理", "化学", "生物", "地理", "历史", "政治", "书法"],
            Resource_Subject_Part2: ["信息技术", "美术", "通用技术", "体育", "品德", "音乐", "俄语", "日语", "科学", "其他"]
        },
        // 选中的选项，用于显示样式的调整和检索的时候进行内容转换
        Chosen_Options: {
            Resource_Type: [],
            Resource_Period: [],
            Resource_Subject_Part1: [],
            Resource_Subject_Part2: []
        },
        // 换页时使用的变量
        Page_Index: 1,
        // 换页时使用的总量数字
        Total_Count: 0,
        // 每页的长度，或每页有多少道题
        Page_Length: 10,
        // 检索内容
        Search_Content: "",
        // 控制检索结果的题目数组
        Resource_Info_List: [],
        // 记录上次检索的时候所使用的信息
        History_Chosen_Options:{
            Resource_Type: [],
            Resource_Period: [],
            Resource_Subject_Part1: [],
            Resource_Subject_Part2: [],
            Search_Content: ""
        },
        // 用于表示正在等待的变量
        Waiting_Param: false,
        // 用于写文字来表示正在等待什么内容的变量
        Waiting_Text: "",
        // 多源下载时的文件类型
        File_Type_Blob:{
            'doc': "application/msword",
            'docx': "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            'pdf': "application/pdf",
            'ppt': "application/vnd.ms-powerpoint",
            'pptx': "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            'jpg': 'image/jpeg',
            'jpeg': "image/jpeg"
        },
    };
  },
  destroyed(){

  },
  computed:{
    multiExerciseMap(){
      return variable.multiExerciseMap
    }
  },
  mounted(){
    this.To_Top();
  },
  updated() {

  },
  methods: {
    handleClick(){
      if(this.activeName=="fourth"){
        this.Search_Do();}
    },
      To_Top(){
          document.getElementById("Filter").scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"})
      },
      openInstructionDialog(){
            this.$refs.instruction.openDialog();
        },
        // 控制筛选项的样式显示
        // 参数分别是筛选项所属的属性，筛选项对应的索引值
        Filter_Item(){
            let WIDTH = '80px'
          return {
            "width": WIDTH,
            "height": "40px",
            "line-height": "40px",
            "text-align": "center",
            "display": "inline-block",
            "box-sizing": "border-box",
            "background": "white",
            "cursor": "pointer",
            "border-top-left-radius":"10px",
            "border-bottom-left-radius":"10px",
            "border-top-right-radius": "10px",
            "border-bottom-right-radius": "10px",
            "margin-right":"10px",
            "margin-top":"10px",
            "background-color":"#EDEFF2"
          }
        },
        // 样式筛选器，对比这个属性的这一项是否在Chosen_Options内，来对应不同的显示
        // 主要用于hover样式，来做成按钮的效果
        Focus_Filter(Part, Item){
            if(this.Chosen_Options[Part].indexOf(Item) == -1){
                return "Unchosen_Option"
            }else{
                return "Chosen_Option"
            }
        },
        // 内容调整，控制选择项的内容
        Filter_Change(Part, Item){
            if(this.Chosen_Options[Part].indexOf(Item) == -1){
                this.Chosen_Options[Part].push(Item)
            }else{
                this.Chosen_Options[Part].splice(this.Chosen_Options[Part].indexOf(Item), 1)
            }
        },
        // 检索用的方法
        Search_Do(){

            this.Page_Index_Change_Check()

            let Param = {}
            let Striped_Content = LRStrip(this.Search_Content)
            if(Striped_Content == ""){
                this.$message.info("请输入内容")
                this.Search_Content = ""
                return
            }else{
                this.Search_Content = Striped_Content
            }

            this.Waiting_Param = true;
            this.Waiting_Text = "正在搜索资源..."

            let SUBJECT = [];
            for(let i = 0; i < this.Chosen_Options.Resource_Subject_Part1.length; i++){
                SUBJECT.push(this.Chosen_Options.Resource_Subject_Part1[i])
            }

            for(let i = 0; i < this.Chosen_Options.Resource_Subject_Part2.length; i++){
                SUBJECT.push(this.Chosen_Options.Resource_Subject_Part2[i])
            }

            let Data = JSON.stringify({
                "content": this.Search_Content,
                "type": this.Chosen_Options.Resource_Type,
                "size": 200,
                "subject": SUBJECT,
                "period": this.Chosen_Options.Resource_Period
            })

            Param.data = Data

            commonAjax(this.backendIP + "/api/rsc_search", Param)
            .then((data)=>{
                if(data.results.length > 0){
                    this.Resource_Info_List = data.results;
                    this.Total_Count = data.results.length;
                    setTimeout(()=>{
                        document.getElementById('Resources').scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"})
                    }, 100)
                }else{
                    this.$message.warning("找不到匹配的资源，请调整搜索的筛选项并重试。")
                    this.Jump_To('Filter');
                }
            }).catch(()=>{
                this.$message.error("服务器好像开小差了，请稍后再试。")
                this.Jump_To('Filter');
            }).finally(()=>{
                this.Waiting_Param = false
                this.Waiting_Text = ""
            })

            return
        },
        // 滚动到顶部
        Page_Index_Change(){
            this.Jump_To('Resources');
        },
        // 检测是否需要把Page_Index页码调整为1
        Page_Index_Change_Check(){
            let Flag = false
            let Keys = ["Resource_Type", "Resource_Period", "Resource_Subject_Part1", "Resource_Subject_Part2"]
            for(let i = 0; i < Keys.length; i++){
                let key = Keys[i]
                if(JSON.stringify(this.History_Chosen_Options[key]) != JSON.stringify(this.Chosen_Options[key])){
                    Flag = true
                    this.History_Chosen_Options[key] = JSON.parse(JSON.stringify(this.Chosen_Options[key]))
                }
            }
            if(JSON.stringify(this.History_Chosen_Options.Search_Content) != JSON.stringify(this.Search_Content)){
                Flag = true;
                this.History_Chosen_Options.Search_Content = JSON.parse(JSON.stringify(this.Search_Content))
            }
            if(Flag){
                this.Page_Index = 1
            }
        },
        // 跳转到某个组件的位置
        Jump_To(Part){
            document.getElementById(Part).scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"})
        },
        // 预览和下载
        Resource_Preview(Resource_Info){
            Resource_Info
            this.$message.warning("敬请期待在线预览功能")
        },
        Resource_Download(Resource_Info){

            this.Waiting_Param = true
            this.Waiting_Text = "正在准备下载资源，请稍后..."

            let Param = {
                'file': Resource_Info.filepath
            };

            let config = {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                responseType: 'arraybuffer',
                emulateJSON: true
            }

            let PART = Resource_Info.name.split(".");
            let TYPE = PART[PART.length - 1];

            this.$http
                .post(this.backendIP + "/api/rsc_get", Param, config)
                .then(function(data) {
                if(data.data){
                    const link = document.createElement('a')
                    let blob = new Blob([data.data],
                        {type: this.File_Type_Blob[TYPE]})
                    let objectUrl = URL.createObjectURL(blob)
                    link.href = objectUrl
                    link.download = Resource_Info.name
                    link.click()
                    URL.revokeObjectURL(objectUrl);
                }
                }).catch((err) => {
                    if(err.status == 404){
                        this.$message.error("此资源维护中，暂时无法提供下载，请尝试更换其他文件...")
                        return
                    }
                    this.$message.error("服务器忙碌，请稍后再试...");
                }).finally(()=>{
                    this.Waiting_Param = false
                    this.Waiting_Text = ""
                });
        },
    }
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.RS_period{
  position: static;
  left: 80px;
  top: 0px;
  width: 80px;
  height: 38px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 16px;
  border-radius: 6px;
  background: #FAE8EC;

  /* 标签下阴影 */
  box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.16);
  font-family: Sarasa-Gothic-SC-Regular;
  font-size: 16px;
  font-weight: normal;
  line-height: 22px;
  letter-spacing: 0px;
  color: #7D3745;
  z-index: 0;
}
.RS_type{
  position: static;
  left: 176px;
  top: 0px;
  width: 64px;
  height: 38px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 16px;
  border-radius: 6px;
  background: #E8FAEF;
  margin: 0px 40px;
  /* 标签下阴影 */
  box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.16);
  font-family: Sarasa-Gothic-SC-Regular;
  font-size: 16px;
  font-weight: normal;
  line-height: 22px;
  letter-spacing: 0px;
  color: #377D53;
  z-index: 0;

}

.RS_SearchInput{
  width: 55vw;
  padding-left: 7vw;
}
.RS_result{
  padding-right: 41.5vw;
  margin-left: -5.1vw;
  font-family: Source Han Sans CN;
  font-weight: 600;
}

.RS_card_btm{
  display: flex;
  flex-direction:row;
  align-items: baseline;


}
.RS_card{
  display: flex;
  flex-direction: column;
  width: 55vw;
  margin-left: -1vw;
}
.RS_container{
  display:flex;
  flex-direction: row-reverse;
  justify-content: space-between;
}
.Filter_Line{
  display: flex;
  flex-direction: column;
  margin: 24px 0;
  min-width: 28vw;
  margin-top: 2.5vh;
}

.Filter_Label{
    width: 90px;
    font-size: 18px;
    font-weight: bold;
    height: 40px;
    line-height: 40px;
    text-align: left;
}

.Unchosen_Option{
    color: #333;
    border: 1px solid #ccc;
    box-sizing: border-box;
}

.Unchosen_Option:hover{
    color: rgba($color: #409EFF, $alpha: 0.6);
    // border: 1px solid rgba($color: #409EFF, $alpha: 0.6);
    box-sizing: border-box;
}

.Chosen_Option{
    color: #409EFF;
    border: 1px solid #409EFF;
    box-sizing: border-box;
}
.Search_Input{
  font-size: 16px;
  line-height: 46px;
  height: 46px;
  background: #FFFFFF;
  border: 1px solid #D4D4D4;
  box-sizing: border-box;
  box-shadow: 0px 2px 8px rgba(151, 151, 151, 0.06);
  border-radius: 10px;
  -webkit-box-shadow: 0px 2px 8px rgba(151, 151, 151, 0.06);
  margin-left: -2vw;
  border-radius: 50px;
  margin-top:5vh;


}
.Search_Input ::v-deep .el-input__inner{
  border: 0;
  border-radius: 0px;
  background: transparent;
}

.Jump_Bar{
    position: absolute;
    right: 45px;
    bottom: 20px;
    width: 40px;
    min-height: 40px;
}

.Jump_Item{
    width: 36px;
    height: 36px;
    line-height: 36px;
    margin-bottom: 12px;
    border-radius: 7px;
    background: white;
    cursor: pointer;
    border: 1px solid #aaa;
    box-shadow: 0px 4px 12px rgba($color: #000, $alpha: 0.06);
    z-index: 5;
    font-size: 16px;
}

.Background_Round{
    position: absolute;
    overflow: hidden;
    width: 1000px;
    height: 1000px;
    margin-left: calc((100% - 1344px - 16px)/2);
    left: 600px;
    top: -58%;
    border-radius: 50%;
    background: linear-gradient( 180deg, rgba(#D9E9FE, 0%), rgba(#C8E0FF, 100%));
    box-shadow: 0px 4px 24px rgba(0, 0, 0, 0.06);
    z-index: -1;
}

.Background_Round_Position{
    position: absolute;
    right: 0px;
    width: 850px;
    background: transparent;
    overflow: hidden;
    z-index: -1;
}

.Filter_Item_Shadow{
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.Padding_Width{
    padding-left: 6vw;
}

.Label_Shadow{
    text-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12);
}

.Main_Background{
    width: 100%;
    overflow: hidden;
    margin-top: -70px;
    margin-bottom: 64px;
    margin-left:-60vw;
}

.Top_Nav{
    position: relative;
    top: -90px;
    width: 10px;
    height: 10px;
    background: transparent;
}

.Table_Label{
    display: inline-block;
    height: 70px;
    background: #D1E5FA;
    color: black;
    line-height: 70px;
}

.Resource_Label{
    display: inline-block;
    height: 60px;
    color: black;
    line-height: 60px;
    text-align: left;
}

.Resource_Name{
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    padding: 0px 16px;
    vertical-align: middle;
}
</style>
