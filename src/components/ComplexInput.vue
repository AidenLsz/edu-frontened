<!-- 

The line of README
The line of README
The line of README

1：
  需要配置Update_CI事件对应的方法来获取ComplexInput组件的文本内容 
  Update_CI事件会将当前ComplexInput组件的文本内容返回至前端，返回值val为文本的内容
  
2：
  需要配置Update_Image事件对应的方法来获取ComplexInput组件的图片内容
  Update_Image事件会将当前ComplexInput组件的图片内容返回至前端，返回值为图片信息数组
  图片信息格式在data字段里面可见

The line of README
The line of README
The line of README

-->

<template>
  <div>
    <el-dialog 
      width="80%" 
      height="500px" 
      :visible.sync="helper_dialog" 
      title="快速公式助手" 
      @close="Clear()" 
      top="2vh" 
      style="background: rgba(225,225,225,0.3); "
      :modal-append-to-body="false"
      :append-to-body="true">
      <el-container>
        <el-aside width="22%" height="500px" style="box-shadow: 0px 0px 2px 2px #ddd; background: rgba(196,219,183,0.4); padding-top: 10px">
          <el-row>
            <el-col :span="11" :offset="1" style="text-align: left;">上标</el-col>
            <el-col :span="11" :offset="1" style="text-align: left">a^2</el-col>  
          </el-row>
          <el-row>                
            <el-col :span="11" :offset="1" style="text-align: left">下标</el-col>
            <el-col :span="11" :offset="1" style="text-align: left">a_2</el-col>
          </el-row>
          <el-row>
            <el-col :span="11" :offset="1" style="text-align: left">组合上标</el-col>
            <el-col :span="11" :offset="1" style="text-align: left">a^{a+b}</el-col>
          </el-row>
          <el-row>
            <el-col :span="11" :offset="1" style="text-align: left">组合下标</el-col>
            <el-col :span="11" :offset="1" style="text-align: left">a_{a+b}</el-col>
          </el-row>
          <el-row>
            <el-col :span="11" :offset="1" style="text-align: left">组合上下标</el-col>                   
            <el-col :span="11" :offset="1" style="text-align: left">a_2^3</el-col>
          </el-row>
          <el-row>
            <el-col :span="11" :offset="1" style="text-align: left">前置上下标</el-col>
            <el-col :span="11" :offset="1" style="text-align: left">{}_1^2a_3^4</el-col>
          </el-row>
          <el-divider></el-divider>
          <div style="padding-top: -10px;" >常见数学希腊符号表</div><br/>
            <el-table max-height="230px" :show-header="false" :data="symbols" style="font-size: 15px;" >
                <el-table-column
                  prop="col1"
                  align="center"
                  width="35">
                </el-table-column>
                <el-table-column
                  prop="col2"
                  align="left"
                  width="85">
                </el-table-column>
                <el-table-column
                  prop="col3"
                  align="center"
                  width="35">
                </el-table-column>
                <el-table-column
                  prop="col4"
                  align="left"
                  width="85">
                </el-table-column>
            </el-table> 
        </el-aside>
        <el-container width="78%" height="500px">
          <el-header height="350px">
            <el-tabs type="border-card" style="height: 340px; width: 102%; margin-left: -9px; background: rgba(196,219,183,0.4); box-shadow: 0px 0px 2px 2px #ddd;" v-model="latex_now" tab-position="top">
              <el-tab-pane name="常用符号及格式提示" label="常用符号及格式提示">
                <el-form >
                  <el-row >
                    <el-col :span="24">
                      <el-form-item label="点击查看符号输入格式">
                        <el-radio-group style="width: 95%; text-align: left; padding-top: 5px" v-model="temp_param_type">
                          <el-row :span="24" >
                            <el-col :span="4">
                              <el-radio label="sum">求和（格式1）</el-radio>
                            </el-col>
                            <el-col :span="4" :offset="1">
                              <el-radio label="msum">求和（格式2）</el-radio>
                            </el-col>
                            <el-col :span="4" :offset="1">
                              <el-radio label="mul">求积（格式1）</el-radio>
                            </el-col>
                            <el-col :span="4" :offset="1">
                              <el-radio label="mmul">求积（格式2）</el-radio>
                            </el-col>
                            <el-col :span="4" :offset="1">
                              <el-radio label="frac">分式</el-radio>
                            </el-col>                      
                          </el-row>
                          <el-row>
                            <el-col :span="4">
                              <el-radio label="cmul">上积（格式1）</el-radio>
                            </el-col>
                            <el-col :span="4" :offset="1">
                              <el-radio label="mcmul">上积（格式2）</el-radio>
                            </el-col>
                            <el-col :span="4" :offset="1">
                              <el-radio label="int">积分</el-radio>
                            </el-col>
                            <el-col :span="4" :offset="1">
                              <el-radio label="iint">双重积分</el-radio>
                            </el-col>
                            <el-col :span="4" :offset="1">
                              <el-radio label="iiint">三重积分</el-radio>
                            </el-col>
                          </el-row>
                          <el-row>
                            <el-col :span="4">
                              <el-radio label="oint">闭合曲线/面符号</el-radio>
                            </el-col>
                            <el-col :span="4" :offset="1">
                              <el-radio label="cap">交集(A,B...)</el-radio>
                            </el-col>
                            <el-col :span="4" :offset="1">
                              <el-radio label="cup">并集(A,B...)</el-radio>
                            </el-col>
                            <el-col :span="4" :offset="1">
                              <el-radio label="bcap">交集(A1~An)</el-radio>
                            </el-col>
                            <el-col :span="4" :offset="1">
                              <el-radio label="bcup">并集(A1~An)</el-radio>
                            </el-col>
                          </el-row> 
                        </el-radio-group>               
                      </el-form-item>     
                    </el-col>
                  </el-row>
                </el-form>
                <el-divider></el-divider>
                <el-link href="https://www.cnblogs.com/wanghai0666/p/13950679.html" target="_blank">更多常见符号对照表</el-link>
              </el-tab-pane>
              <el-tab-pane name="各类括号的使用方法" label="各类括号的使用方法">
                <el-row>
                  <el-col :span="8" style="text-align: left; font-weight: bold">
                    各类括号的使用方法
                  </el-col>
                </el-row>
                <el-row style="margin-bottom: -5px">
                  <el-col :span="24" style="text-align: left; padding-left: 20px">
                    基础表示方式： ( ) 、 [ ]  和 | 表示符号本身，使用  \{ \} 来表示  { } 。
                  </el-col>
                </el-row>
                <el-divider></el-divider>
                <el-form >
                  <el-row style="margin-top: -15px" >
                    <el-col :span="24">
                      <el-form-item label="选择插入示例">
                        <el-radio-group style="width: 95%; text-align: left; padding-top: 5px" v-model="temp_latex">
                          <el-row :span="24" >
                            <el-col :span="4">
                              <el-radio label="$\left( \frac{a}{b} \right)$">圆 / 小括号</el-radio>
                            </el-col>
                            <el-col :span="4" :offset="1">
                              <el-radio label="$\left[ \frac{a}{b} \right]$">方 / 中括号</el-radio>
                            </el-col>
                            <el-col :span="4" :offset="1">
                              <el-radio label="$\left\{ \frac{a}{b} \right\}$">花 / 大括号</el-radio>
                            </el-col>
                            <el-col :span="4" :offset="1">
                              <el-radio label="$\left \langle \frac{a}{b} \right \rangle$">角括号</el-radio>
                            </el-col>                  
                          </el-row>
                          <el-row :span="24" >
                            <el-col :span="4">
                              <el-radio label="$\left| \frac{a}{b} \right|$">绝对值 / 单竖线</el-radio>
                            </el-col>
                            <el-col :span="4" :offset="1">
                              <el-radio label="$\left \| \frac{a}{b} \right \|$">范 / 双竖线</el-radio>
                            </el-col>
                            <el-col :span="4" :offset="1">
                              <el-radio label="$\left \lfloor \frac{a}{b} \right \rfloor$">取整</el-radio>
                            </el-col>
                            <el-col :span="4" :offset="1">
                              <el-radio label="$\left \lceil \frac{c}{d} \right \rceil$">取顶</el-radio>
                            </el-col> 
                            <el-col :span="4" :offset="1">
                              <el-radio label="$\left / \frac{a}{b} \right \backslash$">斜线与反斜线</el-radio>
                            </el-col>                 
                          </el-row>
                          <el-row :span="24" >
                            <el-col :span="4">
                              <el-radio label="$\left \uparrow \frac{a}{b} \right \downarrow$">箭头（单线）</el-radio>
                            </el-col>
                            <el-col :span="4" :offset="1">
                              <el-radio label="$\left \Uparrow \frac{a}{b} \right \Downarrow$">箭头（双线）</el-radio>
                            </el-col>
                            <el-col :span="4" :offset="1">
                              <el-radio label="$\left \updownarrow \frac{a}{b} \right \Updownarrow$">混合双向箭头</el-radio>
                            </el-col>
                            <el-col :span="4" :offset="1">
                              <el-radio label="$\left[ 0,1 \right)$">括号混合</el-radio>
                            </el-col>
                            <el-col :span="4" :offset="1">
                              <el-radio label="$\Bigg ( \bigg [ \Big \{ \big \langle \left | \| \frac{a}{b} \| \right | \big \rangle \Big \} \bigg ] \Bigg )$">括号大小控制示例</el-radio>
                            </el-col>              
                          </el-row>
                          <el-row :span="24" >
                            <el-col :span="6">
                              <el-radio label="$\left \{\frac{a}{b} \right.$">单左括号（右侧补齐）</el-radio>
                            </el-col>
                            <el-col :span="6" :offset="4">
                              <el-radio label="$\left. \frac{a}{b} \right \}$">单右括号（左侧补齐）</el-radio>
                            </el-col>                  
                          </el-row>
                        </el-radio-group>               
                      </el-form-item>     
                    </el-col>
                  </el-row>
                </el-form>
              </el-tab-pane>
              <el-tab-pane name="指数" label="指数">
                按照左侧上标提示输入即可输入指数格式
              </el-tab-pane>
              <el-tab-pane name="对数" label="对数">
                <el-form>
                  <el-row>
                    <el-col :span="15">
                      <el-form-item label="选择底数">
                        <el-radio-group v-model="temp_latex" style="width: 95%; text-align: left; padding-top: 5px">
                          <el-row :span="24">
                            <el-col :span="5" :offset="1">
                              <el-radio label="$\log {占位符}$">2</el-radio>
                            </el-col>
                            <el-col :span="5" :offset="1">
                              <el-radio label="$\ln {占位符}$">e</el-radio>
                            </el-col>
                            <el-col :span="5" :offset="1">
                              <el-radio label="$\lg {占位符}$">10</el-radio>
                            </el-col>
                            <el-col :span="5" :offset="1">
                              <el-radio label="$\log_{占位符1} {占位符2}$">其他</el-radio>
                            </el-col>
                          </el-row>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </el-tab-pane>
              <el-tab-pane name="三角函数" label="三角函数">
                <el-form >
                  <el-row >
                    <el-col :span="24">
                      <el-form-item label="请选择三角函数类型">
                        <el-radio-group style="width: 95%; text-align: left; padding-top: 5px" v-model="temp_param_type">
                          <el-row :span="24" >
                            <el-col :span="4">
                              <el-radio label="sin">正弦sin</el-radio>
                            </el-col>
                            <el-col :span="4" :offset="1">
                              <el-radio label="cos">余弦cos</el-radio>
                            </el-col>
                            <el-col :span="4" :offset="1">
                              <el-radio label="tan">正切tan</el-radio>
                            </el-col>
                            <el-col :span="4" :offset="1">
                              <el-radio label="cot">余切cot</el-radio>
                            </el-col>
                            <el-col :span="4" :offset="1">
                              <el-radio label="sec">正割sec</el-radio>
                            </el-col>                       
                          </el-row>
                          <el-row>
                            <el-col :span="4">
                              <el-radio label="csc">余割csc</el-radio>
                            </el-col>
                            <el-col :span="4" :offset="1">
                              <el-radio label="arcsin">反正弦arcsin</el-radio>
                            </el-col>
                            <el-col :span="4" :offset="1">
                              <el-radio label="arccos">反余弦arccos</el-radio>
                            </el-col>
                            <el-col :span="4" :offset="1">
                              <el-radio label="arctan">反正切arctan</el-radio>
                            </el-col>
                          </el-row>
                          <el-row>
                            <el-col :span="4">
                              <el-radio label="sinh">双曲正弦sinh</el-radio>
                            </el-col>
                            <el-col :span="4" :offset="1">
                              <el-radio label="cosh">双曲余弦cosh</el-radio>
                            </el-col>
                            <el-col :span="4" :offset="1">
                              <el-radio label="tanh">双曲正切tanh</el-radio>
                            </el-col>
                            <el-col :span="4" :offset="1">
                              <el-radio label="coth">双曲余切coth</el-radio>
                            </el-col>
                          </el-row> 
                        </el-radio-group>               
                      </el-form-item>     
                    </el-col>
                  </el-row>
                </el-form>
              </el-tab-pane>
              <el-tab-pane name="最值" label="最值">
                <el-form>
                  <el-row :span="24" >
                    <el-col :span="24">
                      <el-form-item label="请选择最值类型">
                        <el-radio-group style="width: 95%; text-align: left; padding-top: 5px" v-model="temp_param_type">
                          <el-row :span="24" >
                            <el-col :span="3">
                              <el-radio label="min">最小</el-radio>
                            </el-col>
                            <el-col :span="3" :offset="1">
                              <el-radio label="max">最大</el-radio>
                            </el-col>
                            <el-col :span="3" :offset="1">
                              <el-radio label="sup">上确界</el-radio>
                            </el-col>
                            <el-col :span="3" :offset="1">
                              <el-radio label="inf">下确界</el-radio>
                            </el-col>                      
                          </el-row>
                        </el-radio-group>               
                      </el-form-item>     
                    </el-col>
                  </el-row>
                </el-form>
              </el-tab-pane>
              <el-tab-pane name="极限" label="极限">
                <el-form>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="请选择极限类型">
                        <el-radio-group style="width: 95%; text-align: left; padding-top: 5px" v-model="temp_param_type">
                          <el-row :span="24" >
                            <el-col :span="5">
                              <el-radio label="lim">极限（无变量）</el-radio>
                            </el-col>
                            <el-col :span="5" :offset="1">
                              <el-radio label="limft">极限（有变量）</el-radio>
                            </el-col>
                            <el-col :span="5" :offset="1">
                              <el-radio label="limsup">上极限</el-radio>
                            </el-col>
                            <el-col :span="5" :offset="1">
                              <el-radio label="liminf">下极限</el-radio>
                            </el-col>                                         
                          </el-row>
                          <el-row :span="24" >
                            <el-col :span="5">
                              <el-radio label="dim">维度</el-radio>
                            </el-col>
                            <el-col :span="5" :offset="1">
                              <el-radio label="deg">多项式次数</el-radio>
                            </el-col>
                            <el-col :span="5" :offset="1">
                              <el-radio label="det">行列式</el-radio>
                            </el-col>
                            <el-col :span="5" :offset="1">
                              <el-radio label="ker">核（kernal）</el-radio>
                            </el-col>                                         
                          </el-row>
                        </el-radio-group>               
                      </el-form-item>     
                    </el-col>
                  </el-row>
                </el-form>
              </el-tab-pane>
              <el-tab-pane name="投射" label="投射">
                <el-form>
                  <el-row>
                    <el-col :span="15">
                      <el-form-item label="请选择投射属性">
                        <el-radio-group style="width: 95%; text-align: left; padding-top: 5px" v-model="temp_param_type">
                          <el-row :span="24" >
                            <el-col :span="5">
                              <el-radio label="pr">概率</el-radio>
                            </el-col>
                            <el-col :span="5" :offset="1">
                              <el-radio label="hom">同态</el-radio>
                            </el-col>
                            <el-col :span="5" :offset="1">
                              <el-radio label="len">范</el-radio>
                            </el-col>
                            <el-col :span="5" :offset="1">
                              <el-radio label="arg">角度</el-radio>
                            </el-col>                                         
                          </el-row>
                        </el-radio-group>               
                      </el-form-item>     
                    </el-col>
                  </el-row>
                </el-form>
              </el-tab-pane>
              <el-tab-pane name="微分及导数" label="微分及导数">
                <el-form>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="请选择极限类型">
                        <el-radio-group style="width: 95%; text-align: left; padding-top: 5px" v-model="temp_param_type">
                          <el-row :span="24" >
                            <el-col :span="4">
                              <el-radio label="dt">dx（格式1）</el-radio>
                            </el-col>
                            <el-col :span="4" :offset="1">
                              <el-radio label="mdt">dx（格式2）</el-radio>
                            </el-col>
                            <el-col :span="4" :offset="1">
                              <el-radio label="partial">偏导元素</el-radio>
                            </el-col>
                            <el-col :span="4" :offset="1">
                              <el-radio label="par">偏导</el-radio>
                            </el-col> 
                            <el-col :span="4" :offset="1">
                              <el-radio label="nabla">梯度元素</el-radio>
                            </el-col>                                         
                          </el-row>
                          <el-row :span="24" >
                            <el-col :span="6">
                              <el-radio label="par1h">dx/dy（格式1）</el-radio>
                            </el-col>
                            <el-col :span="6" :offset="4">
                              <el-radio label="par2h">dx/dy（格式2）</el-radio>
                            </el-col> 
                          </el-row>
                          <el-row :span="24">
                            <el-col :span="6">
                              <el-radio label="par1v">dx/dy（格式1 | 竖版）</el-radio>
                            </el-col>
                            <el-col :span="6" :offset="4">
                              <el-radio label="par2v">dx/dy（格式2 | 竖版）</el-radio>
                            </el-col>                                        
                          </el-row>
                          <el-row :span="24" >
                            <el-col :span="4">
                              <el-radio label="prime">导数符号</el-radio>
                            </el-col>
                            <el-col :span="4" :offset="1">
                              <el-radio label="backprime">导数符号（反）</el-radio>
                            </el-col>                                       
                            <el-col :span="4" :offset="1">
                              <el-radio label="deri">导数</el-radio>
                            </el-col>
                            <el-col :span="4" :offset="1">
                              <el-radio label="deridot1">导数（点形式 | 1阶）</el-radio>
                            </el-col>  
                            <el-col :span="4" :offset="1">
                              <el-radio label="deridot2">导数（点形式 | 2阶）</el-radio>
                            </el-col>                                    
                          </el-row>
                        </el-radio-group>               
                      </el-form-item>     
                    </el-col>
                  </el-row>
                </el-form>
              </el-tab-pane>
              <el-tab-pane name="类字母符号与常数" label="类字母符号与常数">
                <el-row v-for="(item, index) in alnum_like" :key="index">
                  <el-col :span="1">
                    {{ item.char1 }}
                  </el-col>
                  <el-col :span="4" style="text-align: left; padding-left: 15px">
                    {{ item.str1 }}
                  </el-col>
                  <el-col :span="1" :offset="1">
                    {{ item.char2 }}
                  </el-col>
                  <el-col :span="4" style="text-align: left; padding-left: 15px">
                    {{ item.str2 }}
                  </el-col>
                  <el-col :span="1" :offset="1">
                    {{ item.char3 }}
                  </el-col>
                  <el-col :span="4" style="text-align: left; padding-left: 15px">
                    {{ item.str3 }}
                  </el-col>
                  <el-col :span="1" :offset="1">
                    {{ item.char4 }}
                  </el-col>
                  <el-col :span="4" style="text-align: left; padding-left: 15px">
                    {{ item.str4 }}
                  </el-col>
                </el-row>
              </el-tab-pane>
              <el-tab-pane name="模运算及开根号" label="模运算及开根号">
                <el-form>
                  <el-form-item label="特殊符号">
                    <el-row>
                      <el-col :span="24">
                        <el-row>
                          <el-col :span="1" :offset="1">
                            ≡
                          </el-col>
                          <el-col :span="3" style="text-align: left; padding-left: 15px">
                            \equiv
                          </el-col>
                          <el-col :span="1">
                            ∣
                          </el-col>
                          <el-col :span="3" style="text-align: left; padding-left: 15px">
                            \mid
                          </el-col>
                          <el-col :span="1">
                            ∤
                          </el-col>
                          <el-col :span="3" style="text-align: left; padding-left: 15px">
                            \nmid
                          </el-col>
                          <el-col :span="1">
                            ∣
                          </el-col>
                          <el-col :span="3" style="text-align: left; padding-left: 15px">
                            \shortmid
                          </el-col>
                          <el-col :span="1">
                            
                          </el-col>
                          <el-col :span="3" style="text-align: left; padding-left: 15px">
                            \nshortmid
                          </el-col>
                        </el-row>
                      </el-col>
                    </el-row>
                  </el-form-item>
                  <el-row style="margin-top: -20px">
                    <el-col :span="24">
                      <el-form-item label="请选择运算类型">
                        <el-radio-group style="width: 95%; text-align: left; padding-top: 5px" v-model="temp_param_type">
                          <el-row :span="24" >
                            <el-col :span="5" :offset="1">
                              <el-radio label="bmod">mod符号</el-radio>
                            </el-col>
                            <el-col :span="5" :offset="1">
                              <el-radio label="pmod">对 x 取余</el-radio>
                            </el-col>      
                          </el-row>
                          <el-row>
                            <el-col :span="5" :offset="1">
                              <el-radio label="gcd">最大公约数</el-radio>
                            </el-col>
                            <el-col :span="5" :offset="1">
                              <el-radio label="lcm">最小公倍数</el-radio>
                            </el-col>
                          </el-row>
                          <el-row>   
                            <el-col :span="5" :offset="1">
                              <el-radio label="surd">开根符号</el-radio>
                            </el-col>
                            <el-col :span="5" :offset="1">
                              <el-radio label="sqrt">开根</el-radio>
                            </el-col>               
                          </el-row>
                        </el-radio-group>               
                      </el-form-item>     
                    </el-col>
                  </el-row>
                </el-form>
              </el-tab-pane>
            </el-tabs>
          </el-header>
          <el-main>
            <el-row>
              <el-col :span="2" style="font-weight:bold">
                <el-row style="margin-bottom: 6px; padding-top: 5px">当前元素</el-row>
                <el-row>LaTex格式</el-row>
              </el-col>
              <el-col :span="8">
                <el-input id="input_now" placeholder="当前元素的内容" type="textarea" rows="3" style="font-size: 14px; margin-left: 10px; margin-top: -10px;" resize="none" v-model="temp_latex"></el-input>
              </el-col>
              <el-col :span="1" style="font-size:30px; padding-left: 22px; padding-top: 5px">
                ⇒
              </el-col>
              <el-col :span="2" style="font-weight:bold">
                <el-row style="margin-bottom: 6px; padding-top: 5px">效果</el-row>
                <el-row>展示</el-row>
              </el-col>
              <el-col :span="8" v-if="temp_latex">
                <Mathdown :content="temp_latex" name="show" style="border: 2px dashed black; height: 72px; margin-top: -10px"></Mathdown>
              </el-col>
              <el-col :span="8" v-else style="border: 2px dashed black; height: 72px; margin-top: -10px; padding-top: 24px">
                <span>等待数据元素中...</span>
              </el-col>
              <el-col :span="2" :offset="1">
                <button type="success" size="small" style="margin-top: 12px; margin-left: -18px" @click="Update_Temp_Latex_Total()">添加元素</button>
              </el-col>
            </el-row>
          </el-main>
          <el-footer height="87px">
            <el-row>
              <el-col :span="2" style="font-weight:bold">
                <el-row style="margin-bottom: 6px; padding-top: 5px">插入公式</el-row>
                <el-row>LaTex格式</el-row>
              </el-col>
              <el-col :span="8">
                <el-input id="input_total" placeholder="本次操作生成的公式内容" type="textarea" rows="4" style="font-size: 14px; margin-left: 10px; margin-top: -18px" resize="none" v-model="temp_latex_total"></el-input>
              </el-col>
              <el-col :span="1" style="font-size:30px; padding-left: 22px; padding-top: 5px">
                ⇒
              </el-col>
              <el-col :span="2" style="font-weight:bold">
                <el-row style="margin-bottom: 6px; padding-top: 5px">效果</el-row>
                <el-row>展示</el-row>
              </el-col>
              <el-col :span="8" v-if="temp_latex_total">
                <Mathdown :content="temp_latex_total" name="total" style="border: 2px dashed red; height: 93px; margin-top: -18px"></Mathdown>
              </el-col>
              <el-col :span="8" v-else style="border: 2px dashed red; height: 93px; margin-top: -18px; padding-top: 33px">
                <span>等待数据元素中...</span>
              </el-col>
              <el-col :span="2" :offset="1">
                <el-row style="margin-bottom: 6px; padding-top: -5px"><button type="success" size="small" style="margin-left: -18px" @click="Copy_Input()">复制内容</button></el-row>
                <el-row><button type="success" size="small" style="margin-left: -18px" @click="Insert_To_Content_Tail()">插入末尾</button></el-row>
              </el-col>
            </el-row>
          </el-footer>
        </el-container>
      </el-container>
      <!-- Mathdown组件需要命名name属性才能区别不同的组件，而且不能是纯数字，至少第一个不能是数字 -->
    </el-dialog>

    <el-row style="padding-top: 15px; z-index: 1" type="flex" justify="center">
      <mavon-editor ref="mavoneditor" v-model="content" @imgAdd="New_Img_In" @imgDel="Del_Img" @fullScreen="Change_Class" :class="Get_Mavon_Class(MESinker)" :toolbars="selfToolBar">
        <el-col slot="left-toolbar-after" :span="1">
          <div>
            <el-popover ref="hint" placement="top" content="提供LaTex格式的数学公式元素的辅助输入功能。注：显示区使用KaTex进行解析，可能和LaTex结果显示上有差异，但LaTex格式无误。" width="300" trigger="hover"></el-popover>
            <el-button v-popover:hint class="Math_Helper" size="mini" @click="Open_Helper()">&Sigma;</el-button>
          </div>
        </el-col>         
      </mavon-editor>
    </el-row>
  </div>
