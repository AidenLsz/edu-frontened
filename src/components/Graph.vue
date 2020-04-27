<template>
  <div>
    <svg width="930" height="760"></svg>
  </div>
</template>
<script>
import * as d3 from "d3";
import d3Tip from "d3-tip";
export default {
  name: "Graph",
  props: {
    node: {
      type: Object,
      default: function() {
        return { message: "hello" };
      }
    },
    neighbors_groups: {
      type: Object,
      default: function() {
        return { message: "hello" };
      }
    },
    inward_arrow: {
      type: Number,
      default: 0
    },
    outward_arrow: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      msg: "hi"
    };
  },
  watch: {
    node: {
      handler() {
        this.draw_graph();
      },
      deep: true
    }
  },
  methods: {
    draw_graph() {
      // 改线条颜色
      var directedLen = this.inward_arrow + this.outward_arrow;
      // 动态添加边属性

      // 生成图
      // 先清空画布
      d3.selectAll("svg > *").remove();

      let state = {
        nodes: [
          {
            id: this.node.name,
            desc: "this is " + this.node.name,
            type: 0,
            hidden: false,
            lock: false,
            hideSymbol: null,
            lockSymbol: null
          }
        ],
        links: []
      };

      // 显示最新人教版
      for (var i = 0; i < this.neighbors_groups["kp2.0"].length; i++) {
        state.nodes[i + 1] = {
          id: this.neighbors_groups["kp2.0"][i].name,
          desc: "this is " + this.neighbors_groups["kp2.0"][i].name,
          type: 1,
          hidden: false,
          lock: false,
          hideSymbol: null,
          lockSymbol: null
        };
        if (i < this.inward_arrow) {
          state.links[i] = {
            source: this.neighbors_groups["kp2.0"][i].name,
            target: this.node.name,
            width: 3,
            curved: false
          };
        } else {
          state.links[i] = {
            source: this.node.name,
            target: this.neighbors_groups["kp2.0"][i].name,
            width: 3,
            curved: false
          };
        }

        // console.log(state.links[i]);
      }

      let selectedNode;
      let nodeSize = 25;
      let buttonFlag = 0;
      let hideFlag = 0;

      let colorScale = d3.scaleOrdinal(d3.schemeCategory10);
      let svg = d3.select("svg");
      let width = +svg.attr("width");
      let height = +svg.attr("height");
      let g = svg.append("g").attr("class", "everything");
      let link = g
        .append("g")
        .attr("class", "links")
        .selectAll("line");
      let node = g
        .append("g")
        .attr("class", "nodes")
        .selectAll("circle");
      // 添加文字
      let text = g.append("g").selectAll("text");

      // setup the tool tip
      var toolTip = d3Tip()
        .attr("class", "d3-tip")
        .offset([-8, 0])
        .html(function(d) {
          return "<p>" + d.desc + "</p>";
        });
      svg.call(toolTip);

      svg
        .append("defs")
        .append("marker")
        .attr("id", "straight")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 4)
        .attr("refY", 0)
        .attr("markerWidth", 3)
        .attr("markerHeight", 3)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-4L8,0L0,4")
        .style("fill", "#66b3ff");

      svg
        .append("defs")
        .append("marker")
        .attr("id", "curved")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 0)
        .attr("refY", 0)
        .attr("markerWidth", 4)
        .attr("markerHeight", 4)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-4L8,0L0,4");

      let arcGenerator = d3
        .arc()
        .innerRadius(nodeSize * 1.1)
        .outerRadius(nodeSize * 2);

      let arcBigger = d3
        .arc()
        .innerRadius(nodeSize * 1.1)
        .outerRadius(nodeSize * 2.5);

      let pieData = d3.pie()([60, 60, 20, 20, 20]);
      let pies = g
        .append("g")
        .attr("class", "pie button")
        .selectAll("whatever")
        .data(pieData)
        .enter();

      let pieGs = pies.append("path");

      pieGs
        .attr("d", function(d) {
          return null;
        })
        .attr("fill", function(d, i) {
          return colorScale(i);
        })
        .attr("opacity", 0.8)
        .on("mouseover", function(d, i) {
          if (buttonFlag) {
            d3.select(this)
              .transition()
              .duration(200)
              .attr("d", arcBigger(d))
              .attr("opacity", 0.6);
          }
        })
        .on("mouseout", function(d, i) {
          if (buttonFlag) {
            d3.select(this)
              .transition()
              .duration(200)
              .attr("d", arcGenerator(d))
              .attr("opacity", 0.8);
          }
        })
        .on("click", function(d, index) {
          buttonFlag = 0;
          hideFlag = 0;
          pieGs
            .attr("d", function() {
              return null;
            })
            .interrupt();
          hideSymbol
            .attr("xlink:href", function(d) {
              d.hideSymbol = null;
              return null;
            })
            .interrupt();
          lockSymbol
            .attr("xlink:href", function(d) {
              d.lockSymbol = null;
              return null;
            })
            .interrupt();
          if (index === 0) {
            // Hide the node
            hideFlag = 1;
            selectedNode.each(function(d) {
              d.hidden = true;
            });
            hideFlag = 0;
            console.log("hide");
          } else if (index === 1) {
            // unlock the node; default to lock
            selectedNode.each(function(d) {
              d.fx = null;
              d.fy = null;
            });
            console.log("unlock");
          } else {
            // Change the color of the node
            selectedNode.style("fill", colorScale(index));
            console.log("change the color");
          }
        });

      let lockSymbol = g
        .append("g")
        .attr("class", "lockSymbol")
        .selectAll("lockSymbol");
      let hideSymbol = g
        .append("g")
        .attr("class", "hideSymbol")
        .selectAll("hideSymbol");
      // add the symbol of each button
      hideSymbol = hideSymbol.data(state.nodes, function(d) {
        return d.id;
      });
      hideSymbol.exit().remove();
      hideSymbol = hideSymbol
        .enter()
        .append("image")
        .attr("xlink:href", function(d) {
          d.hideSymbol = null;
          return null;
        })
        .attr("width", 20)
        .attr("height", 20);

      lockSymbol = lockSymbol.data(state.nodes, function(d) {
        return d.id;
      });
      lockSymbol.exit().remove();
      lockSymbol = lockSymbol
        .enter()
        .append("image")
        .attr("xlink:href", function(d) {
          d.lockSymbol = null;
          return null;
        })
        .attr("width", 20)
        .attr("height", 20);

      let currentTransform = "";

      function zoomed() {
        currentTransform = d3.event.transform;
        g.attr("transform", currentTransform);
      }

      let zoom = d3
        .zoom()
        .scaleExtent([1 / 8, 1.5])
        .on("zoom", zoomed);
      // svg.call(zoom);
      zoom(svg);

      function ticked() {
        return function() {
          link
            .attr("d", getPath)
            // Hide the link.
            .attr("display", function(d) {
              return d.source.hidden || d.target.hidden ? "none" : "";
            });

          text.attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
          });

          node
            .attr("cx", function(d) {
              if (d.lock) {
                d.fx = d.x;
              }
              return d.x;
            })
            .attr("cy", function(d) {
              if (d.lock) {
                d.fy = d.y;
              }
              return d.y;
            })
            // Hide the node.
            .attr("display", function(d) {
              return d.hidden ? "none" : "";
            });
          // add the symbol
          hideSymbol
            .attr("x", function(d) {
              return d.x + 26;
            })
            .attr("y", function(d) {
              return d.y - 20;
            });
          lockSymbol
            .attr("x", function(d) {
              return d.x - 9.5;
            })
            .attr("y", function(d) {
              return d.y + 29;
            });

          if (buttonFlag) {
            pieGs.attr("transform", function() {
              return (
                "translate(" +
                selectedNode.attr("cx") +
                "," +
                selectedNode.attr("cy") +
                ")"
              );
            });
          }
        };
      }
      // force simulation
      let simulation = d3
        .forceSimulation()
        // Remove the charge of hidden nodes.
        .force(
          "charge",
          d3.forceManyBody().strength(function(d) {
            if (d.hidden) return 0;
            else return -25;
          })
        )
        // Change the strength of link force for hidden nodes.
        .force(
          "link",
          d3
            .forceLink()
            .strength(function(d) {
              if (d.source.hidden || d.target.hidden) return 0;
              else return 0.8;
            })
            .distance(function(d) {
              // 控制节点间距离
              return ((d.target.id.length % 6) + 2) * 40;
            })
            .id(function(d) {
              return d.id;
            })
        )
        .force("center", d3.forceCenter(width / 2, height / 2))
        .velocityDecay(0.2)
        .on("tick", ticked);

      simulation.nodes(state.nodes).on("tick", ticked());
      simulation.force("link").links(state.links);

      // function reset() {
      //   svg
      //     .transition()
      //     .duration(750)
      //     .call(zoom.transform, d3.zoomIdentity);
      // }

      // d3.select("button").on("click", reset);

      function dragStarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }

      function dragEnded(d, i) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }

      function getPath(d) {
        var r = 30;
        if (d.target.selected) {
          r = 40;
        }
        var dx = d.target.x - d.source.x;
        var dy = d.target.y - d.source.y;
        var dr = Math.sqrt(dx * dx + dy * dy);
        var pathLength = Math.sqrt(dx * dx + dy * dy);
        var offsetX = (dx * r) / pathLength;
        var offsetY = (dy * r) / pathLength;
        if (d.curved) {
          var sinx = r / 2 / dr;
          var cosx = Math.sqrt(1 - sinx * sinx);
          var diffX = dx * cosx + dy * sinx;
          var diffY = dy * cosx - dx * sinx;
          var tx = d.source.x + diffX - offsetX;
          var ty = d.source.y + diffY - offsetY;
          return (
            "M" +
            d.source.x +
            "," +
            d.source.y +
            "A" +
            dr +
            "," +
            dr +
            " 0 0,1 " +
            tx +
            "," +
            ty
          );
        } else {
          return (
            "M" +
            d.source.x +
            "," +
            d.source.y +
            "L" +
            (d.target.x - offsetX) +
            "," +
            (d.target.y - offsetY)
          );
        }
      }

      // update nodes and links
      function updateStates() {
        // 加文字开始
        text = text
          .data(state.nodes)
          .enter()
          .append("text")
          .attr("dy", ".35em")
          .attr("text-anchor", "middle")
          .style("fill", "#fff")
          .style("font-size", "12px")
          .attr("x", function(d) {
            var reEn = /[a-zA-Z]+/g;
            // 如果是全英文，不换行
            if (d.id.match(reEn)) {
              d3.select(this)
                .append("tspan")
                .attr("x", 0)
                .attr("y", 0)
                .text(function() {
                  return d.id;
                });
            }
            // 如果小于3个字符，不换行
            else if (d.id.length <= 3) {
              d3.select(this)
                .append("tspan")
                .attr("x", 0)
                .attr("y", 0)
                .text(function() {
                  return d.id;
                });
            } else {
              var top = d.id.substring(0, 3);
              var bot = d.id.substring(3, d.id.length);

              d3.select(this).text(function() {
                return "";
              });

              d3.select(this)
                .append("tspan")
                .attr("x", 0)
                .attr("y", -7)
                .text(function() {
                  return top;
                });

              d3.select(this)
                .append("tspan")
                .attr("x", 0)
                .attr("y", 14)
                .text(function() {
                  return bot;
                });
            }
          });
        // 加文字结束
        node = node.data(state.nodes, function(d) {
          return d.id;
        });
        node.exit().remove();
        node = node
          .enter()
          .append("circle")
          .attr("transform", currentTransform)
          .merge(node)
          .attr("class", function(d) {
            return d.selected ? "selected" : "";
          })
          .attr("fill", function(d) {
            return colorScale(d.type);
          })
          .call(
            d3
              .drag()
              .on("start", dragStarted)
              .on("drag", dragged)
              .on("end", dragEnded)
          )
          .on("click", function(d) {
            if (hideFlag === 0) {
              if (buttonFlag) {
                buttonFlag = 0;
                hideSymbol
                  .attr("xlink:href", function(d) {
                    d.hideSymbol = null;
                    return null;
                  })
                  .interrupt();
                lockSymbol
                  .attr("xlink:href", function(d) {
                    d.lockSymbol = null;
                    return null;
                  })
                  .interrupt();
                pieGs
                  .attr("d", function() {
                    return null;
                  })
                  .interrupt();
              } else {
                selectedNode = d3.select(this);
                buttonFlag = 1;
                selectedNode.each(function(d) {
                  d.hideSymbol = "/static/hide.png";
                  d.lockSymbol = "/static/unlock.png";
                });
                hideSymbol.attr("xlink:href", function(d) {
                  return d.hideSymbol;
                });
                lockSymbol.attr("xlink:href", function(d) {
                  return d.lockSymbol;
                });
                // console.log(selectedNode);
                pieGs
                  .attr("d", function(d) {
                    return arcGenerator(d);
                  })
                  .attr("transform", d3.select(this).attr("transform"));
              }
            }
          })
          .on("mouseover", toolTip.show)
          .on("mouseout", toolTip.hide);
        link = link.data(state.links, function(d) {
          return d.source + d.target;
        });
        link.exit().remove();
        link = link
          .enter()
          .append("path")
          .attr("transform", currentTransform)
          .merge(link)
          .attr("marker-end", function(d) {
            if (d.index < directedLen) {
              return "url(#straight)";
            } else {
              return "";
            }
          })
          .attr("stroke-width", function(d) {
            return d.width;
          })
          .style("stroke", function(d) {
            if (d.index < directedLen) {
              return "#66b3ff";
            } else {
              return "#000000";
            }
          });

        simulation.nodes(state.nodes);
        simulation.force("link").links(state.links);
        simulation.alpha(0.5).restart();
      }
      updateStates();
    }
  }
};
</script>
<style>
.links path {
  fill: none;
  stroke: #999;
  stroke-opacity: 0.6;
}
marker {
  fill: #999;
  opacity: 0.8;
}
.nodes circle {
  stroke: #fff;
  stroke-width: 3px;
  r: 25px;
}
text {
  pointer-events: none;
}
image {
  pointer-events: none;
}
.d3-tip {
  line-height: 1;
  width: 20%;
  padding: 6px;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  border-radius: 4px;
  font-size: 10px;
}
/* Creates a small triangle extender for the tooltip */
.d3-tip:after {
  box-sizing: border-box;
  display: inline;
  font-size: 10px;
  width: 100%;
  line-height: 1;
  color: rgba(0, 0, 0, 0.8);
  content: "\25BC";
  position: absolute;
  text-align: center;
}
/* Style northward tooltips specifically */
.d3-tip.n:after {
  margin: -2px 0 0 0;
  top: 100%;
  left: 0;
}
</style>
