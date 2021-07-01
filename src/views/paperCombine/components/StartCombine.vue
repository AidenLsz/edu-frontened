<template>
  <div 
    style=" padding-top: 5vh; padding-bottom: 5vh; min-height: 40vh; padding-left: 5vw; padding-right: 5vw; background: #EEF5FE"
    :key="'Fix_' + refresh">
      <el-row>
        <el-col :span="5">
          <!-- 设置区块 -->
          <el-row class="Side_Card">
            <el-col>

              <el-row type="flex" justify="center" style="margin-top: 5px;">
                <label>试卷导出设置</label>
              </el-row>

              <el-row type="flex" justify="start" style="margin-top: 10px">
                <label style="height: 30px; line-height: 30px; margin-left: 15px;">形式：</label>
                <el-radio-group v-model="Export_Setting_Type" style="margin-top: 7px; margin-left: 30px">
                  <el-radio label="simple">简易</el-radio>
                  <el-radio label="standard">标准</el-radio>
                </el-radio-group>
              </el-row>

              <el-row type="flex" justify="start" style="padding-left: 15px">
                <el-button type="text" size="medium" style="color: grey" @click="Setting_Expand = !Setting_Expand">
                  <span style="margin-right: 10px;">高级设置</span>
                  <i v-if="Setting_Expand" class="el-icon-arrow-up"></i>
                  <i v-else class="el-icon-arrow-down"></i>
                </el-button>
              </el-row>

              <el-row v-if="Setting_Expand" style="margin-top: 5px;">
                <el-checkbox-group v-model="Setting_CheckBox_List" style="text-align: left">
                  <el-row v-for="Row_Index in 5" :key="'Setting_Row_' + Row_Index" style="margin-top: 5px">
                    <el-col :span="12" v-for="Col_Index in 2" :key="'Setting_Col_' + Col_Index" style="padding-left: 15px">
                      <el-checkbox v-if="(Row_Index - 1) * 2 + (Col_Index - 1) < 9" :label="Setting_CheckBox_Label[(Row_Index - 1) * 2 + (Col_Index - 1)]"></el-checkbox>
                    </el-col>
                  </el-row>
                </el-checkbox-group>
              </el-row>

            </el-col>
          </el-row>
          <!-- 下载区块 -->
          <el-row style="margin-top: 30px;" class="Side_Card">
            <el-col>

              <el-row type="flex" justify="center" style="margin-bottom: 5px;">
                <el-button type="primary" plain round style="font-size: 14px" @click.native="Unfinish()">
                  <i class="el-icon-download"></i>
                  <span>下载试卷</span>
                </el-button>
              </el-row>

              <el-row>
                <el-col :span="12">
                  <el-row type="flex" justify="center">
                    <el-button type="text" style="font-size: 14px; color: grey" @click.native="Unfinish()">
                      <i class="el-icon-s-data"></i>
                      <span>分析试卷</span>
                    </el-button>
                  </el-row>
                </el-col>
                <el-col :span="12">
                  <el-row type="flex" justify="center">
                    <el-button type="text" style="font-size: 14px; color: grey" @click.native="Unfinish()">
                      <i class="el-icon-document-checked"></i>
                      <span>保存试卷</span>
                    </el-button>
                  </el-row>
                </el-col>
              </el-row>

            </el-col>
          </el-row>
          <el-row style="margin-top: 30px;" class="Side_Card">
            <el-col>

              <el-row type="flex" justify="center" style="margin-top: 5px; margin-bottom: 15px;">
                <label>试卷数量及快速操作</label>
              </el-row>

              <el-row v-for="(Question_List_Item, Index) in Question_List" :key="'Question_List_' + Index" style="margin-bottom: 15px;">
                <el-col>
                  <!-- 顶行：题型及删除操作 -->
                  <el-row style="margin-bottom: 10px;">
                    <el-col :span="10">
                      <el-row type="flex" justify="start" style="height: 30px; line-height: 30px;">
                        <label>
                          {{Get_Chinese_Index(Index)}}、
                          {{Question_List_Item.type}}
                        </label>
                      </el-row>
                    </el-col>
                    <el-col :span="14">
                      <el-row type="flex" justify="end" style="height: 30px; line-height: 30px">
                        <el-button v-if="Index != 0" type="text" @click="List_Item_Move_Up(Index)" style="padding: 0px">前移</el-button>
                        <el-button v-if="Index != Question_List.length - 1" type="text" @click="List_Item_Move_Down(Index)" style="padding: 0px">后移</el-button>
                        <el-button type="text" @click="Delete_Item(Index)" style="padding: 0px">删除</el-button>
                      </el-row>
                    </el-col>
                  </el-row>

                  <!-- 之后的每一道题的操作 -->
                  <el-row v-for="Row_Index in Math.ceil(Question_List_Item.list.length / 6)" :key="'Setting_Row_Index_' + Row_Index">
                    <el-col :span="4" v-for="Col_Index in 6" :key="'Setting_Col_Index_' + Col_Index">
                      <el-popover 
                        trigger="click"
                        width="250"
                        placement="bottom"
                        v-if="((Row_Index - 1) * 6 + Col_Index - 1) < Question_List_Item.list.length"
                        :ref="Get_Pop_Ref(Index, (Row_Index - 1) * 6 + Col_Index - 1)">
                        <el-row type="flex" justify="start" style="margin-bottom: 10px;">
                          <el-col :span="18">
                            <el-row type="flex" justify="start" style="margin-left: 10px;">
                              <span style="height: 30px; line-height: 30px; margin-right: 20px">修改为</span>
                              <el-input 
                                class="Custom_Score_Input" 
                                v-model="Custom_Setting_Score" 
                                :placeholder="Get_Custom_Setting_Score_Placeholder(Index, (Row_Index - 1) * 6 + Col_Index - 1)"></el-input>
                              <span style="height: 30px; line-height: 30px; margin-left: 20px">分</span>
                            </el-row>
                          </el-col>
                          <el-col :span="6">
                            <el-row type="flex" justify="end">
                              <el-button 
                                type="text" 
                                size="medium" 
                                style="height: 30px; line-height: 30px; margin-right: 10px; padding: 0px"
                                @click="Update_Question_Score(Index, (Row_Index - 1) * 6 + Col_Index - 1)">确认</el-button>
                            </el-row>
                          </el-col>
                        </el-row>
                        <!-- 第一行，上移下移 -->
                        <el-row type="flex" justify="center" style="margin-bottom: 10px;">
                          <el-col :span="12">
                            <el-row type="flex" justify="start" style="margin-left: 10px;">
                              <el-button 
                                type="primary" 
                                size="medium" 
                                :disabled="(Row_Index - 1) * 6 + Col_Index - 1 == 0"
                                @click="Question_Move_Up(Index, (Row_Index - 1) * 6 + Col_Index - 1)"
                                >前移</el-button>
                            </el-row>
                          </el-col>
                          <el-col :span="12">
                            <el-row type="flex" justify="end" style="margin-right: 10px;">
                              <el-button 
                                type="primary" 
                                size="medium" 
                                :disabled="(Row_Index - 1) * 6 + Col_Index == Question_List_Item.list.length"
                                @click="Question_Move_Down(Index, (Row_Index - 1) * 6 + Col_Index - 1)">后移</el-button>
                            </el-row>
                          </el-col>
                        </el-row>
                        <!-- 第二行，查看解析及删除 -->
                        <el-row type="flex" justify="center" style="margin-bottom: 10px;">
                          <el-col :span="12">
                            <el-row type="flex" justify="start" style="margin-left: 10px;">
                              <el-button type="primary" size="medium">查看</el-button>
                            </el-row>
                          </el-col>
                          <el-col :span="12">
                            <el-row type="flex" justify="end" style="margin-right: 10px;">
                              <el-button type="danger" size="medium">删除</el-button>
                            </el-row>
                          </el-col>
                        </el-row>
                        <el-row type="flex" justify="center">
                          <el-button type="primary" size="medium"><i class="el-icon-refresh" style="margin-right: 15px;"></i>换一题</el-button>
                        </el-row>
                        <el-row 
                          slot="reference"
                          type="flex" 
                          justify="center" 
                          class="Question_Setting_Button"
                          @click.native="Quick_Operation(Index, (Row_Index - 1) * 6 + Col_Index - 1)"
                          v-if="((Row_Index - 1) * 6 + Col_Index - 1) < Question_List_Item.list.length">
                          {{ (Row_Index - 1) * 6 + Col_Index }}
                        </el-row>
                      </el-popover>
                    </el-col>
                  </el-row>

                </el-col>
              </el-row>

            </el-col>
          </el-row>
        </el-col>
        <el-col :span="18" :offset="1" class="Side_Card">
          <el-row v-for="(Question_List_Item, Index) in Question_List" :key="'Result_Item_' + Index">
            <el-col>
              <el-row type="flex" justify="start">
                <label>
                  {{Get_Chinese_Index(Index)}}、
                  {{Question_List_Item.type}}
                </label>
              </el-row>
              <el-row 
                v-for="(Question, IndexIn) in Question_List_Item.list" 
                :key="'Result_Item_' + Index + '_' + IndexIn"
                type="flex" justify="center">
                {{ Question_List_Item.list[IndexIn] }}
              </el-row>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
  </div>
