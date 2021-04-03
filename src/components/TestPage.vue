// 这一页面主要用于测试各类新功能的显示是否符合具体要求，等待完成后再放到正式页面上去

<template>
    <div style="min-height: 600px">
      <el-row>
        <el-popover
          placement="bottom-start"
          width="765"
          v-model="visible">
          <el-row>
            <el-checkbox-group v-model="Subject_Type">     
              <el-checkbox label="1">语文</el-checkbox>
              <el-checkbox label="2">数学</el-checkbox>
              <el-checkbox label="3">英语</el-checkbox>
              <el-checkbox label="4">政治</el-checkbox>
              <el-checkbox label="5">历史</el-checkbox>
              <el-checkbox label="6">地理</el-checkbox>
              <el-checkbox label="7">物理</el-checkbox>
              <el-checkbox label="8">化学</el-checkbox>
              <el-checkbox label="9">生物</el-checkbox>
            </el-checkbox-group>
          </el-row>
          <el-button slot="reference">学科</el-button>
        </el-popover>
        <el-popover
          placement="bottom-start"
          width="340"
          v-model="visible">
          <el-row>
            <el-checkbox-group v-model="Period_Type">     
              <el-checkbox label="小学">小学</el-checkbox>
              <el-checkbox label="初中">初中</el-checkbox>
              <el-checkbox label="高中">高中</el-checkbox>
              <el-checkbox label="大学">大学</el-checkbox>
            </el-checkbox-group>
          </el-row>
          <el-button slot="reference">学段</el-button>
        </el-popover>
      </el-row>
      <el-row type="flex" justify="start" style="margin-left: 40px; border: 1px solid black; width: 50%; border-radius: 10px">
        <el-col :span="20">
          <el-input class="SearchInput" v-model="Inner" type="text">
            
          </el-input>
        </el-col>
        <el-col :span="1">
          <el-button type="text" style="font-size: 20px;"  size="small" v-if="Inner != ''" @click="Inner = ''">
            <i class="el-icon-close"></i>
          </el-button>
        </el-col>
        <el-col :span="1">
          <el-divider direction="vertical"></el-divider>
        </el-col>
        <el-col :span="1">
          <el-button type="text" style="font-size: 18px; color: black"  size="small">
            ∑
          </el-button>
        </el-col>
        <el-col :span="1">
          <el-button type="text" style="font-size: 20px" size="small">
            <i class="el-icon-search"></i>
          </el-button>
        </el-col>
        
      </el-row>
    </div>
</template>
<script>

export default {

    components: { },
    name: "TestPage",
    data(){
        return {
          Subject_Type: ['1','2','3','4','5'],
          Period_Type: ['小学', '初中', '高中', '大学'],
          Inner: ""
        }
    },
    mounted() {
      this.Init()
    },
    methods: {

    }
}
</script>
<style lang="scss" scoped>
.SearchInput{
  font-size: 16px;
  line-height: 28px;
  height: 28px
}
.SearchInput /deep/ .el-input__inner {
  border: 0;
  border-radius: 0px;
  background: transparent;
}

.el-divider--vertical{
  display: block;
  width: 2px;
  background-color: #9B9EA4;
  height: 32px;
  margin-top: 4px;
}
</style>