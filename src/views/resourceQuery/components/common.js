import * as d3 from "d3";
import screenfull from 'screenfull'

export  function zoom(svg,g){
  // let zoomHandler = d3.zoom()
  //   .on('zoom', zoomActions)
  //   .scaleExtent([1 / 2, 8])
  //
  // svg.call(zoomHandler).on('dblclick.zoom', null)
  // zoomHandler(svg)
  //
  // // Zoom functions
  // function zoomActions () {
  //   for (let g of args) {
  //     g.attr('transform', d3.event.transform)
  //   }
  // }
  // 放大显示的函数
  function zoomed() {
    g.attr("transform", d3.event.transform||"");
  }

  let zoom = d3
    .zoom()
    .scaleExtent([1 / 8, 1.5])
    .on("zoom", zoomed);
  // svg.call(zoom);
  zoom(svg);
}
// const colorDict=["#c5e1a5","#ffc0cb","#fdfd96","#1f77b4","#ffa500","#006400"];
const colorDict=["#c5e1a5","#87CEFA","#fdfd96","#1f77b4","#6495ED","#006400"];

export function color(d){
    return colorDict[d];
}
export function addTooltip(svgContainer,circle){

      let Tooltip = svgContainer
        .append("div")
        .attr("class", "tool-tip")
      // let duration = 300;

      let mouseover = (d)=>{
          let content = d.desc||"暂无描述"
          Tooltip.transition()
              // .duration(duration)
              .style("display", "block")
              .style("position", "absolute")
              .style("background", "#ddd")
              .style("padding", "8px")
              .style("border-radius", "10px")
              .style("text-align", "left")
              .style("text-indent", "2em")

          Tooltip.html('<p>'+content+'</p>')
                 .style("left", d3.event.offsetX+25+"px")
                 .style("top", d3.event.offsetY+"px")
          if(!screenfull.isFullscreen){
            Tooltip
            .style("width", "150px")
            .style("font-size", "12px")
            .style("line-height", "15px")
          }else{
            Tooltip
            .style("width", "250px")
            .style("font-size", "16px")
            .style("line-height", "18px")
          }
      }
      let mouseout = () => {
          Tooltip.transition()
              // .duration(duration)
              .style("display", "none");
      };
      circle.on("mouseover",mouseover)
      .on("mouseout", mouseout)
}
