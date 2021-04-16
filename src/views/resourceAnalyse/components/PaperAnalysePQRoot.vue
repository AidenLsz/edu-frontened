<template>
    <div>
        <el-row type="flex" justify="start">
            <PaperAnalysePackedQuestion :PackedQuestion="PackedQues.sub_question" :Sub_Index="Index" :Name_P="'P_' + Index" style="width: 100%"></PaperAnalysePackedQuestion>
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
    }
}
</script>