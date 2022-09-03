<template>
  <div class="Normal_Home_Page">
    <section class="main_area" >
      <el-row type="flex" justify="center" >
        <div style="display: inline-block">
          <img src="@/assets/LUNA-HOMEPAGE-LOGO.png" class="Home-Page-Icon" draggable="false" >
        </div>
        <div style="display: inline-block; padding-top: 10px">
          <div class="Search-Page-Word">LUNA智慧搜索</div>
        </div>
      </el-row>
      <el-row type="flex" justify="center">
        <div class="Search_Area">
        <div class="Self_Input_Area_Left" align="left">
          <img class="search-icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABHNCSVQICAgIfAhkiAAAAe9JREFUOI2llK9uG0EQh7/Z+8MiGRpWakBIQUGZwUUqcs93CywVlBTEzC8QkIeo1CrApIFRFenOjVxSqWaxlD5AQSMFHigIKfLppsBrdxM5btwMmpvZ/e43OzsrrLE8z18Cr4EEaLtwBUyB07Isv67bByD+R6/X2zPGHDvQJpuq6mA8Hv+8mzBLJ03TjjHmwsEqVT0yxjyL43gnjuMdEXmuqkdOaSIil2madtYqdMougBZwJiIHRVHcrJNmrW01TfNRRHLgRlVf+EpDAFdmCzgry7K/qVb3I5tlWSEiuYiMgP1Vya4BCVCJyMEmmG/GmLfALyCx1iarOItuoqof7ivzPqWq+s7tfeMDE4AgCIqHwjyV5869pbANEIbh9bbAKIqWzVje1b/X5jGmqqEPrADqun6yLWg+n+8CiMi1D5wCNE2T/4eyV86d+cBT5w+tta2HwtzaoVN4sgK6QZ8CbVUdbaFuxKIZs6Iopst46JIDEbkE+nmefxKRwabRc7C+U3fo51evTZqmnSAIPgMtVa1E5L0x5jwMwyuAuq6fNk2TqupQRNoe48d8Pt+fTCbVLSBAlmW7bjaTf1Q8E5FDVT0G9nyorFttrU3cOCUszjZ0V2MmIifLM+t2u+0oir750LXAbewO9PujgR70i6r+/gMy8ssS6oH9AwAAAABJRU5ErkJggg==">
        </div>
        <div class="Self_Input_Area_Middle" align="left">
          <input
              class="Self_Input"
              placeholder="三角函数"
              >
        </div>
        <div class="Self_Input_Area_camera" align="left">
          <div class="camera-icon-container">
            <img class="camera-icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAUCAYAAACXtf2DAAAABHNCSVQICAgIfAhkiAAAAexJREFUOI2tlD2LE0EYx3/P5TDZmG2yrUW6dBYzFqeckMLr7r6DheB1ovEg1hbhuAQ8bE7wW5zloaAnXuHuZ8gXWAhsYMISeCyciIbsxIh/GBiel//zOiME0Ol0GkmSfAL2Kkyu8zw/mEwm8yqOnVCAJEleB8gB9r1NJaRKYYzZE5EvAKr6MMuym230vwL0er3doiiGqnosIq01NuM0TV+uc7bWjoD+qlxVZyJyEcfxq1q73R6LyAsRubWG42ue54+n0+liXYB6vf652WweAHf+yPon14OyLJtijClEpKWq96vK3Ba+fd9UdSbWWgVI0zQ0j0MR6avqPS+6Ac6zLPtQ5bPkDW6RNxyKyCXQE5GWP49E5NJaO9zkHwxgjDkEBsBCVZ8752LnXAycAAtg4G0qsRtSikgfQFVPsix785tqZK0FOAOeAZWtClaw7Pl8Pn+/qnPOXfhr6CGGA4hUzv2vbTYN+TtAo9F4sqqIougYQFWDqx2cgaqORaQnImfW2ppz7p0nfwosN+g8xBGswO/5qU9kFEVREUVRAYy87DT0FjYGAEjTdKCqR6p6BcyAmapeqepRmqaDTf7BFq1UEsy0Cjs+K4wxwXXbBtbafX+dSdWX+58wrnW73Y9lWd4G7gLrvux/wQx4G8fx4Adr071MaxOQ/gAAAABJRU5ErkJggg==">
          </div>
        </div>
          <div class="Self_Input_Area_Button" align="right">
            <button
                class="Self_Search_Button"
                @click="Router_Trans()"
            >
              检索
            </button>
          </div>
        </div>
      </el-row>
      <el-row type="flex" justify="center">
        <div class="choose-card" v-for="(item,index) in source_options" :key="index">
          <div :class="{'focusType':leftColorDisplay == index}" @click="Type_Change(index);icon_show(index);" class="sourceButton">
            <img class="icon-check"
                 v-show="isShow[index]"
                 src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAALCAYAAACgR9dcAAAABHNCSVQICAgIfAhkiAAAAGdJREFUKJGd0LENgDAMRFEKSjangC1Agh1IwQ5Mc/9o0hAFEePWet+Suy44tntJC3CFIbABlrT+gsBuu4/g5ReUNFeh7UPS2ABP28NjCaT8gCkE8+UBOMvAJ3wLNMNaIASLQAJSC7wB0qrRhSGbalQAAAAASUVORK5CYII=">
            <span>{{item.name}}</span>
          </div>
        </div>
        <div class="choose-card">
          <div :class="{'advance_filter':!filter_choosen,'advance_filter_choosen':filter_choosen}"
               @click="filter_change()"
               @mouseenter="hover_button"
               @mouseleave="hover_button"
               class="sourceButton">
            <img v-show="!filter_choosen" style="height: 13px" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAOCAYAAADwikbvAAAABHNCSVQICAgIfAhkiAAAASNJREFUKJG10LFKQnEUx/Hv8X9HB4ceoMCh8cJ1SAj6N+ni0NAD+Ag9Sz1CbYJDS0IhkVDL1f9eY0FDgugdGtJfQzfQssyh33YO58M5HEuS5B4os34eI0lXZlYG7iR1VgkzqwE7QMe891GWZReS9oD9NE17P8EkSXaBrpldF4vFugHEcVxyzt0CG5Kq/X7/YQncBm6Al+l0Wg0hjAoAIYSRpEZ+1nkcx6V5mNdt4E1SI4QwAih8DuTbDoCyc67tvY8AvPeRc67Nx1MP568qzG9I07QnqQn4yWRyDDAej08AL6n59R8LOL/gFGhJquetGtDK+wv5hvNkK+pf8Z/yP9jMSpVKxa+NZ7PZGfAqqWtmm2vhwWBwORwOtyQdAc+SnpbNvQPTbX9bJ2hRdgAAAABJRU5ErkJggg==">
            <img v-show="filter_choosen"  style="height: 13px" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAOCAYAAADwikbvAAAABHNCSVQICAgIfAhkiAAAALpJREFUKJG1kjEKwkAQRV8kB8gRFFJ4BIsUdl7C3trT6AWsPIEQSOsNUqZRFGwtBItn4QpBkhgFf7V/579hht1IrYAh3+sQAztgAezD+ZNmwATYocZqrt7VrItSs5DL1fh1mailelHTFnAc6qWavBfTtmKt+amteX2s4jVWWKvosxbq3KdWwa+Dn3eCtQbb8ISolbptyg1a+OsH3wn30t/gRJ3+Am+AG1DQ8e8b4SiKcmAELIEzcGzKPQArwafPCdW7/AAAAABJRU5ErkJggg==">
            <span v-show="isHover" style="margin-left: 5px">筛选</span>
          </div>
        </div>
      </el-row>
      <div class="Filter_main_container">
        <div class="row_container" v-show="Question_isShow">
           <el-row type="flex" justify="start" class="Filter_Line">
          <span class="Filter_Label">学科</span>
          <div class="Filter_Item">
            <span
                v-for="(Subject_Item, Subject_Item_Index) in Question_Options.Subject" :key="'Filter_Subject_' + Subject_Item_Index"
                :class="Focus_Filter('Subject', Subject_Item)"
                :style="Filter_Item('Subject', Subject_Item_Index, Subject_Item)"
                @click="Filter_Change('Subject', Subject_Item)">
              {{Subject_Item}}
            </span>
          </div>
        </el-row>
           <el-row type="flex" justify="start" class="Filter_Line">
             <span class="Filter_Label">学段</span>
             <div class="Filter_Item">
            <span
                v-for="(Period_Item, Period_Item_Index) in Question_Options.Period" :key="'Filter_Period_' + Period_Item_Index"
                :class="Focus_Filter('Period', Period_Item)"
                :style="Filter_Item('Period', Period_Item_Index, Period_Item)"
                @click="Filter_Change('Period', Period_Item)"
            >
              {{Period_Item}}
            </span>
             </div>
           </el-row>
           <el-row type="flex" justify="start" class="Filter_Line">
             <span class="Filter_Label">题型</span>
             <div class="Filter_Item">
            <span
                v-for="(Type_Item, Type_Item_Index) in Question_Options.Type" :key="'Filter_Type_' + Type_Item_Index"
                :class="Focus_Filter('Type', Type_Item)"
                :style="Filter_Item('Type', Type_Item_Index, Type_Item)"
                @click="Filter_Change('Type', Type_Item)">
              {{Type_Item}}
            </span>
             </div>
           </el-row>
           <el-row type="flex" justify="start" class="Filter_Line">
             <span class="Filter_Label">难度</span>
             <div class="Filter_Item">
            <span
                v-for="(Difficulty_Item, Difficulty_Item_Index) in Question_Options.Difficulty" :key="'Filter_Difficulty_' + Difficulty_Item_Index"
                :class="Focus_Filter('Difficulty', Difficulty_Item)"
                :style="Filter_Item('Difficulty', Difficulty_Item_Index, Difficulty_Item)"
                @click="Filter_Change('Difficulty', Difficulty_Item)">
              {{Difficulty_Item_Index != Question_Options.Difficulty.length - 1 ? Difficulty_Item : Question_Chosen_Options.Difficulty == '自定义' ? Difficulty_Value[0] + '~' + Difficulty_Value[1] : '自定义'}}
            </span>
             </div>
             <el-slider
                 v-show="Question_Chosen_Options.Difficulty == '自定义'"
                 v-model="Difficulty_Value"
                 range
                 style="background: white; width: 170px; border: 1px solid #ccc; padding: 0px 15px 0px 17px; border-radius: 10px; margin-left: 40px; z-index: 1;"
                 :step="0.01"
                 :max="1"
                 :min="0">
             </el-slider>
           </el-row>
           <el-row type="flex" justify="start" class="Filter_Line">
             <span class="Filter_Label">题库</span>
             <div class="Filter_Item">
                       <span
                           v-for="(Database_Item, Database_Item_Index) in Question_Options.Database" :key="'Filter_Database_' + Database_Item_Index"
                           :class="Focus_Filter('Database', Database_Item.nick)"
                           :style="Filter_Item('Database', Database_Item_Index, Database_Item.nick)"
                           @click="Filter_Change('Database', Database_Item.nick)">
                         {{Database_Item.nick}}
                       </span>
             </div>
           </el-row>
           <el-row type="flex" justify="start" class="Filter_Line" style="display: none">
             <span class="Filter_Label">匹配方式</span>
             <div class="Filter_Item">
                       <span
                           v-for="(Semantic_Item, Semantic_Item_Index) in Question_Options.Semantic" :key="'Filter_Semantic_' + Semantic_Item_Index"
                           :class="Focus_Filter('Semantic', Semantic_Item)"
                           :style="Filter_Item('Semantic', Semantic_Item_Index, Semantic_Item)"
                           @click="Filter_Change('Semantic', Semantic_Item)">
                         {{Semantic_Item}}
                       </span>
             </div>
           </el-row>
        </div>
        <div class="row_container" v-show="Textbooks_isShow">
          <el-row type="flex" justify="start" class="Filter_Line">
            <span class="Filter_Label">适用年级</span>
            <div class="Filter_Item">
            <span
                v-for="(Period_Item, Period_Item_Index) in Textbooks_Options.Resource_Period" :key="'Filter_Period_' + Period_Item_Index"
                :class="Focus_Filter_Textbooks('Resource_Period', Period_Item)"
                :style="Filter_Item()"
                @click="Filter_Change_Textbooks('Resource_Period', Period_Item)"
            >
              {{Period_Item}}
            </span>
            </div>
          </el-row>
          <el-row type="flex" justify="start" class="Filter_Line">
            <span class="Filter_Label">资源类型</span>
            <div class="Filter_Item">
            <span
                v-for="(Subject_Item, Subject_Item_Index) in Textbooks_Options.Resource_Type" :key="'Filter_Subject_' + Subject_Item_Index"
                :class="Focus_Filter_Textbooks('Resource_Type', Subject_Item)"
                :style="Filter_Item()"
                @click="Filter_Change_Textbooks('Resource_Type', Subject_Item)">
              {{Subject_Item}}
            </span>
            </div>
          </el-row>
          <el-row type="flex" justify="start" class="Filter_Line">
            <span class="Filter_Label">学科分类Ⅰ</span>
            <div class="Filter_Item">
            <span
                v-for="(Type_Item, Type_Item_Index) in Textbooks_Options.Resource_Subject_Part1" :key="'Filter_Type_' + Type_Item_Index"
                :class="Focus_Filter_Textbooks('Resource_Subject_Part1', Type_Item)"
                :style="Filter_Item()"
                @click="Filter_Change_Textbooks('Resource_Subject_Part1', Type_Item)">
              {{Type_Item}}
            </span>
            </div>
          </el-row>
          <el-row type="flex" justify="start" class="Filter_Line">
            <span class="Filter_Label">学科分类Ⅱ</span>
            <div class="Filter_Item">
            <span
                v-for="(Difficulty_Item, Difficulty_Item_Index) in Textbooks_Options.Resource_Subject_Part2" :key="'Filter_Difficulty_' + Difficulty_Item_Index"
                :class="Focus_Filter_Textbooks('Resource_Subject_Part2', Difficulty_Item)"
                :style="Filter_Item()"
                @click="Filter_Change_Textbooks('Resource_Subject_Part2', Difficulty_Item)">
              {{Difficulty_Item}}
            </span>
            </div>
          </el-row>
        </div>
        <div class="row_container" v-show="Paper_isShow">
          <el-row type="flex" justify="start" class="Filter_Line">
            <span class="Filter_Label">学科</span>
            <div class="Filter_Item">
            <span
                v-for="(Subject_Item, Subject_Item_Index) in Paper_Options.Subject" :key="'Filter_Subject_' + Subject_Item_Index"
                :class="Focus_Filter_Paper('Subject', Subject_Item)"
                :style="Filter_Item()"
                @click="Filter_Change_Paper('Subject', Subject_Item)">
              {{Subject_Item}}
            </span>
            </div>
          </el-row>
          <el-row type="flex" justify="start" class="Filter_Line">
            <span class="Filter_Label">学段</span>
            <div class="Filter_Item">
            <span
                v-for="(Period_Item, Period_Item_Index) in Paper_Options.Period" :key="'Filter_Period_' + Period_Item_Index"
                :class="Focus_Filter_Paper('Period', Period_Item)"
                :style="Filter_Item()"
                @click="Filter_Change_Paper('Period', Period_Item)"
            >
              {{Period_Item}}
            </span>
            </div>
          </el-row>
          <el-row type="flex" justify="start" class="Filter_Line">
            <span class="Filter_Label">搜索方式</span>
            <div class="Filter_Item">
            <span
                v-for="(Type_Item, Type_Item_Index) in Paper_Options.searchMethod" :key="'Filter_Type_' + Type_Item_Index"
                :class="Focus_Filter_Paper('searchMethod', Type_Item)"
                :style="Filter_Item()"
                @click="Filter_Change_Paper('searchMethod', Type_Item)">
              {{Type_Item}}
            </span>
            </div>
          </el-row>
          <el-row type="flex" justify="start" class="Filter_Line">
            <span class="Filter_Label">题库</span>
            <div class="Filter_Item">
                       <span
                           v-for="(Database_Item, Database_Item_Index) in Question_Options.Database" :key="'Filter_Database_' + Database_Item_Index"
                           :class="Focus_Filter_Paper('Database', Database_Item.nick)"
                           :style="Filter_Item('Database', Database_Item_Index, Database_Item.nick)"
                           @click="Filter_Change_Paper('Database', Database_Item.nick)">
                         {{Database_Item.nick}}
                       </span>
            </div>
          </el-row>
        </div>
        <div class="row_container" v-show="Knowledge_isShow">
          <el-row type="flex" justify="start" class="Filter_Line">
            <span class="Filter_Label">学科</span>
            <div class="Filter_Item">
            <span
                v-for="(Subject_Item, Subject_Item_Index) in Question_Options.Subject" :key="'Filter_Subject_' + Subject_Item_Index"
                :class="Focus_Filter('Subject', Subject_Item)"
                :style="Filter_Item('Subject', Subject_Item_Index, Subject_Item)"
                @click="Filter_Change('Subject', Subject_Item)">
              {{Subject_Item}}
            </span>
            </div>
          </el-row>
          <el-row type="flex" justify="start" class="Filter_Line">
            <span class="Filter_Label">学段</span>
            <div class="Filter_Item">
            <span
                v-for="(Period_Item, Period_Item_Index) in Question_Options.Period" :key="'Filter_Period_' + Period_Item_Index"
                :class="Focus_Filter('Period', Period_Item)"
                :style="Filter_Item('Period', Period_Item_Index, Period_Item)"
                @click="Filter_Change('Period', Period_Item)"
            >
              {{Period_Item}}
            </span>
            </div>
          </el-row>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "Index",
  data() {
    return {
      source_options: [
        {name:"知识点",label:"知识点"},
        {name:"试题",label:"试题"},
        {name:"试卷",label:"试卷"},
        {name:"教辅教材",label:"教辅教材"},
      ],
      // 试题选项
      Question_Options:{
        Period: ["小学", "初中", "高中", "大学", "成人"],
        Subject: ["语文", "数学", "英语", "物理", "化学", "生物", "政治", "历史", "地理"],
        Type: ["单选题", "多选题", "判断题", "填空题", "计算题", "简答题", "其他"],
        Difficulty: ['容易', '较易', '中等', '较难', '困难', "自定义"],
        Database: [{name:'public',nick:'公共题库'}],
        Semantic: ["精确匹配", "语义匹配"]
      },
      // 试题选中的选项，用于显示样式的调整和检索的时候进行内容转换
      Question_Chosen_Options: {
        Period: ["高中"],
        Subject: ["数学"],
        Type: ["单选题"],
        Difficulty: "中等",
        Database: ['公共题库'],
        Semantic: "精确匹配"
      },
      // 教辅教材选项
      Textbooks_Options:{
        Resource_Type: ["教材", "课件", "教案", "学案", "其他"],
        Resource_Period: ["一年级", "二年级", "三年级", "四年级", "五年级", "六年级", "七年级", "八年级", "九年级"],
        Resource_Subject_Part1: ["语文", "数学", "英语", "物理", "化学", "生物", "地理", "历史", "政治", "书法"],
        Resource_Subject_Part2: ["信息技术", "美术", "通用技术", "体育", "品德", "音乐", "俄语", "日语", "科学", "其他"]
      },
      Textbooks_Chosen_Options: {
        Resource_Type: [],
        Resource_Period: [],
        Resource_Subject_Part1: [],
        Resource_Subject_Part2: []
      },
      // 试卷筛选的选项
      Paper_Options:{
        Period: ["小学", "初中", "高中", "大学", "成人"],
        Subject: ["语文", "数学", "英语", "物理", "化学", "生物", "政治", "历史", "地理"],
        Database: [{name:'public',nick:'公共题库'}],
        searchMethod: ['试卷内容', '试卷题目']
      },
      Paper_Chosen_Options: {
        Period: ["高中"],
        Subject: ["数学"],
        Database: ['公共题库'],
        searchMethod: ['试卷内容']
      },
      Knowledge_Options:{
        Subject: ["语文", "数学", "英语", "物理", "化学", "生物", "政治", "历史", "地理"],
        Period: ["小学", "初中", "高中", "大学", "成人"],
      },
      Knowledge_Chosen_Options:{
        Subject:[],
        Period:[],
      },
      leftColorDisplay: 0, // 0为默认选择第一个，-1为不选择
      isShow: [true,false,false,false],
      filter_choosen:false,
      isHover:false,
      Knowledge_isShow:false,
      Question_isShow:false,
      Paper_isShow:false,
      Textbooks_isShow:false,
    }
  },
  methods: {
    Type_Change(index) {
      {
        this.leftColorDisplay = index;
      }
    },
    icon_show(index) {
      this.isShow[index] = true;
      let i = 0;
      for (i = 0; i <= 3; i++) {
        if (i !== index) {
          this.isShow[i] = false
        }
      }
      if(this.filter_choosen ==true && this.isShow[0]==true){
        this.Knowledge_isShow = true;
        this.Question_isShow=false;
        this.Paper_isShow=false;
        this.Textbooks_isShow=false;
      }else if(this.filter_choosen==true && this.isShow[1]==true){
        this.Knowledge_isShow = false;
        this.Question_isShow=true;
        this.Paper_isShow=false;
        this.Textbooks_isShow=false;
      }else if(this.filter_choosen==true && this.isShow[2]==true){
        this.Knowledge_isShow = false;
        this.Question_isShow=false;
        this.Paper_isShow=true;
        this.Textbooks_isShow=false;
      }else if(this.filter_choosen==true && this.isShow[3]==true){
        this.Knowledge_isShow = false;
        this.Question_isShow=false;
        this.Paper_isShow=false;
        this.Textbooks_isShow=true;
      }else{
        this.Knowledge_isShow = false;
        this.Question_isShow=false;
        this.Paper_isShow=false;
        this.Textbooks_isShow=false;
      }
    },
    filter_change() {
      this.filter_choosen = !this.filter_choosen;
      if(this.filter_choosen ==true && this.isShow[0]==true){
        this.Knowledge_isShow = true;
        this.Question_isShow=false;
        this.Paper_isShow=false;
        this.Textbooks_isShow=false;
      }else if(this.filter_choosen==true && this.isShow[1]==true){
        this.Knowledge_isShow = false;
        this.Question_isShow=true;
        this.Paper_isShow=false;
        this.Textbooks_isShow=false;
      }else if(this.filter_choosen==true && this.isShow[2]==true){
        this.Knowledge_isShow = false;
        this.Question_isShow=false;
        this.Paper_isShow=true;
        this.Textbooks_isShow=false;
      }else if(this.filter_choosen==true && this.isShow[3]==true){
        this.Knowledge_isShow = false;
        this.Question_isShow=false;
        this.Paper_isShow=false;
        this.Textbooks_isShow=true;
      }else{
        this.Knowledge_isShow = false;
        this.Question_isShow=false;
        this.Paper_isShow=false;
        this.Textbooks_isShow=false;
      }
      console.log(this.filter_choosen);
      console.log(this.Knowledge_isShow);
      console.log(this.Question_isShow);
    },
    hover_button() {
      this.isHover = !this.isHover;
    },
    Filter_Item() {
      return {
        "width": "65px",
        "height": "30px",
        "line-height": "30px",
        "text-align": "center",
        "display": "inline-block",
        "box-sizing": "border-box",
        "cursor": "pointer",
        "border-top-left-radius": "10px",
        "border-bottom-left-radius": "10px",
        "border-top-right-radius": "10px",
        "border-bottom-right-radius": "10px",
        "margin-right": "10px",
        "margin-top": "8px",
      }
    },
    // 样式筛选器，对比这个属性的这一项是否在Chosen_Options内，来对应不同的显示
    // 主要用于hover样式，来做成按钮的效果
    Focus_Filter(Part, Item) {
      if (['Period', 'Subject', 'Type'].indexOf(Part) != -1) {
        if (this.Question_Chosen_Options[Part].indexOf(Item) == -1) {
          return "Unchosen_Option"
        } else {
          return "Chosen_Option"
        }
      } else if (Part == 'Difficulty' || Part == 'Semantic') {
        if (this.Question_Chosen_Options[Part] != Item) {
          return "Unchosen_Option"
        } else {
          return "Chosen_Option"
        }
      } else if (Part == 'Database') {
        if (this.Question_Chosen_Options.Database.indexOf(Item) == -1) {
          return "Unchosen_Option"
        } else {
          return "Chosen_Option"
        }
      }
    },
    // 内容调整，控制选择项的内容
    Filter_Change(Part, Item) {
      if (['Period', 'Subject', 'Type'].indexOf(Part) != -1) {
        if (this.Question_Chosen_Options[Part].indexOf(Item) == -1) {
          this.Question_Chosen_Options[Part].push(Item)
        } else {
          this.Question_Chosen_Options[Part].splice(this.Question_Chosen_Options[Part].indexOf(Item), 1)
        }
      } else if (Part == 'Difficulty' || Part == 'Semantic') {
        this.Question_Chosen_Options[Part] = Item;
      } else if (Part == 'Database') {
        if (this.Question_Chosen_Options[Part].indexOf(Item) == -1) {
          this.Question_Chosen_Options[Part].push(Item)
        } else {
          this.Question_Chosen_Options[Part].splice(this.Question_Chosen_Options[Part].indexOf(Item), 1)
        }
      }
    },
    Focus_Filter_Textbooks(Part, Item) {
      if (this.Textbooks_Chosen_Options[Part].indexOf(Item) == -1) {
        return "Unchosen_Option"
      } else {
        return "Chosen_Option"
      }
    },
    // 内容调整，控制选择项的内容
    Filter_Change_Textbooks(Part, Item) {
      if (this.Textbooks_Chosen_Options[Part].indexOf(Item) == -1) {
        this.Textbooks_Chosen_Options[Part].push(Item)
      } else {
        this.Textbooks_Chosen_Options[Part].splice(this.Textbooks_Chosen_Options[Part].indexOf(Item), 1)
      }
    },
    Focus_Filter_Paper(Part, Item) {
      if (['Period', 'Subject', 'Type'].indexOf(Part) != -1) {
        if (this.Paper_Chosen_Options[Part].indexOf(Item) == -1) {
          return "Unchosen_Option"
        } else {
          return "Chosen_Option"
        }
      } else if (Part == 'Difficulty' || Part == 'Semantic') {
        if (this.Paper_Chosen_Options[Part] != Item) {
          return "Unchosen_Option"
        } else {
          return "Chosen_Option"
        }
      } else if (Part == 'Database') {
        if (this.Paper_Chosen_Options.Database.indexOf(Item) == -1) {
          return "Unchosen_Option"
        } else {
          return "Chosen_Option"
        }
      } else if (Part === 'searchMethod') {
        if (this.Paper_Chosen_Options.searchMethod.indexOf(Item) === -1) {
          return "Unchosen_Option"
        } else {
          return "Chosen_Option"
        }
      }
    },
    // 内容调整，控制选择项的内容
    Filter_Change_Paper(Part, Item) {
      if (['Period', 'Subject', 'Type'].indexOf(Part) != -1) {
        if (this.Paper_Chosen_Options[Part].indexOf(Item) == -1) {
          this.Paper_Chosen_Options[Part].push(Item)
        } else {
          this.Paper_Chosen_Options[Part].splice(this.Paper_Chosen_Options[Part].indexOf(Item), 1)
        }
      } else if (Part == 'Difficulty' || Part == 'Semantic') {
        this.Paper_Chosen_Options[Part] = Item;
      } else if (Part == 'Database') {
        if (this.Paper_Chosen_Options[Part].indexOf(Item) == -1) {
          this.Paper_Chosen_Options[Part].push(Item)
        } else {
          this.Paper_Chosen_Options[Part].splice(this.Paper_Chosen_Options[Part].indexOf(Item), 1)
        }
      } else if (Part === 'searchMethod') {
        if (this.Paper_Chosen_Options[Part].indexOf(Item) === -1) {
          this.Paper_Chosen_Options[Part].pop()
          this.Paper_Chosen_Options[Part].push(Item)
        } else {
          this.Paper_Chosen_Options[Part].splice(this.Paper_Chosen_Options[Part].indexOf(Item), 1)
        }
      }
    },
    Router_Trans(){
      if(this.isShow[0] == true){
        setTimeout(()=>{
          this.$router.push({
            path:'/ku'
          });
        }, 100)
      }else if(this.isShow[1] == true){
        setTimeout(()=>{
          this.$router.push({
            path:'/exercise'
          });
        }, 100)
      }else if(this.isShow[2] == true){
        setTimeout(()=>{
          this.$router.push({
            path:'/searchPaper'
          });
        }, 100)
      }else if(this.isShow[3] == true){
        setTimeout(()=>{
          this.$router.push({
            path:'/resources'
          });
        }, 100)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.Normal_Home_Page{
    /*height: 100%;*/
    /*width: 100%;*/
}
.main_area {
  min-width: 768px;
  height: 900px;
  padding-top: 100px;
  left: 80px;
  text-shadow: 1px 4px 4px 0px rgba(0, 0, 0, 0.12);
}
.main_area::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  z-index: -1;
}
.Home-Page-Icon {
  width: 84px;
  height: 84px;
  user-select: none;
  cursor: pointer;
}

.Home-Page-Icon[lazy='loaded'] {
  animation-duration: .1s;
}
.Search-Page-Word{
  font-family: Sarasa-Gothic-SC-Semibold;
  font-size: 32px;
  font-weight: 600;
  line-height: 56px;
  letter-spacing: 0.05em;
  color: #444444;
  text-shadow: 1px 4px 4px 0px rgba(0, 0, 0, 0.12);
  z-index: 1
}
.Search_Area{
  display: inline-block;
  background: #F5F6F7;
  vertical-align: top;
  margin-top: 54px;
  box-shadow: 0px 6px 32px 0px rgba(0, 0, 0, 0.12);
  border-radius: 32px;
}
.Self_Input_Area_Left{
  height: 54px;
  width: 50px;
  background: #F5F6F7;
  border-radius: 32px 0px 0px 32px;
  display: inline-block;
  vertical-align: top;
}

.Self_Input_Area_Middle{
  height: 54px;
  width: 540px;
  background: #F5F6F7;
  padding-left: 5px;
  display: inline-block;
  vertical-align: top;
}

.Self_Input_Area_camera{
  height: 54px;
  width: 24px;
  background: #F5F6F7;
  border-radius: 0px 32px 32px 0px;
  display: inline-block;
  vertical-align: top;
}
.Self_Input_Area_Button{
  height: 54px;
  width: 100px;
  background: #F5F6F7;
  border-radius: 0px 32px 32px 0px;
  display: inline-block;
  vertical-align: top;
  margin-left: 13px;
}
.Self_Search_Button{
  width: 100%;
  height: 100%;
  margin: 0px;
  background: linear-gradient(to right, #7BAFEE, #7786EB);
  color: white;
  font-size: 18px;
  border: 3px solid white;
  border-radius: 32px;
}
.Self_Search_Button:active{
  transform: scale(0.95);
  transition: all ease 300ms;
}
.Self_Input{
  border: none;
  outline: none;
  height: 54px;
  background: #F5F6F7;
  font-family: Sarasa-Gothic-SC-Semibold;
  font-size: 18px;
  font-weight: 600;
  line-height: 22px;
  letter-spacing: 0em;
  color: #737373;
  z-index: 1;
  display: inline-block;
}
.search-icon{
  font-size: 20px;
  margin-top:18px;
  margin-right: 23px;
  margin-left: 20px;
  width: 20px;
  height: 20px;
}
.camera-icon{
  font-size: 20px;
  margin-top: 18px;
  //margin-right: 23px;
  width: 24px;
  height: 20px;
}
.camera-icon-container{
  width: 24px;
  margin-right: 23px;
  height: 100%;
}
.choose-card{
  margin-top: 40px;
  height: 42px;
  display: inline-block;
  padding: 0px;
}
/*选中时的对号*/
.icon-check{
  height: 10px;
  margin-right: 5px;
}
.sourceButton{
  margin-left: 16px;
  height: 42px;
  display: inline-block;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 6px 16px;
  border-radius: 1000px;
  background: #F2F3F7;
  cursor: pointer;
  font-family: Sarasa-Gothic-SC-Semibold;
  line-height: 30px;
  font-weight: 600;
  letter-spacing: 0.05em;
  z-index: 0
}
.sourceButton.focusType{
  background: #608DE8;
  color: white;
}

.advance_filter{
  margin-left: 16px;
  height: 42px;
  display: inline-block;
  justify-content: center;
  align-items: center;
  padding: 6px 16px;
  border-radius: 1000px;
  background: #F2F3F7;
  font-family: Sarasa-Gothic-SC-Semibold;
  /*font-size: 18px;*/
  font-weight: 600;
  line-height: 30px;
  letter-spacing: 0.05em;
  color: #34363B;
  z-index: 4
}
.advance_filter_choosen{
  margin-left: 16px;
  height: 42px;
  display: inline-block;
  justify-content: center;
  align-items: center;
  /*padding:  16px;*/
  border-radius: 1000px;
  background: #608DE8;
  font-family: Sarasa-Gothic-SC-Semibold;
  font-weight: 600;
  line-height: 30px;
  letter-spacing: 0.05em;
  color: #FFFFFF;
  z-index: 4
}
.Filter_main_container{
  width:640px;
  display: inline-block;
}
.row_container{
  display:flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;
  //max-width: 640px;

}
.Filter_Line{
  display: flex;
  flex-direction: column;
  margin-top: 18px;
  //margin-left: 10px;
  //justify-content: center;
}

.Filter_Label{
  font-family: SourceHanSansCN-Medium;
  font-weight: 600;
  //line-height: 22px;
  letter-spacing: 0px;
  color: #494949;
  //height: 45px;
  text-align: left;
}
.Filter_Item{
  width: 320px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.Unchosen_Option{
  color: #333;
  border: 1px solid #ccc;
  box-sizing: border-box;
  background: #F2F3F7;
}

.Unchosen_Option:hover{
  color: rgba($color: #409EFF, $alpha: 0.6);
// border: 1px solid rgba($color: #409EFF, $alpha: 0.6);
  box-sizing: border-box;
}

.Chosen_Option{
  color: #FFFFFF;
  border: 1px solid #409EFF;
  box-sizing: border-box;
  background: #608DE8;
}

.Top_Nav{
  position: relative;
  top: -90px;
  width: 10px;
  height: 10px;
  background: transparent;
}

.Temp_Label{
  font-size: 48px;
  filter: drop-shadow(1px 4px 4px rgba(0, 0, 0, 0.12));
}
</style>
