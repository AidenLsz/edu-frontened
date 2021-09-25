<template lang="html">
  <Instruction
    ref="instruction"
    :data="steps"
    />
</template>

<script>
import im1 from '@/assets/InstIM/IM1.png';
import im2 from '@/assets/InstIM/IM2.png';
import im3 from '@/assets/InstIM/IM3.png';
import im4 from '@/assets/InstIM/IM4.png';
import Instruction from '@/common/components/Instruction.vue'
export default {
  components:{
    Instruction,
  },
  data(){
    return {
      steps:[
        {
          desc:'选择科目、学段和题型',
          imgSrc:im1
        },
        {
          desc:'输入题目内容：简单文字输入',
          imgSrc:im2
        },
        {
          desc:'输入题目内容：复杂公式输入',
          imgSrc:im3
        },
        {
          desc:'输入答案',
          imgSrc:im4
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
