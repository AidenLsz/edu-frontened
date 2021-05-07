import * as d3 from "d3";
import screenfull from 'screenfull'

export function zoom(svg, g) {
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
    g.attr("transform", d3.event.transform || "");
  }

  let zoom = d3
    .zoom()
    .scaleExtent([1 / 8, 1.5])
    .on("zoom", zoomed);
  // svg.call(zoom);
  zoom(svg);
}
// const colorDict=["#c5e1a5","#ffc0cb","#fdfd96","#1f77b4","#ffa500","#006400"];
// const colorDict=["#c5e1a5","#87CEFA","#fdfd96","#409EFD","#6495ED","#006400"];
const colorDict = ["#fcfe5f", "#eeb8c3", "#9ECCAB", "#8fb2c9", "#F1939C", "#fee159"];
// #409EFD
// #EDB664
// #9ECCAB
// #F1939C

export function color(d) {
  return colorDict[d];
}
export function addTooltip(svgContainer, circle) {

  let Tooltip = svgContainer
    .append("div")
    .attr("class", "tool-tip")
  // let duration = 300;

  let mouseover = (d) => {
    let content = d.desc || "暂无描述"
    Tooltip.transition()
      // .duration(duration)
      .style("display", "block")
      .style("position", "absolute")
      .style("background", "#ddd")
      .style("padding", "8px")
      .style("border-radius", "10px")
      .style("text-align", "left")
      .style("text-indent", "2em")

    Tooltip.html('<p>' + content + '</p>')
      .style("left", d3.event.offsetX + 25 + "px")
      .style("top", d3.event.offsetY + "px")
    if (!screenfull.isFullscreen) {
      Tooltip
        .style("width", "150px")
        .style("font-size", "12px")
        .style("line-height", "15px")
    } else {
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
  circle.on("mouseover", mouseover)
    .on("mouseout", mouseout)
}
const dataDict = {
  current: {
    name:'current',
    desc: "当前知识点",
    value: "3",
    color: "#8fb2c9",
  },
  pre: {
    name: 'pre',
    desc:"前驱节点",
    value: "0",
    color: "#fcfe5f",
  },
  suc: {
    name:'suc',
    desc: "后继节点",
    value: "5",
    color: "#fee159",
  },
  costudy: {
    name: 'costudy',
    desc:"共同学习节点",
    value: "2",
    color: "#9ECCAB",
  },
  sup: {
    name: 'sup',
    desc: "上级节点",
    value: "1",
    color: "#eeb8c3",
  },
  inf: {
    name: 'suc',
    desc: "下级节点",
    value: "4",
    color: "#F1939C",
  }
}

export function addLegend(svg, radius, legendArray) {
  let data=[]
  for (var d of legendArray) {
    if(dataDict[d]){
      dataDict[d].grey=false
      data.push(dataDict[d])
    }
  }
  console.log(data);
  var legend = svg.selectAll("legend")
    .data(data)
    .enter().append("g")

  let legendCircle;
  legendCircle = legend.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", radius)
    .attr("fill", (d) => {
      if (d.grey) {
        return "grey"
      }
      return d.color
    })

  legend.append("text")
    .attr("x", 15)
    .attr("y", 5)
    .style("font-family", "Trebuchet MS")
    .attr("opacity", 0.6)
    .text(d => d.desc);
  return [legend, legendCircle]

}
