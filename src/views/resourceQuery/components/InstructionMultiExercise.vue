<template lang="html">
  <Instruction
    ref="instruction"
    :data="steps"
    />
</template>

<script>
import sp1 from '@/assets/SP1.png';
import me1 from '@/assets/ME1.png';
import me2 from '@/assets/ME2.png';
import me3 from '@/assets/ME3.png';
import me4 from '@/assets/ME4.png';
import me5 from '@/assets/ME5.png';
import Instruction from '@/common/components/Instruction.vue'
export default {
  components:{
    Instruction,
  },
  data(){
    return {
      steps:[
        {
          desc:'选择需要查询的题库。',
          imgSrc:sp1
        },
        {
          desc:'设置筛选条件:选择上传文件所属科目（必选）。',
          imgSrc:me1
        },
        {
          desc:'选择文件上传',
          imgSrc:me2
        },
        {
          desc:'如操作失误或需重新上传文件，可删除当前文件，重新上传。',
          imgSrc:me3
        },
        {
          desc:'切分试题。',
          imgSrc:me4
        },
        {
          desc:'查询试题。',
          imgSrc:me5
        },
      ]
    }
  },
  methods:{
    openDialog(){
      this.$refs.instruction.openDialog()
    },
  }
}
</script>
