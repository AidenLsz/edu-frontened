<template lang="html">
  <Instruction
    ref="instruction"
    :data="steps"
    />
</template>

<script>
import Intro_1 from '@/assets/InstQuestionSearch(Exercise)/1 - Total.png';
import Intro_2_1 from '@/assets/InstQuestionSearch(Exercise)/2-1 - NormalSearch.png';
import Intro_2_2 from '@/assets/InstQuestionSearch(Exercise)/2-2 - InputHelper1.png';
import Intro_2_3 from '@/assets/InstQuestionSearch(Exercise)/2-3 - InputHelper2.png';
import Intro_3_1_1 from '@/assets/InstQuestionSearch(Exercise)/3-1-1 - ImgSearch1.png';
import Intro_3_1_2 from '@/assets/InstQuestionSearch(Exercise)/3-1-2 - ImgSearch2.png';
import Intro_3_1_3 from '@/assets/InstQuestionSearch(Exercise)/3-1-3 - StartSearch.png';
import Intro_3_2_1 from '@/assets/InstQuestionSearch(Exercise)/3-2-1 - FileSearch1.png';
import Intro_3_2_2 from '@/assets/InstQuestionSearch(Exercise)/3-2-2 - FileSearch2.png';
import Intro_4_1 from '@/assets/InstQuestionSearch(Exercise)/4-1 - ResultIntro1.png';

import Instruction from '@/common/components/Instruction.vue'

export default {
  components:{
    Instruction,
  },
  data(){
    return {
      steps:[
        {
          desc:'筛选条件设置',
          imgSrc:Intro_1
        },
        {
          desc:'纯文字检索',
          imgSrc:Intro_2_1
        },
        {
          desc:'对于含有复杂公式的文本，可以使用输入助手快捷输入公式',
          imgSrc:Intro_2_2
        },
        {
          desc:'输入想要的公式并完成编辑进行搜索',
          imgSrc:Intro_2_3
        },
        {
          desc:'文件检索模式',
          imgSrc:Intro_3_1_1
        },
        {
          desc:'如果上传的是jpg或png等图片格式，将会打开图片编辑器，可对搜索内容进行调整',
          imgSrc:Intro_3_1_2
        },
        {
          desc:'返回主页后点击检索对图片内容进行检索',
          imgSrc:Intro_3_1_3
        },
        {
          desc:'如果上传的是word文档，将会启用切分功能自动识别word文档中的每一道题目',
          imgSrc:Intro_3_2_1
        },
        {
          desc:'获得可编辑的题目切分结果，从中选择一个题目进行搜索',
          imgSrc:Intro_3_2_2
        },
        {
          desc:'关于检索结果：检索的结果除了文本外还可以查看多种信息',
          imgSrc:Intro_4_1
        }
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
