<template>
  <div style="margin-top: 5vh; padding-left: 5vw; padding-right: 5vw">
    <el-row justify="start" type="flex">
      <el-col :span="6">
        <el-row type="flex" justify="start" style="height: 40px; line-height: 40px; padding-top: 13px">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>资源录入</el-breadcrumb-item>
                <el-breadcrumb-item>试卷资源</el-breadcrumb-item>
            </el-breadcrumb>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="center" @click.native="toSingle()" class="toSingle">
            <span>切换至单题页面</span>
        </el-row>
      </el-col>
    </el-row>
    <el-row type="flex" justify="start" style="margin-top: 6vh; ">
      <el-col :span="12">
        <!-- 学科选择 -->
        <el-row type="flex" justify="start" style="margin-bottom: -1vh">
          <el-col :span="3">
              <el-row type="flex" justify="start" style="height: 40px; line-height: 40px; font-size: 18px">
                  <label>科目</label>
              </el-row>
          </el-col>
          <el-col :span="20" :offset="1">
              <el-row type="flex" justify="start">
                  <el-select v-model="Subject" placeholder="请选择科目">
                  <el-option
                      v-for="item in Subject_List"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                  </el-select>
              </el-row>
          </el-col>
        </el-row>
        <el-divider></el-divider>
        <!-- 学段选择 -->
        <el-row type="flex" justify="start" style="margin-top: -1vh; margin-bottom: -1vh">
          <el-col :span="3">
              <el-row type="flex" justify="start" style="height: 40px; line-height: 40px; font-size: 18px">
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
                      :value="item.value">
                  </el-option>
                  </el-select>
              </el-row>
          </el-col>
        </el-row>
        <el-divider></el-divider>
        <!-- 学段选择 -->
        <el-row type="flex" justify="start" style="margin-top: -1vh; margin-bottom: -1vh">
          <el-col :span="3">
              <el-row type="flex" justify="start" style="height: 40px; line-height: 40px; font-size: 18px">
                  <label>试卷标题</label>
              </el-row>
          </el-col>
          <el-col :span="20" :offset="1">
              <el-row type="flex" justify="start" style="width: 100%">
                  <el-input v-model="Title" placeholder="请输入试卷的标题信息"></el-input>
              </el-row>
          </el-col>
        </el-row>
        <el-row type="flex" justify="start" style="margin-top: 5vh;">
          <span style="text-align: left">整体上是为了提高单题录入的服用效率（按设计稿做一个整卷的太麻烦了）
            ，下面这部分之后会把单题那边包括题型和录入在内的两部分放过来，然后在右侧放了一个简单的试卷内容预览框。
            单题录入那个按钮点了以后，先是会和单题一样进行一下简单的格式校验，然后放到试卷题包内，并且按题型自动归类。
            现在就是简单看一下每个题型里面都有一些题目之后会长什么样子，具体样式可以再改。
            题目编号上可以和组卷一样加入上移，下移，删除之类的弹出框，点击后给一个简单的确认提示，然后在下方单题录入部分进行编辑。
            现在的主要问题是现在这块打字的地方光放按钮的话有点太空了，放别的什么又没想好，有点尬住了……
          </span>
        </el-row>
        <!-- 学段选择 -->
        <!-- <el-row type="flex" justify="start" style="margin-top: 7vh; margin-bottom: -1vh">
          <el-col :span="11">
              <el-row type="flex" justify="start" style="height: 40px; line-height: 40px;">
                <el-col :span="12">
                  <el-button type="primary" style="width: 100px;">入库按钮</el-button>
                </el-col>
                <el-col :span="12">
                  <el-button type="primary" style="width: 100px;">分析报告</el-button>
                </el-col>
              </el-row>
              <el-row type="flex" justify="start" style="height: 40px; line-height: 40px; margin-top: 60px">
                <el-col :span="12">
                  <el-button type="primary" style="width: 100px;">格式导出</el-button>
                </el-col>
                <el-col :span="12">
                  <el-button type="primary" style="width: 100px;">格式导入</el-button>
                </el-col>
              </el-row>
          </el-col>
          <el-col :span="12" :offset="1" style="height: 166px; border: 1px solid black">

          </el-col>
        </el-row> -->
      </el-col>
      <el-col :span="11" :offset="1">
        <el-row type="flex" justify="center" class="PreviewPaperArea">
          <el-col>
            <el-row type="flex" justify="start" style="margin-bottom: 10px">
              <label>试卷标题行</label>
            </el-row>
            <el-row type="flex" justify="start">
              <el-col :span="6">
                <el-row type="flex" justify="start">
                  <label>一、单选题</label>
                </el-row>
              </el-col>
              <el-col :span="12">
                <el-row type="flex" justify="start">
                  <el-col :span="4">
                    <el-row type="flex" justify="center">
                      <i class="el-icon-top" style="color: #409EFF; font-size: 18px"></i>
                    </el-row>
                  </el-col>
                  <el-col :span="4">
                    <el-row type="flex" justify="center">
                      <i class="el-icon-bottom" style="color: #409EFF; font-size: 18px"></i>
                    </el-row>
                  </el-col>
                  <el-col :span="4">
                    <el-row type="flex" justify="center">
                      <i class="el-icon-close" style="color: #409EFF; font-size: 18px"></i>
                    </el-row>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row type="flex" justify="start" style="margin-bottom: 5px">
              <el-col 
                v-for="Single_Index in 12" 
                :key="'Single_' + Single_Index"
                :span="1"
                >
                <el-row type="flex" justify="center" class="Ques_Button">
                  {{Single_Index}}
                </el-row>
              </el-col>
            </el-row>
            <el-row type="flex" justify="start">
              <label>二、多选题</label>
            </el-row>
            <el-row type="flex" justify="start" style="margin-bottom: 5px">
              <el-col 
                v-for="Single_Index in 12" 
                :key="'Single_' + Single_Index"
                :span="1"
                >
                <el-row type="flex" justify="center" class="Ques_Button">
                  {{Single_Index}}
                </el-row>
              </el-col>
            </el-row>
            <el-row type="flex" justify="start">
              <label>三、判断题</label>
            </el-row>
            <el-row type="flex" justify="start" style="margin-bottom: 5px">
              <el-col 
                v-for="Single_Index in 12" 
                :key="'Single_' + Single_Index"
                :span="1"
                >
                <el-row type="flex" justify="center" class="Ques_Button">
                  {{Single_Index}}
                </el-row>
              </el-col>
            </el-row>
            <el-row type="flex" justify="start">
              <label>四、填空题</label>
            </el-row>
            <el-row type="flex" justify="start" style="margin-bottom: 5px">
              <el-col 
                v-for="Single_Index in 12" 
                :key="'Single_' + Single_Index"
                :span="1"
                >
                <el-row type="flex" justify="center" class="Ques_Button">
                  {{Single_Index}}
                </el-row>
              </el-col>
            </el-row>
            <el-row type="flex" justify="start">
              <label>五、简答题</label>
            </el-row>
            <el-row type="flex" justify="start" style="margin-bottom: 5px">
              <el-col 
                v-for="Single_Index in 12" 
                :key="'Single_' + Single_Index"
                :span="1"
                >
                <el-row type="flex" justify="center" class="Ques_Button">
                  {{Single_Index}}
                </el-row>
              </el-col>
            </el-row>
            <el-row type="flex" justify="start">
              <label>六、计算题</label>
            </el-row>
            <el-row type="flex" justify="start" style="margin-bottom: 5px">
              <el-col 
                v-for="Single_Index in 12" 
                :key="'Single_' + Single_Index"
                :span="1"
                >
                <el-row type="flex" justify="center" class="Ques_Button">
                  {{Single_Index}}
                </el-row>
              </el-col>
            </el-row>
            <el-row type="flex" justify="start">
              <label>七、综合题</label>
            </el-row>
            <el-row type="flex" justify="start" style="margin-bottom: 5px">
              <el-col 
                v-for="Single_Index in 12" 
                :key="'Single_' + Single_Index"
                :span="1"
                >
                <el-row type="flex" justify="center" class="Ques_Button">
                  {{Single_Index}}
                </el-row>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-divider></el-divider>
  </div>
