<template lang="html">
  <Instruction
    ref="instruction"
    :data="steps"
    />
</template>

<script>
import ug1 from '@/assets/UG1.png';
import ug2 from '@/assets/UG2.png';
import ug3 from '@/assets/UG3.png';
import ug4 from '@/assets/UG4.png';
import Instruction from '@/common/components/Instruction.vue'
export default {
  components:{
    Instruction,
  },
  data(){
    return {
      steps:[
        {
          desc:'选择要管理的组织架构',
          imgSrc:ug1
        },
        {
          desc:'添加用户',
          imgSrc:ug2
        },
        {
          desc:'创建用户',
          imgSrc:ug3
        },
        {
          desc:'对申请加入组织的用户进行审批',
          imgSrc:ug4
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
