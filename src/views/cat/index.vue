<template>
  <div class="container">
    <el-row v-for="(Question, Question_Index) in Question_List"
            :key="'Question_' + Question_Index">
      <div :style="Get_Card_Margin(Question_Index)">
        <el-row class="Question_Card" style="background: white" v-if="Question.pattern == 'text'">
          <el-row class="ques-index" style="justify-content:left">
            <div style="border-bottom: 4px solid #C5CBD3;">
              题目{{Question_Index+1}}
            </div>
            <el-progress style="margin-left:32px;" type="circle" :percentage="(Question_Index+1)*100/Question_List.length" :width="32" :stroke-width="6" :show-text="false"/>
            <div class="sm-font">{{(Question_Index+1)}}/{{Question_List.length}}</div>
          </el-row>

          <SearchQuestionItem :Question="Question"
                              :Question_Index="Question_Index"
                              @Expand_Aim="Expand_Aim"></SearchQuestionItem>
          <div class="btn">
            <button class="ques-btn" v-if="Question_Index!=Question_List.length-1" type="button" name="button" @click="Next_Question">下一题</button>
            <button class="ques-btn submit-btn" v-else type="button" name="button">确认提交</button>
          </div>
        </el-row>
      </div>
    </el-row>
  </div>

</template>

<script>

  import SearchQuestionItem from '@/views/cat/components/QuestionItem'
  export default {
    name: 'cat',
    components: {
      SearchQuestionItem
    },
    data() {
      return {
        Visible_Question_Index:0,
        Question_List: [
          {
  "stem": "\n下列函数在($-1,1)$内既是奇函数又是增函数的是（   ）\n",
  "options": [
    "<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAAjCAYAAAANDvOtAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFMSURBVFhH7VgBDoMgDOzL+BPf4TM8had0LQJDhEjjcJCwxCwmpZzHXVsFXOgHC2HFDfbRaTmDChQad80yF7NWIwDQtQJYT6ZFvcE+Emdr8WZ2CK1bs6NoXYhZ3xC4zh6XtmdOuptCTNDzP4r2brCjAEjygtWBdmUwtWNue/m9JOPA2IPZyvBgTQb+AYBERqbFJKVSlDf7BBmUXcOiKcaeHq3GGMmz9eblnBnYr/scsVoYUbL/sNgA1qFRASxJQteGyWEQ+hOfwCpiVE9orPg4qXQdRtBTHv8V7I/c33+o8khwVF2TXuXrX11BlaP+vvMaivjelbzCZZQkWfHOJO2WT5dJY6Bt30wClpuoujX4NGB9y78pm9OAtcRs6+PGpXS9ZqjKRiwBnmm41vvZhkxXm3H+ziwPMiq291gZGtPY38FKTnSDlbAliV2K2Q/Be3Sbu0SSyQAAAABJRU5ErkJggg=='>",
    "$y=log_{2}$",
    "$y=sin$",
    "$y=(x+2)^{2}$"
  ],
  "answer": "$C$",
  "analysis": "$A$、函数<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAAjCAYAAAANDvOtAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFMSURBVFhH7VgBDoMgDOzL+BPf4TM8had0LQJDhEjjcJCwxCwmpZzHXVsFXOgHC2HFDfbRaTmDChQad80yF7NWIwDQtQJYT6ZFvcE+Emdr8WZ2CK1bs6NoXYhZ3xC4zh6XtmdOuptCTNDzP4r2brCjAEjygtWBdmUwtWNue/m9JOPA2IPZyvBgTQb+AYBERqbFJKVSlDf7BBmUXcOiKcaeHq3GGMmz9eblnBnYr/scsVoYUbL/sNgA1qFRASxJQteGyWEQ+hOfwCpiVE9orPg4qXQdRtBTHv8V7I/c33+o8khwVF2TXuXrX11BlaP+vvMaivjelbzCZZQkWfHOJO2WT5dJY6Bt30wClpuoujX4NGB9y78pm9OAtcRs6+PGpXS9ZqjKRiwBnmm41vvZhkxXm3H+ziwPMiq291gZGtPY38FKTnSDlbAliV2K2Q/Be3Sbu0SSyQAAAABJRU5ErkJggg=='>的定义域是{$x|x\\neq 0},$则$A$不对;\n$B$、函数$y=log_{2}x$的定义域是{$x|x>0},$则$B$不对;\n$C$、函数$y=sinx$是奇函数,在<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAAjCAYAAADbqynIAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGMSURBVFhH7ZiLrcMgDEWZjJ1Yh2UYhVHcQIBHWlKMuVRPEZEqpU25+PgDJooedqmH8dAG+u8R3RF6cIQcGaVINT7aegC3TF+ccs4YcofZ3hqK9ntLWltCoARvSPXFQDkEzugTyBlSQCCp/iSQJ6vPSEUgE++A17j+HFBIM5VTT+OBBPoHUPDCX3HzCzqNS2nm7QGU7p21gCj19eOceVFKcxcgPkiyNXpPURmXvocJIJk3oF87Uw4EiAFKYgOhPLlKhxUhZ9pdQCxCSJHg8FhAvelaLU/9W2987/mIPgSoZ1DreTZSMvbbmA2E9GiIEvrCRij0cG+79Z3BIhiGPg4o7OZlxUvnl5sVUATD1IcBeecu559aGJFWXP0mUE6b4Z6utnzJEaKa4E3/pjlF+PLUCJvxyj2Xo49bci75jnNSUWLqg4Cqk+UClvPMlk7GHX0IUHmvsAQmpHJ6b8HQnwYKhXmpm6NwkXU0qj8F1O7IeanBcHZcZD6b1O/6U0Aco379nw30a4+Pzve4CL0AkuSdYhGsH9sAAAAASUVORK5CYII='>上递增,则在($-1,1)$上递增,则$c$正确;\n$D$、由函数$y=(x+2)^{2}$的对称轴是$x=-2$知,此函数不是奇函数,则$D$不对,\n故选$C.$\n",
  "type": "单选题",
  "subject": "数学",
  "period": "高中",
  "database": "LUNA题库",
  "id": "65aab406-e4cc-11eb-8c49-d46a6a0f329c",
  "difficulty": 0.501417,
  "pattern": "text",
  "file_name": null,
  "area": "未知",
  "pastpaper": "非真题"
},
{
  "stem": "\n存在二次函数$f(x),$使函数$g$[$f(x)$]的值域是$R$的函数$g(x)$可以是（   ）\n",
  "options": [
    "$y=2^{x}$",
    "<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADUAAAAjCAYAAAA0aUL2AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAG2SURBVFhH7VfZscMgDKQyeqKS/NMMpVCKHrK5DUm4LOJ5nslknFiyVisJLYMHXuyBmOAfVBerSgBj7PxwCbrLScVIS+CMg8ycrmUKXyqUjUiBQGD+fhCdT9bNoLRSCTNa8slsYaJuBnXhArPrmHKZ9iVpmWwq0Q1AKcEgrT4NkmOmMTgBvlDNc74PXT+678QBNaikvwKHR0lGgNo6jRQUMhKYSAJHsE0lF1sTglLi2swuNGWYKo3l7xgjAoXllbaB8PfuP99rZni0TXwCUBjsteEFvOzv3J2abhK2IDoO3uA/Nv368K1Oo3w6mXvqiz6CBRlgvkTiCYTl0D2RFkTZ6PJkqrAYKjl5+WwMbORxW375FFEgs9W3p6dabGY9i8mIQIUVRhuW3MoykjEqWwsKT3wLypSiyAUKVXSd701AccOQ+OEB4XLgR/o5BSv7WWfGDjNK5btk2s1QvrXV6Z3y1Uab+n4aYaRgO0X5vt0HK7sfK8jhydiCux7l2wNqGYCC4ynKN+l7gi39IgYLW/hH5bsvUwPKd1dQQ8p3R1DDync3UNsr3zun5Oi7nql8R7Oyo/0jmfoDDufMSD3UKV0AAAAASUVORK5CYII='>",
    "$y=log_{2}$",
    "$y=x+1$"
  ],
  "answer": "$C$",
  "analysis": "在$A$中,$\\because y=2^{x}$的值域为($0,+\\infty),$\n$\\therefore g$[$f(x)$]的值域$B$为$R$的真子集.\n无论定义域是什么 值域都取不到$R,$故$A$不成立;\n在$B$中,$\\because $<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADUAAAAjCAYAAAA0aUL2AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAG2SURBVFhH7VfZscMgDKQyeqKS/NMMpVCKHrK5DUm4LOJ5nslknFiyVisJLYMHXuyBmOAfVBerSgBj7PxwCbrLScVIS+CMg8ycrmUKXyqUjUiBQGD+fhCdT9bNoLRSCTNa8slsYaJuBnXhArPrmHKZ9iVpmWwq0Q1AKcEgrT4NkmOmMTgBvlDNc74PXT+678QBNaikvwKHR0lGgNo6jRQUMhKYSAJHsE0lF1sTglLi2swuNGWYKo3l7xgjAoXllbaB8PfuP99rZni0TXwCUBjsteEFvOzv3J2abhK2IDoO3uA/Nv368K1Oo3w6mXvqiz6CBRlgvkTiCYTl0D2RFkTZ6PJkqrAYKjl5+WwMbORxW375FFEgs9W3p6dabGY9i8mIQIUVRhuW3MoykjEqWwsKT3wLypSiyAUKVXSd701AccOQ+OEB4XLgR/o5BSv7WWfGDjNK5btk2s1QvrXV6Z3y1Uab+n4aYaRgO0X5vt0HK7sfK8jhydiCux7l2wNqGYCC4ynKN+l7gi39IgYLW/hH5bsvUwPKd1dQQ8p3R1DDync3UNsr3zun5Oi7nql8R7Oyo/0jmfoDDufMSD3UKV0AAAAASUVORK5CYII='>的值域是{$y|y\\neq 1},$\n$\\therefore g$[$f(x)$]的值域$B$为$R$的真子集.\n无论定义域是什么 值域都取不到$R,$故$B$不成立;\n在$C$中,只要二次函数$f(x)$值域包含区间($0,+\\infty),$\n即可保证$g(x)$值域为$R,$故$C$成立;\n在$D$中,值域只有在定义域为$R$的情况下才可以取到$R,$\n因为$f(x)$为二次函数,$f(x)$值域不为$R,$\n即$g(x)$定义域不为$R,$所以$g(x)$值域不为$R,$故$D$不成立.\n故选$C.$\n",
  "type": "单选题",
  "subject": "数学",
  "period": "高中",
  "database": "LUNA题库",
  "id": "636f638a-e4cd-11eb-adac-d46a6a0f329c",
  "difficulty": 0.510325,
  "pattern": "text",
  "file_name": null,
  "area": "未知",
  "pastpaper": "非真题"
},
{
  "stem": "\n函数$f(x)=(a+x)(1-ax)$为奇函数,则实数$a=$（   ）\n",
  "options": [
    "$0$",
    "$1$",
    "$0$或$1$",
    "$\\mp 1$"
  ],
  "answer": "$A$",
  "analysis": "因为$f(x)$为奇函数,且定义域为$R,$\n所以有$f(0)=0,$即($a+0)(1-0)=0,$解得$a=0.$\n故选$A.$\n",
  "type": "单选题",
  "subject": "数学",
  "period": "高中",
  "database": "LUNA题库",
  "id": "fba542ca-e4cb-11eb-b1b4-d46a6a0f329c",
  "difficulty": 0.482939,
  "pattern": "text",
  "file_name": null,
  "area": "未知",
  "pastpaper": "非真题"
},
          {
    "stem": "\n若函数$y=f(x)$为偶函数,则函数$y=f(x+1)$的一条对称轴是（   ）\n",
    "options": [
      "$x=2$",
      "$x=1$",
      "$x=0$",
      "$x=-1$"
    ],
    "answer": "$D$",
    "analysis": "$\\because $函数$y=f(x)$为偶函数\n$\\therefore $函数关于$y$轴即$x=0$对称\n$\\because y=f(x)$的图象向左平移一个单位可以得到函数$y=f(x+1)$的图象,\n从而可得函数$y=f(x+1)$的图象关于$x=-1$对称\n故选$D.$\n",
    "type": "单选题",
    "subject": "数学",
    "period": "高中",
    "database": "LUNA题库",
    "id": "02d042c8-e4cc-11eb-a580-d46a6a0f329c",
    "difficulty": 0.496819,
    "pattern": "text",
    "file_name": null,
    "area": "未知",
    "pastpaper": "非真题"
  },{
  "stem": "\n函数$f(x)$是定义域为$R$的奇函数,且$x>0$时,$f(x)=9^{x}-3x-1,$则函数$f(x)$的零点个数是（   ）\n",
  "options": [
    "$1$",
    "$2$",
    "$3$",
    "$4$"
  ],
  "answer": "$C$",
  "analysis": "$\\because $函数$f(x)$是定义域为$R$的奇函数,\n$\\therefore f(0)=0,$所以$0$是函数$f(x)$的一个零点\n当$x>0$时,令$f(x)=9^{x}-3x-1=0,$\n$\\therefore 9^{x}=3x+1,$令$p(x)=9^{x},$令$q(x)=3x+1,$在同一坐标系作图如下\n所以函数$f(x)$有一个零点,\n又根据对称性知,当$x<0$时函数$f(x)$也有一个零点.\n故选$C.$\n",
  "type": "单选题",
  "subject": "数学",
  "period": "高中",
  "database": "LUNA题库",
  "id": "01f15a40-e4cc-11eb-a7e6-d46a6a0f329c",
  "difficulty": 0.485167,
  "pattern": "text",
  "file_name": null,
  "area": "未知",
  "pastpaper": "非真题"
},
          {
  "stem": "\n若函数$f(x)$在区间($a,b)$内函数的导数为正,且$f(b)\\leq 0,$则函数$f(x)$在($a,b)$内有（   ）\n",
  "options": [
    "$f(x)>0$",
    "$f(x)<0$",
    "$f(x)=0$",
    "无法确定"
  ],
  "answer": "$B$",
  "analysis": "$\\because $函数$f(x)$在区间($a,b)$内函数的导数为正\n$\\therefore $函数$f(x)$在区间($a,b)$内单调递增\n而$f(b)\\leq 0$\n则函数$f(x)$在($a,b)$内有$f(x)<0$\n故选$B.$\n",
  "type": "单选题",
  "subject": "数学",
  "period": "高中",
  "database": "LUNA题库",
  "id": "cf03e788-e4c7-11eb-8cdc-d46a6a0f329c",
  "difficulty": 0.505677,
  "pattern": "text",
  "file_name": null,
  "area": "未知",
  "pastpaper": "非真题"
},
          {
            "stem": "\n指数函数$f(x)=a^{x}(a>0,$且$a\\neq 1)$在$R$上是减函数,则函数$g(x)=(a-2)x^{2}$在$R$上的单调性（   ）\n",
            "options": [
              "单调递增",
              "单调递减",
              "在($-\\infty,o)$上递减,在($o,+\\infty)$上递增",
              "在($-\\infty,o)$上递增,在($o,+\\infty)$上递减"
            ],
            "answer": "$D$",
            "analysis": "\n解:$\\because $指数函数$f(x)=a^{x}$在$R$上是减函数,\n$\\therefore 0<a<1,$\n$\\therefore -2<a-2<-1,$\n$\\therefore $二次函数$g(x)=(a-2)x^{2}$的图象开口向下,对称轴是$x=0$;\n$\\therefore g(x)$在区间($-\\infty,0)$上递增,在区间($0,+\\infty)$上递减;\n故选:$D.$\n",
            "type": "单选题",
            "subject": "数学",
            "period": "高中",
            "database": "LUNA题库",
            "id": "cca7710a-e4d1-11eb-abc8-d46a6a0f329c",
            "difficulty": 0.50663,
            "pattern": "text",
            "file_name": null,
            "area": "未知",
            "pastpaper": "非真题"
          },
          {
            "stem": "\n定义在$R$上的函数$f(x)$在区间($-\\infty,2)$上是增函数,且$f(x+2)$的图象关于$y$轴对称,则（   ）\n",
            "options": [
              "$f(0)>f(3)$",
              "$f(0)=f(3)$",
              "$f(-1)=f(3)$",
              "$f(-1)<f(3)$"
            ],
            "answer": "$D$",
            "analysis": "$\\because y=f(x+2)$是由$y=f(x)$向左平移$2$个单位得到,$f(x+2)$的图象关于$y$轴对称\n$\\therefore y=f(x)$的图象关于$x=2$对称则$f(2+x)=f(2-x)$\n$\\therefore f(3)=f(1)$\n而函数$f(x)$在区间($-\\infty,2)$上是增函数,\n$\\therefore f(-1)<f(0)<f(1)=f(3)$\n故选$D.$\n",
            "type": "单选题",
            "subject": "数学",
            "period": "高中",
            "database": "LUNA题库",
            "id": "58c6555a-e4cc-11eb-a817-d46a6a0f329c",
            "difficulty": 0.509959,
            "pattern": "text",
            "file_name": null,
            "area": "未知",
            "pastpaper": "非真题"
          },
          {
            "stem": "\n已知数列{$a_{n}$}是首项为$a_{1}$的等比数列,则能保证$4a_{1},a_{5},-2a_{3}$成等差数列的公比$q$的个数为（   ）\n",
            "options": [
              "$0$",
              "$1$",
              "$2$",
              "$3$"
            ],
            "answer": "$C$",
            "analysis": "$\\because 4a_{1},a_{5},-2a_{3}$成等差数列,\n$\\therefore 2a_{5}=4a_{1}+(-2a_{3}).$\n设数列{$a_{n}$}的公比为$q,$则$a_{5}=a_{1}q^{4},a_{3}=a_{1}q^{2},$\n$\\therefore 2a_{1}q^{4}=4a_{1}-2a_{1}q^{2}.\\because a_{1}\\neq 0,\\therefore q^{4}+q^{2}-2=0,$\n$\\therefore q^{2}=1$或$q^{2}=-2($舍去),$\\therefore q=1$或$q=-1.$\n故选:$C$\n",
            "type": "单选题",
            "subject": "数学",
            "period": "高中",
            "database": "LUNA题库",
            "id": "58cf2d1e-e4be-11eb-b306-d46a6a0f329c",
            "difficulty": 0.510159,
            "pattern": "text",
            "file_name": null,
            "area": "未知",
            "pastpaper": "非真题"
          },
          {
            "stem": "\n长虹网络蓝光电视机自投放市场以来,经过两次降价,单价由原来的$10000$元降到$6400$元,则这种电视机平均每次降价的百分率是（   ）\n",
            "options": [
              "$10\\% $",
              "$15\\% $",
              "$18\\% $",
              "$20\\% $"
            ],
            "answer": "$D$",
            "analysis": "设这种电视机平均每次降价的百分率是$x$\n$\\therefore 10000(1+x)^{2}=6400$\n$\\therefore 1+x=0.8$\n$\\therefore x=0.2$\n$\\therefore $这种电视机平均每次降价的百分率是$20\\% $\n故选$D.$\n",
            "type": "单选题",
            "subject": "数学",
            "period": "高中",
            "database": "LUNA题库",
            "id": "590dd10a-e4c9-11eb-bf0a-d46a6a0f329c",
            "difficulty": 0.491619,
            "pattern": "text",
            "file_name": null,
            "area": "未知",
            "pastpaper": "非真题"
          },
          {
            "stem": "\n已知函数$f(x)=ax+sinx$存在极值点,则实数$a$的取值范围是（   ）\n",
            "options": [
              "$-1<a<1$",
              "$-1\\leq a\\leq 1$",
              "$-1\\leq a\\leq 0$",
              "$0<a<1$"
            ],
            "answer": "$A$",
            "analysis": "求导函数可得f′(x)=a+cosx\n∵函数f(x)=ax+sinx存在极值点,\n∴f′(x)=a+cosx=0有解\n∴a=-cosx\n∴-1≤a≤1\n∵a=±1时,f′(x)≥0\n∴-1<a<1\n故选A.\n",
            "type": "单选题",
            "subject": "数学",
            "period": "高中",
            "database": "LUNA题库",
            "id": "590f57a8-e4c9-11eb-95e3-d46a6a0f329c",
            "difficulty": 0.517432,
            "pattern": "text",
            "file_name": null,
            "area": "未知",
            "pastpaper": "非真题"
          },
          {
            "stem": "\n对于非零向量$a,b,$“$a\\parallel b$”是“$a+b=0$”的（   ）\n",
            "options": [
              "充分不必要条件",
              "必要不充分条件",
              "充要条件",
              "既不充分又不必要条件"
            ],
            "answer": "$B$",
            "analysis": "",
            "type": "单选题",
            "subject": "数学",
            "period": "高中",
            "database": "LUNA题库",
            "id": "591970fe-e4ce-11eb-bafc-d46a6a0f329c",
            "difficulty": 0.506333,
            "pattern": "text",
            "file_name": null,
            "area": "未知",
            "pastpaper": "非真题"
          }
        ]
      }
    },
    methods:{
      Next_Question(){
        this.Visible_Question_Index = (this.Visible_Question_Index+1)%this.Question_List.length
      },
      Get_Card_Background(Question_Index){
          let Style = {
              'background': Question_Index % 2 == 0 ? '#F0F5FB' : 'white',

          }
          return Style
      },
      Get_Card_Margin(Question_Index){
          let Style_Row_0 = '-128px auto 64px auto'
          let Style_Row_1 = '-128px auto 128px auto'
          let Style = {
              'margin': Question_Index == this.Question_List.length - 1 ? Style_Row_0 : Style_Row_1,
              'width': '1344px',
              'display':Question_Index== this.Visible_Question_Index?'block':'none'
          }
          return Style
      },
      Expand_Aim(val){
          console.log(val)
          let Aim = JSON.parse(val).Aim;
          this.Jump_To(Aim)
      }
    }
  }