</template>

<script>
export default {
  name: "RemakingInputSingle",
  data() {
    return {
      // 试卷标题
      Title: "",
      // 用于显示最终录入科目的变量
      Subject: "数学",
      // 用于显示最终录入学段的变量
      Period: "高中",
      // 用于确定当前显示的题目类型的变量
      Type: "单选题",
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
        { value: "其他", label: "其他" }
      ],
      // 待选学段
      Period_List: [
        { value: "小学", label: "小学" },
        { value: "初中", label: "初中" },
        { value: "高中", label: "高中" },
        { value: "大学", label: "大学" },
        { value: "成人", label: "成人" },
        { value: "其他", label: "其他" }
      ],
      // 待选试题类型
      Type_List: [
        { value: "单选题", label: "单选题" },
        { value: "多选题", label: "多选题" },
        { value: "判断题", label: "判断题" },
        { value: "填空题", label: "填空题" },
        { value: "简答题", label: "简答题" },
        { value: "计算题", label: "计算题" },
        { value: "综合题", label: "综合题" }
      ],
    };
  },
  methods:{
      toSingle(){
        this.$router.push({path: "/remakeInputSingle"})
      }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.toSingle{
    height: 40px; 
    line-height: 40px;
    width: 10vw; 
    background: #FFE37F;
    font-weight: bold;
    border-radius: 15px;
    cursor: pointer;
}
.toSingle:hover{ 
    background: #FFF0A0;
    color: #888;
}

.Ques_Button{
  width: 100%;
  height: 100%;
  cursor: pointer;
  box-sizing: border-box;
}
.Ques_Button:hover{
  border: 1px solid whitesmoke;
  border-radius: 5px;
  box-shadow: 1px 1px 2px 0 rgba(0, 0, 0, 0.5);
}
.PreviewPaperArea{
  width: 100%; 
  border: 2px solid #409EFF;
  border-radius: 10px; 
  min-height: 400px; 
  padding: 20px;
  box-shadow: 2px 3px 4px 0 rgba(64, 158, 255, 0.7);
}
</style>
