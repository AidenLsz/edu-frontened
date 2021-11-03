<template lang="html">
  <div style="overflow: visible;">
    <div class="tab panel-btn" id="openBtn" @click="openPanel()">
      <div>
        <div><i class="el-icon-d-arrow-right"></i></div>
        <div>多题切分结果</div>
      </div>
    </div>
    <el-card class="box-card" id="res" style="padding:0px">
      <div class="tab panel-btn" id="closeBtn" @click="closePanel()">
        <div>
          <div><i class="el-icon-d-arrow-left"></i></div>
          <div>多题切分结果</div>
        </div>
      </div>
      <div class="container"
            style=""
            v-loading="File_Uploading"
            element-loading-text="加载中，请等待..."
            element-loading-spinner="el-icon-loading">
          <el-row
            v-if="Paper_Content.length!=0"
            style="height: 30px; padding-top: 15px; padding-bottom: 15px; cursor: pointer;position:relative">
              <div style="position:absolute;top:25px;right:30px;z-index:2003">
                <el-button
                    class="copy-btn"
                    @click="copy($event,-1)"
                    data-clipboard-text="llllll"
                    >
                    <div class="">
                      <i class="el-icon-copy-document"></i>复制
                    </div>
                </el-button>
                <el-button
                    class="search-btn"
                    @click="search(-1)">
                    <div class="">
                      <i class="el-icon-search"></i>搜索
                    </div>
                </el-button>
              </div>
          </el-row>
          <el-row
            v-for="(Item, Item_Index) in Paper_Content"
            :key="'Line_' + Item_Index">
              <el-col style="padding-right:30px;">
                <el-row
                  v-if="Item == 'DIVIDER_LINES'"
                  style="height: 30px; padding-top: 15px; padding-bottom: 15px; cursor: pointer;position:relative">
                  <div style="position:absolute;top:25px;right:0px;z-index:2003">
                    <el-button
                        class="copy-btn"
                        @click="copy($event,Item_Index)">
                        <i class="el-icon-copy-document"></i>复制
                    </el-button>
                    <el-button
                        class="search-btn"
                        @click="search(Item_Index)">
                        <i class="el-icon-search"></i>搜索
                    </el-button>
                  </div>
                  <el-col>
                    <el-row
                      @click.native="Delete_Divider(Item_Index)"
                      @mouseenter.native="Paper_Divider_Index = Item_Index"
                      @mouseleave.native="Paper_Divider_Index = -1"
                      :style="'border-top: 2px dashed ' + (Paper_Divider_Index == Item_Index ? 'red' : '#ccc') + '; width: 100%;'"></el-row>
                  </el-col>
                </el-row>
                <el-row :id ="'Item_'+Item_Index" v-if="Item != 'DIVIDER_LINES'&& Item.para_type == '0'" :style="Item.para_style">
                  <span
                    v-for="(message, index_i) in Item.runs"
                    :key="'Line_' + Item_Index + '_' + index_i + '_run'"
                    :style="message.run_style"
                  >
                    <span
                      v-if="message.run_type == '0'"
                      v-html="message.run_text"
                    ></span>
                    <img
                      v-else-if="message.run_type == '1'"
                      :src="Paper_Image_Dict[message.image.src]"
                      :width="message.image.width"
                      :height="message.image.height"
                      :style="message.image.style"
                      :alt="message.image.alt"
                    />
                  </span>
                </el-row>
                <el-row :id ="'Item_'+Item_Index" v-if="Item != 'DIVIDER_LINES' && Item.para_type == '1'">
                  <div :style="Item.para_style">
                    <span v-html="Table_Img_Get(Item.table_raw_html)"></span>
                  </div>
                </el-row>
                <el-row
                  :id ="'Item_'+Item_Index"
                  v-if="Item != 'DIVIDER_LINES' && Item_Index != Paper_Content.length - 1 && Paper_Content[Item_Index + 1] != 'DIVIDER_LINES'"
                  style="height: 14px; width: 100%; padding-top: 6px; cursor: pointer;"
                  @click.native="Add_Divider(Item_Index)"
                  @mouseenter.native="Paper_Divider_Index = Item_Index"
                  @mouseleave.native="Paper_Divider_Index = -1">
                  <el-col>
                    <el-row v-show="Paper_Divider_Index == Item_Index" style="border-top: 2px dashed #409EFF; width: 100%;"></el-row>
                  </el-col>
                </el-row>
              </el-col>
          </el-row>
        </div>
      <div ref="searchQues" id="searchQues"></div>
    </el-card>
  </div>
