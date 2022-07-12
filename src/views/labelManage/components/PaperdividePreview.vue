<template>
  <el-card class="pd-preview">
    <div
        v-for="(item, itemIndex) in paper"
        :key="'Line_' + itemIndex">
      <div>
        <PaperdivideLine :item="item" :item-index="itemIndex" v-if="item.divide" />
        <div v-else-if="item.para_type === '0'" :style="item.para_style">
              <span
                  v-for="(message, index_i) in item.runs"
                  :key="'Line_' + itemIndex + '_' + index_i + '_run'"
                  :style="removeAbsImgStyle(message.run_style, 'span', message.run_type)"
              >
                <span
                    v-if="message.run_type === '0'"
                    v-html="message.run_text"
                ></span>
                <img
                    v-else-if="message.run_type === '1'"
                    :src="imgDict[message.image.src]"
                    :width="message.image.width"
                    :height="message.image.height"
                    :style="removeAbsImgStyle(message.image.style, 'img', message.run_type)"
                    :alt="message.image.alt"
                />
              </span>
        </div>
        <div v-else-if="item.para_type === '1'">
          <div :style="item.para_style">
            <div v-html="getTableImg(item.table_raw_html)"></div>
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import PaperdivideLine from './PaperdivideLine';

export default {
  name: 'PaperdividePreview',
  components: {PaperdivideLine},
  props: {
    paper: {
      type: Array,
    },
    imgDict: {
      type: Object,
    }
  },
  methods: {
    removeAbsImgStyle(style, type='span', runType='1') {
      const newStyle = {...style};
      if (runType === '0') {
        return newStyle;
      } else {
        newStyle.position = 'relative';
        if (type === 'span') {
          newStyle.height = 'auto';
        }
      }
      return newStyle;
    },
    getTableImg(tableHtml) {
      for(const key in this.imgDict){
        const Img_Name_Catcher = new RegExp('<img src="' + key + '"');
        if (Img_Name_Catcher.exec(tableHtml) !== null) {
          tableHtml = tableHtml.replace(Img_Name_Catcher,'<img src="' + this.imgDict[key] + '"');
        }
      }
      return tableHtml;
    },
  },
}
</script>

<style lang="scss" scoped>
  .pd-preview {
    word-break: break-word;
  }

  ::v-deep .el-card__body {
    padding: 25px;
  }
</style>
