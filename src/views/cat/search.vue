<template id="">
  <div class="container">
    <el-row justify="start" type="flex" style="margin-left:134px">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item >
          首页
        </el-breadcrumb-item>
        <el-breadcrumb-item >
          学情报告查询
        </el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <div class="search-container">
      <el-row style="height:46px;display:flex;justify-content: center;align-items:center;">
        <div class="">
          <img
            src="@/assets/icon.png"
            width="45px"
          />
        </div>
        <div class="title">
            学情报告查询
        </div>
      </el-row>
      <el-row>
        <el-input
          class="search-bar"
          placeholder="请输入学生学号"
          suffix-icon="el-icon-search"
          v-model="input"
          @keydown.enter.native="search"
          >
        </el-input>
      </el-row>
      <el-row class="res" v-show="visible">
        <div class="title">
          查询结果
        </div>
        <div class="content">
          <div class="stuID">
            学号：201900013
          </div>
          <el-table
            class="table"
            :data="tableData"
            border
            style="width: 100%">
            <el-table-column
              prop="id"
              label="考试编号"
              width="180">
            </el-table-column>
            <el-table-column
              prop="time"
              label="考试时间"
              width="180">
            </el-table-column>
            <el-table-column
              prop="address"
              label="考点">
            </el-table-column>
            <el-table-column
              prop="score"
              label="分数">
            </el-table-column>
          </el-table>
        </div>
      </el-row>
    </div>
  </div>
</template>
<script type="text/javascript">
export default{
  data(){
    return {
      input:'',
      visible:false,
      tableData:[{
        id:'202109152001',
        time:'2021/09/15',
        address:'1号教学楼304教室',
        score:117
      },{
        id:'202109162011',
        time:'2021/09/16',
        address:'1号教学楼304教室',
        score:134
      }]
    }
  },
  methods:{
    search(){
      if(this.input=='201900013'){
        this.visible=true
      }
    }
  }
}
</script>
<style scoped lang="scss">
  .container{
    min-height: 1000px;
    // min-height: calc(100vh + 160px);
    // margin:70px 206px 200px 134px;
    margin-top:70px;
  }

  .search-bar{
    height: 44px;
    width: 726px;
    margin-top:43px;
    background: #FFFFFF;
  }
  .search-container{
    margin-top:201px;
    height:400px;
    display:flex;
    flex-direction: column;
    // justify-content: center;
    align-items:center;
    .title{
      height: 45px;
      width: 100%;
      left: 62px;
      font-family: Roboto;
      font-size: 38px;
      font-style: normal;
      font-weight: 400;
      line-height: 45px;
      letter-spacing: 0.05em;
      text-align: center;
    }

  }
  .res{
    display:flex;
    flex-direction: column;
    justify-content: center;
    align-items:center;
    margin:112px auto;
    width: 1152px;
    background: #FFFFFF;
    border: 1px solid #D0D0D0;
    box-sizing: border-box;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.12);
    border-radius: 20px;
    .title{
      margin-top: 87px;
      height: 22px;
      width: 96px;
      font-family: Roboto;
      font-size: 24px;
      font-style: normal;
      font-weight: 700;
      line-height: 22px;
      letter-spacing: 0em;
      text-align: center;
    }
    .content{
      width:80%;
      margin:10px auto;
    }
    .stuID{
      margin-top:37px;
      margin-bottom: 15px;
      font-family: Roboto;
      font-size: 20px;
      font-style: normal;
      font-weight: 400;
      line-height: 22px;
      letter-spacing: 0em;
      text-align: left;
    }
    .table{
      margin-bottom: 112px;
      border-radius: 20px;
      font-family: Roboto;
      font-size: 20px;
      font-style: normal;
      font-weight: 500;
      line-height: 22px;
      letter-spacing: 0em;
      text-align: left;

    }
  }
</style>
