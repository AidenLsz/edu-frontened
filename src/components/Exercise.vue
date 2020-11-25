<template>

  <div class="exercise">

    <el-dialog width="80%" :visible.sync="helper_dialog" title="快速公式助手" @close="helper_dialog = false; latex_now = ''; temp_latex = ''">
      <el-container style="height: 500px;">
        <el-main>
        <el-container style="margin-top: -20px; height: 390px">
          <el-aside width="25%" style="height: 390px;">
            <el-select v-model="latex_now" placeholder="请选择数学元素的大致类型">
                <el-option
                  v-for="(item, index) in latex"
                  :key="index"
                  :label="item.name"
                  :value="item.name">
                </el-option>
            </el-select>
            <el-divider></el-divider>
            <div style="padding-top: -10px;" >常见数学希腊符号表</div><br/>
            <el-table max-height="260px" :show-header="false" :data="symbols" style="font-size: 15px">
                <el-table-column
                  prop="col1"
                  align="center"
                  width="40">
                </el-table-column>
                <el-table-column
                  prop="col2"
                  align="left"
                  width="100">
                </el-table-column>
                <el-table-column
                  prop="col3"
                  align="center"
                  width="40">
                </el-table-column>
                <el-table-column
                  prop="col4"
                  align="left"
                  width="100">
                </el-table-column>
            </el-table>           
          </el-aside>

          <el-main width="75%" style="height: 390px;">
            
            <!-- 常用符号及格式提示用DIV -->
            <div v-if="latex_now == '' || latex_now == '常用符号及格式提示'">
              <el-row>
                <el-col :span="4" style="text-align: left; font-weight: bold">
                  格式提示
                </el-col>
              </el-row>
              <el-form >
                <el-row :span="24" >
                  <el-col :span="24">
                    <el-form-item label="点击查看常用输入格式结果">
                      <el-radio-group style="width: 800px; text-align: left; padding-top: 10px" v-model="temp_latex">
                        <el-row :span="24" >
                          <el-col :span="6">
                            <el-radio label="$a^2$">上标 例：a^2</el-radio>
                          </el-col>
                          <el-col :span="6" :offset="1">
                            <el-radio label="$a_2$">下标 例：a_2</el-radio>
                          </el-col>
                          <el-col :span="6" :offset="1">
                            <el-radio label="$a^{a+b}$">组合上标 例：a^{a+b}</el-radio>
                          </el-col>                   
                        </el-row>
                        <el-row>
                          <el-col :span="6">
                            <el-radio label="$a_{a+b}$">组合上标 例：a_{a+b}</el-radio>
                          </el-col>
                          <el-col :span="6" :offset="1">
                            <el-radio label="$a_2^3$">组合上下标 例：a_2^3</el-radio>
                          </el-col>
                          <el-col :span="6" :offset="1">
                            <el-radio label="${}_1^2a_3^4$">前置上下标 例：{}_1^2a_3^4</el-radio>
                          </el-col>
                        </el-row>
                      </el-radio-group>               
                    </el-form-item>     
                  </el-col>
                </el-row>
              </el-form>
              <el-divider></el-divider>
              <el-row>
                <el-col :span="4" style="text-align: left; font-weight: bold">
                  常用符号
                </el-col>
              </el-row>
              <el-form >
                <el-row :span="24" >
                  <el-col :span="24">
                    <el-form-item label="请选择常用符号类型">
                      <el-radio-group style="width: 800px; text-align: left; padding-top: 10px" v-model="temp_param_type">
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
                            <el-radio label="oint">闭合曲线 / 面符号</el-radio>
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
                <el-row :span="24" v-if="temp_param_type == 'sum' ||
                                        temp_param_type == 'msum' ||
                                        temp_param_type == 'mul' ||
                                        temp_param_type == 'mmul' ||
                                        temp_param_type == 'cmul' ||
                                        temp_param_type == 'mcmul' ||
                                        temp_param_type == 'bcap' ||
                                        temp_param_type == 'bcup' ">
                  <el-col :span="6">
                    <el-form-item label="变量">
                      <el-input v-model="temp_param_1" placeholder="请输入变量"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6" :offset="1">
                    <el-form-item label="变量起始值">
                      <el-input v-model="temp_param_2" placeholder="请输入变量起始值"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6" :offset="1">
                    <el-form-item label="变量目标值">
                      <el-input v-model="temp_param_3" placeholder="请输入变量目标值"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :span="24" v-if="temp_param_type == 'int' ||
                                        temp_param_type == 'iint' ||
                                        temp_param_type == 'iiint'">
                  <el-col :span="6">
                    <el-form-item label="上限">
                      <el-input v-model="temp_param_1" placeholder="请输入上限"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6" :offset="1">
                    <el-form-item label="下限">
                      <el-input v-model="temp_param_2" placeholder="请输入下限"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :span="24" v-if="temp_param_type == 'cap' ||
                                        temp_param_type == 'cup'">
                  <el-col :span="18">
                    <el-form-item label="变量">
                      <el-input v-model="temp_param_1" placeholder="请输入至少两个变量，并用英文逗号分隔变量"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <el-divider></el-divider>
              <el-link href="https://www.cnblogs.com/wanghai0666/p/13950679.html" target="_blank">更多常见符号对照表</el-link>
            </div>

            <!-- 各类括号的使用方法的DIV -->
            <div v-if="latex_now == '各类括号的使用方法'">
              <el-row>
                <el-col :span="4" style="text-align: left; font-weight: bold">
                  各类括号的使用方法
                </el-col>
                <el-col :span="24" style="margin: 10px">
                </el-col>
                <el-col :span="24" style="text-align: left; padding-left: 20px">
                  基础表示方式： ( ) 、 [ ]  和 | 表示符号本身，使用  \{ \} 来表示  { } 。
                </el-col>
              </el-row>
              <el-divider></el-divider>
              <el-form >
                <el-row :span="24" >
                  <el-col :span="24">
                    <el-form-item label="点击查看示例结果">
                      <el-radio-group style="width: 800px; text-align: left; padding-top: 10px" v-model="temp_latex">
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
                        </el-row>
                        <el-row :span="24" >
                          <el-col :span="4">
                            <el-radio label="$\left[ 0,1 \right)$">括号混合</el-radio>
                          </el-col>
                          <el-col :span="6" :offset="1">
                            <el-radio label="$\left \{\frac{a}{b} \right.$">单左括号（注意右侧补齐）</el-radio>
                          </el-col>
                          <el-col :span="6" :offset="1">
                            <el-radio label="$\left. \frac{a}{b} \right \}$">单右括号（注意左侧补齐）</el-radio>
                          </el-col>                  
                        </el-row>
                        <el-row :span="24" >
                          <el-col :span="8">
                            <el-radio label="$\Bigg ( \bigg [ \Big \{ \big \langle \left | \| \frac{a}{b} \| \right | \big \rangle \Big \} \bigg ] \Bigg )$">括号大小控制示例</el-radio>
                          </el-col>                  
                        </el-row>
                      </el-radio-group>               
                    </el-form-item>     
                  </el-col>
                </el-row>
              </el-form>
            </div>

            <!-- 指数用DIV -->
            <div v-if="latex_now == '指数'">
              <el-form>
                <el-row :span="24">
                  <el-col :span="6">
                    <el-form-item label="底数">
                      <el-input v-model="temp_param_1" placeholder="请输入底数"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6" :offset="1">
                    <el-form-item label="指数">
                      <el-input v-model="temp_param_2" placeholder="请输入指数"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form> 
            </div>

            <!-- 对数用DIV -->
            <div v-if="latex_now == '对数'">
              <el-form>
                <el-row>
                  <el-col :span="9">
                    <el-form-item label="特殊底数">
                      <el-radio-group v-model="temp_param_1">
                        <el-radio label="e">e</el-radio>
                        <el-radio label="10">10</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="4">
                    <el-form-item label="底数">
                      <el-input v-model="temp_param_1" placeholder="请输入底数"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4" :offset="1">
                    <el-form-item label="指数">
                      <el-input v-model="temp_param_2" placeholder="请输入指数"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>

            <!-- 三角函数用DIV -->
            <div v-if="latex_now == '三角函数'">
              <el-form >
                <el-row :span="24" >
                  <el-col :span="24">
                    <el-form-item label="请选择三角函数类型">
                      <el-radio-group style="width: 800px; text-align: left; padding-top: 10px" v-model="temp_param_type">
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
                <el-row :span="24">
                  <el-col :span="9">
                    <el-form-item label="参数">
                      <el-input v-model="temp_param_1" placeholder="请输入参数"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>

            <!-- 最值用DIV -->
            <div v-if="latex_now == '最值'">
              <el-form>
                <el-row :span="24" >
                  <el-col :span="24">
                    <el-form-item label="请选择最值类型">
                      <el-radio-group style="width: 800px; text-align: left; padding-top: 10px" v-model="temp_param_type">
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
                <el-row :span="24">
                  <el-col :span="9">
                    <el-form-item label="参数">
                      <el-input v-model="temp_param_1" placeholder="请输入参数，多个参数请用英文逗号分隔"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>   
            </div>

            <!-- 极限用DIV -->
            <div v-if="latex_now == '极限'">
              <el-form>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="请选择极限类型">
                      <el-radio-group style="width: 800px; text-align: left; padding-top: 10px" v-model="temp_param_type">
                        <el-row :span="24" >
                          <el-col :span="3">
                            <el-radio label="lim">极限（无变量）</el-radio>
                          </el-col>
                          <el-col :span="3" :offset="1">
                            <el-radio label="limft">极限（有变量）</el-radio>
                          </el-col>
                          <el-col :span="3" :offset="1">
                            <el-radio label="limsup">上极限</el-radio>
                          </el-col>
                          <el-col :span="3" :offset="1">
                            <el-radio label="liminf">下极限</el-radio>
                          </el-col>                                         
                        </el-row>
                        <el-row :span="24" >
                          <el-col :span="3">
                            <el-radio label="dim">维度</el-radio>
                          </el-col>
                          <el-col :span="3" :offset="1">
                            <el-radio label="deg">多项式次数</el-radio>
                          </el-col>
                          <el-col :span="3" :offset="1">
                            <el-radio label="det">行列式</el-radio>
                          </el-col>
                          <el-col :span="3" :offset="1">
                            <el-radio label="ker">核（kernal）</el-radio>
                          </el-col>                                         
                        </el-row>
                      </el-radio-group>               
                    </el-form-item>     
                  </el-col>
                </el-row>
                <el-row :span="24" v-if=" temp_param_type != 'limft' ">
                  <el-col :span="9">
                    <el-form-item label="公式">
                      <el-input v-model="temp_param_1" placeholder="请输入公式"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :span="24" v-if=" temp_param_type == 'limft' ">
                  <el-col :span="6">
                    <el-form-item label="参数">
                      <el-input v-model="temp_param_1" placeholder="请输入参数名，多个参数名请用英文逗号分隔"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6" :offset="3">
                    <el-form-item label="目标">
                      <el-input v-model="temp_param_2" placeholder="请输入极限值，多个极限值请用英文逗号分隔"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6" :offset="3">
                    <el-form-item label="公式">
                      <el-input v-model="temp_param_3" placeholder="请输入公式"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>

            <!-- 分数用DIV -->
            <div v-if="latex_now == '分数'">
              <el-form>
                <el-row :span="24">
                  <el-col :span="11">
                    <el-form-item label="分子部分">
                      <el-input v-model="temp_param_1" placeholder="请输入分子部分"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11" :offset="2">
                    <el-form-item label="分母部分">
                      <el-input v-model="temp_param_2" placeholder="请输入分母部分"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>

            <!-- 投射用DIV -->
            <div v-if="latex_now == '投射'">
              <el-form>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="请选择投射属性">
                      <el-radio-group style="width: 800px; text-align: left; padding-top: 10px" v-model="temp_param_type">
                        <el-row :span="24" >
                          <el-col :span="3">
                            <el-radio label="pr">概率</el-radio>
                          </el-col>
                          <el-col :span="3" :offset="1">
                            <el-radio label="hom">同态</el-radio>
                          </el-col>
                          <el-col :span="3" :offset="1">
                            <el-radio label="len">范</el-radio>
                          </el-col>
                          <el-col :span="3" :offset="1">
                            <el-radio label="arg">角度</el-radio>
                          </el-col>                                         
                        </el-row>
                      </el-radio-group>               
                    </el-form-item>     
                  </el-col>
                </el-row>
                <el-row :span="24">
                  <el-col :span="9">
                    <el-form-item label="公式">
                      <el-input v-model="temp_param_1" placeholder="请输入公式"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>

            <!-- 微分及导数用DIV -->
            <div v-if="latex_now == '微分及导数'">
              <el-form>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="请选择极限类型">
                      <el-radio-group style="width: 800px; text-align: left; padding-top: 10px" v-model="temp_param_type">
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
                            <el-radio label="nabla">梯度元素</el-radio>
                          </el-col>                                         
                        </el-row>
                        <el-row :span="24" >
                          <el-col :span="4">
                            <el-radio label="par1h">dx/dy（格式1）</el-radio>
                          </el-col>
                          <el-col :span="4" :offset="1">
                            <el-radio label="par2h">dx/dy（格式2）</el-radio>
                          </el-col>
                          <el-col :span="4" :offset="1">
                            <el-radio label="par1v">dx/dy（格式1 | 竖版）</el-radio>
                          </el-col>
                          <el-col :span="4" :offset="1">
                            <el-radio label="par2v">dx/dy（格式2 | 竖版）</el-radio>
                          </el-col>
                          <el-col :span="4" :offset="1">
                            <el-radio label="par">偏导</el-radio>
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
                            <el-radio label="deridot">导数（点形式）</el-radio>
                          </el-col>                                     
                        </el-row>
                      </el-radio-group>               
                    </el-form-item>     
                  </el-col>
                </el-row>
                <el-row :span="24" v-if=" temp_param_type == 'dt' ||
                                          temp_param_type == 'mdt' ||
                                          temp_param_type == 'partial' ||
                                          temp_param_type == 'nabla' ">
                  <el-col :span="16">
                    <el-form-item label="变量元素">
                      <el-input v-model="temp_param_1" placeholder="请输入变量元素，多元素请用英文逗号分隔"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :span="24" v-if=" temp_param_type == 'par1h' ||
                                          temp_param_type == 'par2h' ||
                                          temp_param_type == 'par1v' ||
                                          temp_param_type == 'par2v' ||
                                          temp_param_type == 'par' ">
                  <el-col :span="10">
                    <el-form-item label="变量1">
                      <el-input v-model="temp_param_1" placeholder="请输入变量1，多个变量请用英文逗号分隔"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10" :offset="1">
                    <el-form-item label="变量2">
                      <el-input v-model="temp_param_2" placeholder="请输入变量2，多个变量请用英文逗号分隔"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :span="24" v-if=" temp_param_type == 'prime' ||
                                          temp_param_type == 'backprime' ">
                </el-row>
                <el-row :span="24" v-if=" temp_param_type == 'deri' ||
                                          temp_param_type == 'deridot' ">
                  <el-col :span="10">
                    <el-form-item label="变量元素">
                      <el-input v-model="temp_param_1" placeholder="请输入变量元素"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10" :offset="1">
                    <el-form-item label="求导次数">
                      <el-input v-model="temp_param_2" placeholder="请输入求导次数"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>

            <!-- 类字母符号与常数用DIV -->
            <div v-if="latex_now == '类字母符号与常数'">
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
            </div>

            <!-- 模运算及开根号用DIV -->
            <div v-if="latex_now == '模运算及开根号'">
              <el-form>
                <el-form-item label="特殊符号">
                  <el-row>
                    <el-col :span="1">
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
                </el-form-item>
               
                <el-row :span="24" >
                  <el-col :span="24">
                    <el-form-item label="请选择运算类型">
                      <el-radio-group style="width: 800px; text-align: left; padding-top: 10px" v-model="temp_param_type">
                        <el-row :span="24" >
                          <el-col :span="3">
                            <el-radio label="bmod">mod符号</el-radio>
                          </el-col>
                          <el-col :span="3" :offset="1">
                            <el-radio label="pmod">对 x 取余</el-radio>
                          </el-col>
                          <el-col :span="3" :offset="1">
                            <el-radio label="gcd">最大公约数</el-radio>
                          </el-col>
                          <el-col :span="3" :offset="1">
                            <el-radio label="lcm">最小公倍数</el-radio>
                          </el-col>   
                          <el-col :span="3" :offset="1">
                            <el-radio label="sqrt">开根号</el-radio>
                          </el-col>               
                        </el-row>
                      </el-radio-group>               
                    </el-form-item>     
                  </el-col>
                </el-row>

                <el-row v-if="temp_param_type == 'bmod'"></el-row>
                <el-row v-else-if="temp_param_type == 'pmod'">
                  <el-col :span="4">
                    <el-form-item label="参数">
                      <el-input v-model="temp_param_1" placeholder="请输入参数"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row v-else>
                  <el-col :span="4">
                    <el-form-item label="参数1">
                      <el-input v-model="temp_param_1" placeholder="请输入参数1"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4" :offset="1">
                    <el-form-item label="参数2">
                      <el-input v-model="temp_param_2" placeholder="请输入参数2"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </el-main>
        </el-container>
        </el-main>
        <el-divider></el-divider>
          <el-footer style="height: 40px">
            <el-row>
              <el-col :span="3" style="height: 40px; font-size: 16px; font-weight: bold">LaTex文本预览：</el-col>
              <el-col :span="6">
                <el-input id="copy_input" style="text-align: left; font-size: 12px; height: 40px" :autosize="{minRows: 1, maxRows: 2}" type="textarea" resize="none" :readonly="true" :value="temp_latex"></el-input>
              </el-col>   
              <el-col :span="7" :offset="1">
                <Mathdown :content="'效果展示：'+temp_latex" style="text-align: left; height: 40px; font-size: 16px; font-weight: bold"></Mathdown>
              </el-col>
              <el-col :span="2" :offset="1" style="text-align: left; height: 40px; font-size: 16px; font-weight: bold; padding-top: 12px;">
                <el-button size="small" @click="Copy_Input()">复制到粘贴板</el-button>
              </el-col>
              <el-col :span="2" :offset="1" style="text-align: left; height: 40px; font-size: 16px; font-weight: bold; padding-top: 12px;">
                <el-button size="small" @click="Insert_To_Content_Tail()">插入文本末尾</el-button>
              </el-col>
            </el-row>
          </el-footer>
        </el-container>
    </el-dialog>

    <!-- header -->
    <el-row style="padding-top: 15px;" v-if="simpleInput">
      <el-col :span="6">
        <div class="logo">
          <img src="../assets/title_exercise.png" alt="logo" />
        </div>
      </el-col>
      <el-col :span="14">
        <el-row type="flex" justify="center">
          <el-col :span="22">
            <el-input v-model="exercise_text" placeholder="请输入内容">
              <template slot="append">
                <span style="cursor:pointer" @click="changeInput">
                  切换多格式输入
                </span>
              </template>
            </el-input>
          </el-col>
          <el-button type="submit" value="提交" @click="submit"
            >检索
          </el-button>
        </el-row>
      </el-col>
    </el-row>
    <!-- <el-row v-if="!simpleInput" type="flex" justify="center">
      <el-col :span="3" style="margin-top: 100px;">
        <img src="../assets/title_exercise.png" alt="logo" />
      </el-col>
      <el-col
        :span="18"
        style="margin-top: 20px; margin-bottom: -20px;"
        v-if="!simpleInput"
      >
        <el-row>
          <el-tabs type="border-card" id="tabs">
            <el-tab-pane label="多格式文本">
              <el-input
                type="textarea"
                :rows="8"
                v-model="content"
                placeholder="请输入内容"
              >
              </el-input>
            </el-tab-pane>
            <el-tab-pane label="LaTex预览">
              <div style="height:180px; overflow-y:scroll;">
                <Mathdown :content="content"></Mathdown>
                <div
                  class="img-list-item"
                  v-for="(item, index) in src"
                  :key="index"
                >
                  <img :src="item" class="common" />
                  <i class="del-img" @click="forkImage(index)"></i>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
          <UploadImg
            style="position: absolute;left:250px;top:0px;"
            :src="src"
            :filelists="filelists"
            @uploadImg="imgInfo"
          ></UploadImg>
          <span
            style="cursor:pointer;position:absolute;right:5px;top:12px;font-size:12px;"
            @click="changeInput"
          >
            切换简单输入
          </span>
          <el-button
            size="small"
            style="position:absolute; right:90px; top:5px;"
          >
            检索
          </el-button>
        </el-row>
      </el-col>
    </el-row> -->
    <el-row style="padding-top: 15px;" v-if="!simpleInput" type="flex" justify="center">
      <el-col :span="2">
        <el-row style="margin-top: 40px;"><img src="../assets/title_exercise.png" alt="logo" /></el-row>
        <el-row>
          <el-popover ref="hint" placement="top" content="提供LaTex格式的数学公式元素的辅助输入功能。注：显示区使用KaTex进行解析，可能和LaTex结果显示上有差异，但LaTex格式无误。" width="300" trigger="hover"></el-popover>
          <el-button v-popover:hint @click="helper_dialog = true">快速公式助手</el-button>
        </el-row>
        <el-row><el-button @click="changeInput">切换简单输入</el-button></el-row>
        <!-- 临时先注释掉，等之后后台搞定了图片转换LaTex的方法之后，再来处理这一块 -->
        <!-- <el-row>
          <div>
            <input type="file" @change="selectFile($event)" accept=".docx" style="width: 72px; margin-left: 28px"/>
          </div>
        </el-row> -->
        <el-row><el-button>检索</el-button></el-row>
      </el-col>
      <el-col :span="18"><mavon-editor ref="mavoneditor" v-model="content" @imgAdd="New_Img_In" @imgDel="Del_Img" /></el-col>
    </el-row>
    <!-- main -->
    <el-row type="flex" justify="center" style="border-top: 10px solid #111;">
      <el-col :span="22">
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
                value="rjb_new"
                @tab-click="dataSource"
                type="card"
                style="height: 200px; margin-top: -10px; margin-left: 0px;"
                id="tabs"
              >
                <el-tab-pane label="人教版新" name="rjb_new">
                  <el-row
                    v-for="(entities, group, group_index) in entities_groups"
                    :key="group_index"
                  >
                    <el-row v-if="group_index == 0" type="flex" justify="start">
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
                        <el-tag slot="reference" id="tag">{{
                          entity.name
                        }}</el-tag>
                      </el-popover>
                    </el-row>
                  </el-row>
                </el-tab-pane>
              </el-tabs>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
