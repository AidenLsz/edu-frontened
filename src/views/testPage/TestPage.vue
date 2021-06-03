<template>
  <div style="margin-left: 10vw; margin-right: 10vw; min-height: 700px">
    <el-row type="flex" justify="center" style="margin-top: 40px">
      鼠标移入移除测试
    </el-row>
    <el-row type="flex" justify="center" style="margin: 20px 0px">
      <el-button v-if="!Self_Cut" @click="Self_Cut = true" type="text" style="color: blue">开启自定义切分</el-button>
      <el-button v-if="Self_Cut" @click="Self_Cut = false" type="text" style="color: pink">关闭自定义切分</el-button>
    </el-row>
    <el-row v-for="(I, Index) in [0, 1, 2]" :key="Index">
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
    <el-divider></el-divider>
    <el-row style="margin-bottom: 30px; margin-top: 30px">
      题目题干合并测试
    </el-row>
    <el-row v-for="(Item, Item_Index) in TestList" :key="'TL' + Item_Index">
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
export default {
  name: 'ScreenShot',
  props: {

  },
  data() {
    return {
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
  watch:{

  },
  mounted() {

  },
  methods: {
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