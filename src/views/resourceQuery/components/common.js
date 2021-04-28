import * as d3 from "d3";
import screenfull from 'screenfull'

export  function zoom(svg,...args){
  let zoomHandler = d3.zoom()
    .on('zoom', zoomActions)
    .scaleExtent([1 / 2, 8])

  svg.call(zoomHandler).on('dblclick.zoom', null)
  zoomHandler(svg)

  // Zoom functions
  function zoomActions () {
    for (let g of args) {
      g.attr('transform', d3.event.transform)
    }
  }
}

export function addTooltip(svgContainer,circle){

      let Tooltip = svgContainer
        .append("div")
        .attr("class", "tool-tip")
      // let duration = 300;

      let mouseover = (d)=>{
          Tooltip.transition()
              // .duration(duration)
              .style("display", "block");
          Tooltip.html('<p>'+d.desc+'</p>')
          if(!screenfull.isFullscreen){
            Tooltip.style("left", d.x+10+"px")
            .style("top", d.y+10+"px")
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
      .on("mouseout", mouseout);
      // var toolTip = d3.tip()
      //   .attr("class", "d3-tip")
      //   // .rootElement(function(){
      //   //   return svgDOM
      //   //   // return document.getElementById('presuc');
      //   // })
      //   // .rootElement(document.getElementById('test'))
      //   .direction('e')
      //   .style('background-color','rgba(248,251, 255, .7)')
      //   .style('border','solid 1px rgba(31,119,180,0.3)')
      //   // .offset([0, 0])
      //   .rootElement(document.body)
      //   .html(function(d) {
      //     return "<p>" + d.desc + "</p>";
      //   });
      // gs.call(toolTip);
      //
}
