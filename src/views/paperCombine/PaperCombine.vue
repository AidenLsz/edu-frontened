<template>
  <div style=" margin-top: 5vh;">
    <!-- 地址框 -->
    <el-row justify="start" type="flex" style="margin-bottom: 3vh; margin-left: 5vw; margin-right: 5vw">
      <el-col>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>
            组卷系统
          </el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row style="min-height: 40px; background: #409EFF;">
        <el-col :span="3" :offset="1" class="Bar_Menu_Unfocus">
            <el-popover 
                placement="bottom-start"
                trigger="click"
                width="400">
                <el-row 
                    v-for="(Item, Index) in Select_List" 
                    :key="'Select_List_' + Index"
                    style="margin-bottom: 12px">
                    <el-col :span="24">
                        <el-row type="flex" justify="start">
                            <label style="font-size: 30px; height: 30px; line-height: 30px; margin-right: 12px">·</label>
                            <label style="font-size: 16px; height: 30px; line-height: 30px">{{Item.period}}</label>
                        </el-row>
                        <el-row 
                            v-for="Subject_Row_Index in Math.ceil(Item.subjects.length / 6)" 
                            :key="'Select_List_' + Index + '_' + Subject_Row_Index"
                            style="margin-bottom: 3px;">
                            <el-col :span="4" v-for="Col_Index in [0, 1, 2, 3, 4, 5]" :key="'Select_List_' + Index + '_' + Subject_Row_Index + '_' + Col_Index">
                                <el-row 
                                    type="flex" 
                                    justify="center" 
                                    :class="Selected_Catch(Item.period, Item.subjects[(Subject_Row_Index - 1) * 6 + Col_Index])"
                                    @click.native="Change_Select(Item.period, Item.subjects[(Subject_Row_Index - 1) * 6 + Col_Index])">
                                    {{Item.subjects[(Subject_Row_Index - 1) * 6 + Col_Index]}}
                                </el-row>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <el-row type="flex" justify="center" slot="reference">
                    <i class="el-icon-menu" style="height: 40px; line-height: 40px; font-size: 20px; margin-right: 15px"></i>
                    {{Selected_Period + Selected_Subject}}
                </el-row>
            </el-popover>
        </el-col>
        <el-col :span="2" :class="Menu_Now(0)" @click.native="Using_Menu_Index = 0">
            <el-row type="flex" justify="center">
                关键词挑题
            </el-row>
        </el-col>
        <el-col :span="2" :class="Menu_Now(1)" @click.native="Using_Menu_Index = 1">
            <el-row type="flex" justify="center">
                知识点挑题
            </el-row>
        </el-col>
        <el-col :span="2" :class="Menu_Now(2)" @click.native="Using_Menu_Index = 2">
            <el-row type="flex" justify="center">
                录入题目
            </el-row>
        </el-col>
        <el-col :span="2" :class="Menu_Now(3)" @click.native="Using_Menu_Index = 3">
            <el-row type="flex" justify="center">
                细目表挑题
            </el-row>
        </el-col>
        <el-col :span="3" :offset="7" class="Question_Shopping_Card">
            <el-row type="flex" justify="center">
                <i class="el-icon-shopping-cart-2" style="height: 32px; line-height: 32px; font-size: 20px; margin-right: 10px"></i>
                <div 
                    style=" border-radius: 50%; 
                            background: white; 
                            height: 24px; width: 24px; margin-top: 4px;
                            line-height: 24px; margin-right: 20px; 
                            color: #409EFF; font-size: 16px">
                    <label>{{Question_List.length}}</label>
                </div>
                <p style="margin-top: -1px">试题篮</p>
            </el-row>
        </el-col>
    </el-row>
    <el-row v-if="Using_Menu_Index == 0">
        <Keyword @Add_To_Cart="Add_To_Question_Cart" :Period.sync="Selected_Period" :Subject.sync="Selected_Subject"></Keyword>
    </el-row>
    <el-row v-if="Using_Menu_Index == 1">
        <KnowledgePoint></KnowledgePoint>
    </el-row>
    <el-row v-if="Using_Menu_Index == 2">
        <InputQuestion></InputQuestion>
    </el-row>
    <el-row v-if="Using_Menu_Index == 3">
        <DetailTable></DetailTable>
    </el-row>
  </div>
</template>
<script>

import Keyword from '@/views/paperCombine/components/Keyword'
import KnowledgePoint from '@/views/paperCombine/components/KnowledgePoint'
import InputQuestion from '@/views/paperCombine/components/InputQuestion'
import DetailTable from '@/views/paperCombine/components/DetailTable'

export default {
  name: 'paperCombine',
  props: {

  },
  components: {
        Keyword, KnowledgePoint,
        InputQuestion, DetailTable
  },
  data() {
    return {
        // 存放当前正在使用第几个菜单项
        Using_Menu_Index: 0,
        // 题目列表信息
        Question_List: [],
        // 用于设定学科 / 学段选择位置的数据字段
        Select_List: [{
            period: "高中",
            subjects: ['数学', "语文", "英语", "物理", "化学", "生物", "政治", "历史", "地理"]
        },{
            period: "初中",
            subjects: ['数学', "语文", "英语", "物理", "化学", "生物", "政治", "历史", "地理"]
        },{
            period: "小学",
            subjects: ['数学', "语文", "英语"]
        }],
        // 被选中的学段和科目
        Selected_Period: "高中",
        Selected_Subject: "数学"
    }
  },
  watch:{

  },
  mounted() {

  },
  methods: {
    Menu_Now(index){
        if(index == this.Using_Menu_Index){
            return "Bar_Menu_Focus"
        }else{
            return "Bar_Menu_Unfocus"
        }
    },
    Add_To_Question_Cart(val){
        let Question = JSON.parse(val);
        this.Question_List.push(Question);
        console.log(this.Question_List);
    },
    Selected_Catch(Period, Subject){
        if(Period == this.Selected_Period && Subject == this.Selected_Subject){
            return "Selected_Item"
        }else{
            return "Unselected_Item"
        }
    },
    Change_Select(Period, Subject){
        this.Selected_Period = Period;
        this.Selected_Subject = Subject;
    }
  },
}
</script>
<style >
.Bar_Menu_Unfocus{
    height: 40px;
    line-height: 40px;
    cursor: pointer;
    font-size: 16px;
    color: white;
}
.Bar_Menu_Focus{
    height: 40px;
    line-height: 40px;
    cursor: pointer;
    font-size: 16px;
    color: white;
    background: #71B0F2;
}
.Question_Shopping_Card{
    margin-top: 2px;
    margin-bottom: 2px;
    height: 36px;
    line-height: 36px;
    cursor: pointer;
    font-size: 16px;
    color: white;
    border: 2px solid white; 
    border-radius: 8px; 
    box-sizing: border-box
}
.Selected_Item{
    background: #409EFF;
    color: white;
    cursor: pointer;
    border-radius: 30px;
    height: 30px;
    line-height: 30px;
    margin-left: 5px;
    margin-right: 5px;
}
.Unselected_Item
{
    background: transparent;
    color: black;
    cursor: pointer;
    height: 30px;
    line-height: 30px;
}
</style>