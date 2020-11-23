<template>

  <div class="exercise">

    <el-dialog width="80%" :visible.sync="helper_dialog" @close="helper_dialog = false; latex_now = ''; temp_latex = ''">
      <el-container style="height: 450px;">
        <el-header style="height: 30px; font-size: 20px; font-weight: bold">
          快速公式助手
        </el-header>
        <el-container style="height: 400px;" direction="horizontal">
          
          <el-aside width="25%" style="margin: 5px">
            <el-select style="height: 10px;" v-model="latex_now" placeholder="请选择">
              <el-option
                v-for="(item, index) in latex"
                :key="index"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
            <el-divider></el-divider>
            <div style="padding-top: -10px;" >常见数学希腊符号表（首字母可大写）</div><br/>
            <el-table max-height="160px" :show-header="false" :data="symbols" style="font-size: 12px">
              <el-table-column
                prop="col1"
                align="center"
                width="70">
              </el-table-column>
              <el-table-column
                prop="col2"
                align="center"
                width="70">
              </el-table-column>
              <el-table-column
                prop="col3"
                align="center"
                width="70">
              </el-table-column>
              <el-table-column
                prop="col4"
                align="center"
                width="70">
              </el-table-column>
            </el-table>
            <p style="text-align: left; padding-left: 30px;padding-top: 20px ; height: 50px">复制格式：{{ temp_latex }}</p>
            <Mathdown :content="'效果展示：'+temp_latex" style="text-align: left; padding-left: 30px; padding-top: 20px; height: 30px"></Mathdown>
          </el-aside>

          <el-main width="75%" style="margin: 5px; margin-left: 15px">
            
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
                      <el-radio-group style="width: 800px; text-align: left; padding-top: 10px" v-model="latex.常用符号及格式提示.param1">
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
                <el-row :span="24" v-if="latex.常用符号及格式提示.param1 == 'sum' ||
                                        latex.常用符号及格式提示.param1 == 'msum' ||
                                        latex.常用符号及格式提示.param1 == 'mul' ||
                                        latex.常用符号及格式提示.param1 == 'mmul' ||
                                        latex.常用符号及格式提示.param1 == 'cmul' ||
                                        latex.常用符号及格式提示.param1 == 'mcmul' ||
                                        latex.常用符号及格式提示.param1 == 'bcap' ||
                                        latex.常用符号及格式提示.param1 == 'bcup' ">
                  <el-col :span="6">
                    <el-form-item label="变量">
                      <el-input v-model="latex.常用符号及格式提示.param2" placeholder="请输入变量"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6" :offset="1">
                    <el-form-item label="变量起始值">
                      <el-input v-model="latex.常用符号及格式提示.param3" placeholder="请输入变量起始值"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6" :offset="1">
                    <el-form-item label="变量目标值">
                      <el-input v-model="latex.常用符号及格式提示.param4" placeholder="请输入变量目标值"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :span="24" v-if="latex.常用符号及格式提示.param1 == 'int' ||
                                        latex.常用符号及格式提示.param1 == 'iint' ||
                                        latex.常用符号及格式提示.param1 == 'iiint'">
                  <el-col :span="6">
                    <el-form-item label="上限">
                      <el-input v-model="latex.常用符号及格式提示.param2" placeholder="请输入上限"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6" :offset="1">
                    <el-form-item label="下限">
                      <el-input v-model="latex.常用符号及格式提示.param3" placeholder="请输入下限"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :span="24" v-if="latex.常用符号及格式提示.param1 == 'cap' ||
                                        latex.常用符号及格式提示.param1 == 'cup'">
                  <el-col :span="18">
                    <el-form-item label="变量">
                      <el-input v-model="latex.常用符号及格式提示.param2" placeholder="请输入至少两个变量，并用英文逗号分隔变量"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :span="24" v-if="latex.常用符号及格式提示.param1 != ''">
                  <el-col :span="24">
                    <el-form-item>
                      <el-button @click="Update_Default()">点击刷新</el-button>
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
                      <el-input v-model="latex.指数.param1" placeholder="请输入底数"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6" :offset="1">
                    <el-form-item label="指数">
                      <el-input v-model="latex.指数.param2" placeholder="请输入指数"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-divider></el-divider>
                <el-row :span="24">
                  <el-col :span="6">
                    <el-form-item>
                      <el-button @click="Update_Exp()">点击刷新</el-button>
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
                      <el-radio-group v-model="latex.对数.param1">
                        <el-radio label="e">e</el-radio>
                        <el-radio label="10">10</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="4">
                    <el-form-item label="底数">
                      <el-input v-model="latex.对数.param1" placeholder="请输入底数"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4" :offset="1">
                    <el-form-item label="指数">
                      <el-input v-model="latex.对数.param2" placeholder="请输入指数"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-divider></el-divider>
                <el-row :span="24">
                  <el-col :span="9">
                    <el-form-item>
                      <el-button @click="Update_Log()">刷新</el-button>
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
                      <el-radio-group style="width: 800px; text-align: left; padding-top: 10px" v-model="latex.三角函数.param1">
                        <el-row :span="24" >
                          <el-col :span="4">
                            <el-radio label="\sin">正弦sin</el-radio>
                          </el-col>
                          <el-col :span="4" :offset="1">
                            <el-radio label="\cos">余弦cos</el-radio>
                          </el-col>
                          <el-col :span="4" :offset="1">
                            <el-radio label="\tan">正切tan</el-radio>
                          </el-col>
                          <el-col :span="4" :offset="1">
                            <el-radio label="\cot">余切cot</el-radio>
                          </el-col>
                          <el-col :span="4" :offset="1">
                            <el-radio label="\sec">正割sec</el-radio>
                          </el-col>                       
                        </el-row>
                        <el-row>
                          <el-col :span="4">
                            <el-radio label="\csc">余割csc</el-radio>
                          </el-col>
                          <el-col :span="4" :offset="1">
                            <el-radio label="\arcsin">反正弦arcsin</el-radio>
                          </el-col>
                          <el-col :span="4" :offset="1">
                            <el-radio label="\arccos">反余弦arccos</el-radio>
                          </el-col>
                          <el-col :span="4" :offset="1">
                            <el-radio label="\arctan">反正切arctan</el-radio>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="4">
                            <el-radio label="\sinh">双曲正弦sinh</el-radio>
                          </el-col>
                          <el-col :span="4" :offset="1">
                            <el-radio label="\cosh">双曲余弦cosh</el-radio>
                          </el-col>
                          <el-col :span="4" :offset="1">
                            <el-radio label="\tanh">双曲正切tanh</el-radio>
                          </el-col>
                          <el-col :span="4" :offset="1">
                            <el-radio label="\coth">双曲余切coth</el-radio>
                          </el-col>
                        </el-row> 
                      </el-radio-group>               
                    </el-form-item>     
                  </el-col>
                </el-row>
                <el-row :span="24">
                  <el-col :span="9">
                    <el-form-item label="参数">
                      <el-input v-model="latex.三角函数.param2" placeholder="请输入参数"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-divider></el-divider>
                <el-row :span="24">
                  <el-col :span="9">
                    <el-form-item>
                      <el-button @click="Update_Triangle()">刷新</el-button>
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
                      <el-radio-group style="width: 800px; text-align: left; padding-top: 10px" v-model="latex.最值.param1">
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
                      <el-input v-model="latex.最值.param2" placeholder="请输入参数，多个参数请用英文逗号分隔"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-divider></el-divider>
                <el-row :span="24">
                  <el-col :span="9">
                    <el-form-item>
                      <el-button @click="Update_MinMax()">点击刷新</el-button>
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
                      <el-radio-group style="width: 800px; text-align: left; padding-top: 10px" v-model="latex.极限.param1">
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
                <el-row :span="24" v-if=" latex.极限.param1 != 'limft' ">
                  <el-col :span="9">
                    <el-form-item label="公式">
                      <el-input v-model="latex.极限.param2" placeholder="请输入公式"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :span="24" v-if=" latex.极限.param1 == 'limft' ">
                  <el-col :span="6">
                    <el-form-item label="参数">
                      <el-input v-model="latex.极限.param2" placeholder="请输入参数名，多个参数名请用英文逗号分隔"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6" :offset="3">
                    <el-form-item label="目标">
                      <el-input v-model="latex.极限.param3" placeholder="请输入极限值，多个极限值请用英文逗号分隔"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6" :offset="3">
                    <el-form-item label="公式">
                      <el-input v-model="latex.极限.param4" placeholder="请输入公式"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-divider></el-divider>
                <el-row :span="24">
                  <el-col>
                    <el-form-item>
                      <el-button @click="Update_Limit()">点击刷新</el-button>
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
                      <el-input v-model="latex.分数.param1" placeholder="请输入分子部分"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11" :offset="2">
                    <el-form-item label="分母部分">
                      <el-input v-model="latex.分数.param2" placeholder="请输入分母部分"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-divider></el-divider>
                <el-row :span="24">
                  <el-col>
                    <el-form-item>
                      <el-button @click="Update_Frac()">点击刷新</el-button>
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
                      <el-radio-group style="width: 800px; text-align: left; padding-top: 10px" v-model="latex.投射.param1">
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
                      <el-input v-model="latex.投射.param2" placeholder="请输入公式"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-divider></el-divider>
                <el-row :span="24">
                  <el-col>
                    <el-form-item>
                      <el-button @click="Update_Perspective()">点击刷新</el-button>
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
                      <el-radio-group style="width: 800px; text-align: left; padding-top: 10px" v-model="latex.微分及导数.param1">
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
                <el-row :span="24" v-if=" latex.微分及导数.param1 == 'dt' ||
                                          latex.微分及导数.param1 == 'mdt' ||
                                          latex.微分及导数.param1 == 'partial' ||
                                          latex.微分及导数.param1 == 'nabla' ">
                  <el-col :span="16">
                    <el-form-item label="变量元素">
                      <el-input v-model="latex.微分及导数.param2" placeholder="请输入变量元素，多元素请用英文逗号分隔"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :span="24" v-if=" latex.微分及导数.param1 == 'par1h' ||
                                          latex.微分及导数.param1 == 'par2h' ||
                                          latex.微分及导数.param1 == 'par1v' ||
                                          latex.微分及导数.param1 == 'par2v' ||
                                          latex.微分及导数.param1 == 'par' ">
                  <el-col :span="10">
                    <el-form-item label="变量1">
                      <el-input v-model="latex.微分及导数.param2" placeholder="请输入变量1，多个变量请用英文逗号分隔"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10" :offset="1">
                    <el-form-item label="变量2">
                      <el-input v-model="latex.微分及导数.param3" placeholder="请输入变量2，多个变量请用英文逗号分隔"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :span="24" v-if=" latex.微分及导数.param1 == 'prime' ||
                                          latex.微分及导数.param1 == 'backprime' ">
                </el-row>
                <el-row :span="24" v-if=" latex.微分及导数.param1 == 'deri' ||
                                          latex.微分及导数.param1 == 'deridot' ">
                  <el-col :span="10">
                    <el-form-item label="变量元素">
                      <el-input v-model="latex.微分及导数.param2" placeholder="请输入变量元素"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10" :offset="1">
                    <el-form-item label="求导次数">
                      <el-input v-model="latex.微分及导数.param3" placeholder="请输入求导次数"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-divider></el-divider>
                <el-row :span="24">
                  <el-col>
                    <el-form-item>
                      <el-button @click="Update_Deri_or_Diff()">点击刷新</el-button>
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
                      <el-radio-group style="width: 800px; text-align: left; padding-top: 10px" v-model="latex.模运算及开根号.param1">
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

                <el-row v-if="latex.模运算及开根号.param1 == 'bmod'"></el-row>
                <el-row v-else-if="latex.模运算及开根号.param1 == 'pmod'">
                  <el-col :span="4">
                    <el-form-item label="参数">
                      <el-input v-model="latex.模运算及开根号.param2" placeholder="请输入参数"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row v-else>
                  <el-col :span="4">
                    <el-form-item label="参数1">
                      <el-input v-model="latex.模运算及开根号.param2" placeholder="请输入参数1"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4" :offset="1">
                    <el-form-item label="参数2">
                      <el-input v-model="latex.模运算及开根号.param3" placeholder="请输入参数2"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-divider></el-divider>

                <el-row :span="24">
                  <el-col :span="9">
                    <el-form-item>
                      <el-button @click="Update_Mod_or_Sqrt()">刷新</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>

          </el-main>
        </el-container>
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
          <el-button @click="helper_dialog = true">快速公式助手</el-button>           
        </el-row>
        <el-row><el-button @click="changeInput">切换简单输入</el-button></el-row>
        <el-row><el-button>检索</el-button></el-row>
      </el-col>
      <el-col :span="18"><mavon-editor v-model="content" @imgAdd="New_Img_In" @imgDel="Del_Img" /></el-col>
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
      // 记录当前应当显示的LaTex公式的结果
      temp_latex: "",
      // 记录当前应当显示哪一个LaTex公式的对话框的变量
      latex_now: "",
      // 保存所有快速生成LaTex文本参数的Json段
      latex: {
        "常用符号及格式提示":{
          name: "常用符号及格式提示",
          param1: "",
          param2: "",
          param3: "",
          param4: ""
        },
        "各类括号的使用方法": {
          name: "各类括号的使用方法"
        },
        "指数":{
          name: "指数",
          param1: "",
          param2: ""
        },
        "对数": {
          name: "对数",
          param1: "",
          param2: ""
        },
        "三角函数": {
          name: "三角函数",
          param1: "",
          param2: ""
        },
        "最值": {
          name: "最值",
          param1: "",
          param2: ""
        },
        "分数": {
          name: "分数",
          param1: "",
          param2: ""
        },
        "极限": {
          name: "极限",
          param1: "",
          param2: "",
          param3: "",
          param4: ""
        },
        "投射": {
          name: "投射",
          param1: "",
          param2: ""
        },
        "微分及导数": {
          name: "微分及导数",
          param1: "",
          param2: "",
          param3: ""
        },
        "类字母符号与常数": {
          name: "类字母符号与常数"
        },
        "模运算及开根号": {
          name: "模运算及开根号",
          param1: "",
          param2: "",
          param3: ""
        }
      },
      // 保存显示数学希腊符号的符号段
      symbols: [
        {
          'col1': "\\alpha",
          'col2': "\\beta",
          'col3': "\\gamma",
          'col4': "\\delta"
        },
        {
          'col1': "\\epsilon",
          'col2': "\\zeta",
          'col3': "\\eta",
          'col4': "\\theta"
        },{
          'col1': "\\iota ",
          'col2': "\\kappa",
          'col3': "\\lambda",
          'col4': "\\mu"
        },{
          'col1': "\\nu",
          'col2': "\\omicron",
          'col3': "\\xi",
          'col4': "\\pi"
        },{
          'col1': "\\rho",
          'col2': "\\sigma",
          'col3': "\\tau",
          'col4': "\\upsilon"
        },{
          'col1': "\\phi",
          'col2': "\\chi",
          'col3': "\\psi",
          'col4': "\\omega"
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
        this.latex_now = newVal;
      }
    }
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
      this.image_infos.push(
        {
          "name": img.name,
          "info": img.miniurl
        }
      );
      console.log(this.image_infos);
    },
    Del_Img(imgname){
      for(var i = 0; i < this.image_infos.length; i++){
        if(this.image_infos[i].name == imgname[1].name){
          this.image_infos.splice(i, 1)
          break;
        }
      }
    },
    // 参数
    Update_Exp(){
      this.temp_latex = "$" + this.latex.指数.param1 + "^{" + this.latex.指数.param2 + "}$";
    },
    // 对数
    Update_Log(){
      if(this.latex.对数.param1 == 'e'){
        this.temp_latex = "$\\ln" + this.latex.对数.param2 + "$";
      }else if(this.latex.对数.param1 == '10'){
        this.temp_latex = "$\\lg" + this.latex.对数.param2 + "$";
      }else{
        this.temp_latex = "$\\log_{" + this.latex.对数.param1 + "}" + this.latex.对数.param2 + "$";
      }
    },
    // 三角函数
    Update_Triangle(){
      this.temp_latex = "$" + this.latex.三角函数.param1 + " " + this.latex.三角函数.param2 + "$";
    },
    // 最值
    Update_MinMax(){
      if( this.latex.最值.param1 == 'min' && this.latex.最值.param2.indexOf(',') != -1 ){
        this.temp_latex = "$\\min(" + this.latex.最值.param2 + ")$";
      }else if( this.latex.最值.param1 == 'max' && this.latex.最值.param2.indexOf(',') != -1 ){
        this.temp_latex = "$\\max(" + this.latex.最值.param2 + ")$";
      }else if( this.latex.最值.param1 == 'min' && this.latex.最值.param2.indexOf(',') == -1 ){
        this.temp_latex = "$\\min " + this.latex.最值.param2 + "$";
      }else if( this.latex.最值.param1 == 'max' && this.latex.最值.param2.indexOf(',') == -1 ){
        this.temp_latex = "$\\max " + this.latex.最值.param2 + "$";
      }else if( this.latex.最值.param1 == 'sup' && this.latex.最值.param2.indexOf(',') == -1 ){
        this.temp_latex = "$\\sup " + this.latex.最值.param2 + "$";
      }else if( this.latex.最值.param1 == 'inf' && this.latex.最值.param2.indexOf(',') == -1 ){
        this.temp_latex = "$\\inf " + this.latex.最值.param2 + "$";
      }else if( this.latex.最值.param1 == 'sup' && this.latex.最值.param2.indexOf(',') != -1 ){
        this.temp_latex = "上确界不支持多参数";
      }else if( this.latex.最值.param1 == 'inf' && this.latex.最值.param2.indexOf(',') != -1 ){
        this.temp_latex = "下确界不支持多参数";
      }
    },
    // 极限
    Update_Limit(){
      if(this.latex.极限.param1 != "limft"){
        if(this.latex.极限.param1 == "lim"){
          this.temp_latex = "$\\lim " + this.latex.极限.param2 + "$"
        }else if(this.latex.极限.param1 == "limsup"){
          this.temp_latex = "$\\limsup " + this.latex.极限.param2 + "$"
        }else if(this.latex.极限.param1 == "liminf"){
          this.temp_latex = "$\\liminf " + this.latex.极限.param2 + "$"
        }else if(this.latex.极限.param1 == "dim"){
          this.temp_latex = "$\\dim " + this.latex.极限.param2 + "$"
        }else if(this.latex.极限.param1 == "deg"){
          this.temp_latex = "$\\deg " + this.latex.极限.param2 + "$"
        }else if(this.latex.极限.param1 == "det"){
          this.temp_latex = "$\\det " + this.latex.极限.param2 + "$"
        }else if(this.latex.极限.param1 == "ker"){
          this.temp_latex = "$\\ker " + this.latex.极限.param2 + "$"
        }
      }else if(this.latex.极限.param1 == "limft"){
        if(this.latex.极限.param2 != "" && this.latex.极限.param3 != "" && this.latex.极限.param4 != ""){
          if(this.latex.极限.param2.indexOf(',') != -1){
            this.latex.极限.param2 = "(" + this.latex.极限.param2 + ")"; 
          }
          if(this.latex.极限.param3.indexOf(',') != -1){
            this.latex.极限.param3 = "(" + this.latex.极限.param3 + ")"; 
          }
          this.temp_latex = "$\\lim_{" + this.latex.极限.param2 + " \\to " + this.latex.极限.param3 + "} " + this.latex.极限.param4 + "$";
        }else{
          this.temp_latex = "请填入完整参数"
        }
      }
    },
    // 分数
    Update_Frac(){
      this.temp_latex = "$\\frac{" + this.latex.分数.param1 + "}{" +  this.latex.分数.param2 + "}$"
    },
    // 投射
    Update_Perspective(){
      if(this.latex.投射.param1 == 'pr'){
        this.temp_latex = "$\\Pr "+ this.latex.投射.param2 + "$";
      }else if(this.latex.投射.param1 == 'hom'){
        this.temp_latex = "$\\hom "+ this.latex.投射.param2 + "$";
      }else if(this.latex.投射.param1 == 'len'){
        this.temp_latex = "$||"+ this.latex.投射.param2 + "||$";
      }else if(this.latex.投射.param1 == 'arg'){
        this.temp_latex = "$\\arg "+ this.latex.投射.param2 + "$";
      }
    },
    // 微分及导数
    Update_Deri_or_Diff(){
      if(this.latex.微分及导数.param1 == 'dt'){
        if(this.latex.微分及导数.param2.indexOf(',') != -1){
          var temp_list = this.latex.微分及导数.param2.split(",");
          this.temp_latex = "$";
          for(var i = 0; i < temp_list.length; i++){
            this.temp_latex = this.temp_latex + "d" + temp_list[i] + " ";
          }
          this.temp_latex = this.temp_latex + "$";
        }else{
          this.temp_latex = "$d" + this.latex.微分及导数.param2 + "$"
        }
      }else if(this.latex.微分及导数.param1 == 'mdt'){
        if(this.latex.微分及导数.param2.indexOf(',') != -1){
          var temp_list = this.latex.微分及导数.param2.split(",");
          this.temp_latex = "$";
          for(var i = 0; i < temp_list.length; i++){
            this.temp_latex = this.temp_latex + "\\mathrm{d}" + temp_list[i] + " ";
          }
          this.temp_latex = this.temp_latex + "$";
        }else{
          this.temp_latex = "$\\mathrm{d}" + this.latex.微分及导数.param2 + "$"
        }
      }else if(this.latex.微分及导数.param1 == 'partial'){
        if(this.latex.微分及导数.param2.indexOf(',') != -1){
          var temp_list = this.latex.微分及导数.param2.split(",");
          this.temp_latex = "$";
          for(var i = 0; i < temp_list.length; i++){
            this.temp_latex = this.temp_latex + "\\partial " + temp_list[i] + " ";
          }
          this.temp_latex = this.temp_latex + "$";
        }else{
          this.temp_latex = "$\\partial " + this.latex.微分及导数.param2 + "$"
        }
      }else if(this.latex.微分及导数.param1 == 'nabla'){
        if(this.latex.微分及导数.param2.indexOf(',') != -1){
          var temp_list = this.latex.微分及导数.param2.split(",");
          this.temp_latex = "$";
          for(var i = 0; i < temp_list.length; i++){
            this.temp_latex = this.temp_latex + "\\nabla " + temp_list[i] + " ";
          }
          this.temp_latex = this.temp_latex + "$";
        }else{
          this.temp_latex = "$\\nabla " + this.latex.微分及导数.param2 + "$"
        }
      }else if(this.latex.微分及导数.param1 == 'par1h'){

        var temp_param2 = "";
        if(this.latex.微分及导数.param2.indexOf(',') != -1){
          var temp_list = this.latex.微分及导数.param2.split(",");
          for(var i = 0; i < temp_list.length; i++){
            temp_param2 = temp_param2 + "d" + temp_list[i];
          }
        }else{
          temp_param2 = "d" + this.latex.微分及导数.param2
        }

        var temp_param3 = "";
        if(this.latex.微分及导数.param3.indexOf(',') != -1){
          var temp_list = this.latex.微分及导数.param3.split(",");
          for(var i = 0; i < temp_list.length; i++){
            temp_param3 = temp_param3 + "d" + temp_list[i];
          }
        }else{
          temp_param3 = "d" + this.latex.微分及导数.param3
        }
        
        this.temp_latex = "$" + temp_param2 + "/" + temp_param3 + "$"

      }else if(this.latex.微分及导数.param1 == 'par2h'){

        var temp_param2 = "";
        if(this.latex.微分及导数.param2.indexOf(',') != -1){
          var temp_list = this.latex.微分及导数.param2.split(",");
          for(var i = 0; i < temp_list.length; i++){
            temp_param2 = temp_param2 + "\\mathrm{d}" + temp_list[i];
          }
        }else{
          temp_param2 = "\\mathrm{d}" + this.latex.微分及导数.param2
        }

        var temp_param3 = "";
        if(this.latex.微分及导数.param3.indexOf(',') != -1){
          var temp_list = this.latex.微分及导数.param3.split(",");
          for(var i = 0; i < temp_list.length; i++){
            temp_param3 = temp_param3 + "\\mathrm{d}" + temp_list[i];
          }
        }else{
          temp_param3 = "\\mathrm{d}" + this.latex.微分及导数.param3
        }
        
        this.temp_latex = "$" + temp_param2 + "/" + temp_param3 + "$"

      }else if(this.latex.微分及导数.param1 == 'par1v'){

        var temp_param2 = "";
        if(this.latex.微分及导数.param2.indexOf(',') != -1){
          var temp_list = this.latex.微分及导数.param2.split(",");
          for(var i = 0; i < temp_list.length; i++){
            temp_param2 = temp_param2 + "d" + temp_list[i];
          }
        }else{
          temp_param2 = "d" + this.latex.微分及导数.param2
        }

        var temp_param3 = "";
        if(this.latex.微分及导数.param3.indexOf(',') != -1){
          var temp_list = this.latex.微分及导数.param3.split(",");
          for(var i = 0; i < temp_list.length; i++){
            temp_param3 = temp_param3 + "d" + temp_list[i];
          }
        }else{
          temp_param3 = "d" + this.latex.微分及导数.param3
        }
        
        this.temp_latex = "$\\frac{" + temp_param2 + "}{" + temp_param3 + "}$"

      }else if(this.latex.微分及导数.param1 == 'par2v'){

        var temp_param2 = "";
        if(this.latex.微分及导数.param2.indexOf(',') != -1){
          var temp_list = this.latex.微分及导数.param2.split(",");
          for(var i = 0; i < temp_list.length; i++){
            temp_param2 = temp_param2 + "\\mathrm{d}" + temp_list[i];
          }
        }else{
          temp_param2 = "\\mathrm{d}" + this.latex.微分及导数.param2
        }

        var temp_param3 = "";
        if(this.latex.微分及导数.param3.indexOf(',') != -1){
          var temp_list = this.latex.微分及导数.param3.split(",");
          for(var i = 0; i < temp_list.length; i++){
            temp_param3 = temp_param3 + "\\mathrm{d}" + temp_list[i];
          }
        }else{
          temp_param3 = "\\mathrm{d}" + this.latex.微分及导数.param3
        }
        
        this.temp_latex = "$\\frac{" + temp_param2 + "}{" + temp_param3 + "}$"

      }else if(this.latex.微分及导数.param1 == 'par'){
        
        var temp_param2 = "";
        if(this.latex.微分及导数.param2.indexOf(',') != -1){
          var temp_list = this.latex.微分及导数.param2.split(",");
          for(var i = 0; i < temp_list.length; i++){
            temp_param2 = temp_param2 + "\\partial " + temp_list[i];
          }
        }else{
          temp_param2 = "\\partial " + this.latex.微分及导数.param2
        }

        var temp_param3 = "";
        if(this.latex.微分及导数.param3.indexOf(',') != -1){
          var temp_list = this.latex.微分及导数.param3.split(",");
          for(var i = 0; i < temp_list.length; i++){
            temp_param3 = temp_param3 + "\\partial " + temp_list[i];
          }
        }else{
          temp_param3 = "\\partial " + this.latex.微分及导数.param3
        }
        
        this.temp_latex = "$\\frac{" + temp_param2 + "}{" + temp_param3 + "}$"

      }else if(this.latex.微分及导数.param1 == 'prime'){

        this.temp_latex = "$\\prime$"

      }else if(this.latex.微分及导数.param1 == 'backprime'){

        this.temp_latex = "$\\backprime$"

      }else if(this.latex.微分及导数.param1 == 'deri'){
        
        if(this.latex.微分及导数.param2.indexOf(',') != -1){
          this.temp_latex = "请勿输入多个元素";
        }else{
          var deri_count = parseInt(this.latex.微分及导数.param3);
          this.temp_latex = "$" + this.latex.微分及导数.param2;
          if(deri_count == 1){
            this.temp_latex = this.temp_latex + "^\\prime";
          }else if(deri_count == 2){
            this.temp_latex = this.temp_latex + "\'\'"
          }else if(deri_count > 2){
            this.temp_latex = this.temp_latex + "^{(" + deri_count + ")}"
          }
          this.temp_latex = this.temp_latex + "$";
        }

      }else if(this.latex.微分及导数.param1 == 'deridot'){

        if(this.latex.微分及导数.param2.indexOf(',') != -1){
          this.temp_latex = "请勿输入多个元素";
        }else{
          var deri_count = parseInt(this.latex.微分及导数.param3);
          if(deri_count == 1){
            this.temp_latex = "$\\dot " + this.latex.微分及导数.param2 + "$";
          }else if(deri_count == 2){
            this.temp_latex = "$\\ddot " + this.latex.微分及导数.param2 + "$";
          }else if(deri_count > 2){
            this.temp_latex = "点格式不支持二阶以上的表示";
          }
        }
      }
    },
    // 模运算及开根号
    Update_Mod_or_Sqrt(){
      if(this.latex.模运算及开根号.param1 == 'bmod'){
        this.temp_latex = "$\\bmod$"
      }else if(this.latex.模运算及开根号.param1 == 'pmod'){
        if(this.latex.模运算及开根号.param2.indexOf(',') == -1){
          this.temp_latex = "$\\pmod{" + this.latex.模运算及开根号.param2 + "}$";
        }else{
          this.temp_latex = "请勿输入多参数"
        }
      }else if(this.latex.模运算及开根号.param1 == 'gcd'){
        if(this.latex.模运算及开根号.param2.indexOf(',') == -1 && this.latex.模运算及开根号.param3.indexOf(',') == -1){
          this.temp_latex = "$\\gcd(" + this.latex.模运算及开根号.param2 + "," + this.latex.模运算及开根号.param3 + ")$";
        }else{
          this.temp_latex = "请勿输入多参数";
        }
      }else if(this.latex.模运算及开根号.param1 == 'lcm'){
        if(this.latex.模运算及开根号.param2.indexOf(',') == -1 && this.latex.模运算及开根号.param3.indexOf(',') == -1){
          this.temp_latex = "$\\operatorname{lcm}(" + this.latex.模运算及开根号.param2 + "," + this.latex.模运算及开根号.param3 + ")$";
        }else{
          this.temp_latex = "请勿输入多参数";
        }
      }else if(this.latex.模运算及开根号.param1 == 'sqrt'){
        if(this.latex.模运算及开根号.param2.indexOf(',') == -1 && this.latex.模运算及开根号.param3.indexOf(',') == -1){
          if(this.latex.模运算及开根号.param2 == "" && this.latex.模运算及开根号.param3 == ""){
            this.temp_latex = "$\\surd$";
          }else if(this.latex.模运算及开根号.param2 != "" && this.latex.模运算及开根号.param3 == ""){
            this.temp_latex = "$\\sqrt{" + this.latex.模运算及开根号.param2 + "}$";
          }else if(this.latex.模运算及开根号.param2 == "" && this.latex.模运算及开根号.param3 != ""){
            this.temp_latex = "$\\sqrt[" + this.latex.模运算及开根号.param3 + "]{}$";
          }else if(this.latex.模运算及开根号.param2 != "" && this.latex.模运算及开根号.param3 != ""){
            this.temp_latex = "$\\sqrt[" + this.latex.模运算及开根号.param3 + "]{" + this.latex.模运算及开根号.param2 + "}$";
          }
        }else{
          this.temp_latex = "请勿输入多参数";
        }
      }
    },
    Update_Default(){
      // 求和
      if(this.latex.常用符号及格式提示.param1 == 'sum'){
        this.temp_latex = "$\\sum_{" + this.latex.常用符号及格式提示.param2 + "=" + this.latex.常用符号及格式提示.param3 + "}^" + this.latex.常用符号及格式提示.param4 + "$"
      }else if(this.latex.常用符号及格式提示.param1 == 'msum'){
        this.temp_latex = "$\\begin{matrix} \\sum_{" + this.latex.常用符号及格式提示.param2 + "=" + this.latex.常用符号及格式提示.param3 + "}^" + this.latex.常用符号及格式提示.param4 + " \\end{matrix}$"
      }
      // 求积
      else if(this.latex.常用符号及格式提示.param1 == 'mul'){
        this.temp_latex = "$\\prod_{" + this.latex.常用符号及格式提示.param2 + "=" + this.latex.常用符号及格式提示.param3 + "}^" + this.latex.常用符号及格式提示.param4 + "$"
      }else if(this.latex.常用符号及格式提示.param1 == 'mmul'){
        this.temp_latex = "$\\begin{matrix} \\prod_{" + this.latex.常用符号及格式提示.param2 + "=" + this.latex.常用符号及格式提示.param3 + "}^" + this.latex.常用符号及格式提示.param4 + " \\end{matrix}$"  
      }
      // 上积
      else if(this.latex.常用符号及格式提示.param1 == 'cmul'){
        this.temp_latex = "$\\coprod_{" + this.latex.常用符号及格式提示.param2 + "=" + this.latex.常用符号及格式提示.param3 + "}^" + this.latex.常用符号及格式提示.param4 + "$"
      }else if(this.latex.常用符号及格式提示.param1 == 'mcmul'){
        this.temp_latex = "$\\begin{matrix} \\coprod_{" + this.latex.常用符号及格式提示.param2 + "=" + this.latex.常用符号及格式提示.param3 + "}^" + this.latex.常用符号及格式提示.param4 + " \\end{matrix}$"  
      }
      // 积分，二重积分，三重积分
      else if(this.latex.常用符号及格式提示.param1 == 'int'){
        this.temp_latex = "$\\int_{" + this.latex.常用符号及格式提示.param2 + "}^{" + this.latex.常用符号及格式提示.param3 + "}$"
      }else if(this.latex.常用符号及格式提示.param1 == 'iint'){
        this.temp_latex = "$\\iint_{" + this.latex.常用符号及格式提示.param2 + "}^{" + this.latex.常用符号及格式提示.param3 + "}$"
      }else if(this.latex.常用符号及格式提示.param1 == 'iiint'){
        this.temp_latex = "$\\iiint_{" + this.latex.常用符号及格式提示.param2 + "}^{" + this.latex.常用符号及格式提示.param3 + "}$"
      }
      // 交并集
      else if(this.latex.常用符号及格式提示.param1 == 'cap'){
        var temp_list = this.latex.常用符号及格式提示.param2.split(',');
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
      }else if(this.latex.常用符号及格式提示.param1 == 'cup'){
        var temp_list = this.latex.常用符号及格式提示.param2.split(',');
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
      }else if(this.latex.常用符号及格式提示.param1 == 'bcap'){
        this.temp_latex = "$\\bigcap_{" + this.latex.常用符号及格式提示.param3 + "}^{" + this.latex.常用符号及格式提示.param4 + "} " + this.latex.常用符号及格式提示.param2 + "$"
      }else if(this.latex.常用符号及格式提示.param1 == 'bcup'){
        this.temp_latex = "$\\bigcup_{" + this.latex.常用符号及格式提示.param3 + "}^{" + this.latex.常用符号及格式提示.param4 + "} " + this.latex.常用符号及格式提示.param2 + "$"
      }
      // 闭合曲线曲面积分符号
      else if(this.latex.常用符号及格式提示.param1 == 'oint'){
        this.temp_latex = "$\\oint$"
      }
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