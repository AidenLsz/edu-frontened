<template lang="html">
  <Instruction
    ref="instruction"
    :data="steps"
    />
</template>

<script>
import sp1 from '@/assets/InstSP/SP1.png';
import sp2 from '@/assets/InstSP/SP2.png';
import sp3 from '@/assets/InstSP/SP3.png';
import sp4 from '@/assets/InstSP/SP4.png';
import sp5 from '@/assets/InstSP/SP5.png';
import sp6 from '@/assets/InstSP/SP6.png';
import sp7 from '@/assets/InstSP/SP7.png';
import sp8 from '@/assets/InstSP/SP8.png';
import sp9 from '@/assets/InstSP/SP9.png';
import Instruction from '@/common/components/Instruction.vue'
export default {
  components:{
    Instruction,
  },
  data(){
    return {
      steps:[
        {
          desc:'选择需要查询的题库',
          imgSrc:sp1
        },
        {
          desc:'设置筛选条件',
          imgSrc:sp2
        },
        {
          desc:'方式一：输入文字内容进行搜索',
          imgSrc:sp3
        },
        {
          desc:'方式二：上传图片进行搜索',
          imgSrc:sp4
        },
        {
          desc:'方式二：上传图片进行搜索-上传图片',
          imgSrc:sp5
        },
        {
          desc:'方式二：上传图片进行搜索-调整图片并搜索',
          imgSrc:sp6
        },
        {
          desc:'方式三：输入公式进行搜索',
          imgSrc:sp7
        },
        {
          desc:'方式三：输入公式进行搜索-编辑公式等搜索内容',
          imgSrc:sp8
        },
        {
          desc:'方式三：输入公式进行搜索-进行搜索',
          imgSrc:sp9
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
