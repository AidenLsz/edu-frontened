<template>
  <!-- 展开栏 -->
  <el-row
    type="flex"
    justify="start"
    v-on:click.native="show = !show"
    class="Part_Row_Style"
  >
    <el-col :span="14" style="text-align: left; line-height: 30px">
      <el-row type="flex" justify="start">
        <i
          class="el-icon-arrow-up"
          v-if="show"
          style="font-size: 24px; line-height: 30px; margin-right: 20px"
        ></i>
        <i
          class="el-icon-arrow-down"
          v-else
          style="font-size: 24px; line-height: 30px; margin-right: 20px"
        ></i>
        {{ title }}
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      show: true,
    };
  },
  watch: {
    show() {
      setTimeout(() => {
        this.$emit("ChangeShow");
      }, 10);
    },
  },
};
</script>

<style>
.Part_Row_Style {
  border-left: 15px solid #409efd;
  background: rgba(240, 245, 251, 0.45);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  width: 90%;
  margin: 5px 0 20px 6%;
  padding-left: 30px;
  font-size: 1.5rem;
  font-weight: bold;
  padding-top: 5px;
  padding-bottom: 5px;
  cursor: pointer;
}
</style>