</template>

<script>
import $ from 'jquery'
import Clipboard from 'clipboard'
import html2canvas from "html2canvas"

export default {
  data() {
    return {
      // 用于存放拿来显示的变量
      Paper_Content: [],
      // 用来进行初始结果的备份
      Paper_Content_BackUp: [],
      // 存放拿来进行显示的图片
      Paper_Image_Dict: {

      },
      // 标记切分点的变量
      Paper_Divider_Index: -1,
      // 是否正在等待文件切分完成
      File_Uploading: false,
      // File_Uploading: true,
    };
  },
  components:{
  },
  methods:{
    // 外面点一下重置题目聚焦
    openPanel() {
      $('.box-card').animate({
        left: '120px',
        opacity: 1
      },'easeInOutExpo')
      $('#openBtn').hide()
      $('#closeBtn').show()
    },
    closePanel(){
      $('.box-card').animate({
        left: '-100%',
        opacity: 0,
      }, 'easeInOutExpo')
      $('#openBtn').show()
      $('#closeBtn').hide()

    },
    uploadAndCut(formData, config) {
      this.openPanel()
      this.Paper_Content=[]
      this.File_Uploading=true;
      this.$http
        .post("https://file-upload-backend-88-production.env.bdaa.pro/v1/paperProcessing/upload", formData, config)
        .then(function(data) {
          this.Paper_Content = data.data.paper
          this.Paper_Image_Dict = data.data.image_dict
          let Lists = []
          for(let i = 0; i < data.data.paper.length; i++){
            let Para = data.data.paper[i].sub_para[0]
            for(let j = 0; j < Para.length; j++){
              Lists.push(Para[j])
            }
            if(i != data.data.paper.length - 1){
              Lists.push("DIVIDER_LINES")
            }
          }
          this.Paper_Content = Lists
          this.Paper_Content_BackUp = Lists
        }).catch(() => {
          this.$alert("切分过程出现错误，这可能是由于服务器原因导致目前暂时无法提供服务，请重新提交文件或稍后再试。", "提示")
        }).finally(()=>{
          this.File_Uploading=false;
        });
    },
    // 替换表格中的图片内容
    // 更新表格中的图片文件
    Table_Img_Get(Table_Html){
      for(var key in this.Paper_Image_Dict){
        var Img_Name_Catcher = new RegExp('<img src="' + key + '"')
        if(Img_Name_Catcher.exec(Table_Html) != null){
          Table_Html = Table_Html.replace(Img_Name_Catcher,'<img src="' + this.json_content.img[key] + '"')
        }
      }
      return Table_Html
    },
    Add_Divider(Item_Index){
      this.Paper_Content.splice(Item_Index + 1, 0, 'DIVIDER_LINES')
      this.Paper_Divider_Index = -1;
    },
    // 尝试添加和删除切分线
    Delete_Divider(Item_Index){
      this.Paper_Content.splice(Item_Index, 1)
      this.Paper_Divider_Index = -1;
    },
    copy(e,text){
      const clipboard = new Clipboard(e.target, { text: () => this.Get_Content_By_Id(text).join(' ')})
      clipboard.on('success', () => {
        this.$message({
          message: '复制qustion_ID成功',
          type: 'success'
        });
        // 释放内存
        clipboard.off('error')
        clipboard.off('success')
        clipboard.destroy()
      })
      clipboard.on('error', () => {
        // 不支持复制
        this.$message({ type: 'warning', message: '该浏览器不支持自动复制' })
        // 释放内存
        clipboard.off('error')
        clipboard.off('success')
        clipboard.destroy()
      })
      clipboard.onClick(e)
    },
    Get_Content_By_Id(Item_Index){
      let Reg_C = new RegExp('&#xa0;', 'g')
      let ItemContent=[]
      for (var i = Item_Index+1; i < this.Paper_Content.length; i++) {
        if (this.Paper_Content[i]=='DIVIDER_LINES') {
          break;
        }
        // 0 代表文字和图片内容
        // 1 代表试卷中的表格内容（不太清楚要怎么办，但总之应该是这么返回才对……吧？）
        if(this.Paper_Content[i].para_type == '0'){
          let Content = ""
          for(let j = 0; j < this.Paper_Content[i].runs.length; j++){
            if(this.Paper_Content[i].runs[j].run_type == '0'){
              Content = Content + this.Paper_Content[i].runs[j].run_text
            }else if(this.Paper_Content[i].runs[j].run_type == '1'){
              Content = Content
                + "<img src='" + this.Paper_Image_Dict[this.Paper_Content[i].runs[j].image.src] + "' "
                + " width='" + this.Paper_Content[i].runs[j].image.width + "' "
                + " height='" + this.Paper_Content[i].runs[j].image.height + "' "
                + " style='" + this.Paper_Content[i].runs[j].image.style + "' "
                + " alt='" + this.Paper_Content[i].runs[j].image.alt + "' "
                + ">"
            }
          }
          Content = Content.replace(Reg_C, "")
          ItemContent.push(Content)
        }else{
          ItemContent.push(this.Table_Img_Get(this.Paper_Content[i].table_raw_html))
        }
      }
      return ItemContent
    },
    search(Item_Index){
      this.closePanel();
      let ItemContent = this.Get_Content_By_Id(Item_Index).join(' ')
      if(!ItemContent.includes('data:image/png;')){
        this.$emit('search',ItemContent,'文字检索')
        return
      }
      let html="<div>"
      for (var i = Item_Index+1; i < this.Paper_Content.length; i++) {
        if (this.Paper_Content[i]=='DIVIDER_LINES') {
          break;
        }
        html+=$('#Item_'+i).html()
        html+="<br>"
      }

      html+="</div>"
      $('#searchQues').html(html)
      this.$nextTick(()=>{
        html2canvas(this.$refs.searchQues).then(canvas => {
          // console.log(canvas);
          // 转成图片，生成图片地址
          $('#searchQues').html("")
          this.$emit('search',canvas.toDataURL("image/png"),'ImgSearch')
        });
      })
    },
  }
}
</script>

