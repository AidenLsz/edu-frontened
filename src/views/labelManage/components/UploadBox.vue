<template>
  <el-upload
      ref="upload"
      class="pd-upload"
      drag
      :name="pdForm.fileName"
      action="https://file-upload-backend-88-production.env.bdaa.pro/v1/paperProcessing/upload"
      :auto-upload="false"
      :show-file-list="false"
      :on-change="onChange"
      accept=".doc, .docx"
      :multiple="false"
      >
    <img class="pd-upload__img" src="../img/pd-upload.svg" alt="">
    <div class="pd-upload__text">{{ prompt }}</div>
  </el-upload>
</template>

<script>
import {eventList} from '../data';

export default {
  name: 'UploadBox',
  props: {
    pdForm: {
      type: Object,
    }
  },
  model: {
    prop: 'pdForm',
    event: eventList.fileChange,
  },
  data() {
    return {
      uploadPrompts: {
        init: '点击或拖拽上传',
        hasFile: '重新拖拽或点击可更改文件',
      },
      hasFile: false,
    };
  },
  computed: {
    prompt() {
      if (this.hasFile) {
        return this.uploadPrompts.hasFile;
      } else {
        return this.uploadPrompts.init;
      }
    }
  },
  methods: {
    // 保证只有一个文件被选中
    onChange(file, fileList) {
      if (fileList.length > 1 && file.status !== "fail") {
        fileList.splice(0, 1);
      } else if (file.status === "fail") {
        this.$message.error("文件上传失败，请重试");
        fileList.splice(0, 1);
      }
      this.$root.$emit(eventList.fileChange, file.name);
      this.hasFile = true;
      this.pdForm.file = file;
    },
  },
}
</script>

<style lang="scss" scoped>

  ::v-deep .el-upload-dragger {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    border-width: 3px;
    transition: .3s;
  }

  ::v-deep .el-upload {
    width: 100%;
    height: 100%;
  }

  .pd-upload {
    position: relative;
    height: 100%;
    box-shadow: rgb(0 0 0 / 10%) 0px 2px 12px 0px;

    &__img {
      max-width: 80px;
    }

    &__text {
      margin-top: 5px;
      font-size: 2.5rem;
    }
  }
</style>
