<template>
    <div>
        <el-row type="flex" justify="center" style="margin-top: 30px">
            <el-button @click="Check_Analyse('794c6214-ab16-11eb-9570-3c9c0fb58abe', '题库中国')">测试题目1</el-button>
            <el-button @click="Check_Analyse('0d13f658-ab0c-11eb-9ed4-3c9c0fb58abe', '题库中国')">测试题目2</el-button>
        </el-row>
        <el-row>
          <QuestionAnalyse :Ques="analyseData"></QuestionAnalyse>
        </el-row>
    </div>
</template>
<script>

import QuestionAnalyse from '../resourceAnalyse/QuestionAnalyse.vue'

export default {

    components: { QuestionAnalyse },
    name: "TestPageList",
    mounted(){
    },
    props: {
        aD: {
            type: Object,
            default: function(){
                return {
                "analysis": "\u5982\u56fe\uff0c\u505a\u51fa\u7ea6\u675f\u6761\u4ef6$\\left\\{\\begin{array}{c}2 x+y-2 \\leq 0 \\ x-y-1 \\geq 0 \\ y+1 \\geq 0\\end{array}\\right.$\u6240\u8868\u793a\u7684\u53ef\u884c\u57df\u3002\u6613\u5f97A\u7684\u5750\u6807\u4e3a$A(1,0)$\u3002\u5f53\u76ee\u6807\u51fd\u6570\u7ecf\u8fc7A\u70b9\u65f6\uff0cz\u53d6\u5f97\u6700\u5927\u503c\uff0c\u53ef\u5f97$z=x+7 y$\u7684\u6700\u5927\u503c\u4e3a$1+7 \\times 0=1$", 
                "answer": "1", 
                "database": "公开题库", 
                "id": "96ac6512-8aed-11eb-8fbd-b46bfc50aa29", 
                "options": ['［-1，+∞)',
                            '(1, <img width="25" height="23" border="0" src="/tikuimg/q_500004/d/11/10/11/4e459037d429.gif">+<img width="16" height="41" border="0" src="/tikuimg/q_500004/d/11/10/11/29ec228f9344.gif">］',
                            '［-1, <img width="25" height="23" border="0" src="/tikuimg/q_500004/d/11/10/11/4e459037d429.gif">］',
                            '(0, <img width="25" height="23" border="0" src="/tikuimg/q_500004/d/11/10/11/4e459037d429.gif">］'
                            ], 
                "period": "高中", 
                "stem": "若$x,y$满足约束条件$\\left\\{\\begin{array}{c}2 x+y-2 \\leq 0 \\ x-y-1 \\geq 0 \\ y+1 \\geq 0\\end{array}\\right.$，则$z=x+7 y$的最大值为$\\underline{}$", 
                "subject": "数学", 
                "type": "Question",
                "que_type": "其他",
                "difficulty": 0.2, 
                "discrimination": 0.3, 

                "quality": 0.6,
                "knowledge_points_frontend": {
                    "kp": [
                        "\u7b80\u5355\u7684\u7ebf\u6027\u89c4\u5212", 
                        "\u4ee3\u6570", 
                        "\u7b80\u5355\u7684\u7ebf\u6027\u89c4\u5212\u95ee\u9898", 
                        "\u4e0d\u7b49\u5f0f"
                    ], 
                    "kp_layer": [
                        {
                        "children": [
                            {
                            "children": [
                                {
                                "children": [
                                    {
                                    "children": [], 
                                    "label": "\u7b80\u5355\u7684\u7ebf\u6027\u89c4\u5212\u95ee\u9898"
                                    }, 
                                    {
                                    "children": [], 
                                    "label": "\u4e8c\u5143\u4e00\u6b21\u4e0d\u7b49\u5f0f\uff08\u7ec4\uff09\u8868\u793a\u7684\u5e73\u9762\u533a\u57df"
                                    }
                                ], 
                                "label": "\u7b80\u5355\u7684\u7ebf\u6027\u89c4\u5212"
                                }
                            ], 
                            "label": "\u4e0d\u7b49\u5f0f"
                            }
                        ], 
                        "label": "\u4ee3\u6570"
                        }
                    ], 
                    "kp_priority": [
                            "\u4ee3\u6570", 
                            "\u4e0d\u7b49\u5f0f", 
                            "\u7b80\u5355\u7684\u7ebf\u6027\u89c4\u5212", 
                            "\u7b80\u5355\u7684\u7ebf\u6027\u89c4\u5212\u95ee\u9898", 
                            "\u4e8c\u5143\u4e00\u6b21\u4e0d\u7b49\u5f0f\uff08\u7ec4\uff09\u8868\u793a\u7684\u5e73\u9762\u533a\u57df"
                    ]
                    },
                }
            }
        }
    },
    data(){
        return {
           // 用于分析显示的题目数据
            analyseData: this.aD
        }
    },
    methods: {
        // 查看单题分析报告
        Check_Analyse(ID, DatabaseName){

            let config = {
                headers: { "Content-Type": "multipart/form-data" }
            };

            let param = new FormData();

            if(DatabaseName == '公开题库'){
                param.append("databasename", 'public');
            }else if(DatabaseName == 'neea'){
                param.append("databasename", 'neea');
            }else if(DatabaseName == 'iflytek'){
                param.append("databasename", 'iflytek');
            }else if(DatabaseName == '题库中国'){
                param.append("databasename", 'tiku');
            }
            param.append("ID", ID);

            this.$http
            .post(this.backendIP + "/api/questionAnalyse", param, config, {
                emulateJSON: true
            })
            .then(function(data) {
                this.analyseData = data.data.que_dic;
                console.log(this.analyseData);
            });    
        },
    }
}
</script>
<style lang="scss" scoped>

</style>

