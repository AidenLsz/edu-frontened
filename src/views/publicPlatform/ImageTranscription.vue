<template>
	<div style="margin-top: 5vh;">

		<el-row justify="start" type="flex">
			<el-col style="padding-left: 25px">
				<el-breadcrumb separator-class="el-icon-arrow-right">
					<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
					<el-breadcrumb-item>AI实验室</el-breadcrumb-item>
					<el-breadcrumb-item>图片转写</el-breadcrumb-item>
				</el-breadcrumb>
			</el-col>
		</el-row>

		<!-- <el-row style="margin: 30px 0px 10px 0px">
			<label style="font-size: 30px">图片转写</label>
		</el-row>

		<el-row style="margin: 50px 200px 10px 200px">
			<p style="font-size: 18px;">
				图片转写功能旨在辅助用户从图片格式的教育资源中快速提取格式化富文本内容。仅需上传一张图片，人工智能算法便可自动识别图片中的文字、公式与图例，并将其中的公式转化为统一标准的排版语言（如latex）。
			</p>
		</el-row> -->

		<div id="main">
			<div id="image">
				<!-- <i v-if="loading" class="el-icon-loading"></i> -->
				<img v-if="error" class="error" />
				<img v-else class="self_adaption" :src="image" alt="图片显示错误" />
				<div id="shadow">
					<div class="dialog">
						<el-input class="input_text" type="text" size="large" placeholder="请输入url" v-model="url_input"
							clearable>
						</el-input>
					</div>
					<el-button type="primary" class="but" style="left:330px;" @click="url_update()">
						url上传
					</el-button>
					<span style="position:absolute; color: #FFFFFF; font-size: 20px; top:25px; left: 450px;">或</span>
					<el-button type="primary" class="but" style="left:500px;" @click="Open_Pic_Search()">
						本地上传
						<i class="el-icon-upload el-icon--right"></i>
					</el-button>
					<el-button type="primary" class="but" style="left:700px;" @click="identify()">
						识别
					</el-button>
				</div>
			</div>

			<div id="option">
				<div v-for="(img,index) in optional_image" :key="img" class="optional_img"
					:style="{'left' : index*200+20+'px'}">
					<img :src="img" :alt="'image' + index" class="self_adaption" @click="ChooseDefaultImage(img)">
				</div>
			</div>

			<div id="result">
				<div style="font-size: 30px; font-weight: bold; float:left; margin:20px 0px 20px 20px;">
					识别结果
				</div>
				<el-table :data="tableData" border style="width: 100%" empty-text="加载中...">
					<!-- <ComplexInput @Update_CI="UCI" @Update_Image="UCII" :Get_Out_Content="tableData[num].content"></ComplexInput> -->
					<el-table-column prop="num" label="序号" width="60">
					</el-table-column>
					<el-table-column prop="content" label="内容">
					</el-table-column>
				</el-table>
			</div>
		</div>

		<el-dialog :visible.sync="picSearchDialogShow" title="图片检索" width="80%" :modal-append-to-body="false"
			:close-on-click-modal="false" @close="Reset_Interval()">
			<el-row type="flex" justify="start" style="margin-left: 2.4vw;">
				<label style="margin-right: 3vw; margin-top: -0.3vh;">图片检索模式：</label>
			</el-row>
			<el-row style="margin: 0px; padding: 0px">
				<el-col :span="24">
					<el-row v-if="option.img != ''" type="flex" justify="center">
						<VueCropper style="width: 100%; height: 400px; margin-left: 2.4vw; margin-right: 2.4vw"
							ref="cropper" :img="option.img" :autoCrop="option.autoCrop" :canMove="option.canMove"
							:centerBox="option.centerBox" :canScale="option.canScale" autoCropWidth="4096"
							autoCropHeight="2048"></VueCropper>
					</el-row>
					<el-row v-else id="DragItem" type="flex" justify="center">
						<div class="btn_file" style="min-height: 400px">
							<div style="display: inline-block">
								<i class="el-icon-plus" style="margin: 125px auto 20px auto; font-size: 60px"></i>
								<p style="font-size: 20px">点击区域或拖拽图片入内以上传</p>
								<p style="font-size: 20px">图片大小请不要超过1M</p>
							</div>
							<input id="loaded_image" class="inputSp" type="file" @change="pictureSearch($event)"
								accept=".jpeg, .png, .jpg" ref="picSearchInput" />
						</div>
					</el-row>
					<el-row type="flex" justify="start" style="margin-top: 30px;">
						<el-col :span="4" :offset="4">
							<el-row type="flex" justify="center">
								<el-button type="primary" icon="el-icon-refresh-left" @click="rotateLeft()" plain>
									向左旋转
								</el-button>
							</el-row>
						</el-col>
						<el-col :span="4">
							<el-row type="flex" justify="center">
								<el-button type="primary" icon="el-icon-refresh-right" @click="rotateRight()" plain>
									向右旋转
								</el-button>
							</el-row>
						</el-col>
						<el-col :span="4">
							<el-row type="flex" justify="center">
								<el-button type="warning" icon="el-icon-delete" @click="clearData()" plain>
									清空内容
								</el-button>
							</el-row>
						</el-col>
						<el-col :span="4">
							<el-row type="flex" justify="center">
								<el-button v-if="option.img != ''" type="success" @click="ConfirmImg()" plain>
									确定
								</el-button>
								<el-button v-else type="danger" icon="el-icon-close" @click="Reset_Interval()" plain>
									关闭页面
								</el-button>
							</el-row>
						</el-col>
					</el-row>
				</el-col>
			</el-row>
		</el-dialog>

		<!-- 测试dialogue组件 -->
		<!-- <div>
			<Dialogue :optional_image="optional_image"></Dialogue>
		</div> -->

		<!-- 侧边对话框 -->
		<!-- <el-row class="panel-body"> -->
		<div class="tab panel-btn" id="openBtn" @click="openPanel()">
			<div>使用说明</div>
			<div class="arrow"></div>
		</div>
		<el-card class="box-card left">
			<div class="panel-btn" id="closeBtn" @click="closePanel()">
				<i class="el-icon-d-arrow-left"></i>
			</div>
			<div class="container">
				<div class="intro">
					<el-row type="flex" justify="start" class="title">
						介绍
					</el-row>
					<el-row type="flex" justify="start" class="content">
						<el-col>
							图片转写模块综合了当下最为流行的OCR技术和机器翻译技术。当输入一张图片时，模块首先通过布局分析分割试题中的图片、表格、公式以及文字部分，然后利用OCR识别模型将图片区域转换为文本形式的题目，从而轻松录入题目。
						</el-col>
					</el-row>
				</div>
				<!-- <el-divider></el-divider> -->
				<div class="intro">
					<el-row type="flex" justify="start" class="title">
						API说明
					</el-row>
					<el-row type="flex" justify="start" class="content">
						<el-col>
							<ul>
								<li>
									<p>首先将试题图片转化为base64的格式，发送到识别API。在模型识别完成后，从返回的数据中提取出图片转写后的试题文本。</p>
								</li>
								<li>
									<p>API URL: https://formula-recognition-service-157-production.env.bdaa.pro/v1
									</p>
								</li>
								<li>
									<p>接口类型：POST</p>
								</li>
								<li>
									<p>参数说明：</p>
									<p><strong>接收参数</strong></p>
									<el-table :data="ReceivedPara" border style="width: 100%">
										<!-- <ComplexInput @Update_CI="UCI" @Update_Image="UCII" :Get_Out_Content="tableData[num].content"></ComplexInput> -->
										<el-table-column prop="field" label="字段">
										</el-table-column>
										<el-table-column prop="type" label="类型">
										</el-table-column>
										<el-table-column prop="necessary" label="是否必填">
										</el-table-column>
										<el-table-column prop="desc" label="描述">
										</el-table-column>
									</el-table>
									<p><strong>返回参数</strong></p>
									<el-table :data="ReturnedPara" border style="width: 100%">
										<!-- <ComplexInput @Update_CI="UCI" @Update_Image="UCII" :Get_Out_Content="tableData[num].content"></ComplexInput> -->
										<el-table-column prop="field" label="字段">
										</el-table-column>
										<el-table-column prop="type" label="类型">
										</el-table-column>
										<el-table-column prop="desc" label="描述">
										</el-table-column>
									</el-table>
								</li>
							</ul>
						</el-col>
					</el-row>
				</div>
				<!-- <el-divider></el-divider> -->
				<div class="intro">
					<el-row type="flex" justify="start" class="title">
						使用示例
					</el-row>
					<el-row type="flex" justify="start" class="content">
						<el-col>
							<p><strong>发送请求</strong></p>
							<pre><code>import json