</template>

<script>
/* eslint-disable */
import Mathdown from "./Mathdown.vue";
export default {
  components: { Mathdown },
  name: "ComplexInput",
  props: {
    Get_Out_Content: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      // Latex格式的内容
      content: this.Get_Out_Content,
      // 新版本用的mavon-editor带来的自带回调函数用的json格式
      // name: 图片名
      // info: base64转换后的数据段
      image_infos: [],
      // 记录当前是否打开数学助手对话框
      helper_dialog: false,  
      // 记录当前应当显示哪一个LaTex公式的对话框的变量
      latex_now: "常用符号及格式提示",
      // 保存所有快速生成LaTex文本参数的Json段
      latex: {
        "常用符号及格式提示":{
          name: "常用符号及格式提示",
        },
        "各类括号的使用方法": {
          name: "各类括号的使用方法"
        },
        "三角函数": {
          name: "三角函数",
        },
        "微分及导数": {
          name: "微分及导数",
        },
        "对数": {
          name: "对数",
        },
        "指数":{
          name: "指数",
        },
        "最值": {
          name: "最值",
        },
        "极限": {
          name: "极限",
        },
        "投射": {
          name: "投射",
        },
        "模运算及开根号": {
          name: "模运算及开根号",
        },
        "类字母符号与常数": {
          name: "类字母符号与常数"
        }
      },
      // 记录当前元件应当显示的LaTex公式的结果
      temp_latex: "",
      // 记录当前公式应当显示的LaTex公式的结果
      temp_latex_total: "",
      // 保存当前分类，与latex_now结合判断使用哪部分语句作为输出
      temp_param_type: "",
      // 保存显示数学希腊符号的符号段
      symbols: [
        {
          'col1': "α",
          'col2': "\\alpha",
          'col3': "β",
          'col4': "\\beta"
        },
        {
          'col1': "γ",
          'col2': "\\gamma",
          'col3': "δ",
          'col4': "\\delta"
        },
        {
          'col1': "ϵ",
          'col2': "\\epsilon",
          'col3': "ζ",
          'col4': "\\zeta"
        },
        {
          'col1': "η",
          'col2': "\\eta",
          'col3': "θ",
          'col4': "\\theta"
        },
        {
          'col1': "ι",
          'col2': "\\iota",
          'col3': "κ",
          'col4': "\\kappa"
        },
        {
          'col1': "λ",
          'col2': "\\lambda",
          'col3': "μ",
          'col4': "\\mu"
        },
        {
          'col1': "ν",
          'col2': "\\nu",
          'col3': "o",
          'col4': "\\omicron"
        },
        {
          'col1': "ξ",
          'col2': "\\xi",
          'col3': "π",
          'col4': "\\pi"
        },
        {
          'col1': "ρ",
          'col2': "\\rho",
          'col3': "σ",
          'col4': "\\sigma"
        },
        {
          'col1': "τ",
          'col2': "\\tau",
          'col3': "υ",
          'col4': "\\upsilon"
        },
        {
          'col1': "ϕ",
          'col2': "\\phi",
          'col3': "χ",
          'col4': "\\chi"
        },
        {
          'col1': "ψ",
          'col2': "\\psi",
          'col3': "ω",
          'col4': "\\omega"
        },
        {
          'col1': "A",
          'col2': "\\Alpha",
          'col3': "B",
          'col4': "\\Beta"
        },
        {
          'col1': "Γ",
          'col2': "\\Gamma",
          'col3': "Δ",
          'col4': "\\Delta"
        },
        {
          'col1': "E",
          'col2': "\\Epsilon",
          'col3': "Z",
          'col4': "\\Zeta"
        },
        {
          'col1': "H",
          'col2': "\\Eta",
          'col3': "Θ",
          'col4': "\\Theta"
        },
        {
          'col1': "I",
          'col2': "\\Iota",
          'col3': "K",
          'col4': "\\Kappa"
        },
        {
          'col1': "Λ",
          'col2': "\\Lambda",
          'col3': "M",
          'col4': "\\Mu"
        },
        {
          'col1': "N",
          'col2': "\\Nu",
          'col3': "O",
          'col4': "\\Omicron"
        },
        {
          'col1': "Ξ",
          'col2': "\\Xi",
          'col3': "Π",
          'col4': "\\Pi"
        },
        {
          'col1': "P",
          'col2': "\\Rho",
          'col3': "Σ",
          'col4': "\\Sigma"
        },
        {
          'col1': "T",
          'col2': "\\Tau",
          'col3': "Υ",
          'col4': "\\Upsilon"
        },
        {
          'col1': "Φ",
          'col2': "\\Phi",
          'col3': "X",
          'col4': "\\Chi"
        },
        {
          'col1': "Ψ",
          'col2': "\\Psi",
          'col3': "Ω",
          'col4': "\\Omega"
        }
      ],
      // 保存显示类字母符号和常数的符号段
      alnum_like: [
        {
          char1: "∞",
          str1: "\\infty",
          char2: "ℵ",
          str2: "\\aleph",
          char3: "∁",
          str3: "\\complement",
          char4: "∍",
          str4: "\\backepsilon",
        },
        {
          char1: "ð",
          str1: "\\eth",
          char2: "Ⅎ",
          str2: "\\Finv",
          char3: "ℏ",
          str3: "\\hbar",
          char4: "I",
          str4: "\\Im",
        },
        {
          char1: "ı",
          str1: "\\imath",
          char2: "ȷ",
          str2: "\\jmath",
          char3: "k",
          str3: "\\Bbbk",
          char4: "ℓ",
          str4: "\\ell",
        },
        {
          char1: "℧",
          str1: "\\mho",
          char2: "℘",
          str2: "\\wp",
          char3: "R",
          str3: "\\Re",
          char4: "Ⓢ",
          str4: "\\circledS",
        }
      ],
      // 处理自带的工具栏
      selfToolBar: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: false, // 标题
        underline: true, // 下划线
        strikethrough: true, // 中划线
        mark: false, // 标记
        superscript: true, // 上角标
        subscript: true, // 下角标
        quote: false, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        imagelink: true, // 图片链接
        code: false, // code
        table: true, // 表格
        fullscreen: true, // 全屏编辑
        readmodel: true, // 沉浸式阅读
        htmlcode: false, // 展示html源码
        help: true, // 帮助
        /* 1.3.5 */
        undo: true, // 上一步
        redo: true, // 下一步
        trash: true, // 清空
        save: false, // 保存（触发events中的save事件）
        /* 1.4.2 */
        navigation: true, // 导航目录
        /* 2.1.8 */
        alignleft: false, // 左对齐
        aligncenter: false, // 居中
        alignright: false, // 右对齐
        /* 2.2.1 */
        subfield: true, // 单双栏模式
        preview: true // 预览
      },
      // 是否下沉mavonEditor
      MESinker: false
    };
  },
  watch:{
    sour(val) {
      this.submit();
    },
    latex_now(newVal, oldVal){
      if(newVal != oldVal){
        this.temp_latex = "";
        this.latex_now = newVal;
        if(newVal == '常用符号及格式提示'){
          this.temp_param_type = 'calc';
        }
      }
    },
    temp_param_type(newVal, oldVal){
      if(newVal != oldVal){
        this.temp_param_type = newVal;
        this.Param_Switch();
      }
    },
    temp_latex(newVal){
      this.temp_latex = newVal;
    },
    content(newVal){
      setTimeout(()=>{this.$emit("Update_CI", newVal)}, 10);
    },
    image_infos(newVal){
      setTimeout(()=>{this.$emit("Update_Image", newVal)}, 10);
    }
  },
  methods: {
    Get_Mavon_Class(value){
      if(value){
        setTimeout(()=>{this.$emit("Full_Change", value)}, 10);
        return "ME_Full"   
      }else{
        setTimeout(()=>{this.$emit("Full_Change", value)}, 10);
        return "ME_Unfull"
      }
    },
    Change_Class(status, value){
      this.MESinker = status;
    },
    dataSource(tab, event) {
      this.sour = tab.name;
      //黄小青师兄12月提供数据
      if(this.sour == 'rjb_new'){
        this.entity_type = "kp2.0";
      }
      return tab.name;
    },
    New_Img_In(imgname, img){
      this.image_infos.push(
        {
          "name": img.name,
          "info": img.miniurl
        }
      );
    },
    Del_Img(imgname){
      for(var i = 0; i < this.image_infos.length; i++){
        if(this.image_infos[i].name == imgname[1].name){
          this.image_infos.splice(i, 1)
          break;
        }
      }
    },
    // 三角函数
    Update_Triangle(){
      this.temp_latex = "$\\" + this.temp_param_type+ " { 变量符号 }$";
    },
    // 最值
    Update_MinMax(){
      if( this.temp_param_type == 'min'){
        this.temp_latex = "$\\min(占位符，多个元素用英文逗号分隔)$";
      }else if( this.temp_param_type == 'max'){
        this.temp_latex = "$\\max(占位符，多个元素用英文逗号分隔)$";
      }else if( this.temp_param_type == 'sup'){
        this.temp_latex = "$\\sup {占位符}$";
      }else if( this.temp_param_type == 'inf'){
        this.temp_latex = "$\\inf {占位符}$";
      }
    },
    // 极限
    Update_Limit(){
      if(this.temp_param_type != "limft"){
        if(this.temp_param_type == "lim"){
          this.temp_latex = "$\\lim {变量占位符}$"
        }else if(this.temp_param_type == "limsup"){
          this.temp_latex = "$\\limsup {变量占位符}$"
        }else if(this.temp_param_type == "liminf"){
          this.temp_latex = "$\\liminf {变量占位符}$"
        }else if(this.temp_param_type == "dim"){
          this.temp_latex = "$\\dim {变量占位符}$"
        }else if(this.temp_param_type == "deg"){
          this.temp_latex = "$\\deg {变量占位符}$"
        }else if(this.temp_param_type == "det"){
          this.temp_latex = "$\\det {变量占位符}$"
        }else if(this.temp_param_type == "ker"){
          this.temp_latex = "$\\ker {变量占位符}$"
        }
      }else if(this.temp_param_type == "limft"){
        this.temp_latex = "$\\lim_{{变量名称} \\to {趋近目标}} {公式占位符}$";
      }
    },
    // 投射
    Update_Perspective(){
      if(this.temp_param_type == 'pr'){
        this.temp_latex = "$\\Pr {变量占位符}$";
      }else if(this.temp_param_type == 'hom'){
        this.temp_latex = "$\\hom {变量占位符}$";
      }else if(this.temp_param_type == 'len'){
        this.temp_latex = "$||{变量占位符}||$";
      }else if(this.temp_param_type == 'arg'){
        this.temp_latex = "$\\arg {变量占位符}$";
      }
    },
    // 微分及导数
    Update_Deri_or_Diff(){
      if(this.temp_param_type == 'dt'){
        this.temp_latex = "$d{变量占位符}$";
      }else if(this.temp_param_type == 'mdt'){
        this.temp_latex = "$\\mathrm{d}{变量占位符}$";
      }else if(this.temp_param_type == 'partial'){
        this.temp_latex = "$\\partial {变量占位符}$";
      }else if(this.temp_param_type == 'nabla'){
        this.temp_latex = "$\\nabla {变量占位符}$";
      }else if(this.temp_param_type == 'par1h'){

        var temp_param2 = "d{变量占位符1}";
        var temp_param3 = "d{变量占位符2}";
        
        this.temp_latex = "$" + temp_param2 + "/" + temp_param3 + "$"

      }else if(this.temp_param_type == 'par2h'){

        var temp_param2 = "\\mathrm{d}{变量占位符1}";
        var temp_param3 = "\\mathrm{d}{变量占位符2}";
        
        this.temp_latex = "$" + temp_param2 + "/" + temp_param3 + "$"

      }else if(this.temp_param_type == 'par1v'){

        var temp_param2 = "d{变量占位符1}";
        var temp_param3 = "d{变量占位符2}";
        
        this.temp_latex = "$\\frac{" + temp_param2 + "}{" + temp_param3 + "}$"

      }else if(this.temp_param_type == 'par2v'){

        var temp_param2 = "\\mathrm{d}{变量占位符1}";
        var temp_param3 = "\\mathrm{d}{变量占位符2}";
        
        this.temp_latex = "$\\frac{" + temp_param2 + "}{" + temp_param3 + "}$"

      }else if(this.temp_param_type == 'par'){
        
        var temp_param2 = "\\partial {变量占位符1}";
        var temp_param3 = "\\partial {变量占位符2}";
        
        this.temp_latex = "$\\frac{" + temp_param2 + "}{" + temp_param3 + "}$"

      }else if(this.temp_param_type == 'prime'){

        this.temp_latex = "$\\prime$"

      }else if(this.temp_param_type == 'backprime'){

        this.temp_latex = "$\\backprime$"

      }else if(this.temp_param_type == 'deri'){
        
        this.temp_latex = "${变量占位符}^{(次数占位符)}$"

      }else if(this.temp_param_type == 'deridot1'){

        this.temp_latex = "$\\dot {变量占位符}$";

      }else if(this.temp_param_type == 'deridot2'){

        this.temp_latex = "$\\ddot {变量占位符}$";

      }
    },
    // 模运算及开根号
    Update_Mod_or_Sqrt(){
      if(this.temp_param_type == 'bmod'){
        this.temp_latex = "$\\bmod$"
      }else if(this.temp_param_type == 'pmod'){
        this.temp_latex = "$\\pmod {变量占位符}$";
      }else if(this.temp_param_type == 'gcd'){
        this.temp_latex = "$\\gcd (变量占位符，多个变量请用英文逗号分隔)$";
      }else if(this.temp_param_type == 'lcm'){
        this.temp_latex = "$\\operatorname{lcm}(变量占位符，多个变量请用英文逗号分隔)$"
      }else if(this.temp_param_type == 'sqrt'){  
        this.temp_latex = "$\\sqrt[次数占位符]{开根项占位符}$";
      }else if(this.temp_param_type == 'surd'){
        this.temp_latex = "$\\surd$";
      }
    },
    // 默认页面
    Update_Default(){
      // 求和
      if(this.temp_param_type == 'sum'){
        this.temp_latex = "$\\sum_{变量名 = 起始值}^{目标值}$";
      }else if(this.temp_param_type == 'msum'){
        this.temp_latex = "$\\begin{matrix} \\sum_{变量名 = 起始值}^{ 目标值 } \\end{matrix}$"
      }
      // 求积
      else if(this.temp_param_type == 'mul'){
        this.temp_latex = "$\\prod_{变量名 = 起始值}^{目标值}$"
      }else if(this.temp_param_type == 'mmul'){
        this.temp_latex = "$\\begin{matrix} \\prod_{变量名 = 起始值}^{目标值} \\end{matrix}$"  
      }
      // 上积
      else if(this.temp_param_type == 'cmul'){
        this.temp_latex = "$\\coprod_{变量名 = 起始值}^{目标值}$"
      }else if(this.temp_param_type == 'mcmul'){
        this.temp_latex = "$\\begin{matrix} \\coprod_{变量名 = 起始值}^{目标值} \\end{matrix}$"  
      }
      // 积分，二重积分，三重积分
      else if(this.temp_param_type == 'int'){
        this.temp_latex = "$\\int_{区间下限}^{区间上限}$"
      }else if(this.temp_param_type == 'iint'){
        this.temp_latex = "$\\iint_{区间下限}^{区间上限}$"
      }else if(this.temp_param_type == 'iiint'){
        this.temp_latex = "$\\iiint_{区间下限}^{区间上限}$"
      }
      // 交并集
      else if(this.temp_param_type == 'cap'){
        this.temp_latex = "$集合A \\cap 集合B \\cap 集合C$";
      }else if(this.temp_param_type == 'cup'){
        this.temp_latex = "$集合A \\cup 集合B \\cup 集合C$";
      }else if(this.temp_param_type == 'bcap'){
        this.temp_latex = "$\\bigcap_{ 开始标记 }^{ 结束标记 }{ 集合名称 }$"
      }else if(this.temp_param_type == 'bcup'){
        this.temp_latex = "$\\bigcup_{ 开始标记 }^{ 结束标记 }{ 集合名称 }$"
      }
      // 闭合曲线曲面积分符号
      else if(this.temp_param_type == 'oint'){
        this.temp_latex = "$\\oint$"
      }
      // 分式被移动到这里了
      else if(this.temp_param_type == 'frac'){
        this.temp_latex = "$\\frac{ 分子部分 }{ 分母部分 }$"
      }
    },
    // 上传Docx文件
    selectFile(e){

      if(e.target.files.length > 0){
      
        if(e.target.files[0].type != "application/vnd.openxmlformats-officedocument.wordprocessingml.document"){
          this.$alert('    请选择正确类型的文件', '提示', {
            confirmButtonText: '确定'
          });
          return null;
        }

        let formData = new FormData();

        formData.append("files", e.target.files[0]);
        formData.append("baseurl", this.backendIP);

        this.file_now = e.target.files[0];

        let config = {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        };

        this.$http
        .post(this.backendIP + "/api/readFromDocx", formData, config)
        .then(function(data){

          this.content = data.data.content;

        });

      }else{

        this.$alert('  请选择要进行分析的DOCX文件。', '提示', {
          confirmButtonText: '确定',
          callback: action => {}
        });

      }
    },
    // 传送参数至对应更新函数
    Param_Switch(){
      switch(this.latex_now){
          case "常用符号及格式提示":
          case "":
            this.Update_Default();
            break;
          case "三角函数":
            this.Update_Triangle();
            break;
          case "最值":
            this.Update_MinMax();
            break;
          case "极限":
            this.Update_Limit();
            break;
          case "投射":
            this.Update_Perspective();
            break;
          case "微分及导数":
            this.Update_Deri_or_Diff();
            break;
          case "模运算及开根号":
            this.Update_Mod_or_Sqrt();
            break;
        }
    },
    // 复制到粘贴板
    Copy_Input(){
      var Input = document.getElementById('input_now');
      Input.select();
      document.execCommand("Copy");
      this.$message('已复制');
    },
    // 插入至文本末尾
    Insert_To_Content_Tail(){
      this.content = this.content + this.temp_latex_total;
      this.temp_latex_total = '';
      this.$message('已插入文本末尾');
    },
    // 拼合元素与待输入公式
    Update_Temp_Latex_Total(){
      this.temp_latex_total = this.temp_latex_total + " " + this.temp_latex;
    },
    // 清除临时数据
    Clear(){
      this.helper_dialog = false;
      this.latex_now = "常用符号及格式提示";
      this.temp_latex = "";
      this.temp_latex_total = "";
      this.temp_param_type = "";
    },
    // 打开对话框
    Open_Helper(){
      this.helper_dialog = true; 
    },
    // 返回当前LaTex公式的结果
    Get_Content(){
      return this.content;
    },
    Get_Out(){
      console.log(this.Get_Out_Content);
    }
  }
};
</script>

