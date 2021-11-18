<template>
	<div style="margin-top: 5vh;">
		<el-row style="margin: 30px 0px 10px 0px">
			<label style="font-size: 30px">AI实验室</label>
		</el-row>

		<el-row style="margin: 50px 200px 10px 200px">
			<p style="font-size: 18px;">
				本平台由LUNA团队提供和维护，依托领先的技术实力，我们为用户提供高品质的教育产品及服务，全面分析试题，提升学习效率，目前推出了包括图片转写、属性预估、相似度分析等多款在线服务，旨在为用户提供智能练习、难题解析等多元化的智能教育服务。
			</p>
		</el-row>

		<!-- <el-divider></el-divider> -->

		<!-- API area -->
		<section class="API-area">
			<el-row>
				<el-col :span="4" :offset="5">
					<el-divider></el-divider>
				</el-col>
				<el-col :span="6">
					<h1 style="padding-left: 5vw; padding-right: 4vw; letter-spacing: 1vw; margin-top: 5px">API服务</h1>
				</el-col>
				<el-col :span="4">
					<el-divider></el-divider>
				</el-col>
			</el-row>

			<el-row style="padding-top: 30px; padding-bottom: 30px">
				<el-col :span="6">
					<el-row>
						<el-button @click="ToImageTranscription()" circle style="height: 200px; width: 200px;"><img
								src="../assets/icon9.png" width="50%" />
						</el-button>
					</el-row>
					<el-row>
						<label @click="ToImageTranscription()" class="name">
							图片转写
						</label>
					</el-row>
					<el-row class="description">
						<span>识别图片中的文字、公式与图例，并将其中的公式转化为统一标准的排版语言（如latex）</span>
					</el-row>
				</el-col>
				<el-col :span="6">
					<el-row>
						<el-button @click="ToEstimate()" circle style="height: 200px; width: 200px"><img
								src="../assets/icon10.png" width="50%" />
						</el-button>
					</el-row>
					<el-row>
						<label @click="ToEstimate()" class="name">
							属性预估
						</label>
					</el-row>
					<el-row class="description">
						<span>自动预测试题的难度、信效度和知识点等属性，提高学生的做题效率和提升组卷的质量</span>
					</el-row>
				</el-col>
				<el-col :span="6">
					<el-row>
						<el-button @click="ToSimilarity()" circle style="height: 200px; width: 200px"><img
								src="../assets/icon11.png" width="50%" />
						</el-button>
					</el-row>
					<el-row>
						<label @click="ToSimilarity()" class="name">
							相似度估计
						</label>
					</el-row>
					<el-row class="description">
						<span>基于人工智能算法，判断两个题目之间的相似程度</span>
					</el-row>
				</el-col>
				<el-col :span="6">
					<el-row>
						<el-button @click="ToSegmentation()" circle style="height: 200px; width: 200px"><img
								src="../assets/icon14.png" width="50%" />
						</el-button>
					</el-row>
					<el-row>
						<label @click="ToSegmentation()" class="name">
							试卷打散入库
						</label>
					</el-row>
					<el-row class="description">
						<span>将试卷切分为题目、答案、解析等部分，提取其中的试题并入数据库</span>
					</el-row>
				</el-col>
			</el-row>
		</section>

		<!-- algorithm area -->
		<section class="algorithm-area">
			<el-row>
				<el-col :span="3" :offset="5">
					<el-divider></el-divider>
				</el-col>
				<el-col :span="8">
					<h1 style="padding-left: 5vw; padding-right: 4vw; letter-spacing: 1vw; margin-top: 5px">开源数据与算法</h1>
				</el-col>
				<el-col :span="3">
					<el-divider></el-divider>
				</el-col>
			</el-row>

			<el-row style="padding-top: 30px; padding-bottom: 30px">
				<el-col :span="12">
					<el-row>
						<el-button @click="ToEduDate()()" circle style="height: 200px; width: 200px;">
							<img src="../assets/icon12.png" width="80%" />
						</el-button>
					</el-row>
					<el-row>
						<label @click="ToEduDate()" class="name">
							教育数据集
						</label>
					</el-row>
					<el-row class="description">
						<span>提供教育数据集、便利的下载接口和预处理教育数据集的界面</span>
					</el-row>
				</el-col>
				<el-col :span="12">
					<el-row>
						<el-button @click="ToEduNLP()()" circle style="height: 200px; width: 200px">
							<img src="../assets/icon13.png" width="80%" />
						</el-button>
					</el-row>
					<el-row>
						<label @click="ToEduNLP()()" class="name">
							NLP工具
						</label>
					</el-row>
					<el-row class="description">
						<span>为教育类数据（如试题、试卷等）提供自然语言处理工具</span>
					</el-row>
				</el-col>
			</el-row>
		</section>
	</div>
</template>

<script>
	export default {
		name: "PublicPlatform",
		activated() {
			this.ToTop();
		},
		methods: {
			ToTop() {
				window.scrollTo(0, 0);
			},
			ToImageTranscription() {
				this.$router.push({
					path: "/PublicPlatform/ImageTranscription"
				});
				this.ToTop();
			},
			ToEstimate() {
				this.$router.push({
					path: "/PublicPlatform/Estimate"
				});
				this.ToTop();
			},
			ToSimilarity() {
				this.$router.push({
					path: "/PublicPlatform/Similarity"
				});
				this.ToTop();
			},
			ToSegmentation() {
				this.$router.push({
					path: "/PublicPlatform/segmentation"
				});
				this.ToTop();
			},
			ToEduDate() {
				window.location = "https://github.com/bigdata-ustc/EduData"
			},
			ToEduNLP() {
				window.location = "https://github.com/bigdata-ustc/EduNLP"
			},
		}
	}
</script>

<style scoped>
	.API-area {
		padding-top: 50px;
		background: #EEF5FE;
		background-size: 100%;
		position: relative;
		min-height: 600px;
		background-position: center;
		background-size: cover;
		z-index: 1;
	}

	.algorithm-area {
		padding-top: 50px;
		padding-bottom: 50px;
	}

	.name {
		margin-top: 30px;
		font-size: 20px;
	}

	.name:hover {
		cursor: pointer;
	}

	.description {
		margin-top: 15px;
		font-size: 10px;
		width: 200px;
		margin: auto;
	}

	.el-divider__text {
		position: absolute;
		background-color: rgba(0, 0, 0, 0);
		padding: 0 20px;
		font-weight: 500;
		color: #303133;
		font-size: 14px
	}

	.el-divider--horizontal {
		display: block;
		height: 4px;
		width: 100%;
		margin: 24px 0
	}
</style>
