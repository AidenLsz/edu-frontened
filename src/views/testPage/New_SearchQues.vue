<template>
    <div>
        <div class="Test">

        </div>
        <div style="width: 100%; border: 1px solid blue; height: 50px; line-height: 50px;">
            123123123<br>
            123123123
        </div>
    </div>
</template>

<script>

export default {
  name: "",
  components:{
      
  },
  data() {
    return {

    }
  },
  destroyed(){

  },
  computed:{
      
  },
  mounted(){

  },
  methods: {

  }
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.Test{
    position: fixed;
    background: rgba($color: white, $alpha: 1);
    border: 1px solid red;
    height: 50px;
    width: 100%;
}

@media screen and (max-width: 800px) {
  .Test{
      position: fixed;
      background: rgba($color: black, $alpha: 1);
      border: 1px solid red;
      height: 50px;
      width: 100%;
  }
}
</style>