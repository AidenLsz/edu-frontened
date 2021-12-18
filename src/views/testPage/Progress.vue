<template>
  <div class="Percentage_DIV" align="center">
    <div class="Percentage_Area">
      <el-progress 
        :percentage="Percentage_Now_Inner"
        :stroke-width="16"
        color="#539DD9"
        :show-text="false">

      </el-progress>
      <label class="Loading_Label">{{Loading_Text}}</label>
    </div>
  </div>
</template>

<script>

export default {
  name: "",
  props:{
    Percentage_Now:{
      type: Number,
      default: 0
    },
    Duration_Time:{
      type: Number,
      default: -1
    },
    Full_Count: {
      type: Number,
      default: -1
    },
    Now_Count: {
      type: Number,
      default: -1
    },
    Loading_Text: {
      type: String,
      default: "加载中，请稍后..."
    }
  },
  components:{
      
  },
  data() {
    return {
      Progress_Interval: "",
      Percentage_Now_Inner: this.Percentage_Now,
      Duration_Time_Inner: this.Duration_Time,
    }
  },
  destroyed(){

  },
  computed:{
      
  },
  mounted(){
    this.Progress_Go();
  },
  watch:{
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
    Progress_Go(){
      this.Percentage_Now_Inner = 0;

      if(this.Duration_Time == -1){
        this.Progress_Interval = setInterval(()=>{
          this.Percentage_Now_Inner = (this.Now_Count / this.Full_Count) * 100;
        }, 10)
      }else{
        this.Progress_Interval = setInterval(()=>{
          this.Percentage_Now_Inner = this.Percentage_Now_Inner + 1/this.Duration_Time_Inner;
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
}

.Loading_Label{
  margin-top: 10px;
  font-size: 16px;
  color: #0A4A6E;
}
</style>