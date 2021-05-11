// 这一页面主要用于测试各类新功能的显示是否符合具体要求，等待完成后再放到正式页面上去

<template>
    <div style="min-height: 600px">
        <el-row>
            <el-col :span="12" :offset="6">
                <el-input v-model="content"></el-input>
            </el-col>
        </el-row>
        <el-row style="margin-top: 10px">
            <el-button @click="contentRemake()">转化</el-button>
        </el-row>
        <el-row style="margin-top: 10px">
            {{remakeContent}}
        </el-row>
    </div>
</template>

<script>

export default {

    components: {},
    name: "TestPage",
    data(){
        return {
            content: "",
            remakeContent: ""
        }
    },
    mounted() {

    },
    methods: {
        contentRemake(){
            let result = this.contentRemake_Do(this.content);
            console.log(result);
            if(!result[1]){
                this.remakeContent = result[0]
            }else{
                this.remakeContent = "请将自己输入的Latex公式正确包裹在$$符号之内！";
            }
        },
        contentRemake_Do(content){

            let remakeContent = "";

            var latexFlag = false;
            let Regx = /[A-Za-z0-9]/;

            var Img_Catcher = new RegExp('<img src="(.*?)">', 'g')
            var Result_List = Img_Catcher.exec(content);

            var Img_SE = [];

            while(Result_List != null){
                var Temp_Catcher = '<img src="' + Result_List[1] + '">';
                var Start = content.indexOf(Temp_Catcher);
                Img_SE.push([Start, Start + Temp_Catcher.length])
                Result_List = Img_Catcher.exec(content);
            }
                  
            var Img_Index = 0;

            for(let i = 0; i < content.length; i++){
                
                if(content[i] == '$' && !latexFlag){
                    latexFlag = true;
                }else if(content[i] == '$' && latexFlag){
                    latexFlag = false;
                }

                
                if(Img_SE.length > 0 && i >= Img_SE[Img_Index][0] && i <= Img_SE[Img_Index][1]){
                    remakeContent = remakeContent + content[i];
                    continue;
                }else if(Img_SE.length > 0 && i > Img_SE[Img_Index][1] && Img_Index < Img_SE.length - 1){
                    Img_Index = Img_Index + 1
                }

                if(!latexFlag){
                    if (Regx.test(content[i])) {
                        if(remakeContent[remakeContent.length - 1] == '$'){
                            remakeContent = remakeContent.substring(0, remakeContent.length - 1) + content[i] + "$";
                        }else{
                            remakeContent = remakeContent + "$" + content[i] + "$";
                        }
                    }
                    else {
                        remakeContent = remakeContent + content[i];
                    }
                }else{
                    remakeContent = remakeContent + content[i];
                }
            }

            return [remakeContent, latexFlag]
        }
    }
}
</script>

<style lang="scss" scoped>

</style>