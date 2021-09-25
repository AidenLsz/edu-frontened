<template lang="html">
  <Instruction
    ref="instruction"
    :data="steps"
    />
</template>

<script>
import ip1 from '@/assets/InstIP/IP1.png';
import ip2 from '@/assets/InstIP/IP2.png';
import ip3 from '@/assets/InstIP/IP3.png';
import ip4 from '@/assets/InstIP/IP4.png';
import Instruction from '@/common/components/Instruction.vue'
export default {
  components:{
    Instruction,
  },
  data(){
    return {
      steps:[
        {
          desc:'文件导入',
          imgSrc:ip1
        },
        {
          desc:'选择学科',
          imgSrc:ip2
        },
        {
          desc:'点击选择学段、文字输入格式',
          imgSrc:ip3
        },
        {
          desc:'选择本地文件',
          imgSrc:ip4
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
