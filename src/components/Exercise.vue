<template>
  <div class="exercise">
    <!-- header -->
    <el-row>
      <el-col :span="6">
        <div class="logo">
          <img src="../assets/title_exercise.png" alt="logo" />
        </div>
      </el-col>
      <el-col :span="14">
        <form @submit.prevent="submit" style="margin-top: 20px;">
          <el-row type="flex" class="row-bg" justify="center">
            <el-col :span="22">
              <el-input
                v-model="exercise_text"
                placeholder="请输入内容"
              ></el-input>
            </el-col>
            <el-button type="submit" value="提交" @click="submit"
              >检索</el-button
            >
          </el-row>
        </form>
      </el-col>
    </el-row>
    <!-- main -->
    <el-row>
      <el-col :span="7">
        <div class="result">
          <el-row type="flex" justify="start">
            <h5 style="color: #0a1612;">试题文本</h5>
          </el-row>
          <el-row type="flex" justify="start" class="title">
            {{ raw_text }}
          </el-row>
          <el-divider></el-divider>
          <el-row type="flex" justify="start">
            <el-col :span="24">
              <el-row>
                <h5 style="color: #0a1612; float: left;">知识点</h5>
              </el-row>
              <el-tabs
                value="bk"
                @tab-click="dataSource"
                type="card"
                ref="ss"
                style="height: 200px; margin-top: -10px; margin-left: 0px;"
              >
                <el-tab-pane label="百科" name="bk">
                  <el-row
                    v-for="(entities, group, group_index) in entities_groups"
                    :key="group_index"
                  >
                    <el-row v-if="group_index == 0" type="flex" justify="start">
                      <!-- <h4>{{ group }}</h4> -->
                    </el-row>
                    <el-row
                      v-if="group_index == 0"
                      class="label"
                      type="flex"
                      justify="start"
                    >
                      <el-popover
                        placement="top-start"
                        v-for="(entity, index) in entities"
                        :key="index"
                        :title="entity.name"
                        width="200"
                        trigger="hover"
                        :content="entity.annotation"
                      >
                        <el-tag slot="reference">{{ entity.name }}</el-tag>
                      </el-popover>
                    </el-row>
                  </el-row>
                </el-tab-pane>
                <el-tab-pane label="人教版" name="rjb" id="rjb" ref="rjb">
                  <el-row
                    v-for="(entities, group, group_index) in entities_groups"
                    :key="group_index"
                  >
                    <el-row v-if="group_index == 0" type="flex" justify="start">
                      <!-- <h4 ref="h">{{ group }}</h4> -->
                    </el-row>
                    <el-row
                      v-if="group_index == 0"
                      class="label"
                      type="flex"
                      justify="start"
                    >
                      <el-popover
                        placement="top-start"
                        v-for="(entity, index) in entities"
                        :key="index"
                        :title="entity.name"
                        width="200"
                        trigger="hover"
                        :content="entity.annotation"
                      >
                        <el-tag slot="reference">{{ entity.name }}</el-tag>
                      </el-popover>
                    </el-row>
                  </el-row>
                </el-tab-pane>
                <el-tab-pane
                  label="人教版新"
                  name="rjb_new"
                  id="rjb_new"
                  ref="rjb_new"
                >
                  <el-row
                    v-for="(entities, group, group_index) in neighbors_groups"
                    :key="group_index"
                  >
                    <el-row
                      v-if="group == 'kp2.0'"
                      class="label"
                      type="flex"
                      justify="start"
                    >
                      <el-popover
                        placement="top-start"
                        v-for="(entity, index) in entities"
                        :key="index"
                        :title="entity.name"
                        width="200"
                        trigger="hover"
                        :content="entity.annotation"
                      >
                        <el-tag slot="reference">{{ entity.name }}</el-tag>
                      </el-popover>
                    </el-row>
                  </el-row>
                </el-tab-pane>
              </el-tabs>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="17">
        <div class="graph">
          <!-- <button class="reset">Reset View</button> -->
          <svg width="930" height="760"></svg>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
