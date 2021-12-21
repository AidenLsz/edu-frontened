<template lang="html">
  <Instruction
    ref="instruction"
    :data="steps"
    />
</template>

<script>
import Search from '@/assets/InstKUSearch/1 - Search.png';
import KUResult from '@/assets/InstKUSearch/2 - KUResult.png';
import DetailCard from '@/assets/InstKUSearch/3 - DetailCard.png';
import OtherRelation from '@/assets/InstKUSearch/4 - OtherRelation.png';
import History from '@/assets/InstKUSearch/5 - History.png';
import Instruction from '@/common/components/Instruction.vue'
export default {
  components:{
    Instruction,
  },
  data(){
    return {
      steps:[
        {
          desc:'输入查询，选择筛选条件',
          imgSrc:Search
        },
        {
          desc:'点击搜索后获得知识点搜索结果',
          imgSrc:KUResult
        },
        {
          desc:'点击查看知识点详情后可以看到更丰富的知识点信息',
          imgSrc:DetailCard
        },
        {
          desc:'另外也可以查看知识点的不同关系',
          imgSrc:OtherRelation
        },
        {
          desc:'可通过知识点的历史记录快速返回之前查询过的知识点',
          imgSrc:History
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