<style lang="scss" scoped>
#res ::v-deep.el-card__body {
  padding: 0px;
}
.container {
  display: flex;
  width:100%;
  padding:55px 37px;
  height: 77vh;
  flex-flow: column;
  overflow-y: scroll;
  border-radius: 15px;
}
.box-card {
  position: fixed;
  overflow: visible;
  top: 134px;
  // background: rgba(248,251, 255, .9);
  background: rgba(255, 255, 255, 0.95);
  width: 792px;
  height: 80vh;
  left: -100%;
  // z-index: 2001;
  opacity:0;
}
.panel-btn{
  font-size: 30px;
  font-weight:bold;
  color: #bbb;
}
#openBtn{
  z-index:2002;
  top:134px;
}
#closeBtn{
  // z-index:2002;
  position: absolute;
  top:0;
  // position: fixed;
  right:-48px;
}
.tab
{
    position: absolute;
    // left:0;
    width: 48px;
    height: 182px;
    border-radius: 0px 10px 10px 0px;
    background-color: #eef1f7;
    cursor:default;
    >div{
      width: 16px;
      margin: 8px auto;
      color:#000000;
      font-family: "Sarasa Gothic SC";
      font-style: normal;
      font-weight: normal;
      font-size: 18px;
      line-height: 22px;
      align-items: center;
      text-align: center;
    }
}
.search-btn,.copy-btn{
  margin-right:5px;
  padding:0px 15px;
  width: 80px;
  height: 40px;
  font-family: "Sarasa Gothic SC";
  font-size: 16px;
  line-height: 19px;
  border-radius: 8px;
  // display: flex;
  // align-items: center;
  // text-align: center;
}
.search-btn{
  background-color:#539DD9;
  color: #FFFFFF;
}
.copy-btn{
  background-color: #fff;
  color: #082135;
  border: 1px solid rgba(0, 0, 0, 0.14)
}
</style>