</script>
<style  scoped lang="scss">
  .container{
    min-height: calc(100vh - 360px);
    margin:228px 206px 0 134px;
  }
  .ques-index{
    height: 50px;
    width: 300px;
    font-family: PingFang SC;
    font-size: 36px;
    font-style: normal;
    font-weight: 500;
    line-height: 50px;
    letter-spacing: 0.03em;
    text-align: left;
    display:flex;
    justify-content:center;
    align-items:center;
    div{
      display: inline-block;
      // height:50px;
      // vertical-align: center;
    }
    .sm-font{
      margin-left:8px;
      font-family: Noto Sans SC;
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: 23px;
      letter-spacing: 0px;
      text-align: 'center';
    }
  }
  .ques-btn{
    float: left;
    height: 48px;
    width: 164px;
    margin-top:50px;
    border-radius: 6px;
    border:none;
    padding: 8px, 32px, 8px, 32px;
    background: linear-gradient(90deg, #65A1E6 0%, #3E89E0 100%);
    box-shadow: 0px 1px 2px 0px #0000001F;
    color:#fff;
    font-family: Noto Sans SC;
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    line-height: 26px;
    letter-spacing: 0em;
    text-align: center;
  }
  .submit-btn{
    background: linear-gradient(90deg, #4FD78D 0%, #4FBE46 100%);
  }
  .ques-index,.btn{
    padding-left: 30px;
  }

</style>
