<template>
    <div style="margin-left: 10vw; margin-right: 10vw">
        <el-row
            class="Padding_Width"
            type="flex"
            ref="BreadCrumb_Line"
            justify="start">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>
                    首页
                </el-breadcrumb-item>
                <el-breadcrumb-item>
                    多源查重
                </el-breadcrumb-item>
            </el-breadcrumb>
        </el-row>
        <el-row type="flex" justify="center" style="margin-top: 30px;">
            <el-input v-model="MultiSearchContent" placeholder="在此输入检索关键字" style="width: 90%; margin-right: 40px; height: 40px"></el-input>
            <div @click="MultiSourceSearch()" class="Search_Button" align="center">
                <i class="el-icon-search" style="margin-right: 16px"></i>检索
            </div>
        </el-row>
        <el-row type="flex" justify="start" style="margin-top: 20px; width: 100%; ">
            <label style="width: 80px; text-align: left; font-size: 16px; height: 40px; line-height: 40px">学科：</label>
            <span
                v-for="(Subject_Item, Subject_Item_Index) in Subject_All_List" :key="'MultiFilter_Subject_' + Subject_Item_Index"
                :class="Focus_Filter(Subject_Item)"
                :style="Filter_Item(Subject_Item_Index)"
                @click="Filter_Change(Subject_Item)">
                {{Subject_Item}}
            </span>
        </el-row>
        <div v-show="Multi_Source_Search_Result.length == 0" align="center" style="width: 100%; height: 300px; line-height: 300px">
            <span style="font-size: 30px; color: #ddd">暂无检索信息</span>
        </div>
        <div v-show="Multi_Source_Search_Result.length > 0">
            <el-row 
                v-for="(Item, Item_Index) in Multi_Source_Search_Result"
                :key="'Multi_Source_Search_Result_' + Item_Index">

            </el-row>
        </div>
        <el-row type="flex" justify="center" v-show="Multi_Source_Search_Result.length > 0">
            <el-pagination
                @current-change="Page_Index_Change"
                :current-page.sync="Page_Index"
                :page-size="Page_Length"
                layout="total, prev, pager, next"
                :total="Total_Count">
            </el-pagination>
        </el-row>
    </div>
</template>

<script>

export default {
  name: "",
  components:{
      
  },
  data() {
    return {
        MultiSearchContent: "",
        Subject_All_List: ["语文", "数学", "英语", "物理", "化学", "生物", "政治", "历史", "地理"],
        Subject_Chosen_List: [],
        Multi_Source_Search_Result: [
            {

            }
        ],
        Total_Count: 0,
        Page_Index: 1,
        Page_Length: 5,
        File_Type_Bolb:{
            'doc': "application/msword",
            'docx': "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            'pdf': "application/pdf",
            'ppt': "application/vnd.ms-powerpoint",
            'pptx': "application/vnd.openxmlformats-officedocument.presentationml.presentation"
        }
    }
  },
  destroyed(){

  },
  computed:{
      
  },
  mounted(){

  },
  methods: {
    MultiSourceSearch(){
        
    },
    // 主要用于hover样式，来做成按钮的效果
    Focus_Filter(Item){
        if(this.Subject_Chosen_List.indexOf(Item) == -1){
            return "Unchosen_Option"
        }else{
            return "Chosen_Option"
        }
    },
    // 内容调整，控制选择项的内容
    Filter_Change(Item){
        if(this.Subject_Chosen_List.indexOf(Item) == -1){
            this.Subject_Chosen_List.push(Item)
        }else{
            this.Subject_Chosen_List.splice(this.Subject_Chosen_List.indexOf(Item), 1)
        }
    },
    // 参数分别是筛选项所属的属性，筛选项对应的索引值
    Filter_Item(Index){
        return {
            "width": "80px",
            "height": "40px",
            "line-height": "40px",
            "text-align": "center",
            "display": "inline-block",
            "background": "white",
            "cursor": "pointer",
            "border-top-left-radius": Index == 0 ? "10px" : "0px",
            "border-bottom-left-radius": Index == 0 ? "10px" : "0px",
            "border-top-right-radius": Index == this.Subject_All_List.length - 1 ? "10px" : "0px",
            "border-bottom-right-radius": Index == this.Subject_All_List.length - 1 ? "10px" : "0px"
        }
    },
    Page_Index_Change(){
        this.MultiSourceSearch();
    }
  }
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

.Padding_Width{
    padding-top: 40px;
}

.Search_Button{
    width: 100px;
    height: 40px;
    line-height: 40px;
    border-radius: 5px;
    background: #409EFF;
    color: white;
    margin: 1px;
    cursor: pointer;
    transition: 300ms;
}

.Search_Button:hover{
    background: rgba(#409EFF, 0.7);
    color: white;
}

.Unchosen_Option{
    color: #333;
    border: 1px solid #ccc;
    box-sizing: border-box;
}

.Unchosen_Option:hover{
    color: rgba($color: #409EFF, $alpha: 0.6);
    border: 1px solid rgba($color: #409EFF, $alpha: 0.6);
    box-sizing: border-box;
}

.Chosen_Option{
    color: #409EFF;
    border: 1px solid #409EFF;
    box-sizing: border-box;
}
</style>