<template>
  <div class="i-editor-md">
    <slot></slot>
    <div class="dev-md-content" v-html="html" ref="content"></div>
  </div>
</template>
<script>
import "mathjax/es5/tex-svg"
export default {
  name: "Mathdown",
  props: {
    content: {
      type: String,
      default: ""
    },
    name: {
      type: String,
      default: "math"
    }
  },
  data() {
    return {
      html: ""
    };
  },
  watch: {
    content() {
      this.renderMath();
    }
  },
  methods: {
    renderMath() {
      let input = this.content;
      let nlTag = `--nl--`;
      let nlReg = /--nl--/g;
      input = input.replace(/\n/g, nlTag);
      input = input.replace(/\r\n/g, nlTag);
      input = input.replace(/\r/g, nlTag);
      let $latexes = input.match(/\\\[.+?\\\]/g);
      if ($latexes) {
        $latexes.some(str => {
          let len = str.length;
          let latexe = str.substr(2, len - 4);
          latexe = latexe.replace(nlReg, ` `);
          input = input.replace(
            str,
            `<span id="${this.name}" class="latex inline" title="${latexe}"></span>`
          );
        });
      }
      $latexes = input.match(/\$\$.+?\$\$/g);
      if ($latexes) {
        $latexes.some(str => {
          let len = str.length;
          let latexe = str.substr(2, len - 4);
          latexe = latexe.replace(nlReg, ` `);
          input = input.replace(
            str,
            `<span id="${this.name}" class="latex" title="${latexe}"></span>`
          );
        });
      }
      $latexes = input.match(/\$.+?\$/g);
      if ($latexes) {
        $latexes.some(str => {
          let len = str.length;
          let latexe = str.substr(1, len - 2);
          latexe = latexe.replace(nlReg, ` `);
          input = input.replace(
            str,
            `<span id="${this.name}" class="latex inline" title="${latexe}"></span>`
          );
        });
      }
      input = input.replace(nlReg, `<br/>`);
      this.html = input;
      this.$nextTick(() => {
        let $laTexes = window.document.querySelectorAll(
          "#" + this.name + ".latex"
        );
        Array.prototype.forEach.call($laTexes, $laTex => {
          this.renderTex($laTex.title, $laTex);
        });
      });
    },
    renderTex(input, output) {
      output.innerHTML = "";
      window.MathJax.texReset();
      let options = window.MathJax.getMetricsFor(output);
      options.display = true;
      window.MathJax.tex2svgPromise(input, options)
        .then(function(node) {
          output.appendChild(node);
          window.MathJax.startup.document.clear();
          window.MathJax.startup.document.updateDocument();
        })
        .catch(function(err) {
          output
            .appendChild(document.createElement("pre"))
            .appendChild(document.createTextNode(err.message));
        })
        .then(function() {});
    }
  },
  mounted() {
    this.renderMath();
  }
};
</script>
<style lang="less" scoped>
::v-deep .latex mjx-container[jax="SVG"][display="true"] {
  display: block;
  margin: 0;
}
::v-deep .inline mjx-container[jax="SVG"][display="true"] {
  display: inline-block !important;
  margin: 0;
}
.i-editor-md {
  color: #000;
  text-align: left;
}
</style>
