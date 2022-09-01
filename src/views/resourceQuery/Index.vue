<template>
  <div class="Normal_Home_Page">
    <section class="main_area" >
      <el-row type="flex" justify="center" >
        <div style="display: inline-block">
          <img src="@/assets/LUNA-HOMEPAGE-LOGO.png" class="Home-Page-Icon" draggable="false" >
        </div>
        <div style="display: inline-block; padding-top: 10px">
          <div class="Search-Page-Word">LUNA智慧搜索</div>
        </div>
      </el-row>
      <el-row type="flex" justify="center">
        <div class="Search_Area">
        <div class="Self_Input_Area_Left" align="left">
          <img class="search-icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABHNCSVQICAgIfAhkiAAAAe9JREFUOI2llK9uG0EQh7/Z+8MiGRpWakBIQUGZwUUqcs93CywVlBTEzC8QkIeo1CrApIFRFenOjVxSqWaxlD5AQSMFHigIKfLppsBrdxM5btwMmpvZ/e43OzsrrLE8z18Cr4EEaLtwBUyB07Isv67bByD+R6/X2zPGHDvQJpuq6mA8Hv+8mzBLJ03TjjHmwsEqVT0yxjyL43gnjuMdEXmuqkdOaSIil2madtYqdMougBZwJiIHRVHcrJNmrW01TfNRRHLgRlVf+EpDAFdmCzgry7K/qVb3I5tlWSEiuYiMgP1Vya4BCVCJyMEmmG/GmLfALyCx1iarOItuoqof7ivzPqWq+s7tfeMDE4AgCIqHwjyV5869pbANEIbh9bbAKIqWzVje1b/X5jGmqqEPrADqun6yLWg+n+8CiMi1D5wCNE2T/4eyV86d+cBT5w+tta2HwtzaoVN4sgK6QZ8CbVUdbaFuxKIZs6Iopst46JIDEbkE+nmefxKRwabRc7C+U3fo51evTZqmnSAIPgMtVa1E5L0x5jwMwyuAuq6fNk2TqupQRNoe48d8Pt+fTCbVLSBAlmW7bjaTf1Q8E5FDVT0G9nyorFttrU3cOCUszjZ0V2MmIifLM+t2u+0oir750LXAbewO9PujgR70i6r+/gMy8ssS6oH9AwAAAABJRU5ErkJggg==">
        </div>
        <div class="Self_Input_Area_Middle" align="left">
          <input
              class="Self_Input"
              placeholder="三角函数"
              >
        </div>
        <div class="Self_Input_Area_Right" align="right">
          <img class="camera-icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAUCAYAAACXtf2DAAAABHNCSVQICAgIfAhkiAAAAexJREFUOI2tlD2LE0EYx3/P5TDZmG2yrUW6dBYzFqeckMLr7r6DheB1ovEg1hbhuAQ8bE7wW5zloaAnXuHuZ8gXWAhsYMISeCyciIbsxIh/GBiel//zOiME0Ol0GkmSfAL2Kkyu8zw/mEwm8yqOnVCAJEleB8gB9r1NJaRKYYzZE5EvAKr6MMuym230vwL0er3doiiGqnosIq01NuM0TV+uc7bWjoD+qlxVZyJyEcfxq1q73R6LyAsRubWG42ue54+n0+liXYB6vf652WweAHf+yPon14OyLJtijClEpKWq96vK3Ba+fd9UdSbWWgVI0zQ0j0MR6avqPS+6Ac6zLPtQ5bPkDW6RNxyKyCXQE5GWP49E5NJaO9zkHwxgjDkEBsBCVZ8752LnXAycAAtg4G0qsRtSikgfQFVPsix785tqZK0FOAOeAZWtClaw7Pl8Pn+/qnPOXfhr6CGGA4hUzv2vbTYN+TtAo9F4sqqIougYQFWDqx2cgaqORaQnImfW2ppz7p0nfwosN+g8xBGswO/5qU9kFEVREUVRAYy87DT0FjYGAEjTdKCqR6p6BcyAmapeqepRmqaDTf7BFq1UEsy0Cjs+K4wxwXXbBtbafX+dSdWX+58wrnW73Y9lWd4G7gLrvux/wQx4G8fx4Adr071MaxOQ/gAAAABJRU5ErkJggg==">
        </div>
        </div>
      </el-row>
      <el-row type="flex" justify="center">
        <div class="choose-card" v-for="(item,index) in source_options" :key="index"
             :style="{'active':selected.indexOf(item)!=-1}" @click="active(index,item)">
          <div class="sourceButton">
            <span>{{item.name}}</span>
          </div>
        </div>
        <div class="choose-card">
          <div class="advance_filter">
            <img class="filter-icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAOCAYAAADwikbvAAAABHNCSVQICAgIfAhkiAAAASNJREFUKJG10LFKQnEUx/Hv8X9HB4ceoMCh8cJ1SAj6N+ni0NAD+Ag9Sz1CbYJDS0IhkVDL1f9eY0FDgugdGtJfQzfQssyh33YO58M5HEuS5B4os34eI0lXZlYG7iR1VgkzqwE7QMe891GWZReS9oD9NE17P8EkSXaBrpldF4vFugHEcVxyzt0CG5Kq/X7/YQncBm6Al+l0Wg0hjAoAIYSRpEZ+1nkcx6V5mNdt4E1SI4QwAih8DuTbDoCyc67tvY8AvPeRc67Nx1MP568qzG9I07QnqQn4yWRyDDAej08AL6n59R8LOL/gFGhJquetGtDK+wv5hvNkK+pf8Z/yP9jMSpVKxa+NZ7PZGfAqqWtmm2vhwWBwORwOtyQdAc+SnpbNvQPTbX9bJ2hRdgAAAABJRU5ErkJggg==">
          </div>
        </div>

      </el-row>
    </section>
  </div>
