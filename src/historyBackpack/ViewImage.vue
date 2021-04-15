<template>
  <div class="image-viewer" style="margin-top:5px;margin-bottom:5px;">
    <div
      :class="preData ? 'image-container-noborder' : 'image-container'"
      :style="{ width: canvasW + 'px', height: canvasH + 'px' }"
    >
      <form class="image-container-form" ref="form">
        <input
          type="file"
          class="file-inputter"
          ref="fileInput"
          @change="uploadImage"
          accept="image/png, image/jpeg"
          multiple
        />
      </form>
      <div
        class="image-container-trigger"
        v-if="preData === false && imageLoaded === false"
        @click="triggerInput"
      ></div>
      <div class="image-viewer-buttons" v-if="imageLoaded === true">
        <button @click="scaleUp" type="button" class="image-button">+</button>
        <button @click="scaleDown" type="button" class="image-button">
          -
        </button>
        <button @click="reset" type="button" class="image-button">
          x
        </button>
      </div>
      <canvas
        class="image-canvas"
        ref="canvas"
        :style="{
          width: canvasW + 'px',
          height: canvasH + 'px',
          cursor: draggable ? 'move' : ''
        }"
      ></canvas>
    </div>
  </div>
</template>
<script>
export default {
  name: "image-viewer",
  data() {
    return {
      // Image
      ctx: null,
      canvas: null,
      image: null,
      base64: "",
      // Property
      scaleSteps: 0,
      scaledW: 0,
      scaledH: 0,
      imageW: 0,
      imageH: 0,
      imageX: 0,
      imageY: 0,
      imageLoaded: false,
      // Mouse
      startX: 0,
      startY: 0,
      mouseX: 0,
      mouseY: 0,
      draggable: false,
      dragging: false,
      preData: false,
      canvasW: 200,
      canvasH: 100
    };
  },
  props: {
    // canvasW: {
    //   type: Number,
    //   default: 200
    // },
    // canvasH: {
    //   type: Number,
    //   default: 100
    // },
    data: {
      type: String,
      default: ""
    },
    upload: {
      // specially for the condition when the paper is uploaded
      type: Boolean,
      default: false
    }
  },
  mounted: function() {
    this.canvas = this.$refs.canvas;
    this.ctx = this.canvas.getContext("2d");
    this.image = document.createElement("img");
    if (this.preData || this.upload) {
      if (this.upload) {
        this.imageLoaded = true;
      }
      this.image.src = this.data;
      let vm = this;
      this.image.onload = function() {
        try {
          vm.imageW = vm.image.width;
          vm.imageH = vm.image.height;
          vm.uploadImage({});
          vm.draw();
        } catch (err) {
          console.log("err");
          console.log(`${err.message}`);
        }
      };
    }
  },
  watch: {
    data: {
      handler(val) {
        if (val !== "") {
          if (!this.upload) {
            this.preData = true;
          } else {
            this.imageLoaded = true;
          }
          let canvas = this.$refs.canvas;
          if (canvas) {
            this.image.src = this.data;
            let vm = this;
            this.image.onload = function() {
              try {
                vm.imageW = vm.image.width;
                vm.imageH = vm.image.height;
                vm.uploadImage({});
                vm.draw();
              } catch (err) {
                console.log("err");
                console.log(`${err.message}`);
              }
            };
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    getBase64: function() {
      let imageData = this.canvas.toDataURL("image/png");
      this.base64 = imageData;
      this.$emit("ImageBase64", this.base64);
    },
    draw: function() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      let scale = 1 - this.scaleSteps * 0.05;
      this.scaledW = this.image.width * scale;
      this.scaledH = this.scaledW * (this.image.height / this.image.width);
      this.canvas.width = this.scaledW;
      this.canvasW = this.scaledW;
      this.canvas.height = this.scaledH;
      this.canvasH = this.scaledH;
      // console.log(this.image.width);
      // console.log(this.image.height);
      // console.log(this.canvas.width);
      // console.log(this.canvas.height);
      this.ctx.drawImage(
        this.image,
        0,
        0,
        this.image.width,
        this.image.height,
        this.imageX,
        this.imageY,
        this.scaledW,
        this.scaledH
      );
      this.getBase64();
    },
    scaleUp: function() {
      this.scaleSteps--;
      this.draw();
      this.$emit("updateUpload");
    },
    scaleDown: function() {
      this.scaleSteps++;
      this.draw();
      this.$emit("updateUpload");
    },
    reset: function() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.$refs.form.reset();
      this.imageLoaded = false;
      this.preData = false;
      this.getBase64();
      this.$emit("updateUpload");
    },
    getMousePos: function(e) {
      let rect = this.canvas.getBoundingClientRect();
      let scaleX = this.canvas.width / rect.width;
      let scaleY = this.canvas.height / rect.height;

      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      };
    },
    hitImage: function(x, y) {
      return (
        x > this.imageX &&
        x < this.imageX + this.imageW &&
        y > this.imageY &&
        y < this.imageY + this.imageH
      );
    },
    uploadImage: function(event) {
      let _this = this;
      let input = event.target;
      if (input && input.files && input.files.length > 0) {
        let reader = new FileReader();
        reader.onload = e => {
          try {
            _this.image.src = e.target.result;
          } catch (err) {
            console.log("err");
            console.log(`${err.message}`);
          }
        };
        reader.readAsDataURL(input.files[0]);
        _this.image.onload = function() {
          try {
            _this.ctx.drawImage(_this.image, 0, 0);
            _this.imageW = _this.image.width;
            _this.imageH = _this.image.height;
            _this.draw();
            _this.imageLoaded = true;
          } catch (err) {
            console.log("err");
            console.log(`${err.message}`);
          }
        };
      }

      function handleMouseDown(e) {
        _this.$emit("updateUpload");
        let pos = _this.getMousePos(e);
        _this.startX = pos.x;
        _this.startY = pos.y;
        _this.dragging = _this.draggable;
      }
      function handleMouseUp() {
        _this.$emit("updateUpload");
        _this.dragging = false;
        _this.draw();
        _this.$emit("updateUpload");
      }
      function handleMouseOut(e) {
        _this.$emit("updateUpload");
        handleMouseUp(e);
      }
      function handleMouseMove(e) {
        _this.$emit("updateUpload");
        let pos = _this.getMousePos(e);
        _this.draggable = _this.hitImage(pos.x, pos.y);
        if (_this.dragging) {
          // if can drag
          _this.mouseX = pos.x;
          _this.mouseY = pos.y;

          // move the image
          let dx = _this.mouseX - _this.startX;
          let dy = _this.mouseY - _this.startY;

          _this.imageX += dx;

          _this.imageY += dy;

          // Reset the startXY for next time
          _this.startX = _this.mouseX;
          _this.startY = _this.mouseY;

          // Redraw the image with border
          _this.draw();
        }
      }
      _this.canvas.addEventListener("mousedown", handleMouseDown, false);
      _this.canvas.addEventListener("mousemove", handleMouseMove, false);
      _this.canvas.addEventListener("mouseup", handleMouseUp, false);
      _this.canvas.addEventListener("mouseout", handleMouseOut, false);
    },
    triggerInput: function() {
      this.$refs.fileInput.click();
    }
  }
};
</script>

<style scoped>
.image-container {
  position: relative;
  overflow: hidden;
  border: 1px dashed #000000;
  left: 0;
  cursor: pointer;
}
.image-container-noborder {
  position: relative;
  overflow: hidden;
  left: 0;
  cursor: pointer;
}
.image-viewer:hover .image-container {
  border: 1px solid #7fcc29;
  background: url("/static/camera.svg");
  background-size: 50px 50px;
  background-position: center;
  background-repeat: no-repeat;
}
.image-container {
  position: relative;
  left: 0;
}
.image-container-noborder {
  position: relative;
  left: 0;
}
.file-inputter {
  widows: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}
.image-viewer-buttons {
  position: absolute;
  left: 0;
}
.image-container-trigger {
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;

  cursor: pointer;
}
.image-button {
  font-family: "Roboto", sans-serif;
  margin: 0 auto;
  padding: 0;
  height: 25px;
  width: 25px;
  border-radius: 5px;
  text-align: center;
  line-height: 12.5px;
}
</style>