import requests
import base64
import os

baseDir = os.path.dirname(os.path.abspath(__file__)) + '/'

if __name__ == "__main__":
    url = "https://formula-recognition-service-157-production.env.bdaa.pro/v1"

    image_paths = ['./img_1.png', './img_2.png', './img_3.png']
    images = []
    for image_path in image_paths:
        with open(os.path.join(baseDir, image_path), 'rb') as f:
            image = base64.b64encode(f.read()).decode()
            images.append(image)

    data = []
    for idx, image in enumerate(images):
        query = {
            'qid': idx,
            'image': image
        }
        data.append(query)

    resp = requests.post(url, data=json.dumps(data))

    assert resp.status_code == 200, resp.text
    try:
        print(json.loads(resp.content))
    except Exception:
        print(resp.text)</code></pre>
							<p><strong>返回值</strong></p>
							<pre><code>[{
    'code': 200, 
    'msg': '', 
    'data': {'qid': '0', 
             'success': 1, 
             'is_formula': 1, 
             'detect_formula': 1, 
             'latex': '| f ( x ) - g ( x ) | \\leq k ( k &gt; 0 )'}
}, 
{'code': 200, 
 'msg': '', 
 'data': {'qid': '1', 
          'success': 1, 
          'is_formula': 1, 
          'detect_formula': 1, 
          'latex': 'f ( x ) = ( \\frac { 1 } { 3 } ) ^ { x } - \\sqrt { x }'}
},
{'code': 200, 
 'msg': 'This image is not formula!', 
 'data': {'qid': '2', 
          'success': 1, 
          'is_formula': 0, 
          'detect_formula': 0, 
          'latex': ''}
}]</code></pre>
						</el-col>
					</el-row>
				</div>
			</div>
		</el-card>
		<!-- </el-row> -->
	</div>