/* eslint-disable */
import * as d3 from 'd3'
import d3Tip from "d3-tip"
export default {
  name: "exercise",
  data() {
    return {
      exercise_text: "",
      raw_text: "",
      entities_groups: {},
      neighbors_groups: {},
      entity_type: "concept",
      graph: {},
      sour: ""
    };
  },
  watch:{
    sour(val) {
      this.submit();
    }
  },
  methods: {
    dataSource(tab, event) {
      this.sour = tab.name;
      //黄小青师兄12月提供数据
      if(this.sour == 'rjb_new'){
        this.entity_type = "kp2.0";
      }
      if(this.sour == 'bk' || this.sour == 'rjb'){
        this.entity_type = 'concept';
      }
      return tab.name;
    },
    submit() {
      this.$http
        .post(
          this.backendIP + "/api/surface",
          { exercise_text: this.exercise_text, entity_type: this.entity_type },
          { emulateJSON: true }
        )
        .then(function(data) {
          console.log(data.data);
          this.raw_text = data.data.raw_text;
          this.entities_groups = data.data.entities_groups;
          this.graph = data.data.graph;
          
          //生成图
          //先清空画布
          d3.selectAll("svg > *").remove();
          
          let state = {
          nodes: [  
          ],
          links: [
          ]
          };

      if(this.sour == "rjb") {
        //显示人教版的图
        var sub_length = new Array();
        sub_length[-1] = 0;
        for( var j = 0; j < this.graph.length; j++){
          var m = 0;
          if(this.graph[j].neighbors_groups['knowledge point']){
            sub_length[j] = this.graph[j].neighbors_groups['knowledge point'].length;
          } else{
            sub_length[j] = 0;
          }
          for(var k = -1; k < j; k++){
            m = m + sub_length[k];
          };

          state.nodes[m+j] = {
            id: this.graph[j].node.name,
            desc: "this is "+this.graph[j].node.name,
            type: 0,
            hidden: false,
            lock: false,
            hide_symbol: null,
            lock_symbol: null
          };
          if(this.graph[j].neighbors_groups['knowledge point']){
            for(var i = m; i < m+this.graph[j].neighbors_groups['knowledge point'].length; i++){
              state.nodes[i+1+j]=  {
                id: this.graph[j].neighbors_groups['knowledge point'][i-m].name,
                desc: "this is "+this.graph[j].neighbors_groups['knowledge point'][i-m].name,
                type: 1,
                hidden: false,
                lock: false,
                hide_symbol: null,
                lock_symbol: null
              };
              state.links[i] = {
                source: this.graph[j].node.name, target: this.graph[j].neighbors_groups['knowledge point'][i-m].name, width: 5, curved: false 
              }        
            };
          };
        };  
      }else if(this.sour == "rjb_new"){
        var sub_length = new Array();
        sub_length[-1] = 0;
        for( var j = 0; j < this.graph.length; j++){
          var m = 0;
          if(this.graph[j].neighbors_groups['kp2.0']){
            sub_length[j] = this.graph[j].neighbors_groups['kp2.0'].length;
          } else{
            sub_length[j] = 0;
          }
          for(var k = -1; k < j; k++){
            m = m + sub_length[k];
          };

          state.nodes[m+j] = {
            id: this.graph[j].node.name,
            desc: "this is "+this.graph[j].node.name,
            type: 0,
            hidden: false,
            lock: false,
            hide_symbol: null,
            lock_symbol: null
          };
          if(this.graph[j].neighbors_groups['kp2.0']){
            for(var i = m; i < m+this.graph[j].neighbors_groups['kp2.0'].length; i++){
              state.nodes[i+1+j]=  {
                id: this.graph[j].neighbors_groups['kp2.0'][i-m].name,
                desc: "this is "+this.graph[j].neighbors_groups['kp2.0'][i-m].name,
                type: 1,
                hidden: false,
                lock: false,
                hide_symbol: null,
                lock_symbol: null
              };
              state.links[i] = {
                source: this.graph[j].node.name, target: this.graph[j].neighbors_groups['kp2.0'][i-m].name, width: 5, curved: false 
              }        
            };
          };
        };
      }else {
        //显示概念的图
        var sub_length = new Array();
        sub_length[-1] = 0;
        for( var j = 0; j < this.graph.length; j++){
          var m = 0;
          if(this.graph[j].neighbors_groups.concept){
            sub_length[j] = this.graph[j].neighbors_groups.concept.length;
          }else {
            sub_length[j] = 0;
          }
          for(var k = -1; k < j; k++){
            m = m + sub_length[k];
          };

          state.nodes[m+j] = {
            id: this.graph[j].node.name,
            desc: "this is "+this.graph[j].node.name,
            type: 0,
            hidden: false,
            lock: false,
            hide_symbol: null,
            lock_symbol: null
          };
          if(this.graph[j].neighbors_groups.concept){
          for(var i = m; i < m+this.graph[j].neighbors_groups.concept.length; i++){
            state.nodes[i+1+j]=  {
              id: this.graph[j].neighbors_groups.concept[i-m].name,
              desc: "this is "+this.graph[j].neighbors_groups.concept[i-m].name,
              type: 1,
              hidden: false,
              lock: false,
              hide_symbol: null,
              lock_symbol: null
            };
            state.links[i] = {
              source: this.graph[j].node.name, target: this.graph[j].neighbors_groups.concept[i-m].name, width: 5, curved: false 
            }        
          };
          }
        };  
      };
     
      let selectedNode;
      let nodeSize = 25;
      let button_flag = 0;
      let hide_flag = 0;
      let arcSize = 0;

      let nodeMap = { node1: state.nodes[0] };
      let linkList = { node1: [state.links[0]], node2: [] };

      let colorScale = d3.scaleOrdinal(d3.schemeAccent);

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
      //添加文字
      let text = g.append("g").selectAll("text");


      // setup the tool tip
      var tool_tip = d3Tip()
        .attr("class", "d3-tip")
        .offset([-8, 0])
        .html(function(d) {
          return "<p>" + d.desc + "</p>";
        });
      svg.call(tool_tip);

      svg
        .append("defs")
        .append("marker")
        .attr("id", "straight")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 0)
        .attr("refY", 0)
        .attr("markerWidth", 4)
        .attr("markerHeight", 4)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-4L8,0L0,4");

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

      let arc_generator = d3
        .arc()
        .innerRadius(nodeSize * 1.1)
        .outerRadius(nodeSize * 2);

      let arc_bigger = d3
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

      let pie_gs = pies.append("path");

      pie_gs
        .attr("d", function(d) {
          return null;
        })
        .attr("fill", function(d, i) {
          return colorScale(i + 2);
        })
        .attr("opacity", 0.8)
        .on("mouseover", function(d, i) {
          if (button_flag) {
            d3.select(this)
              .transition()
              .duration(200)
              .attr("d", arc_bigger(d))
              .attr("opacity", 0.6);
          }
        })
        .on("mouseout", function(d, i) {
          if (button_flag) {
            d3.select(this)
              .transition()
              .duration(200)
              .attr("d", arc_generator(d))
              .attr("opacity", 0.8);
          }
        })
        .on("click", function(d, index) {
          button_flag = 0;
          hide_flag = 0;
          pie_gs
            .attr("d", function() {
              return null;
            })
            .interrupt();
          hide_symbol
            .attr("xlink:href", function(d) {
              d.hide_symbol = null;
              return null;
            })
            .interrupt();
          lock_symbol
            .attr("xlink:href", function(d) {
              d.lock_symbol = null;
              return null;
            })
            .interrupt();
          if (index == 0) {
            // Hide the node
            hide_flag = 1;
            selectedNode.each(function(d) {
              d.hidden = true;
            });
            hide_flag = 0;
            console.log("hide");
          } else if (index == 1) {
            // unlock the node; default to lock
            selectedNode.each(function(d) {
              d.fx = null;
              d.fy = null;
            });
            console.log("unlock");
          } else {
            // Change the color of the node
            selectedNode.style("fill", colorScale(index + 2));
            console.log("change the color");
          }
        });

      let lock_symbol = g
        .append("g")
        .attr("class", "lock_symbol")
        .selectAll("lock_symbol");
      let hide_symbol = g
        .append("g")
        .attr("class", "hide_symbol")
        .selectAll("hide_symbol");
      // add the symbol of each button
      hide_symbol = hide_symbol.data(state.nodes, function(d) {
        return d.id;
      });
      hide_symbol.exit().remove();
      hide_symbol = hide_symbol
        .enter()
        .append("image")
        .attr("xlink:href", function(d) {
          d.hide_symbol = null;
          return null;
        })
        .attr("width", 20)
        .attr("height", 20);

      lock_symbol = lock_symbol.data(state.nodes, function(d) {
        return d.id;
      });
      lock_symbol.exit().remove();
      lock_symbol = lock_symbol
        .enter()
        .append("image")
        .attr("xlink:href", function(d) {
          d.lock_symbol = null;
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

      svg.call(zoom);

      function ticked() {
        return function() {
          link
            .attr("d", getPath)
            // Hide the link.
            .attr("display", function(d) {
              return d.source.hidden || d.target.hidden ? "none" : "";
            });

          text
            .attr("transform", function(d){
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
          hide_symbol
            .attr("x", function(d) {
              return d.x + 26;
            })
            .attr("y", function(d) {
              return d.y - 20;
            });
          lock_symbol
            .attr("x", function(d) {
              return d.x - 9.5;
            })
            .attr("y", function(d) {
              return d.y + 29;
            });

          if (button_flag) {
            pie_gs.attr("transform", function() {
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
              //控制节点间距离
              return (d.target.id.length%6+2)*40;
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

      function drag_started(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }

      function drag_ended(d, i) {
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
        //加文字开始
        text = text.data(state.nodes)
        .enter()
        .append("text")
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .style('fill',"#fff")
        .style('font-size', "12px")
        .attr('x',function(d){
        var re_en = /[a-zA-Z]+/g;
        //如果是全英文，不换行
        if(d.id.match(re_en)){
          d3.select(this).append('tspan')
            .attr('x',0)
            .attr('y',0)
            .text(function(){return d.id;});
        }
        //如果小于3个字符，不换行
        else if(d.id.length<=3){
          d3.select(this).append('tspan')
            .attr('x',0)
            .attr('y',0)
            .text(function(){return d.id;});
        }else{
          var top=d.id.substring(0,3);
          var bot=d.id.substring(3,d.id.length);

          d3.select(this).text(function(){return '';});

          d3.select(this).append('tspan')
            .attr('x',0)
            .attr('y',-7)
            .text(function(){return top;});

          d3.select(this).append('tspan')
            .attr('x',0)
            .attr('y',14)
            .text(function(){return bot;});
        }
      });
    //加文字结束
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
              .on("start", drag_started)
              .on("drag", dragged)
              .on("end", drag_ended)
          )
          .on("click", function(d) {
            if (hide_flag == 0) {
              if (button_flag) {
                button_flag = 0;
                hide_symbol
                  .attr("xlink:href", function(d) {
                    d.hide_symbol = null;
                    return null;
                  })
                  .interrupt();
                lock_symbol
                  .attr("xlink:href", function(d) {
                    d.lock_symbol = null;
                    return null;
                  })
                  .interrupt();
                pie_gs
                  .attr("d", function() {
                    return null;
                  })
                  .interrupt();
              } else {
                selectedNode = d3.select(this);
                button_flag = 1;
                selectedNode.each(function(d) {
                  d.hide_symbol = "/static/hide.png";
                  d.lock_symbol = "/static/unlock.png";
                });
                hide_symbol.attr("xlink:href", function(d) {
                  return d.hide_symbol;
                });
                lock_symbol.attr("xlink:href", function(d) {
                   return d.lock_symbol;
                });
                //console.log(selectedNode);
                pie_gs
                  .attr("d", function(d) {
                    return arc_generator(d);
                  })
                  .attr("transform", d3.select(this).attr("transform"));
              }
            }
          })
          .on("mouseover", tool_tip.show)
          .on("mouseout", tool_tip.hide);
        link = link.data(state.links, function(d) {
          return d.source + d.target;
        });
        link.exit().remove();
        link = link
          .enter()
          .append("path")
          .attr("transform", currentTransform)
          .merge(link)
          .attr("marker-end", "url(#straight)")
          .attr("stroke-width", function(d) {
            return d.width;
          });

        simulation.nodes(state.nodes);
        simulation.force("link").links(state.links);
        simulation.alpha(0.5).restart();
      }
      updateStates();
      });    
    }
  }
};
</script>

<style scoped lang="scss">
.exercise {
  background: url("/static/sub_bg.png") no-repeat;
}
/*.exercise h1 {
  color: #fff;
  font-size: 32px;
  padding-top: 20px;
  padding-bottom: 0px;
  margin-left: 150px;
}*/
.logo {
  margin-top: 15px;
  margin-left: 20px;
}
.result {
  border: 1px solid #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding-left: 5%;
  padding-right: 5%;
  padding-top: 5%;
  height: 780px;
  background-color: #fff;
  margin-left: 20px;
  border-right: 14px solid #fff;
}

.el-row {
  margin-bottom: 20px;
  & :last-child {
    margin-bottom: 0;
  }
}
.title {
  text-align: left;
  font-weight: bold;
  font-size: 22px;
  color: #0a1612;
}

.el-tag {
  margin-left: 10px;
}

.el-col {
  border-radius: 4px;
}

.graph {
  border: 1px solid #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
/*  padding-left: 5%;
  padding-right: 5%;
  padding-top: 5%;*/
  height: 780px;
  background-color: #fff;
  margin-right: 20px;
}
</style>

<style type="text/css">
 .el-tabs__item {
    color: #0a1612!important;
    font-weight: 900!important;
} 
 .el-tabs__item.is-active {
    background-color: #0a1612!important;
    color: #fff!important;
    font-weight: 900!important;
}
.el-button:focus {
  outline: none!important;
}
.el-tag {
  background-color: #fff!important;
  color: #000!important;
  border-color: #c5c1c0!important;
}
</style>

<style>
.links path {
  fill: none;
  stroke: #999;
  stroke-opacity: 0.6;
}
marker {
  fill: #999;
  opacity: 0.6;
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

