<template lang="html">
  <!-- 题库选择 -->
  <el-row style="padding-top: 8px; height: 40px;"
  :gutter="20" type="flex" justify="start">
    <div style="margin-left:10px;line-height: 30px;">
      请选择要查询的数据库：
    </div>
    <template v-for="(item,i) in database_list">
      <div :key="i" style="margin-left:10px;">
        <span :class="Check_Focus_Database(i)" @click="Database_Aim(i)">
          {{item.nick || item.name}}
        </span>
      </div>
    </template>
  </el-row>
</template>

<script>
import {commonAjax} from '@/common/utils/ajax'

export default {
  data(){
    return {
      // 存放将要查询的数据库名称
      database_aim: [],
      database_list:[],
    }
  },
  mounted(){
    this.initDatabaseList()
    this.$nextTick(()=>{
      this.Emit_Database_Change()
    })
  },
  methods:{
    initDatabaseList(){
      this.database_list=[{name:'public',nick:'公共题库'}]
      this.database_aim=[true]
      //未登录时，不调用获取题库的端口
      if(!this.$store.state.user.token){
        return ;
      }
      commonAjax(this.backendIP+'/api/get_user_ig_name',
        {
          type:'Question',
          action:'R',
        }
      ).then((res)=>{
        let data=res.ig_name;
        for (var i = 0; i < data.length; i++) {
          this.database_list.push({name:data[i], nick: data[i]})
          this.database_aim.push(false)
        }
      })
    },
    Database_Aim(Index){
      this.database_aim.splice(Index, 1, !this.database_aim[Index])
      this.Emit_Database_Change()
    },
    Emit_Database_Change(){
      var database_list = [];
      for(var i = 0; i < this.database_aim.length; i++){
        if(this.database_aim[i]){
          database_list.push(this.database_list[i].name)
        }
      }
      this.$emit('databaseChange',database_list)
    },
    Check_Focus_Database(Index){
      if(this.database_aim[Index]){
        return "focusDatabase"
      }else{
        return "unFocusDatabase"
      }

    },
  }
}
</script>

<style lang="scss" scoped>
.focusDatabase{
  background: #409EFF;
  color: white;
}
.unFocusDatabase{
  background: #F8FBFF;
  color: #409EFF;
  border: 1px solid #409EFF;
}
.focusDatabase,.unFocusDatabase{
  border-radius: 15px;
  padding: 0px 15px;
  height: 30px;
  line-height: 30px;
  float: left;
  text-align: center;/*让文字水平居中*/
}
</style>
