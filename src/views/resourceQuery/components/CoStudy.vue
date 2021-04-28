<template lang="html">
    <div v-if="undirected_len==0">
        无共同学习节点
    </div>
    <svg v-else id="costudy" style="width: 100%;height: 100%;">
    </svg>
</template>

<script>
import * as d3 from "d3";
import $ from "jquery";
import {zoom} from './zoom.js'

export default {
  props: {
    node: {
      type: Object,
      default: function() {
        return { message: "" };
      }
    },
    neighbors_groups: {
      type: Object,
      default: function() {
        return { message: "" };
      }
    },
    undirected_len: {
      type: Number,
      default: 0
    },
  },
  watch: {
    node: {
      handler() {
        this.draw_graph();
      },
      deep: true
    },
  },
  mounted () {
    this.draw_graph()
  },
  methods:{
    draw_graph(){

      let nodes = [
          {
            name: this.node.name,
          }
      ];

      let edges=[]
      let kg_group=this.neighbors_groups["kp2.0"]
      //
      let r_idx= kg_group.length-1

      for (let i = 0; i < this.undirected_len; i++) {
        // console.log(i+1,r_idx-i,kg_group[r_idx-i].name);
        nodes[i + 1] = {
          name: kg_group[r_idx-i].name,
        };
        edges[i] = {
          source: 0,
          target: i+1,
          relation: '',
          value: Math.random() * (1.6 - 1) + 1
        }
      }
      // console.log(nodes);

      let width = $('svg#costudy').width()
      let height = $('svg#costudy').height()
      let svg = d3.select('svg#costudy')
      .attr('class', 'groupbox')
      .attr("viewBox", "0 0 " + width + " " + height )
      .attr("preserveAspectRatio", "xMidYMid meet");
      let g = svg.append('g');

      // 设置一个颜色比例尺
      let colorScale = d3.scaleOrdinal()
        .domain(d3.range(nodes.length))
        .range(d3.schemeCategory10)

      // 新建一个力导向图
      let forceSimulation = d3.forceSimulation()
        .force('link', d3.forceLink())
        .force('charge', d3.forceManyBody())
        .force('center', d3.forceCenter())
        .force('collision', d3.forceCollide().radius(15))
      // 生成节点数据
      forceSimulation.nodes(nodes)
        .on('tick', ticked)

      forceSimulation.force('link')
        .links(edges)
        .distance(function (d) { // 每一边的长度
          return d.value * 100
        })
      // 设置图形中心位置
      forceSimulation.force('center')
        .x(width / 2)
        .y(height / 2)
      // // 顶点集，边集
      // 绘制边
      let links = g.append('g')
        .selectAll('line')
        .data(edges)
        .enter()
        .append('line')
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.4)
        .attr('stroke-width', 1)

      // 边上的文字
      let linksText = g.append('g')
        .selectAll('text')
        .data(edges)
        .enter()
        .append('text')
        .text(function (d) {
          return d.relation
        })
      // 创建分组
      let gs = g.selectAll('.circleText')
        .data(nodes)
        .enter()
        .append('g')
        .attr('transform', function (d) {
          let cirX = d.x
          let cirY = d.y
          return 'translate(' + cirX + ',' + cirY + ')'
        })
        .call(d3.drag()
          .on('start', started)
          .on('drag', dragged)
          .on('end', ended)
        )
      // 绘制节点
      let _this=this
      gs.append('circle')
        .attr('r', 5)
        .attr('fill', function (d, i) {
          return colorScale(i)
        })
        .on('click',function(d){
          if(d.name!=_this.node.name)
            _this.$emit("search", d.name)
        })
      // 文字
      gs.append('text')
        .attr('x', -6)
        .attr('y', 6)
        .attr('dy', 10)
        .attr("opacity", 0.6)
        .attr("pointer-events", "none")
        .style("font-family", "sans-serif")
        .style("font-size", "0.8em")
        .text(function (d) {
          return d.name
        })
      zoom(svg,g)
      function ticked () {
        links
          .attr('x1', function (d) { return d.source.x })
          .attr('y1', function (d) { return d.source.y })
          .attr('x2', function (d) { return d.target.x })
          .attr('y2', function (d) { return d.target.y })
        linksText
          .attr('x', function (d) { return (d.source.x + d.target.x) / 2 })
          .attr('y', function (d) { return (d.source.y + d.target.y) / 2 })
        gs
          .attr('transform', function (d) { return 'translate(' + d.x + ',' + d.y + ')' })
      }
      // drag
      function started (d) {
        if (!d3.event.active) {
          forceSimulation.alphaTarget(0.8).restart() // 设置衰减系数，对节点位置移动过程的模拟，数值越高移动越快，数值范围[0, 1]
        }
        d.fx = d.x
        d.fy = d.y
      }
      function dragged (d) {
        d.fx = d3.event.x
        d.fy = d3.event.y
      }
      function ended (d) {
        if (!d3.event.active) {
          forceSimulation.alphaTarget(0)
        }
        d.fx = null
        d.fy = null
      }
    }

  }
}
</script>

<style lang="css" >
</style>