</template>

<script>
export default {
  name: "Index",
  data() {
    return {
      source_options: [
        {name:"知识点"},
        {name:"试题"},
        {name:"试卷"},
        {name:"教辅教材"}
      ],
      selected: [],
    }
  },
  methods: {
    active(index,item){
      // this.selected.indexOf(item) 判断item下标是否为-1，
      // 是-1则数组中匹配不到该数据，添加
      // 不是-1则说明匹配到了，抹除
      if (this.selected.indexOf(item) !== -1) {
        this.selected.splice(this.selected.indexOf(item), 1); //取消
      } else {
        this.selected.push(item);//选中添加到数组里
      }
      console.log(JSON.parse(JSON.stringify(this.selected)));
    }
  },
}
</script>

<style scoped>
.Normal_Home_Page{
    /*height: 100%;*/
    /*width: 100%;*/
}
.main_area {
  min-width: 768px;
  height: 900px;
  padding-top: 180px;
  left: 80px;
  text-shadow: 1px 4px 4px 0px rgba(0, 0, 0, 0.12);
}
.main_area::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  z-index: -1;
}
.Home-Page-Icon {
  width: 84px;
  height: 84px;
  user-select: none;
  cursor: pointer;
  /*box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.12);*/
  /*z-index: 0*/
}

.Home-Page-Icon[lazy='loaded'] {
  animation-duration: .1s;
}
.Search-Page-Word{
  font-family: Sarasa-Gothic-SC-Semibold;
  font-size: 32px;
  font-weight: 600;
  line-height: 56px;
  letter-spacing: 0.05em;
  color: #444444;
  text-shadow: 1px 4px 4px 0px rgba(0, 0, 0, 0.12);
  z-index: 1
}
.Search_Area{
  display: inline-block;
  background: #F5F6F7;
  vertical-align: top;
  margin-top: 54px;
  box-shadow: 0px 6px 32px 0px rgba(0, 0, 0, 0.12);
  border-radius: 32px;
}
.Self_Input_Area_Left{
  height: 64px;
  width: 50px;
  background: #F5F6F7;
  border-radius: 32px 0px 0px 32px;
  display: inline-block;
  vertical-align: top;
}

.Self_Input_Area_Middle{
  height: 64px;
  width: 540px;
  background: #F5F6F7;
  padding-left: 5px;
  display: inline-block;
  vertical-align: top;
}

.Self_Input_Area_Right{
  height: 64px;
  width: 128px;
  background: #F5F6F7;
  border-radius: 0px 32px 32px 0px;
  display: inline-block;
  vertical-align: top;
}
.Self_Input{
  border: none;
  outline: none;
  height: 64px;
  /*width: 420px;*/
  background: #F5F6F7;
  font-family: Sarasa-Gothic-SC-Semibold;
  font-size: 18px;
  font-weight: 600;
  line-height: 22px;
  letter-spacing: 0em;
  color: #737373;
  z-index: 1;
  display: inline-block;
}
.search-icon{
  font-size: 20px;
  margin-top: 23px;
  margin-right: 23px;
  margin-left: 20px;
  left: 2px;
  top: 2px;
  width: 20px;
  height: 20px;
}
.camera-icon{
  font-size: 20px;
  margin-top: 23px;
  margin-right: 23px;
  margin-left: 20px;
  left: 0px;
  top: 2px;
  width: 24px;
  height: 20px;
}
.filter-icon{
  left: 2.25px;
  top: 3.38px;
  width: 15px;
  height: 13px;
  /*border: 1.5px solid #333333;*/
}
.choose-card{
  margin-top: 40px;
  height: 42px;
  display: inline-block;
  padding: 0px;
}
.sourceButton{
  margin-left: 16px;
  height: 42px;
  display: inline-block;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 6px 16px;
  border-radius: 1000px;
  background: #F2F3F7;
  cursor: pointer;
  font-family: Sarasa-Gothic-SC-Semibold;
  line-height: 30px;
  font-weight: 600;
  letter-spacing: 0.05em;
  z-index: 0
}
.sourceButton_selected{
  margin-left: 16px;
  height: 42px;
  display: inline-block;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 6px 16px;
  border-radius: 1000px;
  background: #608DE8;
  cursor: pointer;
  font-family: Sarasa-Gothic-SC-Semibold;
  line-height: 30px;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: #FFFFFF;
  z-index: 0
}
.advance_filter{
  margin-left: 16px;
  height: 42px;
  display: inline-block;
  justify-content: center;
  align-items: center;
  padding: 12px 16px;
  border-radius: 1000px;
  background: #F2F3F7;
  z-index: 4
}
.word-style{
  font-family: Sarasa-Gothic-SC-Semibold;
  line-height: 30px;
  font-weight: 600;
  letter-spacing: 0.05em;
}
.bgcolor{
  background: #608DE8; ;
}
.Self_Search_Button{
  width: 100%;
  height: 64px;
  margin: 0px;
  background: linear-gradient(to right, #7BAFEE, #7786EB);
  color: white;
  font-size: 20px;
  border: 3px solid white;
  border-radius: 32px;
}

.Self_Search_Button:active{
  transform: scale(0.95);
  transition: all ease 300ms;
}
.Top_Nav{
  position: relative;
  top: -90px;
  width: 10px;
  height: 10px;
  background: transparent;
}

.Temp_Label{
  font-size: 48px;
  filter: drop-shadow(1px 4px 4px rgba(0, 0, 0, 0.12));
}
</style>
