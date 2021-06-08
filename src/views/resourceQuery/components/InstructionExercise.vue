<template lang="html">
  <Instruction
    ref="instruction"
    :data="steps"
    />
</template>

<script>
import sp1 from '@/assets/SP1.png';
import sp2 from '@/assets/SP2.png';
import sp3 from '@/assets/SP3.png';
import sp4 from '@/assets/SP4.png';
import Instruction from '@/common/components/Instruction.vue'
export default {
  components:{
    Instruction,
  },
  data(){
    return {
      steps:[
        {
          desc:'选择需要查询的数据库',
          imgSrc:sp1
        },
        {
          desc:'设置筛选条件',
          imgSrc:sp2
        },
        {
          desc:'输入搜索内容：简单文字查询｜复杂公式查询｜图片查询',
          imgSrc:sp3
        },
        {
          desc:'进行查询',
          imgSrc:sp4
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