</template>

<script>
	// import Mathdown from "@/common/components/Mathdown.vue";
	require("mathjax/es5/tex-svg");
	import $ from 'jquery'
	import {
		commonAjax
	} from '@/common/utils/ajax'
	//import Dialogue from "./components/Dialogue.vue"

	export default {
		components: {
			//Dialogue
			//ComplexInput
		},
		name: "ImageTranscription",
		mounted() {
			this.ToTop();
			this.openPanel();
		},
		data() {
			return {
				image: require("@/assets/default_image/0.png"),
				url_input: "",
				picSearchDialogShow: false,
				option: {
					img: "", // 裁剪图片的地址
					autoCrop: true, //是否默认生成截图框
					fixedBox: true, //固定截图框大小 不允许改变
					canMove: false,
					centerBox: true,
					canScale: false
				},
				//图片是否需要转base64
				need_trans: 1,
				optional_image: [
					require("@/assets/default_image/0.png"),
					require("@/assets/default_image/1.png"),
					require("@/assets/default_image/2.png"),
					require("@/assets/default_image/3.png")
				],
				tableData: [{
					num: "1",
					content: "关 于 函 数 f ( x ) = 4 \\sin \\left ( 2 x + \\frac { \\pi } { 3 } \\right ) ( x \\in R ) ， 有 下 列 命 题 ："
				}, {
					num: "2",
					content: "① y = f ( x ) 的 表 达 式 可 改 写 为 y = 4 \\cos \\left ( 2 x - \\frac { \\pi } { 6 } \\right ) ；",
				}, {
					num: "3",
					content: "② y = f ( x ) 是 以 2 π 为 最 小 正 周 期 的 周 期 函 数 ；,"
				}, {
					num: "4",
					content: "2 y = f ( x ) 的 图 象 关 于 点 \\left ( - \\frac { \\pi } { 6 } , 0 \\right ) 对 称 ；"
				}, {
					num: "5",
					content: "④ y = f ( x ) 的 图 象 关 于 直 线 x = - \\frac { \\pi } { 6 } 对 称 。"
				}, {
					num: "6",
					content: "其 中 正 确 的 命 题 的 序 号 是 _ _ _ _ _ _ _ _ _ _ _ _ 。 （ 注 ： 把 你 认 为 正 确 的 命 题 的 序 号 都 填 上 上"
				}],
				ReceivedPara: [{
					field: "image",
					type: "str(base64 encode)",
					necessary: "是",
					desc: "待识别的图片，需要用base64编码"
				}, {
					field: "qid",
					type: "int/str",
					necessary: "否",
					desc: "查询id"
				}],
				ReturnedPara: [{
					field: "qid",
					type: "str",
					desc: "查询id，若发送参数不包含则返回空字符串"
				}, {
					field: "success",
					type: "int",
					desc: "1代表识别成功，0代表识别失败"
				}, {
					field: "is_formula",
					type: "int",
					desc: "1代表该图片是公式，0代表该图片不是公式，不进行识别"
				}, {
					field: "detect_formula",
					type: "int",
					desc: "1代表检测到公式，0代表未检测到公式，不进行识别。该参数仅在is_formula为1的时候有意义"
				}, {
					field: "latex",
					type: "str",
					desc: "识别出的公式转换成latex格式，若未识别出来则返回空字符串\"\"。该参数仅在上面三个参数都为1时才有意义"
				}],
				// loading: false,
				error: false,
				qid: 0,
				size: 0,
				type: "",
				base64_code: "",
			}
		},
		methods: {
			ToTop() {
				window.scrollTo(0, 0);
			},
			// 清空计时器
			Reset_Interval() {
				clearInterval(this.Paste_Catcher)
				this.picSearchDialogShow = false
				window.removeEventListener('paste', this.Paste_Function)
			},
			// 打开图片搜索栏
			Open_Pic_Search() {
				this.Init_Img_Paster();
				this.Paste_Catcher = setInterval(() => {
					if (sessionStorage.getItem("PicPaste")) {
						this.option.img = sessionStorage.getItem("PicPaste")
					}
				}, 20);
				this.picSearchDialogShow = true;
				console.log("success\n");
			},
			// 尝试利用截图工具的粘贴板
			Init_Img_Paster() {
				window.addEventListener('paste', this.Paste_Function)
			},
			Paste_Function(e) {
				let Pic = e.clipboardData.items[0].getAsFile();
				// 保存读取内容用的临时变量
				var Picresult = "";
				// Promise方法避免异步操作
				var promise = new Promise(function(resolve) {
					// 用文件读取来读取图片的base64格式代码
					var reader = new FileReader();
					reader.readAsDataURL(Pic);
					reader.onloadend = function(e) {
						Picresult = e.target.result;
						resolve('1');
					};
				});
				promise.then(function() {
					// 用捕捉到的this对象来进行搜索
					sessionStorage.setItem("PicPaste", Picresult)
				}).catch(function(err) {
					// 报错了就打印错误
					console.log(err);
					alert("您最新的粘贴对象不是图片内容。")
				})
			},
			// 左旋转
			rotateLeft() {
				this.$refs.cropper.rotateLeft();
			},
			// 右旋转
			rotateRight() {
				this.$refs.cropper.rotateRight();
			},
			// 生成blob图片
			getCropData() {
				this.$refs.cropper.getCropData((data) => {
					this.submit(1, data);
					this.picSearchDialogShow = false;
				})
			},
			// 照片上传
			pictureSearch(event) {
				if (event.target.files) {
					// 获取图片
					let Pic = event.target.files[0];
					// 保存读取内容用的临时变量
					var Picresult = "";
					// 获取this对象
					const _this = this;
					// 重置input组件
					this.$refs.picSearchInput.value = "";
					// Promise方法避免异步操作
					var promise = new Promise(function(resolve) {
						// 用文件读取来读取图片的base64格式代码
						var reader = new FileReader();
						reader.readAsDataURL(Pic);
						reader.onloadend = function(e) {
							Picresult = e.target.result;
							resolve('1');
						};
					});
					promise.then(function() {
						// 用捕捉到的this对象来进行搜索
						_this.option.img = Picresult;
					}).catch(function(error) {
						// 报错了就打印错误
						console.log(error)
					})
				} else {
					return
				}
			},

			clearData() {
				sessionStorage.setItem("PicPaste", "");
				this.option.img = "";
			},

			ConfirmImg() {
				this.error = false;
				this.image = this.option.img;
				this.need_trans = 0;
				this.Reset_Interval();
			},

			url_update() {
				// this.image = this.url_input;
				this.error = false;
				this.image = require("@/assets/loading.gif");
				var newImg = new Image();
				newImg.src = this.url_input;
				newImg.onload = () => { // 图片加载成功后把地址给原来的img
					this.image = newImg.src;
				};
				newImg.onerror = () => {
					console.log("error\n");
					this.error = true;
				}
				this.need_trans = 1;
			},

			ChooseDefaultImage(default_image) {
				this.error = false;
				this.image = default_image;
				this.need_trans = 1;
			},

			getBase64(url) {
				return new Promise((resolve) => {
					var Img = new Image()
					var dataURL = '';
					//Img.setAttribute('crossOrigin', 'Anonymous')
					Img.src = url + '?v=' + Math.random();
					Img.onload = function() {
						// 要先确保图片完整获取到，这是个异步事件
						var canvas = document.createElement('canvas') // 创建canvas元素
						var width = Img.width; // 确保canvas的尺寸和图片一样
						var height = Img.height;
						canvas.width = width;
						canvas.height = height;
						canvas.getContext('2d').drawImage(Img, 0, 0, width, height);
						// canvas.toBlob(res1 => {
						// 	console.log("size=" + res1.size); //图片真实存储大小      
						// 	console.log("type=" + res1.type);
						// 	this.size = res1.size;
						// 	this.type = res1.type;
						// }, this.type, 1);
						var ext = Img.src.substring(Img.src.lastIndexOf(".") + 1).toLowerCase();
						dataURL = canvas.toDataURL('image/' + ext); // 转换图片为dataURL
						//this.base64_code = dataURL;
						//console.log("size=" + this.size);
						resolve(dataURL);
					}
				})
			},

			async identify() {
				//let reader = new FileReader();
				this.tableData = [];
				let result, data;
				let res = '!!!';
				console.log('执行');
				console.log(this.image + '!!!');

				if (this.need_trans == 1) { //要转
					try {
						res = await this.getBase64(this.image);
					} catch (err) {
						console.log(err);
					}
					this.base64_code = res; // 将结果赋值给需要用的变量属性
					// console.log(this.base64_code); // 获取到结果
				} else
					this.base64_code = this.image;

				console.log(this.base64_code.length);
				if (this.base64_code.length / 1024 > 1024) {
					alert("抱歉，您上传的图片过大，请重新上传");
					return;
				}

				try {
					data = await commonAjax(
						"https://formula-recognition-service-157-production.env.bdaa.pro/v1", {
							image: this.base64_code,
							qid: this.qid
						});
				} catch (err) {
					console.log(err);
				}

				// commonAjax(
				// 	"https://formula-recognition-service-157-production.env.bdaa.pro/v1", {
				// 		image: this.base64_code,
				// 		qid: this.qid
				// 	}).then(data=>{
				// 		// console.log("then qid:  "+data)
				// 		console.log(111,JSON.parse(JSON.stringify(data)))
				// 	})

				console.log(data);
				result = data.data;
				this.qid++;
				console.log(result.qid);
				if (result.success && result.is_formula && result.detect_formula) {
					console.log("success!");
					for (let i = 0; i < result.latex.length; i++) {
						// console.log(i,result.latex[i])
						this.tableData.push({
							content: result.latex[i],
							num: i + 1
						});
					}
				} else {
					this.tableData.length = 0;
				}
				//console.log(this.tableData[0].content);
			},

			openPanel() {
				$('.box-card.left').animate({
					left: '0%',
					opacity: 1
				}, 'easeInOutExpo')
				$('#openBtn').hide()
				$('#closeBtn').show()
			},

			closePanel() {
				$('.box-card.left').animate({
					left: '-50%',
					opacity: 0,
				}, 'easeInOutExpo')
				$('#openBtn').show()
				$('#closeBtn').hide()
			},
		}
	}
