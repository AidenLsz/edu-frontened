<template lang="html">
  <Instruction
    ref="instruction"
    :data="steps"
    />
</template>

<script>
import sr1 from '@/assets/InstSR/SR1.png';
import sr2 from '@/assets/InstSR/SR2.png';

import Instruction from '@/common/components/Instruction.vue'
export default {
  components:{
    Instruction,
  },
  data(){
    return {
      steps:[
        {
          desc:'选择检索资源种类',
          imgSrc:sr1
        },
        {
          desc:'输入搜索内容,进行查询',
          imgSrc:sr2
        },
      ]
    }
  },
  props:{
    dialogTitle:{
      type:String
    }
  },
  methods:{
    openDialog(){
      this.$refs.instruction.openDialog()
    },
  }
}
</script>
