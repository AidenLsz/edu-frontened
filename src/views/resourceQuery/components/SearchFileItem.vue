// 用于新页面的单题显示组件

<template>
  <div style="border-radius: 10px; background: white;">
    <el-row type="flex" justify="start" style="font-size: 16px; padding-left: 30px; background: white; padding-top: 15px; border-radius: 10px">
        <div align="left" style="width: 80px; margin-right: 10px">
            <label>文件名：</label>
        </div>
        <div align="left" class="Item_Info">
            <span style="text-align: left">{{File.file_name}}</span>
        </div>
    </el-row>
    <el-row type="flex" justify="start" style="font-size: 14px; margin-top: 10px; text-align: left; padding-left: 30px; background: white; padding-bottom: 8px">
        <div align="left" style="width: 80px; margin-right: 10px">
            <label>相关信息：</label>
        </div>
        <div align="left" class="Item_Info" style="margin-right: 30px">
            <span style="text-align: left">{{File.stem}}</span>
        </div>
    </el-row>
    <el-row class="Detail_Line">
        <div
            class="Detail_Line_Left" 
            align="left"
            style="line-height: 44px; padding: 0px 16px 0px 16px; border-radius: 10px; background: #F8F8F8">
            <span class="Extra_Info_Item">
                学科：{{File.subject}}
            </span>
            <span class="Extra_Info_Item">
                文件类型：{{File.pattern.toUpperCase()}}
            </span>
        </div>
        <div
            class="Detail_Line_Right">
            <el-button 
                size="medium"
                type="primary"
                class="Search_Button"
                style="height: 44px; border-radius: 10px; width: 132px" @click="Download_File(File)">
                下载此文件
            </el-button>
        </div>
    </el-row>
  </div>
</template>

<script>

export default {
  name: "SearchFileItem",
  components:{

  },
  props:{
    File:{
        type: Object,
        default: function(){
            return {
                "analysis": "", 
                "answer": "", 
                "database": "", 
                "id": "", 
                "options": [], 
                "period": "", 
                "stem": "", 
                "subject": "", 
                "type": "",
                "pattern": "docx",
                "file_name": null,
                "pastpaper": "",
                "area": ""
            }
        }
    },
  },
  data() {
    return {

    };
  },
  methods: {
      Download_File(File){
          this.$emit("Download_File", JSON.stringify(File))
      }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.Detail_Line{
    padding: 6px 16px 16px 16px;
}
.Detail_Line_Left{
    display: inline-block;
    width: calc(100% - 148px);
    margin-right: 16px;
}
.Detail_Line_Right{
    width: 132px;
    height: 44px;
    display: inline-block;
}
.Extra_Info_Item{
    margin-left: 15px;
}
.Detail_Line_Expand{
    display: inline-block;
    width: 60px;
}
.Detail_Line_Infos{
    position: relative;
    display: inline-block;
    right: 0px;
    width: calc(100% - 60px);
}

.Search_Button{
    background: #539DD9;
    transition-duration: 300ms;
}

.Search_Button:hover{
    background: #4484B8;
}

.Item_Info{
    word-break:break-all; 
    overflow:auto;
    width: calc(100% - 80px);
}
</style>
