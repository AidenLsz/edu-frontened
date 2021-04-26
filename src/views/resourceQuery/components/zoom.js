import * as d3 from "d3";

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
