<template lang="html">
  <svg id="graph" width="100%" height="100%"></svg>
</template>

<script>
import * as d3 from "d3";
import $ from "jquery";
import {
  zoom,
  addTooltip,addLegend
} from './utils.js'

export default {
  methods: {
    draw_graph(data) {
      //	data stores
      var graph, store;

      //	svg selection and sizing
      let width = $('svg#graph').width()
      let height = $('svg#graph').height()
      let svgDOM = d3.select('svg#graph')
        .attr('class', 'groupbox')
        .attr("viewBox", "0 0 " + width + " " + height)
        .attr("preserveAspectRatio", "xMidYMid meet");

      var radius = 5;
      var svg = svgDOM.append('g');
      var groupingForce = forceInABox()
        .strength(0.05)
        // .strength(1)
        .groupBy('community')
        .size([width, height]);

      var link = svg.append("g")
        .selectAll('line'),
        node = svg.append("g")
        .selectAll(".node");

      //	force simulation initialization

      var simulation = d3.forceSimulation().force("link", d3.forceLink().id(function(d) {
          return d.id;
        })).force("charge", d3.forceManyBody().strength(function() {
          return -400;
        }).distanceMax(200).distanceMin(20))
        .force('collision', d3.forceCollide().radius(20))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force('group', groupingForce)
      var nodeByID = {};

      //	data read and store
      data.nodes.forEach(function(n) {
        nodeByID[n.id] = n;
      });

      data.links.forEach(function(l) {
        l.sourceGroup = nodeByID[l.source].group;
        l.targetGroup = nodeByID[l.target].group;
      });

      graph = data;
      store = $.extend(true, {}, data);
      //	filtered types
      var typeFilterList = [];

      let _this = this
      var [legend,legendCircle] =addLegend(svg,radius,['current','pre','suc','costudy','sup','inf'])
      legend.attr("transform", (d, i) => `translate(${width-120},${i * 30+80})`)

      legend.on("click",function(d){
          if (d.value=="3") {
            return;
          }
          d.grey=!d.grey
          var id = d.value;
          if (typeFilterList.includes(id)) {
            typeFilterList.splice(typeFilterList.indexOf(id), 1)
          } else {
            typeFilterList.push(id);
          }
          filter();
          update();
      });
      update(true);

      //	general update pattern for updating the graph
      function update(first = false) {
        let newNode, circle
        if(legendCircle){
          legendCircle.attr("fill", (d)=>{
            if(d.grey){
              return "grey"
            }
            return d.color
          })
        }

        if (first) {
          node = node.data(graph.nodes, function(d) {
              return d.id;
            })
            .enter()
            .append('g')
            .call(d3.drag()
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended)
            )
          //	ENTER
          circle = node.append('circle')
            .attr('r', 5)
            .attr('fill', function(d) {
              return d.color
            })
          // 文字
          node.append('text')
            .attr('x', -6)
            .attr('y', 6)
            .attr('dy', 10)
            .attr("opacity", 0.6)
            .attr("pointer-events", "none")
            .style("font-family", "sans-serif")
            .style("font-size", "0.8em")
            .text(function(d) {
              return d.name
            })
        } else {
          node = node.data(graph.nodes, function(d) {
            return d.id;
          })
          node.exit().remove();
          //	EXIT
          newNode = node
            .enter()
            .append('g')
            .call(d3.drag()
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended)
            )
          //	ENTER
          circle = newNode.append('circle')
            .attr('r', 5)
            .attr('fill', function(d) {
              return d.color
            })
          // 文字
          newNode.append('text')
            .attr('x', -6)
            .attr('y', 6)
            .attr('dy', 10)
            .attr("opacity", 0.6)
            .attr("pointer-events", "none")
            .style("font-family", "sans-serif")
            .style("font-size", "0.8em")
            .text(function(d) {
              return d.name
            })
          node = node.merge(newNode);

        }
        circle.on('click', function(d) {
            $(".tool-tip").hide()
            _this.$emit("search", d.name)
        })
        addTooltip(d3.select("#graph_container"),circle)
        //	UPDATE
        link = link.data(graph.links, function(d) {
          return d.id;
        });
        //	EXIT
        link.exit().remove();
        //	ENTER
        var newLink = link.enter().append("line")
          .attr("class", "link")
          .attr("stroke", "#999")
          .attr("stroke-opacity", 0.4)
          .attr('stroke-width', 1)
          .attr("marker-end", (d) => {
            return (d.targetGroup != "2") ? "url(#arrow)":"none"
          })
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
        newLink.append("title")
          .text(function(d) {
            return "source: " + d.source + "\n" + "target: " + d.target;
          });
        //	ENTER + UPDATE
        link = link.merge(newLink);

        //	update simulation nodes, links, and alpha
        simulation
          .nodes(graph.nodes)
          .on("tick", ticked);

        simulation.force("link")
          .links(graph.links)
        simulation.alpha(1).alphaTarget(0).restart();
      }

      //	drag event handlers
      function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }

      function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }
      zoom(svgDOM, svg)
      //	tick event handler with bounded box
      function ticked() {
        node
          .attr("cx", function(d) {
            return d.x = Math.max(radius, Math.min(width - radius, d.x));
          })
          .attr("cy", function(d) {
            return d.y = Math.max(radius, Math.min(height - radius, d.y));
          });

        link
          .attr("x1", function(d) {
            return d.source.x;
          })
          .attr("y1", function(d) {
            return d.source.y;
          })
          .attr("x2", function(d) {
            return d.target.x;
          })
          .attr("y2", function(d) {
            return d.target.y;
          });
        node.attr('transform', function(d) {
          return 'translate(' + d.x + ',' + d.y + ')'
        })
      }

      //	filter function
      function filter() {
        //	add and remove nodes from data based on type filters
        store.nodes.forEach(function(n) {
          if (!typeFilterList.includes(n.group) && n.filtered) {
            //不在筛选列表中且被筛选掉了 加入节点
            n.filtered = false;
            graph.nodes.push($.extend(true, {}, n));
          } else if (typeFilterList.includes(n.group) && !n.filtered) {
            //在筛选列表中且未被筛选掉 删除该节点
            n.filtered = true;
            graph.nodes.forEach(function(d, i) {
              if (n.id === d.id) {
                graph.nodes.splice(i, 1);
              }
            });
          }
        });

        //	add and remove links from data based on availability of nodes
        store.links.forEach(function(l) {
          if (!(typeFilterList.includes(l.sourceGroup) || typeFilterList.includes(l.targetGroup)) && l.filtered) {
            //加入link
            l.filtered = false;
            graph.links.push($.extend(true, {}, l));
          } else if ((typeFilterList.includes(l.sourceGroup) || typeFilterList.includes(l.targetGroup)) && !l.filtered) {
            //筛选掉link
            l.filtered = true;
            graph.links.forEach(function(d, i) {
              if (l.id === d.id) {
                graph.links.splice(i, 1);
              }
            });
          }
        });
      }

      function forceInABox() {
        function index(d) {
          return d.index;
        }

        var id = index,
          nodes,
          links, //needed for the force version
          tree,
          size = [100, 100],
          nodeSize = 1, // The expected node size used for computing the cluster node
          forceCharge = -2,
          // forceCharge = 100,
          foci = {},
          // oldStart = force.start,
          templateNodesSel,
          // linkStrengthIntraCluster = 0.1,
          // linkStrengthIntraCluster = 10,
          // linkStrengthInterCluster = 0.01,
          // oldGravity = force.gravity(),
          templateNodes = [],
          offset = [0, 0],
          groupBy = function(d) {
            return d.cluster;
          },
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

          nodes.forEach(function(d) {
            if (!clustersCounts.has(groupBy(d))) {
              clustersCounts.set(groupBy(d), 0);
            }
          });

          nodes.forEach(function(d) {
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
          for (i = 0; i < clustersList.length; i += 1) {
            c = clustersList[i];
            size = clustersCounts.get(c);
            children.push({
              id: c,
              size: size
            });
          }
          return {
            id: "clustersTree",
            children: children
          };
        }


        function getFocisFromTemplate() {
          //compute foci
          foci.none = {
            x: 0,
            y: 0
          };
          templateNodes.forEach(function(d) {
            foci[d.data.id] = {
              x: (d.x0 + (d.x1 - d.x0) / 2) - offset[0],
              y: (d.y0 + (d.y1 - d.y0) / 2) - offset[1],
            };
          });
        }

        function initializeWithTreemap() {
          var treemap = d3.treemap()
            .tile(d3.treemapDice)
            .size(force.size())
          tree = d3.hierarchy(getGroupsTree())
            .sum(function() {
              return 1;
            })
            .sort(function(a, b) {
              // return b.height - a.height ||
              return a.data.id - b.data.id;
            });

          templateNodes = treemap(tree).leaves();
          getFocisFromTemplate();
        }
        function drawGraph(container) {
          container.selectAll(".cell").remove();
          templateNodesSel = container.selectAll("cell")
            .data(templateNodes);
          templateNodesSel
            .enter().append("svg:circle")
            .attr("class", "cell")
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; })
            .attr("r", function (d) { return d.size*nodeSize; });

        }
        function drawTreemap(container) {
          container.selectAll(".cell").remove();
          container.selectAll("cell")
            .data(templateNodes)
            .enter().append("svg:rect")
            // .attr("id", d => (d.leafUid = DOM.uid("leaf")).id)
            .attr("class", "cell")
            .attr("x", function(d) {
              return d.x0;
            })
            .attr("y", function(d) {
              return d.y0;
            })
            .attr("width", function(d) {
              return d.x1 - d.x0;
            })
            .attr("height", function(d) {
              return d.y1 - d.y0;
            });

        }

        force.drawTemplate = function(container) {
          drawTreemap(container);
          drawGraph(container);
          return force;
        };

        //Backwards compatibility
        force.drawTreemap = force.drawTemplate;

        force.deleteTemplate = function(container) {
          // showingTemplate = false;
          container.selectAll(".cell").remove();

          return force;
        };


        force.template = function(x) {
          if (!arguments.length) return template;
          template = x;
          initialize();
          return force;
        };

        force.groupBy = function(x) {
          if (!arguments.length) return groupBy;
          if (typeof x === "string") {
            groupBy = function(d) {
              return d[x];
            };
            return force;
          }
          groupBy = x;
          return force;
        };


        force.enableGrouping = function(x) {
          if (!arguments.length) return enableGrouping;
          enableGrouping = x;
          return force;
        };

        force.strength = function(x) {
          if (!arguments.length) return strength;
          strength = x;
          return force;
        };

        force.id = function(_) {
          return arguments.length ? (id = _, force) : id;
        };

        force.size = function(_) {
          return arguments.length ? (size = _, force) : size;
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

    }
  }
}
</script>
<style type="scss" scoped>
svg.groupbox rect.cell {
  fill: none;
  stroke: #ddd;
  stroke-width: 2px;
}
</style>
