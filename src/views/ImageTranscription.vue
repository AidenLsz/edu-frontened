<template>
	<div style="margin-top: 5vh;">

		<el-row justify="start" type="flex">
			<el-col style="padding-left: 25px">
				<el-breadcrumb separator-class="el-icon-arrow-right">
					<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
					<el-breadcrumb-item>开放平台</el-breadcrumb-item>
					<el-breadcrumb-item>图片转写</el-breadcrumb-item>
				</el-breadcrumb>
			</el-col>
		</el-row>

		<el-row style="margin: 30px 0px 10px 0px">
			<label style="font-size: 20px">图片转写</label>
		</el-row>
		<p type="text" style="margin: 40px 150px 40px 150px;">
			图片转写图片转写图片转写图片转写图片转写图片转写图片转写图片转写图片转写图片转写图片转写图片转写图片转写图片转写图片转写图片转写图片转写图片转写图片转写图片转写图片转写图片转写图片转写图片转写图片转写图片转写图片转写图片转写图片转写图片转写图片转写图片转写图片转写图片转写图片转写图片转写图片转写图片转写图片转写图片转写图片转写图片转写图片转写图片转写图片转写图片转写图片转写图片转写图片转写图片转写图片转写图片转写图片转写图片转写图片转写图片转写图片转写图片转写图片转写图片转写
		</p>

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

			<!-- 	<div id="option">
				<div class="optional_img" style="left:20px;">
					<img :src="optional_image[0]" alt="image0" class="self_adaption"
						@click="ChooseDefaultImage(optional_image[0])">
				</div>
				<div class="optional_img" style="left:220px;">
					<img :src="optional_image[1]" alt="image1" class="self_adaption"
						@click="ChooseDefaultImage(optional_image[1])">
				</div>
				<div class="optional_img" style="left:420px;">
					<img :src="optional_image[2]" alt="image2" class="self_adaption"
						@click="ChooseDefaultImage(optional_image[2])">
				</div>
				<div class="optional_img" style="left:620px;">
					<img :src="optional_image[3]" alt="image3" class="self_adaption"
						@click="ChooseDefaultImage(optional_image[3])">
				</div>
			</div> -->

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
				<el-table :data="tableData" border style="width: 100%">
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

		<!-- <p>When $a \ne 0$, there are two solutions to \(ax^2 + bx + c = 0\) and they are $$x = {-b \pm \sqrt{b^2-4ac}
			\over 2a}.$$</p> -->
	</div>
</template>

<script>
	// import Mathdown from "@/common/components/Mathdown.vue";
	require("mathjax/es5/tex-svg");
	import {
		commonAjax
	} from '@/common/utils/ajax'

	export default {
		components: {
			//ComplexInput
		},
		name: "ImageTranscription",
		mounted() {
			this.ToTop();
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
				optional_image: [
					require("@/assets/default_image/0.png"),
					require("@/assets/default_image/1.png"),
					require("@/assets/default_image/2.png"),
					require("@/assets/default_image/3.png")
				],
				tableData: [{
					num: "1",
					content: "http: //www.baidu.com"
				}, {
					num: "2",
					content: "北京市海淀区上地十街10号100085",
				}, {
					num: "3",
					content: " No. 10 Shangdi 10th Street, Haidian District, Beijing 100085",
				}, {
					num: "4",
					content: "Tel:+8610-5292-2888fax:+8610-5992-0900"
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
			},

			ChooseDefaultImage(default_image) {
				this.error = false;
				this.image = default_image;
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
				let result;
				let res = '!!!';
				console.log('执行');
				console.log(this.image + '!!!');

				try {
					res = await this.getBase64(this.image);
				} catch (err) {
					console.log(err);
				}
				this.base64_code = res; // 将结果赋值给需要用的变量属性
				console.log(this.base64_code); // 获取到结果

				console.log(this.base64_code.length);
				if (this.base64_code.length / 1024 > 1024) {
					alert("抱歉，您上传的图片过大，请重新上传");
					return;
				}

				try {
					result = await commonAjax(
						"https://formula-recognition-service-157-production.env.bdaa.pro/v1", {
							image: this.base64_code,
							qid: this.qid
						});
				} catch (err) {
					console.log(err);
					console.log(err);
				}
				this.qid++;
				console.log(result.qid);
				if (result.success && result.is_formula && result.detect_formula) {
					this.tableData = [{
						num: "0",
						content: result.latex
					}];
				} else {
					this.tableData.length = 0;
				}

				// let data = await commonAjax(this.backendIP + '/api/count', {})
				// console.log("paper_num=" + data.num_paper);
			}
		}
	}
</script>

<style lang="scss" scoped>
	#main {
		position: relative;
		margin: auto;
		width: 1200px;
		height: 650px;
		margin-bottom: 100px;
	}

	#image {
		position: absolute;
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
		background-image: url("../assets/failure.png");
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

	// #image /deep/ .el-icon-loading {
	// 	position:absolute;
	// 	height: 80px;
	// 	width:80px;
	// 	top: 400px;
	// 	left:250px;
	// }
</style>