<style scoped lang="scss">
.logo {
  margin-left: 70px;
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
.ME_Full{
  padding-top: 80px;
  z-index: 9999;
}
.ME_Unfull{
  width: 70vw;
}
</style>

<style scoped type="text/css">
.el-button {
  background-color: #1a2930;
  color: #fff;
  border-color: #1a2930;
}
.el-button:hover {
  background-color: #008080;
  color: #fff;
  border-color: #fff;
}
.el-button:focus {
  background-color: #008080;
  color: #fff;
  border-color: #fff;
  outline: none;
}
.Math_Helper {
  color: black; 
  font-size: 20px; 
  background: #fff;
  margin-top: 2px;
  margin-left: -7px;
  width: 25px; 
  height: 25px;
  border: none;
}
.Math_Helper:hover {
  color: black; 
  font-size: 20px; 
  background: #fff;
  margin-top: 2px;
  margin-left: -7px;
  width: 25px; 
  height: 25px;
  border: none;
}
.Math_Helper:focus {
  color: black; 
  font-size: 20px; 
  background: #fff;
  margin-top: 2px;
  margin-left: -7px;
  width: 25px; 
  height: 25px;
  border: none;
}
.img-list-item {
  position: relative;
  margin: auto;
  display: inline-block;
}
.img-list-item img {
  width: 200px;
  height: 200px;
  box-sizing: border-box;
  vertical-align: middle;
  border: 0;
}
.img-list-item i.del-img {
  width: 20px;
  height: 20px;
  display: inline-block;
  background: rgba(0, 0, 0, 0.1);
  background-image: url(../assets/delete.jpeg);
  background-size: 10px;
  background-repeat: no-repeat;
  background-position: 50%;
  position: relative;
  top: 0;
  right: 0;
}
</style>
<style scoped>
#tabs /deep/ .el-tabs__item {
  color: #0a1612;
  font-weight: 900;
}
#tabs /deep/ .el-tabs__item.is-active {
  background-color: #0a1612;
  color: #fff;
  font-weight: 900;
}
#tag /deep/ .el-tag {
  background-color: #fff !important;
  color: #000 !important;
  border-color: #c5c1c0 !important;
}
</style>