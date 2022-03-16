<template id="">
  <div class="container">
    <el-row justify="start" type="flex" style="margin-left:134px">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item >
          首页
        </el-breadcrumb-item>
        <el-breadcrumb-item >
          学生考试情况
        </el-breadcrumb-item>
        <el-breadcrumb-item >
          学情报告查询
        </el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <div class="search-container">
      <el-row style="height:46px;display:flex;justify-content: center;align-items:center;">
        <div class="title">
            学生考试情况报告
        </div>
      </el-row>
      <el-row class="res" >
        <div class="title">
          学生总分情况
        </div>
        <div class="content">
          <el-table
            class="table"
            :data="tableData"
            width="460"
            border
            >
            <el-table-column
              prop="pro"
              label="项目"
              >
            </el-table-column>
            <el-table-column
              prop="info"
              label="信息"
              >
            </el-table-column>
          </el-table>
        </div>
        <div class="title">
          各题型得分情况
        </div>
        <div class="">
          <img
            src="@/assets/pie1.png"
            width="1000px"
          />
        </div>
        <div class="title">
          各知识点得分情况
        </div>
        <div style="margin-bottom:150px">
          <img
            src="@/assets/pie2.png"
            width="1000px"
          />
        </div>
      </el-row>
      <button class="down-btn" type="button" name="button">下载分析报告</button>
    </div>
  </div>
</template>
<script type="text/javascript">
export default{
  data(){
    return {
      input:'',
      tableData:[{
        pro:'学号',
        info:'201900013',
      },{
        pro:'年级',
        info:'九年级',
      },{
        pro:'考试时间',
        info:'2021/09/16',
      },{
        pro:'总分',
        info:'134/150',
      }
      ]
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
  .down-btn{
    width: 180px;
    height: 44px;
    background: #409EFF;
    border: 4px solid #409EFF;
    // box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.06);
    border-radius: 10px;
    color: #fff;
    font-family: Roboto;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
    letter-spacing: 0em;
  }
  .container{
    min-height: 2800px;
    margin-top:70px;
  }

  .search-bar{
    height: 44px;
    width: 726px;
    margin-top:43px;
    background: #FFFFFF;
  }
  .search-container{
    margin-top:110px;
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
      margin-top:80px;
      margin-bottom: 74px;
      // border-bottom: 1px solid rgba(0, 0, 0, 0.13);
      height: 22px;
      width: 100%;
      font-family: Roboto;
      font-size: 24px;
      font-style: normal;
      font-weight: 700;
      line-height: 22px;
      letter-spacing: 0em;
      text-align: center;
    }
    .content{
      width:460px;
      margin:10px auto;
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
