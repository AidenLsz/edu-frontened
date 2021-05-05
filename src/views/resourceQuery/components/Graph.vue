<template lang="html">
  <svg id="graph" width="100%" height="100%"></svg>
</template>

<script>
import * as d3 from "d3";
import $ from "jquery";
import {
  zoom,color,addTooltip
} from './common.js'

export default {
  props: {
    node: {
      type: Object,
      default: function() {
        return {
          message: ""
        };
      }
    },
    neighbors_groups: {
      type: Object,
      default: function() {
        return {
          message: ""
        };
      }
    },
    inward_arrow: {
      type: Number,
      default: 0
    },
    outward_arrow: {
      type: Number,
      default: 0
    },
    undirected_len: {
      type: Number,
      default: 0
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
  watch: {
    node: {
      handler() {
        this.draw_graph();
      },
      deep: true
    },
  },
  mounted() {
    this.draw_graph()
  },
  methods: {
    handleData() {
      let data = {}
      let nodes = [];
      let nodeCount = 0;
      let edgeCount = 0;
      let edges = []
      let lenMin = 1.5,
        lenMax = 2;
      nodes.push({
        id: nodeCount++,
        name: this.node.name,
        community: 3,
        group: "3",
        desc: this.node.description,
      })
      //前驱后继
      let ng = this.neighbors_groups["kp2.0"]
      for (let i = 0; i < this.inward_arrow; i++, nodeCount++, edgeCount++) {
        nodes.push({
          id: nodeCount,
          name: ng[i].name,
          community: 0,
          group: "0",
          desc: ng[i].annotation.split("description-")[1],
        })
        edges.push({
          id: edgeCount,
          source: nodeCount,
          target: 0,
          relation: '',
          value: Math.random() * (lenMax - lenMin) + lenMin,
        })
      }
      for (let i = this.inward_arrow; i < this.inward_arrow + this.outward_arrow; i++, nodeCount++, edgeCount++) {
        nodes.push({
          id: nodeCount,
          name: ng[i].name,
          community: 5,
          group: "5",
          desc: ng[i].annotation.split("description-")[1],
        })
        edges.push({
          id: edgeCount,
          source: 0,
          target: nodeCount,
          relation: '',
          value: Math.random() * (lenMax - lenMin) + lenMin,
        })
      }
      //共同学习
      for (let i = this.inward_arrow + this.outward_arrow; i < ng.length; i++, nodeCount++, edgeCount++) {
        nodes.push({
          id: nodeCount,
          name: ng[i].name,
          community: 2,
          group: "2",
          desc: ng[i].annotation.split("description-")[1],
        })
        edges.push({
          id: edgeCount,
          source: 0,
          target: nodeCount,
          relation: '',
          value: Math.random() * (lenMax - lenMin) + lenMin,
        })
      }
      //层级关系
      let nh = this.neighbors_hierarchy
      for (let i = 0; i < this.superior_layer; i++, nodeCount++, edgeCount++) {
        nodes.push({
          id: nodeCount,
          name: nh[i],
          group: "1",
          community: 1,
        })
        edges.push({
          id: edgeCount,
          source: nodeCount,
          target: 0,
          relation: '',
          value: Math.random() * (lenMax - lenMin) + lenMin,
        })
      }
      for (let i = this.superior_layer; i < this.inferior_layer + this.superior_layer; i++, nodeCount++, edgeCount++) {
        nodes.push({
          id: nodeCount,
          name: nh[i],
          community: 4,
          group: "4",
        })
        edges.push({
          id: edgeCount,
          source: 0,
          target: nodeCount,
          relation: '',
          value: Math.random() * (lenMax - lenMin) + lenMin,
        })
      }
      data.nodes = nodes
      data.links = edges
      return data;
    },
    draw_graph() {
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
        .strength(0.1)
        .groupBy('community')
        .size([width, height]);
      //	d3 color scales

      var link = svg.append("g")
        .selectAll('line'),
        node = svg.append("g")
        .selectAll(".node");

      //	force simulation initialization

      var simulation = d3.forceSimulation().force("link", d3.forceLink().id(function(d) {
          return d.id;
        })).force("charge", d3.forceManyBody().strength(function() {
          return -500;
        })).force("center", d3.forceCenter(width / 2, height / 2))
        .force('group', groupingForce)
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('x', d3.forceX(width / 2).strength(0.02))
        .force('y', d3.forceY(height / 2).strength(0.04));

      var data = this.handleData()
      var nodeByID = {};

      //	data read and store
      data.nodes.forEach(function(n) {
        nodeByID[n.id] = n;
      });

      data.links.forEach(function(l) {
        l.sourceGroup = nodeByID[l.source].group.toString();
        l.targetGroup = nodeByID[l.target].group.toString();
      });

      graph = data;
      store = $.extend(true, {}, data);
      //	filtered types
      var typeFilterList = [];




      let _this = this
      const dataDict = [{
        name: "前驱节点",
        value: "0",
        color: 0,
        grey:false
      },
      {
        name: "后继节点",
        value: "5",
        color: 5,
        grey:false
      },
      {
        name: "共同学习节点",
        value: "2",
        color: 2,
        grey:false
      },{
        name: "上级节点",
        value: "1",
        color: 1,
        grey:false
      },{
        name: "下级节点",
        value: "4",
        color: 4,
        grey:false
      }]
      var legend = svg.selectAll("legend")
        .data(dataDict)
        .enter().append("g")
        .attr("transform", (d, i) => `translate(${width - 120},${i * 30+80})`)
        .on("click",function(d){
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
      let legendCircle;
      legendCircle = legend.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", radius)
        .attr("stroke", "black")
        .attr("fill", (d)=>{
          if(d.grey){
            return "grey"
          }
          return color(d.color)
        })

      legend.append("text")
        .attr("x", 15)
        .attr("y", 5)
        .style("font-family", "Trebuchet MS")
        .text(d => d.name);
      update(true);

      //	general update pattern for updating the graph
      function update(first = false) {
        let newNode, circle
        if(legendCircle){
          legendCircle.attr("fill", (d)=>{
            if(d.grey){
              return "grey"
            }
            return color(d.color)
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
            .attr("stroke", "black")
            .attr('fill', function(d) {
              return color(d.community)
            })
          // 文字
          // let newNode =
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
            .attr("stroke", "black")
            .attr('fill', function(d) {
              return color(d.community)
            })
          // 文字
          // let newNode =
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
            return (d.sourceGroup == "0" || d.targetGroup == "5") ? "url(#arrow)":"none"
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
          .distance(function(d) { // 每一边的长度
            return d.value * 100
          })
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
          linkStrengthIntraCluster = 0.1,
          // linkStrengthInterCluster = 0.01,
          linkStrengthInterCluster = 0.01,
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
            .size(force.size());
          tree = d3.hierarchy(getGroupsTree())
            .sum(function(d) {
              return d.size;
            })
            .sort(function(a, b) {
              return b.height - a.height || a.data.id - b.data.id;
            });

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

        force.getLinkStrength = function(e) {
          if (enableGrouping) {
            if (groupBy(e.source) === groupBy(e.target)) {
              if (typeof(linkStrengthIntraCluster) === "function") {
                return linkStrengthIntraCluster(e);
              } else {
                return linkStrengthIntraCluster;
              }
            } else {
              if (typeof(linkStrengthInterCluster) === "function") {
                return linkStrengthInterCluster(e);
              } else {
                return linkStrengthInterCluster;
              }
            }
          } else {
            // Not grouping return the intracluster
            if (typeof(linkStrengthIntraCluster) === "function") {
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

    }
  }
}
</script>
