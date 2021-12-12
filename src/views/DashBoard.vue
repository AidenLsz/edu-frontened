<template lang="html">
  <div>
  <div id="Top_Nav" class="Top_Nav"></div>
  <statistics/>
  </div>
</template>

<script>
import statistics from "@/common/components/statistics";
export default {
  components: {
    statistics,
  },
  mounted() {
    //要等到子组件渲染完再跳
    setTimeout(() => {
      this.To_Top();
    }, 100);
  },
  methods: {
    To_Top() {
      console.log("aaa");
      document
        .getElementById("Top_Nav")
        .scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      console.log("bbb");
    },
  },
};
</script>

<style lang="css" scoped>
.Top_Nav {
  position: relative;
  top: -90px;
  width: 10px;
  height: 10px;
  background: transparent;
}
</style>
