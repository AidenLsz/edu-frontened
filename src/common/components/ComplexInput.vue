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
    <!-- <el-dialog 
      width="80%" 
      height="500px" 
      :visible.sync="helper_dialog" 
      @close="Clear()" 
      top="2vh" 
      style="background: rgba(225,225,225,0.3); "
      :modal-append-to-body="false"
      :append-to-body="true">
      <template slot="title">
          <el-row type="flex" justify="center" style="font-size: 18px;">快速公式助手</el-row>  
      </template>
      <el-container>
        <el-aside width="22%" height="500px" style="box-shadow: 0px 0px 2px 2px #ddd; background: transparent; padding-top: 10px">
          <el-row>
            <el-col :span="11" :offset="1" style="text-align: left">上标</el-col>
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

        </el-aside>
        <el-container width="78%" height="500px">
          <el-header height="350px">
            <el-tabs type="border-card" style="height: 340px; width: 102%; margin-left: -9px; background: transparent; box-shadow: 0px 0px 2px 2px #ddd;" v-model="latex_now" tab-position="top">
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
                <el-link href="https://www.cnblogs.com/wanghai0666/p/13950679.html" target="_blank" :underline="false">更多常见符号对照表</el-link>
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
              <el-col :span="2" style="font-weight:bold; text-align:center">
                <el-row style="margin-bottom: 6px; padding-top: 5px">当前元素</el-row>
                <el-row>LaTex格式</el-row>
              </el-col>
              <el-col :span="8">
                <el-input id="input_now" placeholder="当前元素的内容" type="textarea" rows="3" style="font-size: 14px; margin-left: 10px; margin-top: -10px;" resize="none" v-model="temp_latex"></el-input>
              </el-col>
              <el-col :span="1" style="font-size:30px; padding-left: 22px; padding-top: 5px">
                ⇒
              </el-col>
              <el-col :span="2" style="font-weight:bold; text-align:center">
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
              <el-col :span="2" style="font-weight:bold; text-align:center">
                <el-row style="margin-bottom: 6px; padding-top: 5px">插入公式</el-row>
                <el-row>LaTex格式</el-row>
              </el-col>
              <el-col :span="8">
                <el-input id="input_total" placeholder="本次操作生成的公式内容" type="textarea" rows="4" style="font-size: 14px; margin-left: 10px; margin-top: -18px" resize="none" v-model="temp_latex_total"></el-input>
              </el-col>
              <el-col :span="1" style="font-size:30px; padding-left: 22px; padding-top: 5px">
                ⇒
              </el-col>
              <el-col :span="2" style="font-weight:bold; text-align:center">
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
      </el-container> -->
      <!-- Mathdown组件需要命名name属性才能区别不同的组件，而且不能是纯数字，至少第一个不能是数字 -->
    <!-- </el-dialog> -->

    <el-row style="padding-top: 15px; z-index: 1" type="flex" justify="center">
      <mavon-editor ref="mavoneditor" v-model="content" @imgAdd="New_Img_In" @imgDel="Del_Img" @fullScreen="Change_Class" :class="Get_Mavon_Class(MESinker)" :toolbars="selfToolBar">
        <!-- 左侧其他常用功能分类 -->
        <el-row slot="left-toolbar-after">
          <el-col :span="24">
            <el-row>
              <!-- 常用 -->
              <el-col :span="2">
                <el-row type="flex" justify="start">
                  <el-popover
                    placement="bottom-start"
                    width="600"
                    trigger="hover">
                    <!-- Common_Binary_Operator_List -> CBOL -->
                    <el-row type="flex" justify="start" style="margin-bottom: 30px" v-if="Part_Common_Page">
                      常用二元运算符
                    </el-row>
                    <div v-if="Part_Common_Page">
                      <el-row style="margin-top: -15px" v-for="Outer in Math.ceil(Part_Common_List.常用运算符.length/24)" :key="'CBOL_' + (Outer - 1)">
                        <el-col :span="1" v-for="index in 24" :key="'CBOL_'  + (Outer - 1) + '_' + index">
                          <button 
                            style="width: 25px; height: 25px; margin-right: 5px; background: transparent; border: none; margin-top: -3px;" 
                            size="mini" 
                            v-if="Part_Common_List_Index('常用运算符', (Outer - 1) * 24 + (index - 1))" 
                            @click="Add_Part_Common_List('常用运算符', (Outer - 1) * 24 + (index - 1))">
                            <Mathdown :name="'Common_Binary_Operator_List_' + ((Outer - 1) * 24 + index)" :content="Part_Common_List.常用运算符[(Outer - 1) * 24 + (index - 1)]" style="margin-top: -3px; margin-left: -2px; text-align: center"></Mathdown>
                          </button>
                          <div style="width: 25px; height: 25px; margin-right: 5px; background: transparent; border: none; margin-top: -3px;" v-else>&nbsp;</div>
                        </el-col>
                      </el-row>
                    </div>
                    <!-- Common_Relational_Operator_List -> CROL -->
                    <el-row type="flex" justify="start" style="margin-bottom: 30px" v-if="Part_Common_Page">
                      常用关系运算符
                    </el-row>
                    <div v-if="Part_Common_Page">
                      <el-row style="margin-top: -15px" v-for="Outer in Math.ceil(Part_Common_List.二元运算符.length/24)" :key="'CROL_' + (Outer - 1)">
                        <el-col :span="1" v-for="index in 24" :key="'CROL_'  + (Outer - 1) + '_' + index">
                          <button 
                            style="width: 25px; height: 25px; margin-right: 5px; background: transparent; border: none; margin-top: -3px;" 
                            size="mini" 
                            v-if="Part_Common_List_Index('二元运算符', (Outer - 1) * 24 + (index - 1))" 
                            @click="Add_Part_Common_List('二元运算符', (Outer - 1) * 24 + (index - 1))">
                            <Mathdown :name="'Common_Relational_Operator_List_' + ((Outer - 1) * 24 + index)" :content="Part_Common_List.二元运算符[(Outer - 1) * 24 + (index - 1)]" style="margin-top: -3px; margin-left: -2px; text-align: center"></Mathdown>
                          </button>
                          <div style="width: 25px; height: 25px; margin-right: 5px; background: transparent; border: none; margin-top: -3px;" v-else>&nbsp;</div>
                        </el-col>
                      </el-row>
                    </div>
                    <!-- 换页按钮 -->
                    <el-row type="flex" justify="center" style="margin: -15px auto 2px auto">
                      <el-button type="text" size="big" style="font-size: 20px" v-if="Part_Common_Page" @click="Part_Common_Page = false">
                        <i class="el-icon-arrow-down"></i>
                      </el-button>
                      <el-button type="text" size="big" style="font-size: 20px" v-else @click="Part_Common_Page = true">
                        <i class="el-icon-arrow-up"></i>
                      </el-button>
                    </el-row>
                    <!-- Common_Fractional_Operator_List -> CBOL -->
                    <el-row type="flex" justify="start" style="margin-bottom: 30px" v-if="!Part_Common_Page">
                      常用分式、二项式运算符
                    </el-row>
                    <div v-if="!Part_Common_Page">
                      <el-row style="margin-top: -15px" v-for="Outer in Math.ceil(Part_Common_List.分式.length/6)" :key="'CFOL_' + (Outer - 1)">
                        <el-col :span="4" v-for="index in 6" :key="'CFOL_'  + (Outer - 1) + '_' + index">
                          <el-row type="flex" justify="center">
                            <button 
                              style="width: 50px; height: 50px; margin-right: 5px; background: transparent; border: none; margin-top: -3px;" 
                              size="mini" 
                              v-if="Part_Common_List_Index('分式', (Outer - 1) * 6 + (index - 1))" 
                              @click="Add_Part_Common_List('分式', (Outer - 1) * 6 + (index - 1))">
                              <Mathdown :name="'Common_Fractional_Operator_List_' + ((Outer - 1) * 6 + index)" :content="Part_Common_List.分式[(Outer - 1) * 6 + (index - 1)]" style="margin-top: -3px; margin-left: -2px; text-align: center"></Mathdown>
                            </button>
                            <div style="width: 50px; height: 50px; margin-right: 5px; background: transparent; border: none; margin-top: -3px;" v-else>&nbsp;</div>
                          </el-row>
                        </el-col>
                      </el-row>
                    </div>
                    <!-- Common_Exponential_Operator_List -> CEOL -->
                    <el-row type="flex" justify="start" style="margin-bottom: 30px" v-if="!Part_Common_Page">
                      常用指数、对数运算符
                    </el-row>
                    <div v-if="!Part_Common_Page">
                      <el-row style="margin-top: -15px; margin: 0px" v-for="Outer in Math.ceil(Part_Common_List.指数.length/6)" :key="'CEOL_' + (Outer - 1)">
                        <el-col :span="4" v-for="index in 6" :key="'CEOL_'  + (Outer - 1) + '_' + index">
                          <el-row type="flex" justify="center">
                            <button 
                              style="width: 50px; height: 50px; margin-right: 5px; background: transparent; border: none; margin-top: -3px;" 
                              size="mini" 
                              v-if="Part_Common_List_Index('指数', (Outer - 1) * 6 + (index - 1))" 
                              @click="Add_Part_Common_List('指数', (Outer - 1) * 6 + (index - 1))">
                              <Mathdown :name="'Common_Exponential_Operator_List_' + ((Outer - 1) * 6 + index)" :content="Part_Common_List.指数[(Outer - 1) * 6 + (index - 1)]" style="margin-top: -3px; margin-left: -2px; text-align: center"></Mathdown>
                            </button>
                            <div style="width: 50px; height: 50px; margin-right: 5px; background: transparent; border: none; margin-top: -3px;" v-else>&nbsp;</div>
                          </el-row>
                        </el-col>
                      </el-row>
                    </div>
                    <img slot="reference" src="./assets/常用运算符.png" width="100%" style="cursor: pointer; margin: 5px; margin-top: 10px"/>
                  </el-popover>
                </el-row>
              </el-col>
              <!-- 上下标 -->
              <el-col :span="2">
                <el-row type="flex" justify="start">
                  <el-popover
                    placement="bottom-start"
                    width="400"
                    trigger="hover">
                    <!-- Subscript_List -> SL -->
                    <el-row v-for="Outer in Math.ceil(Part_Subscript_List.length/6)" :key="'SL_' + (Outer - 1)" style="margin: 0px">
                      <el-col :span="4" v-for="index in 6" :key="'SL_'  + (Outer - 1) + '_' + index">
                        <el-row type="flex" justify="center">
                          <button 
                            style="width: 50px; height: 50px; margin-right: 5px; background: transparent; border: none; margin-top: -3px;" 
                            size="mini" 
                            v-if="(Outer - 1) * 6 + (index - 1) < Part_Subscript_List.length" 
                            @click="Add(Part_Subscript_List[(Outer - 1) * 6 + (index - 1)])">
                            <Mathdown :name="'Subscript_List_' + ((Outer - 1) * 6 + index)" :content="Part_Subscript_List[(Outer - 1) * 6 + (index - 1)]" style="margin-top: -3px; margin-left: -2px; text-align: center"></Mathdown>
                          </button>
                          <div style="width: 50px; height: 50px; margin-right: 5px; background: transparent; border: none; margin-top: -3px;" v-else>&nbsp;</div>
                        </el-row>
                      </el-col>
                    </el-row>
                    <img slot="reference" src="./assets/上下标.png" width="100%" style="cursor: pointer; margin: 5px; margin-top: 10px"/>
                  </el-popover>
                </el-row>
              </el-col>
              <!-- 集合 -->
              <el-col :span="2">
                <el-row type="flex" justify="start">
                  <el-popover
                    placement="bottom-start"
                    width="600"
                    trigger="hover">
                    <!-- Set_Operator_List -> SOL -->
                    <el-row v-for="Outer in Math.ceil(Part_Set_List.length/12)" :key="'SOL_' + (Outer - 1)" style="margin: 0px">
                      <el-col :span="2" v-for="index in 12" :key="'SOL_'  + (Outer - 1) + '_' + index">
                        <el-row type="flex" justify="center">
                          <button 
                            style="width: 50px; height: 50px; margin-right: 5px; background: transparent; border: none; margin-top: -3px;" 
                            size="mini" 
                            v-if="(Outer - 1) * 12 + (index - 1) < Part_Set_List.length" 
                            @click="Add(Part_Set_List[(Outer - 1) * 12 + (index - 1)])">
                            <Mathdown :name="'Set_Operator_List_' + ((Outer - 1) * 12 + index)" :content="Part_Set_List[(Outer - 1) * 12 + (index - 1)]" style="margin-top: -3px; margin-left: -2px; text-align: center"></Mathdown>
                          </button>
                          <div style="width: 50px; height: 50px; margin-right: 5px; background: transparent; border: none; margin-top: -3px;" v-else>&nbsp;</div>
                        </el-row>
                      </el-col>
                    </el-row>
                    <img slot="reference" src="./assets/集合运算符.png" width="100%" style="cursor: pointer; margin: 5px; margin-top: 10px"/>
                  </el-popover>
                </el-row>
              </el-col>
              <!-- 逻辑 -->
              <el-col :span="2">
                <el-row type="flex" justify="start">
                  <el-popover
                    placement="bottom-start"
                    width="600"
                    trigger="hover">
                    <!-- Set_Logical_List -> SLL -->
                    <el-row v-for="Outer in Math.ceil(Part_Logical_List.length/12)" :key="'SLL_' + (Outer - 1)" style="margin: 0px">
                      <el-col :span="2" v-for="index in 12" :key="'SLL_'  + (Outer - 1) + '_' + index">
                        <el-row type="flex" justify="center">
                          <button 
                            style="width: 50px; height: 50px; margin-right: 5px; background: transparent; border: none; margin-top: -3px;" 
                            size="mini" 
                            v-if="(Outer - 1) * 12 + (index - 1) < Part_Logical_List.length" 
                            @click="Add(Part_Logical_List[(Outer - 1) * 12 + (index - 1)])">
                            <Mathdown :name="'Set_Logical_List_' + ((Outer - 1) * 12 + index)" :content="Part_Logical_List[(Outer - 1) * 12 + (index - 1)]" style="margin-top: -3px; margin-left: -2px; text-align: center"></Mathdown>
                          </button>
                          <div style="width: 50px; height: 50px; margin-right: 5px; background: transparent; border: none; margin-top: -3px;" v-else>&nbsp;</div>
                        </el-row>
                      </el-col>
                    </el-row>
                    <img slot="reference" src="./assets/逻辑运算符.png" width="100%" style="cursor: pointer; margin: 5px; margin-top: 10px"/>
                  </el-popover>
                </el-row>
              </el-col>
              <!-- 括号 -->
              <el-col :span="2">
                <el-row type="flex" justify="start">
                  <el-popover
                    placement="bottom"
                    width="600"
                    trigger="hover">
                    <!-- Parentheses_List -> PL -->
                    <el-row v-for="Outer in Math.ceil(Part_Parentheses_List.length/12)" :key="'PL_' + (Outer - 1)" style="margin: 0px">
                      <el-col :span="2" v-for="index in 12" :key="'PL_'  + (Outer - 1) + '_' + index">
                        <el-row type="flex" justify="center">
                          <button 
                            style="width: 50px; height: 75px; margin-right: 5px; background: transparent; border: none; margin-top: -3px;" 
                            size="mini" 
                            v-if="(Outer - 1) * 12 + (index - 1) < Part_Parentheses_List.length && Part_Parentheses_List[(Outer - 1) * 12 + (index - 1)] != ''" 
                            @click="Add(Part_Parentheses_List[(Outer - 1) * 12 + (index - 1)])">
                            <Mathdown :name="'Parentheses_List_' + ((Outer - 1) * 12 + index)" :content="Part_Parentheses_List[(Outer - 1) * 12 + (index - 1)]" style="margin-top: -3px; margin-left: -2px; text-align: center"></Mathdown>
                          </button>
                          <div style="width: 50px; height: 75px; margin-right: 5px; background: transparent; border: none; margin-top: -3px;" v-else>&nbsp;</div>
                        </el-row>
                      </el-col>
                    </el-row>
                    <img slot="reference" src="./assets/括号.png" width="100%" style="cursor: pointer; margin: 5px; margin-top: 10px"/>
                  </el-popover>
                </el-row>
              </el-col>
              <!-- 箭头 -->
              <el-col :span="2">
                <el-row type="flex" justify="start">
                  <el-popover
                    placement="bottom"
                    width="600"
                    trigger="hover">
                    <!-- Arrow_List -> AL -->
                    <el-row v-for="Outer in Math.ceil(Part_Arrow_List.length/12)" :key="'AL_' + (Outer - 1)" style="margin: 0px">
                      <el-col :span="2" v-for="index in 12" :key="'AL_'  + (Outer - 1) + '_' + index">
                        <el-row type="flex" justify="center">
                          <button 
                            style="width: 50px; height: 50px; margin-right: 5px; background: transparent; border: none; margin-top: -3px;" 
                            size="mini" 
                            v-if="(Outer - 1) * 12 + (index - 1) < Part_Arrow_List.length && Part_Arrow_List[(Outer - 1) * 12 + (index - 1)] != ''" 
                            @click="Add(Part_Arrow_List[(Outer - 1) * 12 + (index - 1)])">
                            <Mathdown :name="'Arrow_List_' + ((Outer - 1) * 12 + index)" :content="Part_Arrow_List[(Outer - 1) * 12 + (index - 1)]" style="margin-top: -3px; margin-left: -2px; text-align: center"></Mathdown>
                          </button>
                          <div style="width: 50px; height: 50px; margin-right: 5px; background: transparent; border: none; margin-top: -3px;" v-else>&nbsp;</div>
                        </el-row>
                      </el-col>
                    </el-row>
                    <img slot="reference" src="./assets/箭头.png" width="100%" style="cursor: pointer; margin: 5px; margin-top: 10px"/>
                  </el-popover>
                </el-row>
              </el-col>
              <!-- 微积分 -->
              <el-col :span="2">
                <el-row type="flex" justify="start">
                  <el-popover
                    placement="bottom"
                    width="600"
                    trigger="hover">
                    <!-- Calculus_List -> CL -->
                    <el-row v-for="Outer in Math.ceil(Part_Calculus_List.length/8)" :key="'CL_' + (Outer - 1)" style="margin: 0px">
                      <el-col :span="3" v-for="index in 8" :key="'CL_'  + (Outer - 1) + '_' + index">
                        <el-row type="flex" justify="center">
                          <button 
                            style="width: 75px; height: 75px; margin-right: 5px; background: transparent; border: none; margin-top: -3px;" 
                            size="mini" 
                            v-if="(Outer - 1) * 8 + (index - 1) < Part_Calculus_List.length && Part_Calculus_List[(Outer - 1) * 8 + (index - 1)] != ''" 
                            @click="Add(Part_Calculus_List[(Outer - 1) * 8 + (index - 1)])">
                            <Mathdown :name="'Calculus_List_' + ((Outer - 1) * 8 + index)" :content="Part_Calculus_List[(Outer - 1) * 8 + (index - 1)]" style="margin-top: -3px; margin-left: -2px; text-align: center"></Mathdown>
                          </button>
                          <div style="width: 75px; height: 75px; margin-right: 5px; background: transparent; border: none; margin-top: -3px;" v-else>&nbsp;</div>
                        </el-row>
                      </el-col>
                    </el-row>
                    <img slot="reference" src="./assets/微积分.png" width="100%" style="cursor: pointer; margin: 5px; margin-top: 10px"/>
                  </el-popover>
                </el-row>
              </el-col>
              <!-- 三角函数 -->
              <el-col :span="2">
                <el-row type="flex" justify="start">
                  <el-popover
                    placement="bottom"
                    width="600"
                    trigger="hover">
                    <!-- Triangle_List -> TL -->
                    <el-row v-for="Outer in Math.ceil(Part_Triangle_List.length/6)" :key="'TL_' + (Outer - 1)" style="margin: 0px">
                      <el-col :span="4" v-for="index in 6" :key="'TL_'  + (Outer - 1) + '_' + index">
                        <el-row type="flex" justify="center">
                          <button 
                            style="width: 50px; height: 50px; margin-right: 5px; background: transparent; border: none; margin-top: -3px;" 
                            size="mini" 
                            v-if="(Outer - 1) * 6 + (index - 1) < Part_Triangle_List.length && Part_Triangle_List[(Outer - 1) * 6 + (index - 1)] != ''" 
                            @click="Add(Part_Triangle_List[(Outer - 1) * 6 + (index - 1)])">
                            <Mathdown :name="'Triangle_List_' + ((Outer - 1) * 6 + index)" :content="Part_Triangle_List[(Outer - 1) * 6 + (index - 1)]" style="margin-top: -3px; margin-left: -2px; text-align: center"></Mathdown>
                          </button>
                          <div style="width: 50px; height: 50px; margin-right: 5px; background: transparent; border: none; margin-top: -3px;" v-else>&nbsp;</div>
                        </el-row>
                      </el-col>
                    </el-row>
                    <img slot="reference" src="./assets/三角函数.png" width="100%" style="cursor: pointer; margin: 5px; margin-top: 10px"/>
                  </el-popover>
                </el-row>
              </el-col>
              <!-- 几何符号 -->
              <el-col :span="2">
                <el-row type="flex" justify="start">
                  <el-popover
                    placement="bottom"
                    width="600"
                    trigger="hover">
                    <!-- Geometry_List -> GL -->
                    <el-row v-for="Outer in Math.ceil(Part_Geometry_List.length/12)" :key="'GL_' + (Outer - 1)" style="margin: 0px">
                      <el-col :span="2" v-for="index in 12" :key="'GL_'  + (Outer - 1) + '_' + index">
                        <el-row type="flex" justify="center">
                          <button 
                            style="width: 50px; height: 50px; margin-right: 5px; background: transparent; border: none; margin-top: -3px;" 
                            size="mini" 
                            v-if="(Outer - 1) * 12 + (index - 1) < Part_Geometry_List.length && Part_Geometry_List[(Outer - 1) * 12 + (index - 1)] != ''" 
                            @click="Add(Part_Geometry_List[(Outer - 1) * 12 + (index - 1)])">
                            <Mathdown :name="'Geometry_List_' + ((Outer - 1) * 12 + index)" :content="Part_Geometry_List[(Outer - 1) * 12 + (index - 1)]" style="margin-top: -3px; margin-left: -2px; text-align: center"></Mathdown>
                          </button>
                          <div style="width: 50px; height: 50px; margin-right: 5px; background: transparent; border: none; margin-top: -3px;" v-else>&nbsp;</div>
                        </el-row>
                      </el-col>
                    </el-row>
                    <img slot="reference" src="./assets/几何符号.png" width="100%" style="cursor: pointer; margin: 5px; margin-top: 10px"/>
                  </el-popover>
                </el-row>
              </el-col>
              <!-- 矩阵 -->
              <el-col :span="2">
                <el-row type="flex" justify="start">
                  <el-popover
                    placement="bottom"
                    width="600"
                    trigger="hover">
                    <!-- Matrix_List -> ML -->
                    <el-row v-for="Outer in Math.ceil(Part_Matrix_List.length/4)" :key="'ML_' + (Outer - 1)" style="margin: 0px">
                      <el-col :span="6" v-for="index in 4" :key="'ML_'  + (Outer - 1) + '_' + index">
                        <el-row type="flex" justify="center">
                          <button 
                            style="width: 150px; height: 100px; margin-right: 5px; background: transparent; border: none; margin-top: -3px;" 
                            size="mini" 
                            v-if="(Outer - 1) * 4 + (index - 1) < Part_Matrix_List.length && Part_Matrix_List[(Outer - 1) * 4 + (index - 1)] != ''" 
                            @click="Add(Part_Matrix_List[(Outer - 1) * 4 + (index - 1)])">
                            <Mathdown :name="'Matrix_List_' + ((Outer - 1) * 4 + index)" :content="Part_Matrix_List[(Outer - 1) * 4 + (index - 1)]" style="margin-top: -3px; margin-left: -2px; text-align: center"></Mathdown>
                          </button>
                          <div style="width: 150px; height: 100px; margin-right: 5px; background: transparent; border: none; margin-top: -3px;" v-else>&nbsp;</div>
                        </el-row>
                      </el-col>
                    </el-row>
                    <img slot="reference" src="./assets/矩阵.png" width="100%" style="cursor: pointer; margin: 5px; margin-top: 10px"/>
                  </el-popover>
                </el-row>
              </el-col>
            </el-row>
          </el-col>
          <!-- <div>
            <el-popover ref="hint" placement="top" content="提供LaTex格式的数学公式元素的辅助输入功能。注：显示区使用KaTex进行解析，可能和LaTex结果显示上有差异，但LaTex格式无误。" width="300" trigger="hover"></el-popover>
            <el-button v-popover:hint class="Math_Helper" size="mini" @click="Open_Helper()">&Sigma;</el-button>
          </div> -->
        </el-row> 
        <!-- 右侧插入常见符号的部分 -->
        <div slot="right-toolbar-after" type="flex" justify="start" @mousewheel.prevent="Common_Page_Change">
          <el-row>
            <el-col v-for="(count, index) in [0,1,2,3,4,5,6]" :key="index" :span="3">
              <button style="width: 25px; height: 25px; margin-right: 5px; background: transparent; border: none; margin-top: -3px;" size="mini" v-if="Symbol_Index(index)" @click="Add_Symbol(index)">
                <Mathdown :name="'Common_Symbol_List_' + index" :content="Get_Symbol(index)" style="margin-top: -3px; margin-left: -2px"></Mathdown>
              </button>
              <button style="width: 25px; height: 25px; margin-right: 5px; background: transparent; border: none; margin-top: -3px;" v-else>&nbsp;</button>
            </el-col>
            <el-col :span="3">
              <button style="width: 25px; height: 25px; margin-right: 5px; background: transparent; border: none; margin-top: -3px;" size="mini" :disabled="Common_Page_Index == 0" @click="Common_Page_Index = Common_Page_Index - 1">
                <i class="el-icon-arrow-up" style="color: whitesmoke" v-if="Common_Page_Index == 0"></i>
                <i class="el-icon-arrow-up" v-else></i>
              </button>
            </el-col>
          </el-row>
          <el-row style="margin-top: -20px">
            <el-col v-for="(count, index) in [0,1,2,3,4,5,6]" :key="index" :span="3">
              <button style="width: 25px; height: 25px; margin-right: 5px; background: transparent; border: none; margin-top: -3px;" size="mini" v-if="Symbol_Index(index+7)" @click="Add_Symbol(index+7)">
                <Mathdown :name="'Common_Symbol_List_' + (index + 7)" :content="Get_Symbol(index+7)" style="margin-top: -3px; margin-left: -2px"></Mathdown>
              </button>
              <button style="width: 25px; height: 25px; margin-right: 5px; background: transparent; border: none; margin-top: -3px;" v-else>&nbsp;</button>
            </el-col>
            <el-col :span="3">
              <button style="width: 25px; height: 25px; margin-right: 5px; background: transparent; border: none; margin-top: -3px;" size="mini" :disabled="Common_Page_Index * 7 + 21 >= Symbol_List.length" @click="Common_Page_Index = Common_Page_Index + 1">
                <i class="el-icon-arrow-down" style="color: whitesmoke" v-if="Common_Page_Index * 7 + 21 >= Symbol_List.length"></i>
                <i class="el-icon-arrow-down" v-else></i>
              </button>
            </el-col>
          </el-row>
          <el-row style="margin-top: -20px">
            <el-col v-for="(count, index) in [0,1,2,3,4,5,6]" :key="index" :span="3">
              <button style="width: 25px; height: 25px; margin-right: 5px; background: transparent; border: none; margin-top: -3px;" size="mini" v-if="Symbol_Index(index+14)" @click="Add_Symbol(index+14)">
                <Mathdown :name="'Common_Symbol_List_' + (index + 14)" :content="Get_Symbol(index+14)" style="margin-top: -3px; margin-left: -2px"></Mathdown>
              </button>
              <button style="width: 25px; height: 25px; margin-right: 5px; background: transparent; border: none; margin-top: -3px;" v-else>&nbsp;</button>
            </el-col>
            <el-col :span="3">
              <el-popover
                placement="bottom"
                trigger="hover">
                <el-col style="margin: 0px; padding: 0px;">
                  <el-row type="flex" justify="center" style="margin: 0px; margin-bottom: 5px">
                    当前类型：{{Common_Symbol_Type}}
                  </el-row>
                  <el-row type="flex" justify="center" v-if="Common_Symbol_Type != '常用符号'" style="margin: 0px; margin-top: -2px">
                    <el-button type="text" size="medium" @click="Common_Symbol_Type = '常用符号'">切换至常用符号</el-button>
                  </el-row>
                  <el-row type="flex" justify="center" v-if="Common_Symbol_Type != '希腊字母'" style="margin: 0px; margin-top: -2px">
                    <el-button type="text" size="medium" @click="Common_Symbol_Type = '希腊字母'">切换至希腊字母</el-button>
                  </el-row>
                  <el-row type="flex" justify="center" v-if="Common_Symbol_Type != '字母符号'" style="margin: 0px; margin-top: -2px">
                    <el-button type="text" size="medium" @click="Common_Symbol_Type = '字母符号'">切换至字母符号</el-button>
                  </el-row>
                </el-col>
                <button slot="reference" style="width: 25px; height: 25px; margin-right: 5px; background: transparent; border: none; margin-top: -3px;" size="mini">
                  <i class="el-icon-caret-bottom"></i>
                </button>
              </el-popover>
            </el-col>
          </el-row>
        </div>        
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
      MESinker: false,
      // 按钮栏翻到多少页了
      Common_Page_Index: 0,
      Common_Symbol_Set: {
        // 默认栏
        '常用符号': ["$\\pm$", "$\\infty$", "$\=$", "$\\neq$", "~", "$\\times$", "$\\div$", 
                    "$\!$", "$\\propto$", "$\<$", "$\\ll$", "$\>$", "$\\gg$", "$\\leq$", 
                    "$\\geq$", "$\\mp$", "$\\cong$", "$\\approx$", "$\\equiv$", "$\\forall$", "$\\complement$",
                    "$\\partial$", "$\\sqrt[]{}$", "$\\sqrt[3]{}$", "$\\sqrt[4]{}$", "$\\cup$", "$\\cap$", "$\\emptyset$",
                    "$\\%$", "$^{\\circ}$", "$^{\\circ}F$", "$^{\\circ}C$", "$\\Delta$", "$\\nabla$", "$\\exists$",
                    "$\\nexists$", "$\\in$", "$\\ni$", "$\\gets$", "$\\uparrow$", "$\\to$", "$\\downarrow$",
                    "$\\leftrightarrow$", "$\\because$", "$\\therefore$", "$\+$", "$\-$", "$\\neg$", "$\\alpha$", 
                    "$\\beta$", "$\\gamma$", "$\\delta$", "$\\varepsilon$", "$\\epsilon$", "$\\theta$", "$\\vartheta$", 
                    "$\\mu$", "$\\pi$", "$\\rho$", "$\\sigma$", "$\\tau$", "$\\varphi$", "$\\omega$", 
                    "$\\ast$", "$\\bullet$", "$\\vdots$", "$\\cdots$", "$\\ddots$", "$\\aleph$", "$\\beth$"],
        // 希腊字母
        '希腊字母': ["$\\alpha$", "$\\beta$", "$\\gamma$", "$\\delta$", "$\\varepsilon$", "$\\epsilon$", "$\\zeta$",
                  "$\\eta$", "$\\theta$", "$\\vartheta$", "$\\iota$", "$\\kappa$", "$\\lambda$",  "$\\mu$",
                  "$\\nu$", "$\\omicron$", "$\\xi$", "$\\pi$", "$\\varpi$", "$\\rho$", "$\\varrho$", "$\\sigma$", "$\\varsigma$",
                  "$\\tau$", "$\\upsilon$", "$\\phi$", "$\\chi$", "$\\psi$", "$\\omega$",
                  "$\\rm{A}$",  "$\\rm{B}$", "$\\Gamma$", "$\\Delta$", "$\\rm{E}$", "$\\rm{Z}$",
                  "$\\rm{H}$", "$\\Theta$", "$\\rm{I}$", "$\\rm{K}$",  "$\\Lambda$", "$\\rm{M}$",
                  "$\\rm{N}$", "$\\rm{O}$", "$\\Xi$", "$\\Pi$",  "$\\rm{P}$", "$\\Sigma$",
                  "$\\rm{T}$", "$\\Upsilon$", "$\\Phi$", "$\\rm{X}$", "$\\Psi$", "$\\Omega$"],
        // 其他字母类符号
        '字母符号': ["$\\rm{F}$", "$\\Finv$", "$\\exists$", "$\\nexists$",
                    "$\\forall$", "$\\complement$", "$\\partial$", "$\\hbar$", 
                    "$\\mathcal{g}$", "$\\mathcal{H}$", "$\\mathcal{R}$", "$\\mathcal{L}$",
                    "$\\mathcal{l}$", "$\\mathcal{B}$", "$\\mathcal{E}$", "$\\mathcal{F}$", "$\\mathcal{o}$", 
                    "$\\mathfrak{H}$", "$\\mathfrak{h}$", "$\\mathfrak{l}$", "$\\mathfrak{R}$",
                    "$\\mathbb{K}$", "$\\mathbb{Z}$", "$\\mathbb{R}$", "$\\mathbb{N}$", "$\\mathbb{Q}$", "$\\mathbb{P}$", "$\\mathbb{I}$",
                    "$\\gimel$", "$\\daleth$", "$\\aleph$", "$\\beth$", "$\\infty$", "$\\backepsilon$", "$\\eth$", "$\\Im$", "$\\imath$",
                    "$\\jmath$", "$\\ell$", "$\\mho$", "$\\wp$", "$\\Re$", "$\\circledS$"]
      },
      Common_Symbol_Type: '常用符号',
      // 当前显示的按钮内容
      Symbol_List: ["$\\pm$", "$\\infty$", "$\=$", "$\\neq$", "~", "$\\times$", "$\\div$", 
                    "$\!$", "$\\propto$", "$\<$", "$\\ll$", "$\>$", "$\\gg$", "$\\leq$", 
                    "$\\geq$", "$\\mp$", "$\\cong$", "$\\approx$", "$\\equiv$", "$\\forall$", "$\\complement$",
                    "$\\partial$", "$\\sqrt[]{}$", "$\\sqrt[3]{}$", "$\\sqrt[4]{}$", "$\\cup$", "$\\cap$", "$\\emptyset$",
                    "$\\%$", "$^{\\circ}$", "$^{\\circ}F$", "$^{\\circ}C$", "$\\Delta$", "$\\nabla$", "$\\exists$",
                    "$\\nexists$", "$\\in$", "$\\ni$", "$\\gets$", "$\\uparrow$", "$\\to$", "$\\downarrow$",
                    "$\\leftrightarrow$", "$\\because$", "$\\therefore$", "$\+$", "$\-$", "$\\neg$", "$\\alpha$", 
                    "$\\beta$", "$\\gamma$", "$\\delta$", "$\\varepsilon$", "$\\epsilon$", "$\\theta$", "$\\vartheta$", 
                    "$\\mu$", "$\\pi$", "$\\rho$", "$\\sigma$", "$\\tau$", "$\\varphi$", "$\\omega$", 
                    "$\\ast$", "$\\bullet$", "$\\vdots$", "$\\cdots$", "$\\ddots$", "$\\aleph$", "$\\beth$"],
      // 第一个按钮是否显示的是第一页，由于只有两页，所以可以直接判断
      Part_Common_Page: true,
      // 常用运算符按钮代表的功能列，分为 常用运算符，二元运算符，分式，指数 四个部分
      Part_Common_List:{
        "常用运算符": ["$\+$", "$\-$", "$\\div$", "$\\times$", "$\\pm$", "$\\mp$", "$\\propto$", "$\/$", "$\\ast$", "$\\circ$",
                      "$\\bullet$", "$\\cdot$", "$\\cap$", "$\\cup$", "$\\uplus$", "$\\sqcap$", "$\\sqcup$", "$\\wedge$", "$\\vee$"],
        "二元运算符": ["$\=$", "$\\neq$", "$\<$", "$\>$", "$\\leq$", "$\\geq$", "$\\nless$", "$\\nleq$", "$\\ngtr$", "$\\ngeq$", 
                      "$\\equiv$", "$\\sim$", "$\\simeq$", "$\\approx$", "$\\cong$", "$\\not\\equiv$", "$\\not\\simeq$", "$\\not\\approx$", "$\\not\\cong$", "$\\propto$", 
                      "$\\ll$", "$\\gg$", "$\\in$", "$\\ni$", "$\\notin$", "$\\subset$", "$\\supset$", "$\\subseteq$", "$\\supseteq$", "$\\prec$", 
                      "$\\succ$", "$\\preceq$", "$\\succeq$", "$\\sqsubset$", "$\\sqsupset$", "$\\sqsubseteq$", "$\\sqsupseteq$", "$\\parallel$", "$\\bot$", "$\\vdash$", 
                      "$\\dashv$", "$\\bowtie$", "$\\asymp$"],
        "分式": ["$\\frac{a}{b}$", "$\\frac{d{a}}{d{b}}$", "$\\frac{\\nabla{a}}{\\nabla{b}}$", "$\\frac{\\partial{a}}{\\partial{b}}$", "$\\frac{\\delta{a}}{\\delta{b}}$", "$\\frac{\\pi}{2}$",
                "$\\mathrm{a}/\\mathrm{b}$", "$\\mathrm{d{a}}/\\mathrm{d{b}}$", "$\\mathrm{\\nabla{a}}/\\mathrm{\\nabla{b}}$", "$\\mathrm{\\partial{a}}/\\mathrm{\\partial{b}}$", "$\\mathrm{\\delta{a}}/\\mathrm{\\delta{b}}$", "$\\mathrm{\\pi}/\\mathrm{2}$",
                "$\\tfrac{a}{b}$", "$\\tfrac{d{a}}{d{b}}$", "$\\tfrac{\\nabla{a}}{\\nabla{b}}$", "$\\tfrac{\\partial{a}}{\\partial{b}}$", "$\\tfrac{\\delta{a}}{\\delta{b}}$", "$\\tfrac{\\pi}{2}$",
                "$\\frac{a}{c + \\frac{a}{d}}$", "$\\dbinom{n}{r}$", "$\\binom{n}{n-r}$", "$\\mathrm{C}_n^r$", "$\\mathrm{C}_n^{n-r}$"],
        "指数": ["$e^2$", "$a^b$", "$\\log {a}$", "$\\ln {a}$", "$\\lg {a}$", "$\\log_{a}^{b}$"]
      },
      // 集合运算符
      Part_Set_List: ["$\\forall$", "$\\exists$", "$\\nexists$", "$\\emptyset$", "$\\varnothing$", "$\\in$", "$\\not\\in$", "$\\ni$", "$\\not\\ni$", 
                      "$\\subset$", "$\\subseteq$", "$\\subseteqq$", "$\\subsetneqq$", "$\\supset$", "$\\supseteq$", 
                      "$\\supseteqq$", "$\\supsetneqq$", "$\\cup$", "$\\cap$", "$\\bigcap$", "$\\bigcup$"],
      // 逻辑运算符
      Part_Logical_List: ["$\\neg$", "$\p$", "$\q$", "$\\neg \p$", "$\\neg \q$", "$\\wedge$", "$\\vee$", "$\\bigwedge$", "$\\bigvee$"],
      // 上下标
      Part_Subscript_List: ["$\F_{a}^{}$", "$\F_{}^{b}$", "$\F_{a}^{b}$", "${}_{a}^{b}\F_{}^{}$", "${}_{}^{b}\F_{}^{}$", "${}_{a}^{b}\F_{c}^{d}$"],
      // 括号
      Part_Parentheses_List: ["$\( A \)$", "$\[ A \]$", "$\\{ A \\}$", "$\\langle A \\rangle$", "$\\lceil A \\rceil$", "$\\lfloor A \\rfloor$", 
                              "$\\left| A \\right|$", "$\\left \\| A \\right \\|$", "$\[ A \[$", "$\] A \]$", "$\] A \[$", "$\( A \| B \)$", 
                              "$\[ A \| B \]$", "$\\{ A \| B \\}$", "$\\langle A \| B \\rangle$", 
                              "$\( A $", "$ A \)$", "$\[ A $", "$ A \]$", "$\\{ A $", "$ A \\}$", "$\\langle A $", "$ A \\rangle$",
                              "$\\lceil A $", "$ A \\rceil$", "$\\lfloor A $", "$ A \\rfloor$", "$\| A $", "$ A \|$", "$\\| A $", "$ A \\|$", 
                              "$\\left \\{\\frac{a}{b} \\right.$", "$\\left. \\frac{a}{b} \\right \\}$", 
                              "$\\begin{cases} \\frac{n}{2}, & \\text{if } n\\text{ is even} \\\\ 3n+1, & \\text{if } n\\text{ is odd} \\end{cases}$", "", "",
                              "$\\begin{pmatrix} a_{11} & a_{12} & a_{13} \\\\ a_{21} & a_{22} & a_{23} \\\\ a_{31} & a_{32} & a_{33} \\end{pmatrix}$", "", "",
                              "$\\begin{vmatrix} a_{11} & a_{12} & a_{13} \\\\ a_{21} & a_{22} & a_{23} \\\\ a_{31} & a_{32} & a_{33} \\end{vmatrix}$", "", "",
                              "$\\begin{bmatrix} a_{11} & a_{12} & a_{13} \\\\ a_{21} & a_{22} & a_{23} \\\\ a_{31} & a_{32} & a_{33} \\end{bmatrix}$", "", "",
                              "$\\begin{Bmatrix} a_{11} & a_{12} & a_{13} \\\\ a_{21} & a_{22} & a_{23} \\\\ a_{31} & a_{32} & a_{33} \\end{Bmatrix}$", "", "",],
      // 箭头
      Part_Arrow_List: ["$\\uparrow$", "$\\Uparrow$", "$\\downarrow$", "$\\Downarrow$", "$\\updownarrow$", "$\\Updownarrow$", "$\\rightarrow$", "$\\Rightarrow$", "$\\leftarrow$", 
                        "$\\Leftarrow$", "$\\leftrightarrow$", "$\\Leftrightarrow$", "$\\longrightarrow$", "$\\Longrightarrow$", "$\\longleftarrow$", "$\\Longleftarrow$", "$\\rightleftharpoons$", "$\\nearrow$", 
                        "$\\searrow$", "$\\nLeftarrow$", "$\\nRightarrow$", "$\\rightleftarrows$", "$\\leftrightarrows$", "$\\rightrightarrows$", "$\\curvearrowright$", "$\\Longleftrightarrow$", "$\\leftrightsquigarrow$"],
      // 微积分
      Part_Calculus_List: ["$\d x$", "$\\mathrm{d} x$", "$\\partial x$", "$\\nabla x$", 
                           "$\dy/\dx$", "$\\mathrm{d}y/\\mathrm{d}x$", "$\\frac{\dy}{\dx}$", 
                           "$\\frac{\\mathrm{d}y}{\\mathrm{d}x}$", "$\\frac{\\partial^2}{\\partial x_1\\partial x_2}y$", 
                           "$\\int_{a}^{b}$", "$\\iint_{a}^{b}$", "$\\iiint_{a}^{b}$", "$\\oint_{}^{}$", "$\\oint_{a}^{b}$",
                           "$\\sum_{x = a}^{b}$", 
                           "$\\begin{matrix} \\sum_{x = a}^{b} \\end{matrix}$", 
                           "$\\prod_{x = a}^{b}$",
                           "$\\begin{matrix} \\prod_{x = a}^{b} \\end{matrix}$", 
                           "$\\coprod_{x = a}^{b}$", 
                           "$\\begin{pmatrix} \\coprod_{x = a}^{b} \\end{pmatrix}$",
                           "$x\\prime$", "$x\\backprime$", "$f^{\\prime}$", "$f'$", "$f''$", "$f^{(3)}$", "$\\dot y$", "$\\ddot y$",
                           "$\\lim u$", "$\\liminf v$", "$\\limsup w$", "$\\lim_{x \\to \\infty} \\frac{1}{n(n+1)}$"],
      // 三角
      Part_Triangle_List: ["$\\sin {\\theta}$", "$\\cos {\\theta}$", "$\\tan {\\theta}$", 
                           "$\\csc {\\theta}$", "$\\sec {\\theta}$", "$\\cot {\\theta}$", 
                           "$\\sin^{-1} {\\theta}$", "$\\cos^{-1} {\\theta}$", "$\\tan^{-1} {\\theta}$", 
                           "$\\csc^{-1} {\\theta}$", "$\\sec^{-1} {\\theta}$", "$\\cot^{-1} {\\theta}$", 
                           "$\\sinh {\\theta}$", "$\\cosh {\\theta}$", "$\\tanh {\\theta}$", 
                           "$\\mathrm{csch} {\\theta}$", "$\\mathrm{sech} {\\theta}$", "$\\coth {\\theta}$", 
                           "$\\sinh^{-1} {\\theta}$", "$\\cosh^{-1} {\\theta}$", "$\\tanh^{-1} {\\theta}$", 
                           "$\\mathrm{csch}^{-1} {\\theta}$", "$\\mathrm{sech}^{-1} {\\theta}$", "$\\coth^{-1} {\\theta}$", 
                           "$\\sin {\\theta}$", "$\\cos {2\\theta}$", "$\\tan {\\theta} = \\frac{\\sin {\\theta}}{\\cos {\\theta}}$",  ],
      // 几何
      Part_Geometry_List: ["$\\Box$", "$\\Diamond$", "$\\Delta$", "$\\angle A$", "$\\circ$", "$\\perp$", "$\\vec{a}$", 
                           "$\\overrightarrow{AB}$", "$\\overleftarrow{AB}$", "$\\overline{m+n}$", "$\\overline{AB}$", "$\\underline{m+n}$", "$\\underline{AB}$", "$\/\/$", 
                           "$\\boxplus$", "$\\triangle$", "$\\odot$", "$\\overset{\\frown}{AB}$", "$\\lozenge$", "$\\blacklozenge$", "$\\measuredangle$"],
      // 矩阵
      Part_Matrix_List: ["$\\begin{pmatrix} a_{11} & a_{12} & a_{13} \\\\ a_{21} & a_{22} & a_{23} \\\\ a_{31} & a_{32} & a_{33} \\end{pmatrix}$",
                         "$\\begin{vmatrix} a_{11} & a_{12} & a_{13} \\\\ a_{21} & a_{22} & a_{23} \\\\ a_{31} & a_{32} & a_{33} \\end{vmatrix}$",
                         "$\\begin{Vmatrix} a_{11} & a_{12} & a_{13} \\\\ a_{21} & a_{22} & a_{23} \\\\ a_{31} & a_{32} & a_{33} \\end{Vmatrix}$",
                         "$\\begin{bmatrix} a_{11} & a_{12} & a_{13} \\\\ a_{21} & a_{22} & a_{23} \\\\ a_{31} & a_{32} & a_{33} \\end{bmatrix}$",
                         "$\\begin{Bmatrix} a_{11} & a_{12} & a_{13} \\\\ a_{21} & a_{22} & a_{23} \\\\ a_{31} & a_{32} & a_{33} \\end{Bmatrix}$", 
                         "$\\begin{pmatrix} 1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix}$",
                         "$\\begin{vmatrix} 1 &   &   \\\\   & 1 &   \\\\   &   & 1 \\end{vmatrix}$",
                         "$\\begin{bmatrix} 1 &   &   \\\\   & \\ddots &   \\\\   &   & 1 \\end{bmatrix}$",
                         "$\\begin{bmatrix} 1 & \\dots  & 0 \\\\ \\vdots & \\ddots & \\vdots \\\\ 0 & \\dots & 1 \\end{bmatrix}$",
                         "$\\begin{matrix} 1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 1 \\end{matrix}$",
                         "$\\begin{matrix} 1 & 0 \\\\ 0 & 1 \\end{matrix}$",
                         "$\\begin{matrix} a & b & c \\\\ d & e & f \\end{matrix}$",]
    };
  },
  watch:{
    Common_Symbol_Type(val){
      this.Symbol_List = this.Common_Symbol_Set[val];
      this.Common_Page_Index = 0;
    },
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
    Get_Out_Content(val){
      this.content = val;
    },
    content(newVal){
      setTimeout(()=>{this.$emit("Update_CI", newVal)}, 10);
    },
    image_infos(newVal){
      setTimeout(()=>{this.$emit("Update_Image", newVal)}, 10);
    }
  },
  methods: {
    // 常用 - 长度检测
    Part_Common_List_Index(part, index){
      if(index >= this.Part_Common_List[part].length){
        return false
      }else{
        return true
      }
    },
    Add_Part_Common_List(part, index){
      this.Add(this.Part_Common_List[part][index]);
    },
    // 滚轮事件
    Common_Page_Change(e){
      if(e.wheelDeltaY < 0 && !(this.Common_Page_Index * 7 + 21 >= this.Symbol_List.length)){
        this.Common_Page_Index = this.Common_Page_Index + 1
        e.stopPropagation;
      }else if(e.wheelDeltaY > 0 && this.Common_Page_Index > 0){
        this.Common_Page_Index = this.Common_Page_Index - 1
        e.stopPropagation;
      }
    },
    // 添加符号
    Add_Symbol(index){
      this.Add(this.Symbol_List[(this.Common_Page_Index * 7) + index])
    },
    // 返回符号
    Get_Symbol(index){
      if((this.Common_Page_Index * 7) + index < this.Symbol_List.length){
        return this.Symbol_List[(this.Common_Page_Index * 7) + index]
      }else{
        return ""
      }
    },
    // 这个符号是否是一个有效的符号
    Symbol_Index(index){
      if((this.Common_Page_Index * 7) + index < this.Symbol_List.length){
        return true
      }else{
        return false
      }
    },
    Get_Mavon_Class(value){
      if(value){
        setTimeout(()=>{this.$emit("Full_Change", value)}, 10);
        return "ME_Full"   
      }else{
        setTimeout(()=>{this.$emit("Full_Change", value)}, 10);
        return "ME_Unfull"
      }
    },
    // 添加至Content
    Add(con){
      this.content = this.content + con;
      this.$message.success("已添加 " + con + " 至内容区。")
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

        var temp_param2 = "$\\mathrm{d}{变量占位符1}";
        var temp_param3 = "$\\mathrm{d}{变量占位符2}";
        
        this.temp_latex = "$\\mathrm{d}{a}/\\mathrm{d}{b}$"

      }else if(this.temp_param_type == 'par1v'){

        var temp_param2 = "d{变量占位符1}";
        var temp_param3 = "d{变量占位符2}";
        
        this.temp_latex = "$\\frac{d{a}}{d{b}}$"

      }else if(this.temp_param_type == 'par2v'){

        var temp_param2 = "$\\mathrm{d}{变量占位符1}";
        var temp_param3 = "$\\mathrm{d}{变量占位符2}";
        
        this.temp_latex = "$\\frac{" + temp_param2 + "}{" + temp_param3 + "}$"

      }else if(this.temp_param_type == 'par'){
        
        var temp_param2 = "$\\partial {变量占位符1}";
        var temp_param3 = "$\\partial {变量占位符2}";
        
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
  height: 600px;
}
</style>

<style scoped type="text/css">
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
  background-image: url(./../../assets/delete.jpeg);
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