</script>

<style lang="scss" scoped>
	#main {
		position: relative;
		margin: auto;
		width: 1200px;
		height: 650px;
		margin-top: 100px;
		margin-bottom: 100px;
	}

	#image {
		position: absolute;
		background-color: #EEF5FE;
		top: 0px;
		left: 0px;
		width: 800px;
		height: 500px;
	}

	#option {
		position: absolute;
		top: 500px;
		left: 0px;
		width: 800px;
		height: 150px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
		border-radius: 4px;
	}

	#result {
		position: absolute;
		top: 0px;
		left: 800px;
		width: 400px;
		height: 650px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
		border-radius: 4px;
	}

	#shadow {
		position: absolute;
		display: block;
		background-color: rgba($color: #535353, $alpha: 0.5);
		//opacity: 0.5;
		bottom: 0px;
		width: 800px;
		height: 80px;
	}

	.dialog {
		position: absolute;
		display: block;
		bottom: 30px;
		left: 15px;
		width: 300px;
		height: 30px;
	}

	.but {
		position: absolute;
		display: block;
		bottom: 20px;
	}

	.inputSp {
		position: absolute;
		top: 0;
		right: 0;
		height: 400px;
		width: 100%;
		overflow: hidden;
		cursor: pointer;
		opacity: 0;
	}

	.optional_img {
		position: absolute;
		top: 30px;
		width: 160px;
		height: 90px;
	}

	.self_adaption {
		position: absolute;
		width: auto;
		height: auto;
		max-width: 100%;
		max-height: 100%;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		margin: auto;
	}

	.optional_img img {
		opacity: 0.4;
		transition: width 1s, height 1s, opacity 1s;
		-webkit-transition: width 1s, height 1s, opacity 1s;
	}

	.optional_img img:hover {
		opacity: 1.0;
		cursor: pointer;
		max-width: 110%;
		max-height: 110%;
	}

	#image img.error::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		width: 100%;
		background-color: #FFFFFF;
		background-image: url("../../assets/failure.png");
		background-repeat: no-repeat;
		background-position: 20% 50%;
		background-size: 30%;
	}

	#image img.error::after {
		content: "加载失败！\A\D 请确认输入的url有效！";
		position: absolute;
		left: 200px;
		top: 180px;
		width: 100%;
		line-height: 2;
		color: black;
		font-size: 30px;
		text-overflow: ellipsis;
		white-space: pre;
	}

	// .panel-body {
	// 	position: absolute;
	// 	width: 840px;
	// 	height: 90%;
	// 	left: -10px;
	// 	top: 50px;
	// 	//z-index: 10;
	// }

	.box-card {
		position: absolute;
		margin-left: 15px;
		background: rgba(248, 251, 255, .9);
		// width: 100%;
		// height: 100%;
		// z-index: 10;
		width: 840px;
		height: 93%;
		left: 0;
		top: 50px;
		opacity: 0;
	}

	.panel-btn {
		position: absolute;
		top: 10px;
		font-size: 16px;
		font-weight: bold;
		color: #888888;
	}

	.tab {
		position: absolute;
		width: 25px;
		height: 95px;
		border-radius: 0px 10px 10px 0px;
		background-color: #eef1f7;
		cursor: pointer;
		z-index: 10;

		.arrow {
			border-color: #eef1f7 transparent transparent #eef1f7;
			border-style: solid;
			border-width: 15px 15px 15px 15px;
			height: 0;
			width: 0;
			position: absolute;
			bottom: -23px;
		}
	}

	.container {
		display: flex;
		width: 100%;
		flex-flow: column;
		padding-left: 5%;
		padding-right: 5%;
		padding-top: 5%;
		height: 650px;
		overflow-y: scroll;
	}

	.title {
		text-align: left;
		font-weight: bold;
		font-size: 22px;
		color: #0a1612;
	}

	.intro .content {
		margin-top: 20px;
		margin-bottom: 20px;
		//max-height: 45%;
		text-align: left;
	}

	#openBtn {
		top: 15vh;
		// left:15px;
	}

	#closeBtn {
		right: 50px;
		top: 50px;
		font-size: 30px;
	}
</style>
