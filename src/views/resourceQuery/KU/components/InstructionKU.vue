<template lang="html">
  <Instruction
    ref="instruction"
    :data="steps"
    />
</template>

<script>
import ku1 from '@/assets/InstKU/KU1.png';
import ku2 from '@/assets/InstKU/KU2.png';
import ku3 from '@/assets/InstKU/KU3.png';
import ku4 from '@/assets/InstKU/KU4.png';
import ku5 from '@/assets/InstKU/KU5.png';
import Instruction from '@/common/components/Instruction.vue'
export default {
  components:{
    Instruction,
  },
  data(){
    return {
      steps:[
        {
          desc:'输入搜索内容：简单文字查询｜复杂公式查询',
          imgSrc:ku1
        },
        {
          desc:'进行查询',
          imgSrc:ku2
        },
        {
          desc:'缩起知识卡片',
          imgSrc:ku3
        },
        {
          desc:'展开知识卡片',
          imgSrc:ku4
        },
        {
          desc:'筛选知识节点',
          imgSrc:ku5
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