/* eslint-disable */
import Mathdown from "./Mathdown.vue";
import UploadImg from "./UploadImg.vue";
export default {
  components: { Mathdown, UploadImg },
  name: "exercise",
  data() {
    return {
      exercise_text: "",
      raw_text: "",
      entities_groups: {},
      entity_type: "kp2.0",
      sour: "",
      content: "",
      simpleInput: true,
      // 老版本用到的UploadImg方法，我们这里暂时保留防止万一出问题需要还原
      src: [], // 图片数组
      filelists: [],
      // 新版本用的mavon-editor带来的自带回调函数用的json格式
      // name: 图片名
      // info: base64转换后的数据段
      image_infos: [],
      // 记录当前是否打开数学助手对话框
      helper_dialog: false,  
      // 记录当前应当显示哪一个LaTex公式的对话框的变量
      latex_now: "",
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
        "分数": {
          name: "分数",
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
      // 记录当前应当显示的LaTex公式的结果
      temp_latex: "",
      // 进化模式，单格保存所有当前变量，用算法进行分类
      temp_param_type: "",
      temp_param_1: "",
      temp_param_2: "",
      temp_param_3: "",
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
      // 保存显示运算符的符号段
    };
  },
  watch:{
    sour(val) {
      this.submit();
    },
    latex_now(newVal, oldVal){
      if(newVal != oldVal){
        this.temp_latex = "";
        this.temp_param_1 = "";
        this.temp_param_2 = "";
        this.temp_param_3 = "";
        this.latex_now = newVal;
      }
    },
    temp_param_type(newVal, oldVal){
      if(newVal != oldVal){
        this.temp_param_type = newVal;
        this.Param_Switch();
      }
    },
    temp_param_1(newVal, oldVal){
      if(newVal != oldVal){
        this.temp_param_1 = newVal;
        this.Param_Switch();
      }
    },
    temp_param_2(newVal, oldVal){
      if(newVal != oldVal){
        this.temp_param_2 = newVal;
        this.Param_Switch();
      }
    },
    temp_param_3(newVal, oldVal){
      if(newVal != oldVal){
        this.temp_param_3 = newVal;
        this.Param_Switch();
      }
    }
    // },
    // content(newVal, oldVal){
    //   if(newVal == oldVal){
    //     pass
    //   }else{
    //     console.log(this.$refs.mavoneditor.selectionStart);
    //     this.$refs.test_copy.select();
    //     document.execCommand("Copy");
    //     this.content = newVal;
    //   }
    // }
  },
  methods: {
    dataSource(tab, event) {
      this.sour = tab.name;
      //黄小青师兄12月提供数据
      if(this.sour == 'rjb_new'){
        this.entity_type = "kp2.0";
      }
      return tab.name;
    },
    changeInput() {
      this.simpleInput = !this.simpleInput;
    },
    imgInfo(e) {
      this.src = e.src;
      this.filelists = e.filelists;
      console.log(e.src);
      console.log(e.filelists);
    },
   // 删除图片并保持图片数组顺序
    forkImage(index) {
      this.src.splice(index, 1);
      for (var i = 0; i < this.filelists.length; i++) {
        if (typeof this.filelists[i] === "undefined") {
          this.filelists.splice(i, 1);
          i = i - 1;
        }
      }
      this.filelists.splice(index, 1);
      document.getElementsByTagName("input").value = "";
      console.log(this.src);
      console.log(this.filelists);
      console.log(document.getElementsByTagName("input").value);
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
      });    
    },
    New_Img_In(imgname, img){
      console.log(imgname);
      console.log(img);
      this.image_infos.push(
        {
          "name": img.name,
          "info": img.miniurl
        }
      );
      console.log(this.$refs.mavoneditor);
    },
    Del_Img(imgname){
      for(var i = 0; i < this.image_infos.length; i++){
        if(this.image_infos[i].name == imgname[1].name){
          this.image_infos.splice(i, 1)
          break;
        }
      }
      console.log(this.$refs.mavoneditor);
    },
    // 参数
    Update_Exp(){
      this.temp_latex = "$(" + this.temp_param_1 + ")^{" + this.temp_param_2 + "}$";
    },
    // 对数
    Update_Log(){
      if(this.temp_param_1 == 'e'){
        this.temp_latex = "$\\ln" + this.temp_param_2 + "$";
      }else if(this.temp_param_1 == '10'){
        this.temp_latex = "$\\lg" + this.temp_param_2 + "$";
      }else{
        this.temp_latex = "$\\log_{" + this.temp_param_1 + "}" + this.temp_param_2 + "$";
      }
    },
    // 三角函数
    Update_Triangle(){
      this.temp_latex = "$\\" + this.temp_param_type+ " " + this.temp_param_1 + "$";
    },
    // 最值
    Update_MinMax(){
      if( this.temp_param_type == 'min' && this.temp_param_1.indexOf(',') != -1 ){
        this.temp_latex = "$\\min(" + this.temp_param_1 + ")$";
      }else if( this.temp_param_type == 'max' && this.temp_param_1.indexOf(',') != -1 ){
        this.temp_latex = "$\\max(" + this.temp_param_1 + ")$";
      }else if( this.temp_param_type == 'min' && this.temp_param_1.indexOf(',') == -1 ){
        this.temp_latex = "$\\min " + this.temp_param_1 + "$";
      }else if( this.temp_param_type == 'max' && this.temp_param_1.indexOf(',') == -1 ){
        this.temp_latex = "$\\max " + this.temp_param_1 + "$";
      }else if( this.temp_param_type == 'sup' && this.temp_param_1.indexOf(',') == -1 ){
        this.temp_latex = "$\\sup " + this.temp_param_1 + "$";
      }else if( this.temp_param_type == 'inf' && this.temp_param_1.indexOf(',') == -1 ){
        this.temp_latex = "$\\inf " + this.temp_param_1 + "$";
      }else if( this.temp_param_type == 'sup' && this.temp_param_1.indexOf(',') != -1 ){
        this.temp_latex = "上确界不支持多参数";
      }else if( this.temp_param_type == 'inf' && this.temp_param_1.indexOf(',') != -1 ){
        this.temp_latex = "下确界不支持多参数";
      }
    },
    // 极限
    Update_Limit(){
      if(this.temp_param_type != "limft"){
        if(this.temp_param_type == "lim"){
          this.temp_latex = "$\\lim " + this.temp_param_1 + "$"
        }else if(this.temp_param_type == "limsup"){
          this.temp_latex = "$\\limsup " + this.temp_param_1 + "$"
        }else if(this.temp_param_type == "liminf"){
          this.temp_latex = "$\\liminf " + this.temp_param_1 + "$"
        }else if(this.temp_param_type == "dim"){
          this.temp_latex = "$\\dim " + this.temp_param_1 + "$"
        }else if(this.temp_param_type == "deg"){
          this.temp_latex = "$\\deg " + this.temp_param_1 + "$"
        }else if(this.temp_param_type == "det"){
          this.temp_latex = "$\\det " + this.temp_param_1 + "$"
        }else if(this.temp_param_type == "ker"){
          this.temp_latex = "$\\ker " + this.temp_param_1 + "$"
        }
      }else if(this.temp_param_type == "limft"){
        if(this.temp_param_1 != "" && this.temp_param_2 != "" && this.temp_param_3 != ""){
          if(this.temp_param_1.indexOf(',') != -1){
            this.temp_param_1 = "(" + this.temp_param_1 + ")"; 
          }
          if(this.temp_param_2.indexOf(',') != -1){
            this.temp_param_2 = "(" + this.temp_param_2 + ")"; 
          }
          this.temp_latex = "$\\lim_{" + this.temp_param_1 + " \\to " + this.temp_param_2 + "} " + this.temp_param_3 + "$";
        }else{
          this.temp_latex = "请填入完整参数"
        }
      }
    },
    // 分数
    Update_Frac(){
      this.temp_latex = "$\\frac{" + this.temp_param_1 + "}{" +  this.temp_param_2 + "}$"
    },
    // 投射
    Update_Perspective(){
      if(this.temp_param_type == 'pr'){
        this.temp_latex = "$\\Pr "+ this.temp_param_1 + "$";
      }else if(this.temp_param_type == 'hom'){
        this.temp_latex = "$\\hom "+ this.temp_param_1 + "$";
      }else if(this.temp_param_type == 'len'){
        this.temp_latex = "$||"+ this.temp_param_1 + "||$";
      }else if(this.temp_param_type == 'arg'){
        this.temp_latex = "$\\arg "+ this.temp_param_1 + "$";
      }
    },
    // 微分及导数
    Update_Deri_or_Diff(){
      if(this.temp_param_type == 'dt'){
        if(this.temp_param_1.indexOf(',') != -1){
          var temp_list = this.temp_param_1.split(",");
          this.temp_latex = "$";
          for(var i = 0; i < temp_list.length; i++){
            this.temp_latex = this.temp_latex + "d" + temp_list[i] + " ";
          }
          this.temp_latex = this.temp_latex + "$";
        }else{
          this.temp_latex = "$d" + this.temp_param_1 + "$"
        }
      }else if(this.temp_param_type == 'mdt'){
        if(this.temp_param_1.indexOf(',') != -1){
          var temp_list = this.temp_param_1.split(",");
          this.temp_latex = "$";
          for(var i = 0; i < temp_list.length; i++){
            this.temp_latex = this.temp_latex + "\\mathrm{d}" + temp_list[i] + " ";
          }
          this.temp_latex = this.temp_latex + "$";
        }else{
          this.temp_latex = "$\\mathrm{d}" + this.temp_param_1 + "$"
        }
      }else if(this.temp_param_type == 'partial'){
        if(this.temp_param_1.indexOf(',') != -1){
          var temp_list = this.temp_param_1.split(",");
          this.temp_latex = "$";
          for(var i = 0; i < temp_list.length; i++){
            this.temp_latex = this.temp_latex + "\\partial " + temp_list[i] + " ";
          }
          this.temp_latex = this.temp_latex + "$";
        }else{
          this.temp_latex = "$\\partial " + this.temp_param_1 + "$"
        }
      }else if(this.temp_param_type == 'nabla'){
        if(this.temp_param_1.indexOf(',') != -1){
          var temp_list = this.temp_param_1.split(",");
          this.temp_latex = "$";
          for(var i = 0; i < temp_list.length; i++){
            this.temp_latex = this.temp_latex + "\\nabla " + temp_list[i] + " ";
          }
          this.temp_latex = this.temp_latex + "$";
        }else{
          this.temp_latex = "$\\nabla " + this.temp_param_1 + "$"
        }
      }else if(this.temp_param_type == 'par1h'){

        var temp_param2 = "";
        if(this.temp_param_1.indexOf(',') != -1){
          var temp_list = this.temp_param_1.split(",");
          for(var i = 0; i < temp_list.length; i++){
            temp_param2 = temp_param2 + "d" + temp_list[i];
          }
        }else{
          temp_param2 = "d" + this.temp_param_1
        }

        var temp_param3 = "";
        if(this.temp_param_2.indexOf(',') != -1){
          var temp_list = this.temp_param_2.split(",");
          for(var i = 0; i < temp_list.length; i++){
            temp_param3 = temp_param3 + "d" + temp_list[i];
          }
        }else{
          temp_param3 = "d" + this.temp_param_2
        }
        
        this.temp_latex = "$" + temp_param2 + "/" + temp_param3 + "$"

      }else if(this.temp_param_type == 'par2h'){

        var temp_param2 = "";
        if(this.temp_param_1.indexOf(',') != -1){
          var temp_list = this.temp_param_1.split(",");
          for(var i = 0; i < temp_list.length; i++){
            temp_param2 = temp_param2 + "\\mathrm{d}" + temp_list[i];
          }
        }else{
          temp_param2 = "\\mathrm{d}" + this.temp_param_1
        }

        var temp_param3 = "";
        if(this.temp_param_2.indexOf(',') != -1){
          var temp_list = this.temp_param_2.split(",");
          for(var i = 0; i < temp_list.length; i++){
            temp_param3 = temp_param3 + "\\mathrm{d}" + temp_list[i];
          }
        }else{
          temp_param3 = "\\mathrm{d}" + this.temp_param_2
        }
        
        this.temp_latex = "$" + temp_param2 + "/" + temp_param3 + "$"

      }else if(this.temp_param_type == 'par1v'){

        var temp_param2 = "";
        if(this.temp_param_1.indexOf(',') != -1){
          var temp_list = this.temp_param_1.split(",");
          for(var i = 0; i < temp_list.length; i++){
            temp_param2 = temp_param2 + "d" + temp_list[i];
          }
        }else{
          temp_param2 = "d" + this.temp_param_1
        }

        var temp_param3 = "";
        if(this.temp_param_2.indexOf(',') != -1){
          var temp_list = this.temp_param_2.split(",");
          for(var i = 0; i < temp_list.length; i++){
            temp_param3 = temp_param3 + "d" + temp_list[i];
          }
        }else{
          temp_param3 = "d" + this.temp_param_2
        }
        
        this.temp_latex = "$\\frac{" + temp_param2 + "}{" + temp_param3 + "}$"

      }else if(this.temp_param_type == 'par2v'){

        var temp_param2 = "";
        if(this.temp_param_1.indexOf(',') != -1){
          var temp_list = this.temp_param_1.split(",");
          for(var i = 0; i < temp_list.length; i++){
            temp_param2 = temp_param2 + "\\mathrm{d}" + temp_list[i];
          }
        }else{
          temp_param2 = "\\mathrm{d}" + this.temp_param_1
        }

        var temp_param3 = "";
        if(this.temp_param_2.indexOf(',') != -1){
          var temp_list = this.temp_param_2.split(",");
          for(var i = 0; i < temp_list.length; i++){
            temp_param3 = temp_param3 + "\\mathrm{d}" + temp_list[i];
          }
        }else{
          temp_param3 = "\\mathrm{d}" + this.temp_param_2
        }
        
        this.temp_latex = "$\\frac{" + temp_param2 + "}{" + temp_param3 + "}$"

      }else if(this.temp_param_type == 'par'){
        
        var temp_param2 = "";
        if(this.temp_param_1.indexOf(',') != -1){
          var temp_list = this.temp_param_1.split(",");
          for(var i = 0; i < temp_list.length; i++){
            temp_param2 = temp_param2 + "\\partial " + temp_list[i];
          }
        }else{
          temp_param2 = "\\partial " + this.temp_param_1
        }

        var temp_param3 = "";
        if(this.temp_param_2.indexOf(',') != -1){
          var temp_list = this.temp_param_2.split(",");
          for(var i = 0; i < temp_list.length; i++){
            temp_param3 = temp_param3 + "\\partial " + temp_list[i];
          }
        }else{
          temp_param3 = "\\partial " + this.temp_param_2
        }
        
        this.temp_latex = "$\\frac{" + temp_param2 + "}{" + temp_param3 + "}$"

      }else if(this.temp_param_type == 'prime'){

        this.temp_latex = "$\\prime$"

      }else if(this.temp_param_type == 'backprime'){

        this.temp_latex = "$\\backprime$"

      }else if(this.temp_param_type == 'deri'){
        
        if(this.temp_param_1.indexOf(',') != -1){
          this.temp_latex = "请勿输入多个元素";
        }else{
          var deri_count = parseInt(this.temp_param_2);
          this.temp_latex = "$" + this.temp_param_1;
          if(deri_count == 1){
            this.temp_latex = this.temp_latex + "^\\prime";
          }else if(deri_count == 2){
            this.temp_latex = this.temp_latex + "\'\'"
          }else if(deri_count > 2){
            this.temp_latex = this.temp_latex + "^{(" + deri_count + ")}"
          }
          this.temp_latex = this.temp_latex + "$";
        }

      }else if(this.temp_param_type == 'deridot'){

        if(this.temp_param_1.indexOf(',') != -1){
          this.temp_latex = "请勿输入多个元素";
        }else{
          var deri_count = parseInt(this.temp_param_2);
          if(deri_count == 1){
            this.temp_latex = "$\\dot " + this.temp_param_1 + "$";
          }else if(deri_count == 2){
            this.temp_latex = "$\\ddot " + this.temp_param_1 + "$";
          }else if(deri_count > 2){
            this.temp_latex = "点格式不支持二阶以上的表示";
          }
        }
      }
    },
    // 模运算及开根号
    Update_Mod_or_Sqrt(){
      if(this.temp_param_type == 'bmod'){
        this.temp_latex = "$\\bmod$"
      }else if(this.temp_param_type == 'pmod'){
        if(this.temp_param_1.indexOf(',') == -1){
          this.temp_latex = "$\\pmod{" + this.temp_param_1 + "}$";
        }else{
          this.temp_latex = "请勿输入多参数"
        }
      }else if(this.temp_param_type == 'gcd'){
        if(this.temp_param_1.indexOf(',') == -1 && this.temp_param_2.indexOf(',') == -1){
          this.temp_latex = "$\\gcd(" + this.temp_param_1 + "," + this.temp_param_2 + ")$";
        }else{
          this.temp_latex = "请勿输入多参数";
        }
      }else if(this.temp_param_type == 'lcm'){
        if(this.temp_param_1.indexOf(',') == -1 && this.temp_param_2.indexOf(',') == -1){
          this.temp_latex = "$\\operatorname{lcm}(" + this.temp_param_1 + "," + this.temp_param_2 + ")$";
        }else{
          this.temp_latex = "请勿输入多参数";
        }
      }else if(this.temp_param_type == 'sqrt'){
        if(this.temp_param_1.indexOf(',') == -1 && this.temp_param_2.indexOf(',') == -1){
          if(this.temp_param_1 == "" && this.temp_param_2 == ""){
            this.temp_latex = "$\\surd$";
          }else if(this.temp_param_1 != "" && this.temp_param_2 == ""){
            this.temp_latex = "$\\sqrt{" + this.temp_param_1 + "}$";
          }else if(this.temp_param_1 == "" && this.temp_param_2 != ""){
            this.temp_latex = "$\\sqrt[" + this.temp_param_2 + "]{}$";
          }else if(this.temp_param_1 != "" && this.temp_param_2 != ""){
            this.temp_latex = "$\\sqrt[" + this.temp_param_2 + "]{" + this.temp_param_1 + "}$";
          }
        }else{
          this.temp_latex = "请勿输入多参数";
        }
      }
    },
    // 默认页面
    Update_Default(){
      // 求和
      if(this.temp_param_type == 'sum'){
        this.temp_latex = "$\\sum_{" + this.temp_param_1 + "=" + this.temp_param_2 + "}^" + this.temp_param_3 + "$"
      }else if(this.temp_param_type == 'msum'){
        this.temp_latex = "$\\begin{matrix} \\sum_{" + this.temp_param_1 + "=" + this.temp_param_2 + "}^" + this.temp_param_3 + " \\end{matrix}$"
      }
      // 求积
      else if(this.temp_param_type == 'mul'){
        this.temp_latex = "$\\prod_{" + this.temp_param_1 + "=" + this.temp_param_2 + "}^" + this.temp_param_3 + "$"
      }else if(this.temp_param_type == 'mmul'){
        this.temp_latex = "$\\begin{matrix} \\prod_{" + this.temp_param_1 + "=" + this.temp_param_2 + "}^" + this.temp_param_3 + " \\end{matrix}$"  
      }
      // 上积
      else if(this.temp_param_type == 'cmul'){
        this.temp_latex = "$\\coprod_{" + this.temp_param_1 + "=" + this.temp_param_2 + "}^" + this.temp_param_3 + "$"
      }else if(this.temp_param_type == 'mcmul'){
        this.temp_latex = "$\\begin{matrix} \\coprod_{" + this.temp_param_1 + "=" + this.temp_param_2 + "}^" + this.temp_param_3 + " \\end{matrix}$"  
      }
      // 积分，二重积分，三重积分
      else if(this.temp_param_type == 'int'){
        this.temp_latex = "$\\int_{" + this.temp_param_2 + "}^{" + this.temp_param_1 + "}$"
      }else if(this.temp_param_type == 'iint'){
        this.temp_latex = "$\\iint_{" + this.temp_param_2 + "}^{" + this.temp_param_1 + "}$"
      }else if(this.temp_param_type == 'iiint'){
        this.temp_latex = "$\\iiint_{" + this.temp_param_2 + "}^{" + this.temp_param_1 + "}$"
      }
      // 交并集
      else if(this.temp_param_type == 'cap'){
        var temp_list = this.temp_param_1.split(',');
        if(temp_list.length < 2){
          this.temp_latex = "请正确输入多个变量名称";
          return
        }else{
          this.temp_latex = "$" + temp_list[0];
          for(var j = 1; j < temp_list.length; j++){
            this.temp_latex = this.temp_latex + " \\cap " + temp_list[j];
          }
          this.temp_latex = this.temp_latex + " $";
        }
      }else if(this.temp_param_type == 'cup'){
        var temp_list = this.temp_param_1.split(',');
        if(temp_list.length < 2){
          this.temp_latex = "请正确输入多个变量名称";
          return
        }else{
          this.temp_latex = "$" + temp_list[0];
          for(var j = 1; j < temp_list.length; j++){
            this.temp_latex = this.temp_latex + " \\cup " + temp_list[j];
          }
          this.temp_latex = this.temp_latex + " $";
        }
      }else if(this.temp_param_type == 'bcap'){
        this.temp_latex = "$\\bigcap_{" + this.temp_param_2 + "}^{" + this.temp_param_3 + "} " + this.temp_param_1 + "$"
      }else if(this.temp_param_type == 'bcup'){
        this.temp_latex = "$\\bigcup_{" + this.temp_param_2 + "}^{" + this.temp_param_3 + "} " + this.temp_param_1 + "$"
      }
      // 闭合曲线曲面积分符号
      else if(this.temp_param_type == 'oint'){
        this.temp_latex = "$\\oint$"
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
          case "指数":
            this.Update_Exp();
            break;
          case "对数":
            this.Update_Log();
            break;
          case "三角函数":
            this.Update_Triangle();
            break;
          case "最值":
            this.Update_MinMax();
            break;
          case "分数":
            this.Update_Frac();
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
    Copy_Input(){
      var Input = document.getElementById('copy_input');
      Input.select();
      document.execCommand("Copy");
      this.$message('已复制');
    },
    Insert_To_Content_Tail(){
      this.content = this.content + this.temp_latex;
      this.temp_latex = '';
      this.$message('已插入文本末尾');
    }
  }
};
</script>

<style scoped lang="scss">
.exercise {
  background: url("../assets/sub_bg.png") repeat;
  background-size: 100%;
}
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