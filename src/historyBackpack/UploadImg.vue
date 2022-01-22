<template>
  <div class="upload-btn">
    <label>
      <input
        type="file"
        name="file"
        @change="uploadImg"
        accept="image/png, image/jpeg"
        multiple
      />点击这里上传图片
    </label>
  </div>
</template>
<script>
export default {
  name: "UploadImg",
  props: {
    src: Array,
    filelists: Array
  },
  data() {
    return {
      order: 0
    };
  },
  methods: {
    // 处理用户上传图片，存入图片数组
    uploadImg(e) {
      let _this = this;
      let length = e.target.files.length;
      if (!e || !window.FileReader) return; // 看支持不支持FileReader
      for (var i = _this.order; i < _this.order + length; i++) {
        let reader = new FileReader();
        _this.filelists[i] = e.target.files[i - _this.order];
        reader.readAsDataURL(_this.filelists[i]); // 转换
        reader.onloadend = function() {
          _this.src.push(this.result);
        };
      }
      _this.order = _this.order + length;
      let img = {
        src: this.src,
        filelists: this.filelists
      };
      this.$emit("uploadImg", img);
    }
  }
};
</script>
<style lang="scss" scoped>
.upload-btn {
  padding: 6px 6px;
  height: 40px;
  width: 160px;
  position: relative;
  cursor: pointer;
  color: #888;
  background: #fafafa;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  display: inline-block;
  *display: inline;
  *zoom: 1;
}
input[type="file"] {
  position: absolute;
  font-size: 100px;
  right: 0;
  top: 0;
  opacity: 0;
  filter: alpha(opacity=0);
  cursor: pointer;
}
</style>
