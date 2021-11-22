// 用于新页面的单题显示组件

<template>
  <div class="Whole_Card">
    <el-row type="flex" justify="start" style="font-size: 16px; padding-left: 30px; background: white; padding-top: 15px; border-radius: 10px">
        <div align="left" class="Item_Info">
            <span style="text-align: left">{{KnowledgePoint.label}}</span>
        </div>
        <div align="center" class="Subject_Info">
            {{KnowledgePoint.subject}}
        </div>
        <div align="center" class="Period_Info">
            {{KnowledgePoint.period}}
        </div>
        <div align="center" class="Layer_Info">
            {{KnowledgePoint.layer}}
        </div>
    </el-row>
    <el-row class="Detail_Line">
        <div
            class="Detail_Line_Left" 
            align="left"
            style="line-height: 44px; padding: 0px 16px 0px 16px; border-radius: 10px; background: #F8F8F8">
            <span class="Extra_Info_Item">
                {{KnowledgePoint.shortIntro}}
            </span>
        </div>
        <div
            class="Detail_Line_Right">
            <el-button 
                size="medium"
                type="primary"
                class="Search_Button"
                style="height: 44px; border-radius: 10px; width: 132px" @click="Search_Knowledge_Point()">
                查看详情
            </el-button>
        </div>
    </el-row>
  </div>
</template>

<script>

export default {
  name: "KnowledgePointCard",
  components:{

  },
  props:{
    KnowledgePoint:{
        type: Object,
        default: function(){
            return {
                "label": "三角函数",
                "subject": "数学",
                "period": "高中",
                "layer": "一级知识点",
                "shortIntro": "123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123",
            }
        }
    },
  },
  data() {
    return {

    };
  },
  methods: {
      Search_Knowledge_Point(){
          this.$emit("Download_File", JSON.stringify(this.KnowledgePoint))
      }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.Detail_Line{
    padding: 16px 16px 16px 16px;
}
.Detail_Line_Left{
    display: inline-block;
    width: calc(100% - 148px);
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    vertical-align: bottom;
    margin-right: 16px;
}
.Detail_Line_Right{
    width: 132px;
    height: 44px;
    vertical-align: bottom;
    display: inline-block;
}

.Search_Button{
    width: 124px;
    height: 48px;

    background: linear-gradient(90deg, #78ABE6 0%, #5A74E0 100%);
    /* capsule */
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
    border-radius: 10px;
    transition-duration: 300ms;
}

.Search_Button:hover{
    background: linear-gradient(90deg, #4B87CC 0%, #5A74E0 100%, #3250C7 100%);
}

.Item_Info{
    font-family: PingFang SC;
    font-style: normal;
    font-weight: 500;
    font-size: 24px;
    line-height: 34px;
    /* identical to box height */

    display: flex;
    align-items: center;
    letter-spacing: 0.05em;

    color: #000000;
}
.Whole_Card{
    background: #FFFFFF;
    opacity: 0.95;
    /* capsule */

    border: 1px solid #D4D4D4;
    box-sizing: border-box;
    box-shadow: 0px 6px 24px rgba(0, 0, 0, 0.12);
    border-radius: 10px;
}

.Subject_Info{
    width: 52px;
    height: 34px;
    line-height: 34px;
    background: #F0F7FF;
    border: 1px solid #8FBCEF;
    box-sizing: border-box;
    border-radius: 6px;
    font-size: 16px;
    color: #397CC9;
    margin-left: 16px;
}

.Period_Info{
    width: 52px;
    height: 34px;
    line-height: 34px;
    background: #F2F0FF;
    border: 1px solid #9C8FEF;
    box-sizing: border-box;
    border-radius: 6px;
    font-size: 16px;
    color: #4C39C9;
    margin-left: 12px;
}

.Layer_Info{
    width: 100px;
    height: 34px;
    line-height: 34px;
    background: #FFF0F3;
    border: 1px solid #EF8FA6;
    box-sizing: border-box;
    color: #C9395A;
    border-radius: 6px;
    margin-left: 12px;
}
</style>
