// 为了进度条的需求专门写的简单组件，现在暂时有持续时间式和分数式两种进度
// 后续根据使用需要，比如进度条想在外部计算，或者根据下载文件的总大小计算下载进度等等需求，可能会再扩充

<template>
  <!-- class的部分很容易理解，就不写注释了 -->
  <!-- 外部大框，把z-index拉满，强行遮盖所有其他组件来防止误操作 -->
  <div class="Percentage_DIV" align="center">
    <!-- 实际进度条的区域部分 -->
    <div class="Percentage_Area">
      <!-- 进度条的部分 -->
      <el-progress 
        :percentage="Percentage_Now_Inner"
        :stroke-width="16"
        color="#539DD9"
        :show-text="false">

      </el-progress>
      <!-- 说明文字的部分 -->
      <div>
        <div style="display: inline-block; padding-bottom: 4px;">
          <div class="Side_Line Line_Left">

          </div>
        </div>
        <div style="display: inline-block; padding-bottom: 8px;">
          <label class="Loading_Label">{{Loading_Text}}</label>
        </div>
        <div style="display: inline-block; padding-bottom: 4px;">
          <div class="Side_Line Line_Right">

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "",
  props:{
    // 默认的比例，如果后续有类似文件下载进度条之类的可以留一下
    // 目前就是一个提供default的作用
    Percentage_Now:{
      type: Number,
      default: 0
    },
    // 默认设置的持续时间，如果是-1，则表示要用的是分数式（如1/2，2/2）的进度
    // 单位是秒
    Duration_Time:{
      type: Number,
      default: -1
    },
    // 分数式百分比的分母部分，设置一次即可
    Full_Count: {
      type: Number,
      default: -1
    },
    // 分数式百分比的分子部分，调用时需要用.sync进行同步
    Now_Count: {
      type: Number,
      default: -1
    },
    // 文字区域显示的文字部分，可以自行设置
    Loading_Text: {
      type: String,
      default: "加载中，请稍后..."
    }
  },
  components:{
      
  },
  data() {
    return {
      // 用于持续时间和分子更新的Interval的保存
      Progress_Interval: "",
      // 把百分比保存到组件内部进行使用，避免和使用这一组件的组件产生不必要的冲突
      // 可能以后会根据进度是外部计算还是内部计算来进行一定的调整
      Percentage_Now_Inner: this.Percentage_Now,
    }
  },
  destroyed(){

  },
  computed:{
      
  },
  mounted(){
    // 渲染完成时使其开始运行
    this.Progress_Go();
  },
  watch:{
    // 如果进度条走满了，那么首先清除Interval，然后发送加载结束的事件，由调用它的组卷决定是关闭还是进行后续操作
    Percentage_Now_Inner(newVal){
      if(100 - newVal < 0 || Math.abs(newVal - 100) < 1){
        clearInterval(this.Progress_Interval);
        setTimeout(()=>{
          this.$emit("Finish_Loading", true);
        }, 500)
      }
    }
  },
  methods: {
    // 进度条运行
    Progress_Go(){
      // 为了避免数据残留，先把进度条监听的数据置0
      this.Percentage_Now_Inner = 0;
      // 通过Duration_Time是否为-1来判断是使用持续时间模式还是分数式
      // 根据不同情况设置不同的Interval
      if(this.Duration_Time == -1){
        this.Progress_Interval = setInterval(()=>{
          this.Percentage_Now_Inner = (this.Now_Count / this.Full_Count) * 100;
        }, 10)
      }else{
        this.Progress_Interval = setInterval(()=>{
          this.Percentage_Now_Inner = this.Percentage_Now_Inner + 1/this.Duration_Time;
        }, 10)
      }
    }
  }
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.Percentage_DIV{
  position: absolute;
  width: calc(100% - 16px);
  height: 100vh;
  top: 0%;
  left: 0%;
  background: rgba($color: #ccc, $alpha: 0.6);
  z-index: 9999;
}

.Percentage_Area{
  max-width: 1192px;
  margin: 40vh 64px;
  height: 136px;
  padding-top: 44px;
  padding-left: 96px;
  padding-right: 96px;
  background: #92D0F4;
  border-radius: 16px;
  background: #FFFFFF;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25), inset 0px 4px 8px rgba(0, 0, 0, 0.12);
}

.Loading_Label{
  margin-top: 10px;
  padding-top: 16px;
  font-size: 16px;
  color: #0A4A6E;
  margin-left: 21px;
  margin-right: 21px;
}

.Side_Line{
  width: 75px;
  height: 2px;
  border-radius: 1px;
}

.Line_Left{
  background: linear-gradient(-90deg, #539DD9 0%, #7BABD2 64.06%, rgba(196, 196, 196, 0) 100%, #539DD9 100%);
}

.Line_Right{
  background: linear-gradient(90deg, #539DD9 0%, #7BABD2 64.06%, rgba(196, 196, 196, 0) 100%, #539DD9 100%);
}
</style>