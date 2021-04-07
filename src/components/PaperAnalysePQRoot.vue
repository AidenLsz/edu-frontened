<template>
    <div>
        题包：{{PackedQues.id}}
        <packed-question :PackedQuestion="PackedQues.sub_question"></packed-question>
    </div>
</template>
 
<script>
import PackedQuestion from './PaperAnalysePackedQues.vue'
export default {
    name: 'PQRoot',
    props: {
        PackedQues: Object
    },
    components: {
        PackedQuestion
    }
}
</script>