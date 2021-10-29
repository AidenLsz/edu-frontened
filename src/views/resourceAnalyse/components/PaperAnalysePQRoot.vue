<template>
    <div>
        <el-row type="flex" justify="start">
            <PaperAnalysePackedQuestion 
                :PackedQuestion="PackedQues.sub_question" 
                :Sub_Index="Index" 
                :Name_P="'P_' + I" 
                style="width: 100%"
                :Combine_Update_Bundle_Index="Combine_Update_Bundle_Index"
                @QuestionReport="ReportSend"
                @Replace_Aim="Replace_Aim"></PaperAnalysePackedQuestion>
        </el-row>
    </div>
</template>
 
<script>
import PaperAnalysePackedQuestion from './PaperAnalysePackedQues.vue'
export default {
    name: 'PQRoot',
    props: {
        PackedQues: Object,
        Index: Number,
        Combine_Update_Bundle_Index:{
            type: Number,
            default: -1
        }
    },
    components: {
        PaperAnalysePackedQuestion
    },
    data(){
        return {
            I: this.Index
        }
    },
    methods:{
        ReportSend(val){
            this.$emit("Report", val);
        },
        Replace_Aim(val){
            this.$emit("Replace_Aim", val)
        }
    }
}
</script>