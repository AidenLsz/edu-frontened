<template lang="html">
  <!-- <div id="test"> -->
    <svg id="presuc" style="width: 100%;height: 100%;"/>
  <!-- </div> -->
</template>

<script>
import * as d3 from "d3";
import $ from "jquery";
import {zoom,addTooltip,
  addLegend} from './utils.js'

export default {
  name: "",
  data() {
    return {
    };
  },
  methods:{
    draw_graph(data){
      var width =  $('svg#presuc').width()
      var height = $('svg#presuc').height();
      var drag = d3
        .drag()
        .on('start', dragStart)
        .on('drag', dragging)
        .on('end', dragEnd);

      var svgDOM = d3
        .select('#presuc')
        .attr('class', 'groupbox')
        .attr("viewBox", "0 0 " + width + " " + height )
        .attr("preserveAspectRatio", "xMidYMid meet");
      var svg = svgDOM.append('g');
      var groupingForce = forceInABox()
        .strength(0.025)
        .groupBy('community')
        .size([width, height]);
      var forceSim = d3
        .forceSimulation()
        .force(
          'link',
          d3.forceLink()
          .id(function(d) {
            return d.id;
          })
          .distance(50)
          .strength(groupingForce.getLinkStrength)
        )
        .force('group', groupingForce)
        .force('charge', d3.forceManyBody())
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('x', d3.forceX(width / 2).strength(0.02))
        .force('y', d3.forceY(height / 2).strength(0.04));

      forceSim.nodes(data.nodes).on('tick', tick);
      forceSim.force('link').links(data.links);
      groupingForce.links(data.links).drawTreemap(svg);
      var link = svg
        .append('g')
        .attr("marker-end", "url(#arrow)")
        .attr('class', 'links')
        .selectAll('line')
        .data(data.links)
        .enter()
        .append('line')
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.4)
        .attr('stroke-width', 1)
    // let marker =
    svg.append("defs").append("marker")
          .attr("id", "arrow")
          .attr("viewBox", "0 -5 10 10")
          .attr("refX", 16)
          .attr("refY", 0)
          .attr("opacity", 0.5)
          .attr("markerWidth", 8)
          .attr("markerHeight", 8)
          .attr("orient", "auto")
        .append("svg:path")
          .attr("d", "M0,-5L10,0L0,5");
    // 边上的文字
    let linksText = svg.append('g')
      .selectAll('text')
      .data(data.links)
      .enter()
      .append('text')
      .text(function (d) {
        return d.relation
      })
    // 创建分组
    let gs = svg.selectAll('.circleText')
      .data(data.nodes)
      .enter()
      .append('g')
      .call(drag)

    // 绘制节点
    let _this = this;
    let circle = gs.append('circle')
      .attr('r', 5)
      // .attr("stroke", "black")
      .attr('fill', function (d) {
        return d.color
      })
      .on('click',function(d){
        $(".tool-tip").hide()
        _this.$emit("search", d.id)
      })
      addTooltip(d3.select("#presuc_container"),circle)

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
        // console.log('d:',d.id);
        return d.id
      })
    zoom(svgDOM,svg)
    // var [legend,legendCircle] =
    let [legend,] = addLegend(svg,5,['current','pre','suc'])
    legend.attr("transform", (d, i) => `translate(${width-100},${i * 23+20})`)


    function tick() {
      link
        .attr('x1', function(d) {
          return d.source.x;
        })
        .attr('x2', function(d) {
          return d.target.x;
        })
        .attr('y1', function(d) {
          return d.source.y;
        })
        .attr('y2', function(d) {
          return d.target.y;
        });
      linksText
        .attr('x', function (d) { return (d.source.x + d.target.x) / 2 })
        .attr('y', function (d) { return (d.source.y + d.target.y) / 2 })
      gs.attr('transform', function (d) { return 'translate(' + d.x + ',' + d.y + ')' })
    }

      function dragStart(d) {
        // isDragging = true;
        if (!d3.event.active) forceSim.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }
      function dragging(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }
      function dragEnd(d) {
        if (!d3.event.active) forceSim.alphaTarget(0);
        d.fx = null;
        d.fy = null;
        // isDragging = false;
      }
      function forceInABox() {
        function index(d) {
          return d.index;
        }

        var id = index,
            nodes,
            links, //needed for the force version
            tree,
            size = [100,100],
            nodeSize = 1, // The expected node size used for computing the cluster node
            forceCharge = -2,
            // forceCharge = 100,
            foci = {},
            // oldStart = force.start,
            linkStrengthIntraCluster = 0.1,
            // linkStrengthInterCluster = 0.01,
            linkStrengthInterCluster = 0.01,
            // oldGravity = force.gravity(),
            templateNodes = [],
            offset = [0,0],
            groupBy = function (d) { return d.cluster; },
            template = "treemap",
            enableGrouping = true,
            strength = 0.1;


        function force(alpha) {
          if (!enableGrouping) {
            return force;
          }

          for (var i = 0, n = nodes.length, node, k = alpha * strength; i < n; ++i) {
            node = nodes[i];
            node.vx += (foci[groupBy(node)].x - node.x) * k;
            node.vy += (foci[groupBy(node)].y - node.y) * k;
          }

        }

        function initialize() {
          if (!nodes) return;
          initializeWithTreemap();

        }

        force.initialize = function(_) {
          nodes = _;
          initialize();
        };
        function computeClustersNodeCounts(nodes) {
          var clustersCounts = d3.map();

          nodes.forEach(function (d) {
            if (!clustersCounts.has(groupBy(d))) {
              clustersCounts.set(groupBy(d), 0);
            }
          });

          nodes.forEach(function (d) {
            // if (!d.show) { return; }
            clustersCounts.set(groupBy(d), clustersCounts.get(groupBy(d)) + 1);
          });

          return clustersCounts;
        }

        function getGroupsTree() {
          let children = [],
            clustersList,
            c, i, size, clustersCounts;

          clustersCounts = computeClustersNodeCounts(force.nodes());
          //map.keys() is really slow, it's crucial to have it outside the loop
          clustersList = clustersCounts.keys();
          for (i = 0; i< clustersList.length ; i+=1) {
            c = clustersList[i];
            size = clustersCounts.get(c);
            children.push({id : c, size :size });
          }
          return {id: "clustersTree",  children : children};
        }


        function getFocisFromTemplate() {
          //compute foci
          foci.none = {x : 0, y : 0};
          templateNodes.forEach(function (d) {
            foci[d.data.id] = {
              x : (d.x0 + (d.x1-d.x0) / 2) - offset[0],
              y : (d.y0 + (d.y1-d.y0) / 2) - offset[1],
            };
          });
        }
        function initializeWithTreemap() {
          var treemap = d3.treemap()
            .tile(d3.treemapDice)
            .size(force.size());
          tree = d3.hierarchy(getGroupsTree())
            .sum(function (d) {
              return d.size; })
            .sort(function(a, b) {
              return b.height - a.height || a.data.id - b.data.id; })
            ;

          templateNodes = treemap(tree).leaves();
          getFocisFromTemplate();
        }

        function drawTreemap(container) {
          container.selectAll(".cell").remove();
          container.selectAll("cell")
            .data(templateNodes)
            .enter().append("svg:rect")
            // .attr("id", d => (d.leafUid = DOM.uid("leaf")).id)
            .attr("class", "cell")
            .attr("x", function (d) {
              return d.x0; })
            .attr("y", function (d) {
              return d.y0; })
            .attr("width", function (d) {
              return d.x1-d.x0; })
            .attr("height", function (d) {
              return d.y1-d.y0; });

        }

        force.drawTemplate = function (container) {
          drawTreemap(container);
          return force;
        };

        //Backwards compatibility
        force.drawTreemap = force.drawTemplate;

        force.deleteTemplate = function (container) {
          // showingTemplate = false;
          container.selectAll(".cell").remove();

          return force;
        };


        force.template = function (x) {
          if (!arguments.length) return template;
          template = x;
          initialize();
          return force;
        };

        force.groupBy = function (x) {
          if (!arguments.length) return groupBy;
          if (typeof x === "string") {
            groupBy = function (d) {return d[x]; };
            return force;
          }
          groupBy = x;
          return force;
        };


        force.enableGrouping = function (x) {
          if (!arguments.length) return enableGrouping;
          enableGrouping = x;
          // update();
          return force;
        };

        force.strength = function (x) {
          if (!arguments.length) return strength;
          strength = x;
          return force;
        };

        force.getLinkStrength = function (e) {
          if(enableGrouping)  {
            if (groupBy(e.source) === groupBy(e.target)) {
              if (typeof(linkStrengthIntraCluster)==="function") {
                return linkStrengthIntraCluster(e);
              } else {
                return linkStrengthIntraCluster;
              }
            } else {
              if (typeof(linkStrengthInterCluster)==="function") {
                return linkStrengthInterCluster(e);
              } else {
                return linkStrengthInterCluster;
              }
            }
          } else {
            // Not grouping return the intracluster
            if (typeof(linkStrengthIntraCluster)==="function") {
                return linkStrengthIntraCluster(e);
              } else {
                return linkStrengthIntraCluster;
              }

          }
        };

        force.id = function(_) {
          return arguments.length ? (id = _, force) : id;
        };

        force.size = function(_) {
          return arguments.length ? (size = _, force) : size;
        };

        force.linkStrengthInterCluster = function(_) {
          return arguments.length ? (linkStrengthInterCluster = _, force) : linkStrengthInterCluster;
        };

        force.linkStrengthIntraCluster = function(_) {
          return arguments.length ? (linkStrengthIntraCluster = _, force) : linkStrengthIntraCluster;
        };

        force.nodes = function(_) {
          return arguments.length ? (nodes = _, force) : nodes;
        };

        force.links = function(_) {
          if (!arguments.length)
            return links;
          if (_ === null) links = [];
          else links = _;
          return force;
        };

        force.nodeSize = function(_) {
          return arguments.length ? (nodeSize = _, force) : nodeSize;
        };

        force.forceCharge = function(_) {
          return arguments.length ? (forceCharge = _, force) : forceCharge;
        };

        force.offset = function(_) {
          return arguments.length ? (offset = _, force) : offset;
        };

        return force;
      }
    },
  }
}
</script>

<style  lang="scss" >
#presuc.groupbox rect.cell {
  fill: none;
  stroke-width: 0px;
}

</style>
