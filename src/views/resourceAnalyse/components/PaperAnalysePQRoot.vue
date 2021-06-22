<template>
    <div>
        <el-row type="flex" justify="start">
            <PaperAnalysePackedQuestion 
                :PackedQuestion="PackedQues.sub_question" 
                :Sub_Index="Index" 
                :Name_P="'P_' + I" 
                style="width: 100%"
                @QuestionReport="ReportSend"></PaperAnalysePackedQuestion>
        </el-row>
    </div>
</template>
 
<script>
import PaperAnalysePackedQuestion from './PaperAnalysePackedQues.vue'
export default {
    name: 'PQRoot',
    props: {
        PackedQues: Object,
        Index: Number
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
        }
    }
}
</script>