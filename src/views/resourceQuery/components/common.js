import * as d3 from "d3";
import screenfull from 'screenfull'

export  function zoom(svg,g){
  let zoomHandler = d3.zoom()
    .on('zoom', zoomActions)
    .scaleExtent([1 / 2, 8])

  svg.call(zoomHandler).on('dblclick.zoom', null)
  zoomHandler(svg)

  // Zoom functions
  function zoomActions () {
    g.attr('transform', d3.event.transform)
  }
}
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

          if(!screenfull.isFullscreen){
            Tooltip.style("left", d.x+(d3.event.pageX-d.x)*0.6+"px")
            .style("top", d.y+"px")
            .style("width", "150px")
            .style("font-size", "12px")
            .style("line-height", "15px")
          }else{
            Tooltip.style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY-350) + "px")
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
