<template>
  <div>
    <svg width="900" height="780"></svg>
  </div>
</template>
<script>
var d3 = require("d3");
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
    neighbors_hierarchy: {
      type: Array,
      default: () => []
    },
    inward_arrow: {
      type: Number,
      default: 0
    },
    outward_arrow: {
      type: Number,
      default: 0
    },
    superior_layer: {
      type: Number,
      default: 0
    },
    inferior_layer: {
      type: Number,
      default: 0
    },
    selected_type:{
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      msg: "hi",
    };
  },
  watch: {
    node: {
      handler() {
        this.draw_graph_Single();
      },
      deep: true
    },
    selected_type: {
      handler(){
        this.Type_Change();
      },
      deep: true
    }
  },
  methods: {
    Type_Change(){
      return
    },
    draw_graph() {
      
      // 改线条颜色
      var directedLen = this.inward_arrow + this.outward_arrow;
      let _this = this;
      var KnowledgePoint = "";

      let Node_Color_List = ["#EDB664","#9ECCAB"]
      let Ray_Color_List = ["#EDB664", "#409EFD", "#9ECCAB"]

      // 生成图
      // 先清空画布
      d3.selectAll("svg > *").remove();

      let state = {
        nodes: [
          {
            id: this.node.name,
            desc: "this is " + this.node.description,
            type: 0,
            hidden: false,
            lock: false,
            hideSymbol: null,
            lockSymbol: null,
            searchSymbol: null
          }
        ],
        links: []
      };

      // 显示最新人教版
      // 将所有的邻居节点塞进去，并给所有导入至node的节点的方向设为从自己到node，将node引出的节点或平行节点方向设为node到节点
      for (var i = 0; i < this.neighbors_groups["kp2.0"].length; i++) {
        state.nodes[i + 1] = {
          id: this.neighbors_groups["kp2.0"][i].name,
          desc: "this is " + this.neighbors_groups["kp2.0"][i].name,
          type: 1,
          hidden: false,
          lock: false,
          hideSymbol: null,
          lockSymbol: null,
          searchSymbol: null
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
      }

      let selectedNode;
      let nodeSize = 25;
      let buttonFlag = 0;
      let hideFlag = 0;

      // 经典调色盘
      // 获取画布(SVG)对象，并添加宽度和高度属性
      // let colorScale = d3.scaleOrdinal(d3.schemeCategory10);
      let svg = d3.select("svg");
      let width = +svg.attr("width");
      let height = +svg.attr("height");
      // 给画布添加一个组，并给组添加名为everything的class
      let g = svg.append("g").attr("class", "everything");
      // 给组添加线模型
      let link = g
        .append("g")
        .attr("class", "links")
        .selectAll("line");
      // 给组添加知识点的圆模型
      let node = g
        .append("g")
        .attr("class", "nodes")
        .selectAll("circle");
      // 添加文字
      let text = g
        .append("g")
        .selectAll("text");

      // setup the tool tip
      var toolTip = d3Tip()
        .attr("class", "d3-tip")
        .offset([-8, 0])
        .html(function(d) {
          return "<p>" + d.desc + "</p>";
        });
      svg.call(toolTip);

      // 给画布添加属性
      // 一个是给ID为straight的部分，这部分是箭头的顶端三角形的配置
      // d属性是路径，通过这两个部分的D属性一致，可知这两部分画的都是箭头顶端的三角形
      // 另一个是给ID为curved的部分，这部分
      svg
        .append("defs")
        .append("marker")
        .attr("id", "straight")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 4)
        .attr("refY", 0)
        .attr("markerWidth", 5)
        .attr("markerHeight", 5)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-4L8,0L0,4")
        .style("fill", "#EDB664");

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

      // 设置点击知识点圆时弹出的那个圆环大小
      let arcGenerator = d3
        .arc()
        .innerRadius(nodeSize * 1)
        .outerRadius(nodeSize * 2.2);

      let arcBigger = d3
        .arc()
        .innerRadius(nodeSize * 1)
        .outerRadius(nodeSize * 3);

      // 这里设置了每个圆环的弧度大小比例即可，不是非要写角度大小
      // 它的实际意义是总和的分子而不是实际值
      let pieData = d3.pie()([1, 1, 2]);
      let pies = g
        .append("g")
        .attr("class", "pie button")
        .selectAll()
        .data(pieData)
        .enter();

      // 这个是路径，代表从A到B的线条
      let pieGs = pies.append("path");
      // "d"属性代表了Data的简写，实际上代表了这条路径的起始，起点，过程，终点，停止的过程路径
      // 简单来说：
      // M = Move, L = Line To, H = Horizontal Line To, V = Vertical Line To, Z = closepath
      // 剩下的都是些曲线，这儿应该不太会用到
      pieGs
        .attr("d", function() {
          return null;
        })
        // 调整知识点点击出来的环的颜色
        .attr("fill", function(d, i) {
          return Ray_Color_List[i];
        })
        // 添加透明度
        .attr("opacity", 0.8)
        // 添加鼠标悬在上面的事件
        // 这两个画弧都是通过调用生成器后，把D传进去完成的
        // 同时添加了透明度属性
        // 画了增大弧
        .on("mouseover", function(d) {
          if (buttonFlag) {
            d3.select(this)
              .transition()
              .duration(200)
              .attr("d", arcBigger(d))
              .attr("opacity", 0.6);
          }
        })
        // 添加鼠标移出上面的事件
        // 画了普通弧
        .on("mouseout", function(d) {
          if (buttonFlag) {
            d3.select(this)
              .transition()
              .duration(200)
              .attr("d", arcGenerator(d))
              .attr("opacity", 0.8);
          }
        })
        // 给知识点圆添加点击事件
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
          searchSymbol
            .attr("xlink:href", function(d){
              d.searchSymbol = null;
              return null;
          })
          .interrupt();
          // 0 - 4 : 隐藏，锁定，绿，红，紫
          // selectedNode指的是当前被点击到的那个知识点圆
          if (index === 0) {
            // Hide the node
            // 设置隐藏Flag为1
            // 设置知识点圆的隐藏属性为真
            hideFlag = 1;
            selectedNode.each(function(d) {
              d.hidden = true;
            });
            hideFlag = 0;
          } else if (index === 1) {
            // unlock the node; default to lock
            selectedNode.each(function(d) {
              d.fx = null;
              d.fy = null;
            });
          } else if (index === 2) {
            _this.$emit("Research", KnowledgePoint) 
          }
        });
      // 找到所有的被锁定或被隐藏的点
      let lockSymbol = g
        .append("g")
        .attr("class", "lockSymbol")
        .selectAll("lockSymbol");
      let hideSymbol = g
        .append("g")
        .attr("class", "hideSymbol")
        .selectAll("hideSymbol");
      let searchSymbol = g
        .append("g")
        .attr("class", "searchSymbol")
        .selectAll("searchSymbol");
      // add the symbol of each button
      // 给hideSymbol添加节点的ID值，并舍弃多余的部分
      // xlink:href是一个老的属性，指链接地址，现在新版本已经替换成用href了
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

      searchSymbol = searchSymbol.data(state.nodes, function(d) {
        return d.id;
      });
      searchSymbol.exit().remove();
      searchSymbol = searchSymbol
        .enter()
        .append("image")
        .attr("xlink:href", function(d) {
          d.searchSymbol = null;
          return null;
        })
        .attr("width", 20)
        .attr("height", 20);

      let currentTransform = "";

      // 放大显示的函数
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
          // 设置节点的位置
          // 若数据点的hidden属性为真，则display = none;直接隐藏起来
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
          // 设置文字内容的位置
          text.attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
          });
          link
            .attr("d", getPath)
            // Hide the link.
            // 若任何一方有hidden属性为true，则显示为none，即不显示连接线
            .attr("display", function(d) {
              return d.source.hidden || d.target.hidden ? "none" : "";
            });
          // add the symbol
          // 按照知识点中心位置进行偏移
          lockSymbol
            .attr("x", function(d) {
              return d.x - 40;
            })
            .attr("y", function(d) {
              return d.y - 32;
            });
          hideSymbol
            .attr("x", function(d) {
              return d.x - 40;
            })
            .attr("y", function(d) {
              return d.y + 15;
            });
          searchSymbol
            .attr("x", function(d) {
              return d.x + 25;
            })
            .attr("y", function(d) {
              return d.y - 12;
            });
          // 若当前这个点被点击了，则调整它周围的环进行显示
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

      // 力矩模拟，这说明这里用的是力矩显示模式
      // force simulation
      let simulation = d3
        .forceSimulation()
        // Remove the charge of hidden nodes.
        // 移除隐藏节点所施加的“力”
        .force(
          "charge",
          d3.forceManyBody().strength(function(d) {
            if (d.hidden) return 0;
            else return -25;
          })
        )
        // Change the strength of link force for hidden nodes.
        // 根据距离和隐藏属性设置力的大小
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
            // 返回知识点ID
            .id(function(d) {
              return d.id;
            })
        )
        .force("center", d3.forceCenter(width / 2, height / 2))
        // 力的衰减周期时间
        .velocityDecay(0.2)
        .on("tick", ticked);

      // 确定点和链接
      simulation.nodes(state.nodes).on("tick", ticked());
      simulation.force("link").links(state.links);

      // function reset() {
      //   svg
      //     .transition()
      //     .duration(750)
      //     .call(zoom.transform, d3.zoomIdentity);
      // }

      // d3.select("button").on("click", reset);

      // 下面三个方法设定了拖拽点时计算坐标的方法

      function dragStarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }

      function dragEnded(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }

      // 这里是计算路径过程的方法
      // 按照之前的标记符号来编写这条线所应当经过的路径
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
        // 若为弧形边
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
        } 
        // 若为直线边
        else {
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
      // 开始添加文字和边的实际样式
      function updateStates() {
        // 开始编写文字内容
        // 首先是编辑了文字的大小，对其方式，颜色，大小
        // 然后开始动态计算文字显示的中心点位置
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
            // 如果小于5个字符，不换行
            else if (d.id.length <= 5) {
              d3.select(this)
                .append("tspan")
                .attr("x", 0)
                .attr("y", 0)
                .text(function() {
                  return d.id;
                });
            } else {
              var top = d.id.substring(0, 5);
              var bot = d.id.substring(5, d.id.length);

              d3.select(this).text(function() {
                return "";
              });
              // 切换成两行的情况下，一行上面一点，一行下面一点，错开即可
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
        // 为了避免意外，去除多余的节点部分
        node.exit().remove();
        // 实际添加环的部分，之前控制了环的样式，这里需要实际将环添加上去
        node = node
          .enter()
          .append("circle")
          .attr("transform", currentTransform)
          .merge(node)
          .attr("class", function(d) {
            return d.selected ? "selected" : "";
          })
          .attr("fill", function(d, i) {
            if(i === 0){
              return "#409EFD"
            }
            else if(i - 1 < directedLen){
              return Node_Color_List[0];
            }else{
              return Node_Color_List[1]
            }
          })
          // 对应拖拽事件绑定对应的处理方法
          .call(
            d3
              .drag()
              .on("start", dragStarted)
              .on("drag", dragged)
              .on("end", dragEnded)
          )
          // 只有当非隐藏状态时，点击事件才会生效
          .on("click", function(d) {
            KnowledgePoint = d.id
            if (hideFlag === 0) {
              // 非隐藏状态，且点击的是当前按钮时，会触发对应按钮的点击事件
              if (buttonFlag) {
                
                buttonFlag = 0;
                // 把这个按钮对应的锁定和隐藏按钮都设置为null
                // 然后将它们原本用来设置配套图片的链接地址也设为null
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
                searchSymbol
                  .attr("xlink:href", function(d) {
                    d.searchSymbol = null;
                    return null;
                  })
                  .interrupt();
                pieGs
                  // 将这个点对应的路径也都设为Null
                  .attr("d", function() {
                    return null;
                  })
                  .interrupt();
              } else {
                selectedNode = d3.select(this);
                buttonFlag = 1;
                selectedNode.each(function(d) {
                  // 设置配套的图片
                  d.hideSymbol = require("./../../../assets/hide.png");
                  d.lockSymbol = require("./../../../assets/unlock.png");
                  d.searchSymbol = require("./../../../assets/search.png")
                });
                hideSymbol.attr("xlink:href", function(d) {
                  return d.hideSymbol;
                });
                lockSymbol.attr("xlink:href", function(d) {
                  return d.lockSymbol;
                });
                searchSymbol.attr("xlink:href", function(d) {
                  return d.searchSymbol;
                });
                // 生成环绕弧
                // 并调整弧的中心位置与知识点按钮的中心点一致
                pieGs
                  .attr("d", function(d) {
                    return arcGenerator(d);
                  })
                  .attr("transform", d3.select(this).attr("transform"));
              }
            }
          })
          // 绑定鼠标移入移除事件
          .on("mouseover", toolTip.show)
          .on("mouseout", toolTip.hide);
        
        // 最后是设定链接，并将多余的重复部分剔除
        link = link.data(state.links, function(d) {
          return d.source + d.target;
        });
        link.exit().remove();
        // 添加路径，重新定位，然后将这个新的路径merge到原来的link中去
        link = link
          .enter()
          .append("path")
          .attr("transform", currentTransform)
          .merge(link)
          // 根据节点的索引值来确定是否是带箭头的值
          // 如果是带箭头的值，那么会返回给他一个ID为straight的对象，即之前写好的三角形作为箭头的对象
          .attr("marker-end", function(d) {
            if (d.index < directedLen) {
              return "url(#straight)";
            } else {
              return "";
            }
          })
          // 设定线长度
          .attr("stroke-width", function(d) {
            return d.width;
          })
          // 设定线的颜色
          .style("stroke", function(d) {
            if (d.index < directedLen) {
              return "#EDB664";
            } else {
              return "#000000";
            }
          });
        // 这里在绑定节点和链接关系，然后开始模拟这个力矩图
        simulation.nodes(state.nodes);
        simulation.force("link").links(state.links);
        simulation.alpha(0.5).restart();
      }
      updateStates();
    },
    draw_graph_Single() {

      let _this = this;
      var KnowledgePoint = "";

      // 生成图
      // 先清空画布
      d3.selectAll("svg > *").remove();
      // 改线条颜色
      var directedLen = this.inward_arrow + this.outward_arrow;
      // 动态添加边属性
      let IA = this.inward_arrow;
      let OA = this.outward_arrow;

      var LayerLen = this.superior_layer + this.inferior_layer;
      let SL = this.superior_layer;

      let Node_Color_List = ["#EDB664","#9ECCAB", "#F1939C"]
      let Ray_Color_List = ["#EDB664", "#409EFD", "#9ECCAB", "#F1939C"]

      var Lock_Switch = true;

      var Front_chosen_list = []
      var After_chosen_list = []
      var Combo_chosen_list = []
      var Layer_chosen_list = []

      var Front_Axis = []
      var After_Axis = []
      var Combo_Axis = []
      var Layer_Axis = []

      for(var i = 30; i < 900; i = i + 60){
        for(var j = 30; j < 780; j = j + 60){
          if(i > 390 && i < 510 && j > 330 && j < 450){
            continue
          } else {
            if(i <= 330 && j <= 570 && j >= 210){
              Front_Axis.push([i,j])
              Front_chosen_list.push(false)
            }else if( j <= 570 && i >= 570 && j >= 210 ){
              After_Axis.push([i,j])
              After_chosen_list.push(false)
            }else if(i <= 510 && i >= 390 && j < 390){
              Combo_Axis.push([i,j])
              Combo_chosen_list.push(false)
            }else if(i <= 510 && i >= 390 && j > 390){
              Layer_Axis.push([i,j])
              Layer_chosen_list.push(false)
            }
          }
        }
      }

      let L = this.neighbors_groups["kp2.0"]?this.neighbors_groups["kp2.0"]:[]
      


      if(IA == 0 && L.length == OA){
        After_Axis = After_Axis.concat(Front_Axis).concat(Combo_Axis).concat(Layer_Axis)
        Combo_Axis = []
        Layer_Axis = []
        Front_Axis = []
        After_chosen_list = After_chosen_list.concat(Front_chosen_list).concat(Combo_chosen_list).concat(Layer_chosen_list)
        Front_chosen_list = []
        Layer_chosen_list = []
        Combo_chosen_list = []
      }else if(OA == 0 && L.length == IA){
        Front_Axis = Front_Axis.concat(After_Axis).concat(Combo_Axis).concat(Layer_Axis)
        Combo_Axis = []
        Layer_Axis = []
        After_Axis = []
        Front_chosen_list = Front_chosen_list.concat(After_chosen_list).concat(Combo_chosen_list).concat(Layer_chosen_list)
        After_chosen_list = []
        Layer_chosen_list = []
        Combo_chosen_list = []
      }else if(L.length > directedLen && IA == 0){
        After_Axis = After_Axis.concat(Front_Axis)
        After_chosen_list = After_chosen_list.concat(Front_chosen_list)
        Front_Axis = []
        Front_chosen_list = []
        Combo_Axis = Combo_Axis.concat(Layer_Axis)
        Combo_chosen_list = Combo_chosen_list.concat(Layer_chosen_list)
        Layer_Axis = []
        Layer_chosen_list = []
      }else if(L.length > directedLen && OA == 0){
        Front_Axis = Front_Axis.concat(After_Axis)
        Front_chosen_list = Front_chosen_list.concat(After_chosen_list)
        After_Axis = []
        After_chosen_list = []
        Combo_Axis = Combo_Axis.concat(Layer_Axis)
        Combo_chosen_list = Combo_chosen_list.concat(Layer_chosen_list)
        Layer_Axis = []
        Layer_chosen_list = []
      }else{
        Combo_Axis = Combo_Axis.concat(Layer_Axis)
        Combo_chosen_list = Combo_chosen_list.concat(Layer_chosen_list)
        Layer_Axis = []
        Layer_chosen_list = []
      }

      var Row_Axis = []
      var Col_Axis = []

      var Index = -1;
      for(var Front = 0; Front < IA; Front++){
        Index = Math.floor(Math.random()*Front_Axis.length);
        while(Front_chosen_list[Index] == true){
          Index = Math.floor(Math.random()*Front_Axis.length); 
        }
        Front_chosen_list.splice(Index, 1, true);
        Row_Axis.push(Front_Axis[Index][0])
        Col_Axis.push(Front_Axis[Index][1])
      }

      for(var After = IA; After < directedLen; After++){
        Index = Math.floor(Math.random()*After_Axis.length);
        while(After_chosen_list[Index] == true){
          Index = Math.floor(Math.random()*After_Axis.length);
        }
        After_chosen_list.splice(Index, 1, true);
        Row_Axis.push(After_Axis[Index][0])
        Col_Axis.push(After_Axis[Index][1])  
      }

      for(var Combo = directedLen; Combo < L.length; Combo++){
        Index = Math.floor(Math.random()*Combo_Axis.length);
        while(Combo_chosen_list[Index] == true){
          Index = Math.floor(Math.random()*Combo_Axis.length);
        }
        Combo_chosen_list.splice(Index, 1, true);
        Row_Axis.push(Combo_Axis[Index][0])
        Col_Axis.push(Combo_Axis[Index][1])
      }

      let state = {
        nodes: [
          {
            id: this.node.name,
            desc: this.node.description,
            type: 0,
            hidden: false,
            lock: false,
            hideSymbol: null,
            lockSymbol: null,
            searchSymbol: null
          }
        ],
        links: []
      };

      let NH = this.neighbors_hierarchy;

      // 显示最新人教版
      // 将所有的邻居节点塞进去，并给所有导入至node的节点的方向设为从自己到node，将node引出的节点或平行节点方向设为node到节点
      for (i = 0; i < L.length + LayerLen; i++) {
        if(i < L.length){
          state.nodes[i + 1] = {
            id: L[i].name,
            desc: L[i].annotation.split("description-")[1],
            type: 1,
            hidden: false,
            lock: false,
            hideSymbol: null,
            lockSymbol: null,
            searchSymbol: null
          };
        } else {
          state.nodes[i + 1] = {
            id: NH[i - L.length],
            desc: "暂无描述",
            type: 1,
            hidden: false,
            lock: false,
            hideSymbol: null,
            lockSymbol: null,
            searchSymbol: null
          };
        }
        if (i < this.inward_arrow) {
          state.links[i] = {
            source: L[i].name,
            target: this.node.name,
            width: 3,
            curved: false
          };
        } else if(i < directedLen) {
          state.links[i] = {
            source: this.node.name,
            target: L[i].name,
            width: 3,
            curved: false
          };
        } else if(i < L.length){
          state.links[i] = {
            source: L[i].name,
            target: this.node.name,
            width: 3,
            curved: false
          };
        } else if(i < L.length + SL) {
          state.links[i] = {
            source: NH[i - L.length],
            target: this.node.name,
            width: 3,
            curved: false
          };
        } else {
          state.links[i] = {
            source: this.node.name,
            target: NH[i - L.length - SL],
            width: 3,
            curved: false
          };
        }
      }

      // var Flag = true;

      // if(Flag){
      //   return 
      // }

      let selectedNode;
      let nodeSize = 25;
      let buttonFlag = 0;
      let hideFlag = 0;

      // 经典调色盘
      // 获取画布(SVG)对象，并添加宽度和高度属性
      // let colorScale = d3.scaleOrdinal(d3.schemeCategory10);
      let svg = d3.select("svg");
      let width = +svg.attr("width");
      let height = +svg.attr("height");
      // 给画布添加一个组，并给组添加名为everything的class
      let g = svg.append("g").attr("class", "everything");
      // 给组添加线模型
      let link = g
        .append("g")
        .attr("class", "links")
        .selectAll("line");
      // 给组添加知识点的圆模型
      let node = g
        .append("g")
        .attr("class", "nodes")
        .selectAll("circle");
      // 添加文字
      let text = g
        .append("g")
        .selectAll("text");

      // setup the tool tip
      var toolTip = d3Tip()
        .attr("class", "d3-tip")
        .offset([-8, 0])
        .html(function(d) {
          return "<p>" + d.desc + "</p>";
        });
      svg.call(toolTip);

      // 给画布添加属性
      // 一个是给ID为straight的部分，这部分是箭头的顶端三角形的配置
      // d属性是路径，通过这两个部分的D属性一致，可知这两部分画的都是箭头顶端的三角形
      // 另一个是给ID为curved的部分，这部分
      svg
        .append("defs")
        .append("marker")
        .attr("id", "straight")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 4)
        .attr("refY", 0)
        .attr("markerWidth", 5)
        .attr("markerHeight", 5)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-4L8,0L0,4")
        .style("fill", "#EDB664");

      svg
        .append("defs")
        .append("marker")
        .attr("id", "straightLayer")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 4)
        .attr("refY", 0)
        .attr("markerWidth", 5)
        .attr("markerHeight", 5)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-4L8,0L0,4")
        .style("fill", "#F1939C");

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

      // 设置点击知识点圆时弹出的那个圆环大小
      let arcGenerator = d3
        .arc()
        .innerRadius(nodeSize * 1)
        .outerRadius(nodeSize * 2.2);

      let arcBigger = d3
        .arc()
        .innerRadius(nodeSize * 1)
        .outerRadius(nodeSize * 3);

      // 这里设置了每个圆环的弧度大小比例即可，不是非要写角度大小
      // 它的实际意义是总和的分子而不是实际值
      let pieData = d3.pie()([1, 1, 2]);
      let pies = g
        .append("g")
        .attr("class", "pie button")
        .selectAll()
        .data(pieData)
        .enter();

      // 这个是路径，代表从A到B的线条
      let pieGs = pies.append("path");
      // "d"属性代表了Data的简写，实际上代表了这条路径的起始，起点，过程，终点，停止的过程路径
      // 简单来说：
      // M = Move, L = Line To, H = Horizontal Line To, V = Vertical Line To, Z = closepath
      // 剩下的都是些曲线，这儿应该不太会用到
      pieGs
        .attr("d", function() {
          return null;
        })
        // 调整知识点点击出来的环的颜色
        .attr("fill", function(d, i) {
          return Ray_Color_List[i];
        })
        // 添加透明度
        .attr("opacity", 1)
        // 添加鼠标悬在上面的事件
        // 这两个画弧都是通过调用生成器后，把D传进去完成的
        // 同时添加了透明度属性
        // 画了增大弧
        .on("mouseover", function(d) {
          if (buttonFlag) {
            d3.select(this)
              .transition()
              .duration(200)
              .attr("d", arcBigger(d))
              .attr("opacity", 1);
          }
        })
        // 添加鼠标移出上面的事件
        // 画了普通弧
        .on("mouseout", function(d) {
          if (buttonFlag) {
            d3.select(this)
              .transition()
              .duration(200)
              .attr("d", arcGenerator(d))
              .attr("opacity", 1);
          }
        })
        // 给知识点圆添加点击事件
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
          searchSymbol
            .attr("xlink:href", function(d) {
              d.searchSymbol = null;
              return null;
            })
            .interrupt();
          // 0 - 4 : 隐藏，锁定，绿，红，紫
          // selectedNode指的是当前被点击到的那个知识点圆
          if (index === 0) {
            // Hide the node
            // 设置隐藏Flag为1
            // 设置知识点圆的隐藏属性为真
            hideFlag = 1;
            selectedNode.each(function(d) {
              d.hidden = true;
            });
            hideFlag = 0;
          } else if (index === 1) {
            // unlock the node; default to lock
            selectedNode.each(function(d) {
              d.fx = null;
              d.fy = null;
            });
          } else if (index === 2) {
            _this.$emit("Research", KnowledgePoint) 
          }
        });
      // 找到所有的被锁定或被隐藏的点
      let lockSymbol = g
        .append("g")
        .attr("class", "lockSymbol")
        .selectAll("lockSymbol");
      let hideSymbol = g
        .append("g")
        .attr("class", "hideSymbol")
        .selectAll("hideSymbol");
      let searchSymbol = g
        .append("g")
        .attr("class", "searchSymbol")
        .selectAll("searchSymbol");
      // add the symbol of each button
      // 给hideSymbol添加节点的ID值，并舍弃多余的部分
      // xlink:href是一个老的属性，指链接地址，现在新版本已经替换成用href了
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

      searchSymbol = searchSymbol.data(state.nodes, function(d) {
        return d.id;
      });
      searchSymbol.exit().remove();
      searchSymbol = searchSymbol
        .enter()
        .append("image")
        .attr("xlink:href", function(d) {
          d.searchSymbol = null;
          return null;
        })
        .attr("width", 20)
        .attr("height", 20);

      let currentTransform = "";

      // 放大显示的函数
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
          // 设置节点的位置
          // 若数据点的hidden属性为真，则display = none;直接隐藏起来
          node
            .attr("cx", function(d,i) {
              if(i == 0 && Lock_Switch){
                d.lock = true
                d.x = 450
                d.fx = 450
                return 450
              }
              else if(Lock_Switch && i < L.length + 1){
                d.lock = true
                d.x = Row_Axis[i-1]
                d.fx = Row_Axis[i-1]
                return Row_Axis[i-1]
              }else{
                // d.x = 0
                // d.fx = 0
                // return 0
                if (d.lock) {
                  d.fx = d.x;
                } 
                return d.x;
              }
            })
            .attr("cy", function(d,i) { 
              if(i == 0 && Lock_Switch){
                d.lock = true
                d.x = 390
                d.fy = 390
                return 390
              }
              else if(Lock_Switch && i < L.length + 1){
                d.lock = true
                d.y = Col_Axis[i-1]
                d.fy = Col_Axis[i-1]
                return Col_Axis[i-1]
              }else{
                // d.y = 0
                // d.fy = 0
                // return 0
                if (d.lock) {
                  d.fy = d.y;
                }
                return d.y;
              }
            })
            // Hide the node.
            .attr("display", function(d) {
              return d.hidden ? "none" : "";
            });
          Lock_Switch = false
          // 设置文字内容的位置
          text.attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
          });
          link
            .attr("d", getPath)
            // Hide the link.
            // 若任何一方有hidden属性为true，则显示为none，即不显示连接线
            .attr("display", function(d) {
              return d.source.hidden || d.target.hidden ? "none" : "";
            });
          // add the symbol
          // 按照知识点中心位置进行偏移
          lockSymbol
            .attr("x", function(d) {
              return d.x - 40;
            })
            .attr("y", function(d) {
              return d.y - 32;
            });
          hideSymbol
            .attr("x", function(d) {
              return d.x - 40;
            })
            .attr("y", function(d) {
              return d.y + 15;
            });
          searchSymbol
            .attr("x", function(d) {
              return d.x + 25;
            })
            .attr("y", function(d) {
              return d.y - 12;
            });
          // 若当前这个点被点击了，则调整它周围的环进行显示
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

      // 力矩模拟，这说明这里用的是力矩显示模式
      // force simulation
      let simulation = d3
        .forceSimulation()
        // Remove the charge of hidden nodes.
        // 移除隐藏节点所施加的“力”
        .force(
          "charge",
          d3.forceManyBody().strength(function(d) {
            if (d.hidden) return 0;
            else return -5;
          })
        )
        // Change the strength of link force for hidden nodes.
        // 根据距离和隐藏属性设置力的大小
        .force(
          "link",
          d3
            .forceLink()
            .strength(function(d) {
              if (d.source.hidden || d.target.hidden || d.source.lock || d.target.lock) return 0;
              else return 0.1;
            })
            .distance(function(d) {
              // 控制节点间距离
              return (d.target.id.length / 2);
            })
            // 返回知识点ID
            .id(function(d) {
              return d.id;
            })
        )
        .force("center", d3.forceCenter(width / 2, height / 2))
        // 力的衰减周期时间
        .velocityDecay(0.2)
        .on("tick", ticked);

      // 确定点和链接
      simulation.nodes(state.nodes).on("tick", ticked());
      simulation.force("link").links(state.links);

      // function reset() {
      //   svg
      //     .transition()
      //     .duration(750)
      //     .call(zoom.transform, d3.zoomIdentity);
      // }

      // d3.select("button").on("click", reset);

      // 下面三个方法设定了拖拽点时计算坐标的方法

      function dragStarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }

      function dragEnded(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }

      // 这里是计算路径过程的方法
      // 按照之前的标记符号来编写这条线所应当经过的路径
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
        // 若为弧形边
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
        } 
        // 若为直线边
        else {
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
      // 开始添加文字和边的实际样式
      function updateStates() {
        // 开始编写文字内容
        // 首先是编辑了文字的大小，对其方式，颜色，大小
        // 然后开始动态计算文字显示的中心点位置
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
            // 如果小于5个字符，不换行
            else if (d.id.length <= 5) {
              d3.select(this)
                .append("tspan")
                .attr("x", 0)
                .attr("y", 0)
                .text(function() {
                  return d.id;
                });
            } else {
              var top = d.id.substring(0, 5);
              var bot = d.id.substring(5, d.id.length);

              d3.select(this).text(function() {
                return "";
              });
              // 切换成两行的情况下，一行上面一点，一行下面一点，错开即可
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
        // 为了避免意外，去除多余的节点部分
        node.exit().remove();
        // 实际添加环的部分，之前控制了环的样式，这里需要实际将环添加上去
        node = node
          .enter()
          .append("circle")
          .attr("transform", currentTransform)
          .merge(node)
          .attr("class", function(d) {
            return d.selected ? "selected" : "";
          })
          .attr("fill", function(d, i) {
            if(i === 0){
              return "#409EFD"
            }
            else if(i - 1 < directedLen){
              return Node_Color_List[0];
            }else if (i - 1 < L.length){
              return Node_Color_List[1]
            }else {
              return Node_Color_List[2]
            }
          })
          // 对应拖拽事件绑定对应的处理方法
          .call(
            d3
              .drag()
              .on("start", dragStarted)
              .on("drag", dragged)
              .on("end", dragEnded)
          )
          // 只有当非隐藏状态时，点击事件才会生效
          .on("click", function(d) {
            KnowledgePoint = d.id
            if (hideFlag === 0) {
              // 非隐藏状态，且点击的是当前按钮时，会触发对应按钮的点击事件
              if (buttonFlag) {
                buttonFlag = 0;
                // 把这个按钮对应的锁定和隐藏按钮都设置为null
                // 然后将它们原本用来设置配套图片的链接地址也设为null
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
                searchSymbol
                  .attr("xlink:href", function(d) {
                    d.searchSymbol = null;
                    return null;
                  })
                  .interrupt();
                pieGs
                  // 将这个点对应的路径也都设为Null
                  .attr("d", function() {
                    return null;
                  })
                  .interrupt();
              } else {
                selectedNode = d3.select(this);
                buttonFlag = 1;
                selectedNode.each(function(d) {
                  // 设置配套的图片
                  d.hideSymbol = require("./../../../assets/hide.png");
                  d.lockSymbol = require("./../../../assets/unlock.png");
                  d.searchSymbol = require("./../../../assets/search.png");
                });
                hideSymbol.attr("xlink:href", function(d) {
                  return d.hideSymbol;
                });
                lockSymbol.attr("xlink:href", function(d) {
                  return d.lockSymbol;
                });
                searchSymbol.attr("xlink:href", function(d) {
                  return d.searchSymbol;
                });
                // 生成环绕弧
                // 并调整弧的中心位置与知识点按钮的中心点一致
                pieGs
                  .attr("d", function(d) {
                    return arcGenerator(d);
                  })
                  .attr("transform", d3.select(this).attr("transform"));
              }
            }
          })
          // 绑定鼠标移入移除事件
          .on("mouseover", toolTip.show)
          .on("mouseout", toolTip.hide);
        
        // 最后是设定链接，并将多余的重复部分剔除
        link = link.data(state.links, function(d) {
          return d.source + d.target;
        });
        link.exit().remove();
        // 添加路径，重新定位，然后将这个新的路径merge到原来的link中去
        link = link
          .enter()
          .append("path")
          .attr("transform", currentTransform)
          .merge(link)
          // 根据节点的索引值来确定是否是带箭头的值
          // 如果是带箭头的值，那么会返回给他一个ID为straight的对象，即之前写好的三角形作为箭头的对象
          .attr("marker-end", function(d) {
            if (d.index < directedLen) {
              return "url(#straight)";
            } else if(d.index > L.length - 1 && d.index < L.length + LayerLen){
              return "url(#straightLayer)";
            } else {
              return ""
            }
          })
          // 设定线长度
          .attr("stroke-width", function(d) {
            return d.width;
          })
          // 设定线的颜色
          .style("stroke", function(d) {
            if (d.index < directedLen) {
              return "#EDB664";
            } else if(d.index < L.length){
              return "#9ECCAB";
            } else {
              return "#F1939C";
            }
          });
        // 这里在绑定节点和链接关系，然后开始模拟这个力矩图
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
  stroke-opacity: 1;
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