</template>
<script>
export default {
  name: 'StartCombine',
  props: {
    Question_List: {
      type: Array,
      default: function(){
        return []
      }
    }
  },
  data() {
    return {
      // 试卷导出设置
      Export_Setting_Type: "simple",
      // 设置项的值列表
      Setting_CheckBox_List: [],
      // 设置项的值标签
      Setting_CheckBox_Label: ['标题', '副标题', '考试信息栏', '密封标识', '装订线', '学生输入框', '注意事项', '分卷注释', '大题注释'],
      // 设置列表是否展开
      Setting_Expand: false,
      // 用于给用户临时自定义分数用的值
      Custom_Setting_Score: "",
      // 尝试刷新页面
      refresh: false
    }
  },
  watch:{
    
  },
  mounted() {
    this.Init_Setting_CheckBox();
  },
  methods: {
    // 返回一个用于给自定义分数栏占位的值
    Get_Custom_Setting_Score_Placeholder(IndexOut, IndexIn){
      return this.Question_List[IndexOut].list[IndexIn].score + ""
    },
    // 快捷操作栏
    Quick_Operation(IndexOut, IndexIn){
      this.Custom_Setting_Score = this.Question_List[IndexOut].list[IndexIn].score;
    },
    // 更新分数
    Update_Question_Score(IndexOut, IndexIn){
      if(parseFloat(this.Custom_Setting_Score) + "" != this.Custom_Setting_Score){
        this.$message.error("请正确输入数字");
        return
      }
      this.Question_List[IndexOut].list[IndexIn].score = parseFloat(this.Custom_Setting_Score);
      this.$message.success("已修改")
    },
    // 初始化设置栏
    Init_Setting_CheckBox(){
      if(this.Export_Setting_Type == 'simple'){
        this.Setting_CheckBox_List = ['标题', '考试信息栏', '学生输入框', '大题注释']
      }else if(this.Export_Setting_Type == 'standard'){
        this.Setting_CheckBox_List = ['标题', '副标题', '考试信息栏', '密封标识', '装订线', '注意事项', '分卷注释', '大题注释']
      }
    },
    // 简单返回一下大题编号
    Get_Chinese_Index(Index){
      let Result = ['一', '二', '三', '四', '五', '六', '七', '八', '九']
      return Result[Index]
    },
    // 删除这群大题
    Delete_Item(Index){
      this.Question_List.splice(Index, 1);
      this.$emit('Update_Question_List', JSON.stringify(this.Question_List));
    },
    // 题目前后移
    Question_Move_Up(IndexOut, IndexIn){
      let Item = this.Question_List[IndexOut].list[IndexIn];
      this.Question_List[IndexOut].list.splice(IndexIn, 1)
      this.Question_List[IndexOut].list.splice(IndexIn - 1, 0, Item)
      let name = 'Pop_' + IndexOut + '_' + IndexIn
      this.$refs[name][0].doClose()
      this.$message.success(this.Question_List[IndexOut].type + "第" + ( IndexIn + 1 ) + "题已前移至第" + IndexIn + "题的位置");
      this.$emit('Update_Question_List', JSON.stringify(this.Question_List));
    },
    Question_Move_Down(IndexOut, IndexIn){
      let Item = this.Question_List[IndexOut].list[IndexIn];
      this.Question_List[IndexOut].list.splice(IndexIn, 1)
      this.Question_List[IndexOut].list.splice(IndexIn + 1, 0, Item)
      let name = 'Pop_' + IndexOut + '_' + IndexIn
      this.$refs[name][0].doClose();
      this.$message.success(this.Question_List[IndexOut].type + "第" + ( IndexIn + 1 ) + "题已后移至第" + ( IndexIn + 2 ) + "题的位置")
      this.$emit('Update_Question_List', JSON.stringify(this.Question_List));
    },
    // 给这些内容附加Ref用来定位popover
    Get_Pop_Ref(IndexOut, IndexIn){
      return 'Pop_' + IndexOut + '_' + IndexIn 
    },
    // 题包元素前后移动
    List_Item_Move_Up(Index){
      let Item = this.Question_List[Index];
      this.Question_List.splice(Index, 1);
      this.Question_List.splice(Index - 1, 0, Item);
      this.$emit('Update_Question_List', JSON.stringify(this.Question_List));
      this.$message.success("第" + this.Get_Chinese_Index(Index) + "大题已向前移动。")
    },
    // 题包元素前后移动
    List_Item_Move_Down(Index){
      let Item = this.Question_List[Index];
      this.Question_List.splice(Index, 1);
      this.Question_List.splice(Index + 1, 0, Item);
      this.$emit('Update_Question_List', JSON.stringify(this.Question_List));
      this.$message.success("第" + this.Get_Chinese_Index(Index) + "大题已向后移动。")
    },
    Unfinish(){
      this.$message.error("这部分还没做完或者说还不在当前计划范围内")
    }
  },
}
</script>
<style>
.Side_Card{
  border-radius: 20px;
  background: white; 
  box-shadow: 2px 4px 8px 0 rgba(0, 0, 0, 0.2);
  padding: 15px;
}
.Question_Setting_Button{
  cursor: pointer;
  margin-left: 10%;
  margin-right: 10%;
  border: 1px solid #409EFF;
  color: #409EFF;
  background: transparent;
  border-radius: 5px;
}
.Question_Setting_Button:hover{
  border: 1px solid #92D050;
  color: #92D050;
}
</style>
<style lang="scss" scoped>
.Custom_Score_Input{
  font-size: 16px;
}
.Custom_Score_Input /deep/ .el-input__inner {
  height: 30px;
  line-height: 30px;
  width: 45px;
  padding: 0px;
  text-align: center;
  border-radius: 0px;   
  background: transparent;
}
.Custom_Score_Input.el-input {
  width: 45px;
}
</style>