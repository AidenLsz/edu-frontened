<template lang="html">
    <svg id="tree" style="width:100%;height:100%;overflow-y: scroll;"
    class="d3-tree-vi width-100-percent container-border" />
</template>

<script>
import * as d3 from "d3";
import $ from "jquery";
import {zoom,color} from './common.js'
export default {
  data () {
    return {
      nodeId: '',
      nodeName: '',
      index: 0,
      root: null,
      nodes: [],
      links: [],
      dTreeData: null,
      currentNode: null,
      svg: null,
      container: null,
      newNodeName: '',
      rootNodeId: null
    }
  },
  props: {
    node: {
      type: Object,
      default: function() {
        return { message: "" };
      }
    },
    neighbors_hierarchy: {
      type: Array,
      default: function() {
        return [];
      }
    },
    superior_layer: {
      type: Number,
      default: 0
    },
    inferior_layer: {
      type: Number,
      default: 0
    },
  },
  mounted () {
    let data=null
    let mid_data
    if(this.superior_layer>0){
      for (let i = 0; i < this.superior_layer; i++) {
        data={
          'name': this.neighbors_hierarchy[i].name,
          'value': 1,
          community:1,
          'children': []
        }
      }
      mid_data=data.children[0]
    }
    mid_data={
      'name': this.node.name,
      'value': 1,
      'children': [],
      community:3
    }
    for (let i = 0; i < this.inferior_layer; i++) {
        mid_data.children.push({
          'name': this.neighbors_hierarchy[i+this.superior_layer],
          'value': 1,
          'children': [],
          community:4
        })
    }
    if(!data){
      data=mid_data
    }else{
      data.children.push(mid_data)
    }
    this.draw_graph(data)
  },
  methods:{
    draw_graph(data){
      let margin = ({ left: 60 ,top: 50, right: 120, bottom:120 })

      let width = $('#tree').width()*0.6

      let dy = width / 5
      let dx = 30

      let tree = d3.tree().nodeSize([dx, dy])
      let diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x)

      const root = d3.hierarchy(data)

      root.x0 = 0
      root.y0 = 0
      root.descendants().forEach((d, i) => {
        d.id = i
        d._children = d.children
        if (d.depth && d.data.name.length !== 4) d.children = null
      })

      let svgDOM = d3
        .select('svg.d3-tree-vi')

      let svg=svgDOM.append('g')
        .attr("viewBox", "0 0 " + $('#tree').width() + " " + $('#tree').height() )
        .attr("preserveAspectRatio", "xMidYMid meet");
        // .attr('viewBox', [margin.left, margin.top, width, dx])
      const gLink = svg.append('g')
        .attr('fill', 'none')
        .attr('stroke', '#555')
        .attr('stroke-opacity', 0.4)
        .attr('stroke-width', 1.5)

      const gNode = svg.append('g')
        .attr('cursor', 'pointer')
        .attr('pointer-events', 'all')
      zoom(svgDOM,svg)
      // zoom(svg,gNode,gLink)
      function update (source) {
        const duration = d3.event && d3.event.altKey ? 2500 : 250
        const nodes = root.descendants().reverse()
        const links = root.links()

        // Compute the new tree layout.
        tree(root)


        let left = root
        let right = root
        root.eachBefore(node => {
          if (node.x < left.x) left = node
          if (node.x > right.x) right = node
        })

        const height = right.x - left.x + margin.top + margin.bottom
        // console.log(width,height);
        const transition = svgDOM.transition()
          .duration(duration)
          .attr('viewBox', [-margin.left, left.x - margin.top, width, height])
          // .attr('viewBox', ['25%', '25%', '100%', 380])
          .tween('resize', window.ResizeObserver ? null : () => () => svg.dispatch('toggle'))

        // Update the nodes…
        const node = gNode.selectAll('g')
          .data(nodes, d => d.id)

        // Enter any new nodes at the parent's previous position.
        const nodeEnter = node.enter().append('g')
          .attr('transform', () => `translate(${source.y0},${source.x0})`)
          .attr('fill-opacity', 0)
          .attr('stroke-opacity', 0)
          .on('click', d => {
            d.children = d.children ? null : d._children
            update(d)
          })

        nodeEnter.append('circle')
          .attr('r', 4)
          .attr("stroke", "black")
          .attr('fill', function (d) {
            return color(d.data.community)
          })

        nodeEnter.append('text')
          .attr("opacity", 0.6)
          .attr("pointer-events", "none")
          .style("font-family", "sans-serif")
          .style("font-size", "0.7em")
          .attr('x', d => d._children ? -5 : 5)
          .attr('y', 2)
          .attr('text-anchor', d => d._children ? 'end' : 'start')
          .text(d => d.data.name)
          .clone(true).lower()
          .attr('stroke-linejoin', 'round')
          .attr('stroke-width', 3)
          .attr('stroke', 'white')

        // Transition nodes to their new position.
        // const nodeUpdate =
        node.merge(nodeEnter).transition(transition)
          .attr('transform', d => `translate(${d.y},${d.x})`)
          // .attr('r', 10)
          // .style('fill', function (d) {
          //   return d._children ? '#c9e4ff' : '#fff'
          // })
          // .attr('cursor', 'pointer')
          .attr('fill-opacity', 1)
          .attr('stroke-opacity', 1)
        // console.log(nodeUpdate) // eslint-disable-line

        // Transition exiting nodes to the parent's new position.
        // const nodeExit =
        node.exit().transition(transition).remove()
          .attr('transform', () => `translate(${source.y},${source.x})`)
          .attr('fill-opacity', 0)
          .attr('stroke-opacity', 0)

        // console.log(nodeExit) // eslint-disable-line

        // Update the links…
        const link = gLink.selectAll('path')
          .data(links, d => d.target.id)

        // Enter any new links at the parent's previous position.
        const linkEnter = link.enter().append('path')
          .attr('d', () => {
            const o = { x: source.x0, y: source.y0 }
            return diagonal({ source: o, target: o })
          })

        // Transition links to their new position.
        link.merge(linkEnter).transition(transition)
          .attr('d', diagonal)

        // Transition exiting nodes to the parent's new position.
        link.exit().transition(transition).remove()
          .attr('d', () => {
            const o = { x: source.x, y: source.y }
            return diagonal({ source: o, target: o })
          })

        // Stash the old positions for transition.
        root.eachBefore(d => {
          d.x0 = d.x
          d.y0 = d.y
        })
      }

      update(root)
    }
  }
}
</script>
<style >
</style>
