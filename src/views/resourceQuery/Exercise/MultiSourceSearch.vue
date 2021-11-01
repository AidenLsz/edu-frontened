<template>
    <div 
        :style="Get_Div_Width()"
        align="center"
        v-loading="waiting"
        :element-loading-text="waiting_text"
        element-loading-spinner="el-icon-loading">
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
            <el-input 
                v-model="MultiSearchContent" 
                @keyup.enter.native="Multi_Source_Search()"
                placeholder="在此输入检索关键字" 
                style="width: 90%; margin-right: 40px; height: 40px"></el-input>
            <div @click="Multi_Source_Search()" class="Search_Button" align="center">
                <i class="el-icon-search" style="margin-right: 16px"></i>检索
            </div>
        </el-row>
        <el-row type="flex" justify="start" style="margin-top: 20px; width: 100%; margin-bottom: 20px">
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
        <div 
            id="Multi_Source_Search_Result_List"
            v-show="Multi_Source_Search_Result.length > 0">
            <el-row 
                v-for="(Item, Item_Index) in Multi_Source_Search_Result"
                :key="'Multi_Source_Search_Result_' + Item_Index">
                <div class="Result_Card">
                    <el-row type="flex" justify="start" style="font-size: 16px">
                        <div align="left" style="width: 80px; margin-right: 10px">
                            <label>文件名：</label>
                        </div>
                        <div align="left" class="Item_Info">
                            <span style="text-align: left">{{Item.name}}</span>
                        </div>
                    </el-row>
                    <el-row type="flex" justify="start" style="font-size: 14px; margin-top: 10px;">
                        <div align="left" style="width: 80px; margin-right: 10px">
                            <label>相关信息：</label>
                        </div>
                        <div align="left" class="Item_Info">
                            <span style="text-align: left">{{Item.stem}}</span>
                        </div>
                    </el-row>
                    <el-divider style="margin-top: -10px"></el-divider>
                    <el-row type="flex" justify="start" style="font-size: 14px; margin-top: -5px;">
                        <div style="width: 500px;" align="left">
                            <div align="left" class="Download_Row" style="width: 60px;">
                                <label>学科：</label>
                            </div>
                            <div align="left" class="Download_Row" style="width: 80px;">
                                <span style="text-align: left">{{Item.subject}}</span>
                            </div>
                            <div align="left" class="Download_Row" style="width: 85px;">
                                <label>文件类型：</label>
                            </div>
                            <div align="left" class="Download_Row" style="width: 80px;">
                                <span style="text-align: left">{{Item.type.toUpperCase()}}</span>
                            </div>
                        </div>
                        <div style="width: 100%;" align="right">
                            <el-button type="primary" @click="Multi_Source_Resource_Download(Item)">下载此文件</el-button>
                        </div>
                    </el-row>
                </div>
            </el-row>
        </div>
        <el-row type="flex" justify="center" v-show="Multi_Source_Search_Result.length > 0" style="margin-top: 30px">
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

import {commonAjax} from '@/common/utils/ajax'

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

            ],
            Total_Count: 1,
            Page_Index: 1,
            Page_Length: 5,
            File_Type_Blob:{
                'doc': "application/msword",
                'docx': "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                'pdf': "application/pdf",
                'ppt': "application/vnd.ms-powerpoint",
                'pptx': "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                'jpg': 'image/jpeg',
                'jpeg': "image/jpeg"
            },
            waiting: false,
            waiting_text: "",
            History_Backup: {
                History_Content: "",
                History_Subject_List: []
            },
            Width_Now: 0
        }
    },
    destroyed(){

    },
    updated() {
        window.onresize = () => {
            this.Width_Now = document.body.clientWidth
        }
    },
    computed:{
        
    },
    mounted(){
        this.Width_Now = document.body.clientWidth
    },
    methods: {
        Get_Div_Width(){
            let Width_Border = 1344
            if(this.Width_Now < Width_Border){
                return {
                    "width": '1168px',
                    "padding": "0px 88px",
                }
            }else{
                return {
                    "width": "1168px",
                    "margin": "0px auto",
                }
            }
        },
        // 跳转到某个组件的位置
        Jump_Up(){
            document.getElementById("Multi_Source_Search_Result_List").scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"})
        },
        // 检测当前是否应该重置Page_Index
        Page_Index_Reset_Check(){
            if(this.History_Backup.History_Content != this.MultiSearchContent){
                this.Page_Index = 1;
                this.History_Backup.History_Content = JSON.parse(JSON.stringify(this.MultiSearchContent));
            }
            if(this.History_Backup.History_Subject_List.length != this.Subject_Chosen_List.length){
                this.Page_Index = 1;
                this.History_Backup.History_Subject_List = JSON.parse(JSON.stringify(this.Subject_Chosen_List));
                return
            }
            for(let i = 0; i < this.History_Backup.History_Subject_List.length; i++){
                if(this.Subject_Chosen_List.indexOf(this.History_Backup.History_Subject_List[i]) == -1){
                    this.Page_Index = 1;
                    this.History_Backup.History_Subject_List = JSON.parse(JSON.stringify(this.Subject_Chosen_List));
                    return
                }
            }
        },
        // 多源内容检索
        Multi_Source_Search(){

            this.Page_Index_Reset_Check();

            this.waiting = true;
            this.waiting_text = "资源检索中，请稍后..."
            let Param = {}
     
            let Data = {
                content: this.MultiSearchContent,
                size: 5,
                page_count: this.Page_Index,
                subject: this.Subject_Chosen_List
            }

            Param.data = JSON.stringify(Data)

            commonAjax(this.backendIP+'/api/multi_source_search', Param)
            .then((data)=>{
                this.Multi_Source_Search_Result = data.results;
                this.Total_Count = data.totalLength;
            }).catch(() => {
                this.$message.error("请稍后重试。")
            }).finally(()=>{
                this.Jump_Up()
                this.waiting = false;
                this.waiting_text = ""
            })
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
            this.Multi_Source_Search();
        },
        Multi_Source_Resource_Download(Item){

            this.waiting = true;
            this.waiting_text = "资源准备下载中，请稍后..."

            let TYPE = Item.type

            let Resource_Info = {
                name: Item.name,
                subject: Item.subject
            }

            let config = {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                responseType: 'arraybuffer',
                emulateJSON: true
            }

            let param = new FormData();

            param.append('data', JSON.stringify(Resource_Info, null, 4));

            this.$http
                .post(this.backendIP + "/api/multi_source_download", param, config)
                .then(function(data) {
                    if(data.data){
                        const link = document.createElement('a')
                        let blob = new Blob([data.data],
                            {type: this.File_Type_Blob[TYPE.toLowerCase()]})
                        let objectUrl = URL.createObjectURL(blob)
                        link.href = objectUrl
                        link.download = Resource_Info.name 
                        link.click()
                        URL.revokeObjectURL(objectUrl);
                    }
                }).catch(() => {
                    this.$message.error("服务器忙碌，请稍后再试...");
                    return
                }).finally(()=>{
                    this.waiting = false;
                    this.waiting_text = ""
                });
        },
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

.Result_Card{
    border: 1px dashed #409EFF;
    border-radius: 10px;
    padding: 20px 30px;
    margin: 10px 0px;
}

.Item_Info{
    word-break:break-all; 
    overflow:auto;
    width: calc(100% - 80px);
}

.Download_Row{
    height: 40px;
    line-height: 40px;
    display: inline-block;
}
</style>