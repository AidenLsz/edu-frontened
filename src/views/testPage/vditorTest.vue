<template>
  <div style="margin-left: 5vw; margin-right: 5vw; margin-top: 6vh">
    <el-row type="flex" justify="start">
      <el-col :span="Symbol_Switch ? 18 : 24">
          <div id="vditor" name="description" style="width: 100%"></div>
      </el-col>
      <el-col :span="Symbol_Switch ? 6 : 0">
        <el-row type="flex" justify="center" style="width: 100%; height: 498px; border: 1px solid black; line-height: 498px">
          <span v-show="Symbol_Switch">给可能的自定义公式插入位置描个边</span>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Vditor from "vditor";
import "vditor/src/assets/scss/index.scss";
export default {
    data(){
        return{
            contentEditor: {},
            Symbol_Switch: true,
            // echarts如何实现插入
            defaultString: '{"title": {"text": "某站点用户访问来源","subtext": "纯属虚构","left": "center"},"tooltip": {"trigger": "item"}, "series": [{"name": "访问来源","type": "pie", "radius": "50%", "data": [{"value": 1048, "name": "搜索引擎"},{ "value": 2000, "name": "谁知道呢"}]}]}'
        }
    },
    mounted(){

        const _this = this;

        this.contentEditor = new Vditor('vditor', {
          height: 500,
          placeholder: '此处为话题内容……',
          theme: 'classic',
          counter: {
            enable: true,
            type: 'markdown'
          },
          preview: {
            delay: 0,
            hljs: {
              style: 'monokai',
              lineNumber: true
            }
          },
          tab: '\t',
          typewriterMode: true,
          cache: {
            enable: false
          },
          mode: 'ir',
          toolbar: [
            'emoji',
            'headings',
            'bold',
            'italic',
            'strike',
            'link',
            '|',
            'list',
            'ordered-list',
            'check',
            'outdent',
            'indent',
            '|',
            'quote',
            'line',
            'code',
            'inline-code',
            'insert-before',
            'insert-after',
            '|',
            // 'record',
            'table',
            '|',
            'undo',
            'redo',
            '|',
            'edit-mode',
            // 'content-theme',
            'code-theme',
            'export',
            {
                name: 'more',
                toolbar: [
                    // 'fullscreen',
                    'both',
                    'preview',
                    'info',
                    'help',
                    {
                      "hotkey": "",
                      "name": "fulls22",
                      "tipPosition": "n",
                      "tip": "自定义按钮（显示/隐藏右侧区域）",
                      "className": "right",
                      "icon": "<img src='favicon.ico' width='20' height='20'>",
                      click(){
                        _this.Symbol_Switch = !_this.Symbol_Switch
                      }
                    }
                ],
            },
            {
              "hotkey": "",
              "name": "selfmade",
              "tipPosition": "n",
              "tip": "自定义按钮（显示/隐藏右侧区域）",
              "className": "right",
              "icon": "<img src='favicon.ico' width='20' height='20'>",
              click(){
                _this.Symbol_Switch = !_this.Symbol_Switch
                console.log(_this.contentEditor.getValue())
              }
            }],
          after(){
            _this.contentEditor.setValue(_this.defaultString)
          }
        })
    }  
}
</script>
<style>
.selfMade{
  border: 1px solid red
}
</style>