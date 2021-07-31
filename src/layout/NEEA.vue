<template>
	<el-container id="app">
		<login ref="login" @register_show="register_show" />
		<register ref="register" />
		<!-- <el-header style="height: 70px;" v-show="$route.name!='user'"> -->
		<el-header style="height: 70px;">
			<div id="header-sticky" class="sticky-menu">
				<el-row>
					<el-col :span="4" style="padding-top: 20px; padding-left: 30px">
						<img src="@/assets/bdaa.png" alt="Logo" width="40px" style="cursor: pointer"
							@click="goToMainPage" />
					</el-col>
					<el-col :span="8" :offset="11">
						<el-row type="flex" justify="end">
							<el-col :span="4" style="padding-top: 15px;">
								<el-button type="text" @click="goToMainPage" class="navbar">首页</el-button>
							</el-col>
							<el-col :span="4" style="padding-top: 15px;">
								<el-menu mode="horizontal"
									style=" border-bottom: 3px solid #409EFF; padding-bottom: 10px">
									<el-submenu index="0">
										<template slot="title">
											<span :style="Title_Pos()">功能</span>
										</template>
										<el-submenu index="1">
											<template slot="title"><span style="color: black;">资源录入</span></template>
											<router-link :to="rootPath+'inputMarked'" :underline="false" @click.native="ToTop">
												<el-menu-item index="1-2">
													<span style="color: black;">试题资源</span>
												</el-menu-item>
											</router-link>
											<router-link :to="rootPath+'inputPaper'" :underline="false" @click.native="ToTop">
												<el-menu-item index="1-3">
													<span style="color: black;">试卷资源</span>
												</el-menu-item>
											</router-link>
										</el-submenu>
										<el-submenu index="2">
											<template slot="title"><span style="color: black;">查重</span></template>
											<router-link :to="rootPath+'exercise'" :underline="false" @click.native="ToTop">
												<el-menu-item index="2-1">
													<span style="color: black;">试题检索</span>
												</el-menu-item>
											</router-link>

											<router-link :to="rootPath+'searchPaper'" :underline="false" @click.native="ToTop">
												<el-menu-item index="2-2">
													<span style="color: black;">试卷检索</span>
												</el-menu-item>
											</router-link>
										</el-submenu>
										<el-menu-item index="5">
											<router-link :to="this.rootPath+'manage/dashboard'"
												:underline="false" @click.native="ToTop">
												<span style="color: #409EFF; font-weight: bold">
													资源管理
												</span>
											</router-link>
										</el-menu-item>
									</el-submenu>
								</el-menu>
							</el-col>
							<el-col :span="4" style="padding-top: 15px;">
								<el-button type="text" @click="show_members" class="navbar">成员</el-button>
							</el-col>
							<el-col :span="5" style="padding-top: 15px;" v-if="$store.state.user.name">
								<el-row>
									<el-dropdown trigger="hover" style="padding-top: 8px" class="navbar">
										<span class="el-dropdown-link user-inner">
											{{ $store.state.user.name }}<i
												class="el-icon-arrow-down el-icon--right"></i>
										</span>
										<el-dropdown-menu slot="dropdown">
											<el-dropdown-item @click.native="checkUserInfo">个人设置</el-dropdown-item>
											<el-dropdown-item @click.native="checkUserGroup">组织架构</el-dropdown-item>
											<el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
										</el-dropdown-menu>
									</el-dropdown>
								</el-row>
							</el-col>
							<el-col :span="4" style="padding-top: 15px;" v-else>
								<el-button type="text" @click="login_show" class="navbar">登录</el-button>
							</el-col>
							<el-col :span="2" style="padding-top: 15px;">
								<el-button type="text" @click="register_show" class="navbar">注册</el-button>
							</el-col>
						</el-row>
					</el-col>
				</el-row>
			</div>
		</el-header>
		<el-main>
			<router-view :key="$route.fullPath"></router-view>
			<basic-footer />
		</el-main>
	</el-container>
</template>

<script>
	import BasicFooter from '@/layout/components/footer.vue'
	import login from '@/layout/components/login.vue'
	import register from '@/layout/components/register.vue'
	export default {
		name: "App",
		components: {
			BasicFooter,
			login,
			register
		},
		data() {
			return {
				rootPath:'/neea/',
				activeIndex: "",
				// 跳转至试卷/试题分析的不同地点用的
				PaperAnalyseSwitchFlag: false,
				QuestionAnalyseSwitchFlag: false
			};
		},
		methods: {
			// 查看用户个人信息及组织架构
			checkUserInfo() {
				this.$router.push({
					path: this.rootPath+"user/userInfo"
				});
			},
			checkUserGroup() {
				this.$router.push({
					path: this.rootPath+"user/userGroup"
				});
			},
			// 跳转至试题分析的不同位置的对话框
			QuestionAnalyseSwitch() {
				this.QuestionAnalyseSwitchFlag = true;
			},
			// 跳转至试卷分析的不同位置的对话框
			PaperAnalyseSwitch() {
				this.PaperAnalyseSwitchFlag = true;
			},
			Title_Pos() {
				return {
					"font-size": "18px",
					"color": "black",
					"margin-left": "0px"
				}
			},
			ToTop() {
				window.scrollTo(0, 0);
			},
			goToMainPage() {
				this.$router.push({
					path: this.rootPath
				});
				this.ToTop();
			},
			show_members() {
				this.$router.push({
					path: this.rootPath+"members"
				});
				this.ToTop();
			},
			login_show() {
				this.$refs.login.show()
				this.$refs.register.hide()
			},
			register_show() {
				this.$refs.login.hide()
				this.$refs.register.show()
			},
			login_admin() {
				this.$router.push({
					path: "/admin"
				});
				this.ToTop();
			},
			// 测试退出函数
			async logout() {
				await this.$store.dispatch('user/logout')
				this.$router.push("/");
				location.reload();
			},
			goToUserPage() {
				this.$router.push("/dashboard");
			}
		},
	};
</script>
<style>
	html,
	body,
	#app {
		min-height: 100vh;
	}
</style>
<style scoped lang="scss">
	.el-header .el-menu--horizontal /deep/ .el-submenu.is-active .el-submenu__title {
		border-bottom: none;
	}

	.el-header .el-menu--horizontal /deep/ .el-submenu .el-submenu__title {
		height: 42px;
		line-height: 18px;
		padding-top: 15px;
		border-bottom: 2px solid transparent;
		width: 50%;
		z-index: 999;
	}

	.el-header .el-menu .el-menu--horizontal {
		border-bottom: none;
	}
</style>
<style>
	.el-header .el-menu--horizontal /deep/ .el-submenu.is-active .el-submenu__title {
		border-bottom: none;
	}

	.el-header .el-menu--horizontal /deep/ .el-submenu .el-submenu__title {
		height: 42px;
		line-height: 18px;
		padding-top: 15px;
		border-bottom: 2px solid transparent;
		width: 50%;
		z-index: 999;
	}

	.el-header .el-menu .el-menu--horizontal {
		border-bottom: none;
	}
</style>

<style scoped lang="scss">
	.menu-area {
		margin-top: -60px;
		padding-bottom: -10px;
		margin-right: 0px;
		background-color: #fff;
	}

	.logo {
		margin-left: -100px;
	}

	.main-menu ul li {
		display: inline-block;
		position: relative;
		margin-right: -10px;
	}

	.main-menu ul li:first-child {
		margin-left: 0;
	}

	.main-menu ul li a {
		display: block;
		color: #1a2930;
		opacity: 0.8;
		padding: 0;
		font-size: 18px;
		font-weight: 700;
		position: relative;
		margin-bottom: -20px;
		text-decoration: none;
	}

	.main-menu ul li:hover>a {
		color: #000;
		opacity: 1;
		font-weight: 900;
		text-decoration: none;
	}

	.main-menu ul li.active>a {
		color: #ffd700;
		opacity: 1;
		font-weight: 900;
		text-decoration: none;
	}

	.main-menu ul>li>a::before {
		content: "";
		position: absolute;
		left: 0;
		bottom: 5px;
		width: 0;
		height: 2px;
		background: #fff;
		transition: 0.3s;
	}

	.main-menu ul>li:hover>a::before {
		width: 100%;
	}

	.main-menu ul li.active a::before {
		content: "";
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 2px;
		background: #fff;
		transition: 0.3s;
	}

	.sticky-menu {
		left: 0;
		margin: auto;
		position: fixed;
		max-height: 70px;
		top: 0;
		width: 100%;
		box-shadow: 0 0px 12px 0 rgba(0, 0, 0, 0.5);
		z-index: 999;
		background: #fff;
		-webkit-animation: 300ms ease-in-out 0s normal none 1 running fadeInDown;
		animation: 300ms ease-in-out 0s normal none 1 running fadeInDown;
		-webkit-box-shadow: 0 0px 12px 0 rgba(0, 0, 0, 0.5);
		margin-top: 0px;
	}

	/* scrollUp */
	#scrollUp {
		background: #fff;
		height: 40px;
		width: 40px;
		right: 50px;
		bottom: 77px;
		color: #666666;
		text-align: center;
		border-radius: 50%;
		font-size: 20px;
		line-height: 43px;
	}

	#scrollUp:hover {
		background: #666666;
		color: #fff;
	}

	#app {
		font-family: "Avenir", Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;
	}

	.el-dropdown-link {
		cursor: pointer;
		color: #1a2930;
		font-size: 18px;
		font-weight: 900;
	}
</style>
<style scoped>
	.el-dropdown-menu__item:focus,
	.el-dropdown-menu__item:not(.is-disable):hover {
		background-color: #1a2930 !important;
		color: #fff !important;
	}

	.el-dropdown-menu__item a {
		color: #1a2930 !important;
		text-decoration: none !important;
	}

	.el-dropdown-menu__item:hover a {
		color: #fff !important;
		text-decoration: none !important;
	}

	.text-btn {
		background: transparent;
		color: #1a2930;
		border: 0px;
		margin-left: 30px;
		margin-right: -35px;
		font-size: 14px;
	}

	.user-inner {
		cursor: pointer;
		color: #1a2930;
	}

	.navbar {
		font-size: 18px;
		color: black;
	}

	.el-container {
		/*设置内部填充为0，几个布局元素之间没有间距*/
		padding: 0px;
		/*外部间距也是如此设置*/
		margin: 0px;
		/*统一设置高度为100%*/
		height: 100%;
		width: 100%;
	}

	.el-main {
		/*设置内部填充为0，几个布局元素之间没有间距*/
		padding: 0px 0px 0px 0px;
		/*外部间距也是如此设置*/
		margin: 0px 0px 0px 0px;
		/*统一设置高度为100%*/
		height: 100%;
		width: 100%;
		overflow-x: hidden;
	}

	.el-header {
		/*设置内部填充为0，几个布局元素之间没有间距*/
		padding: 0px 0px 0px 0px;
		/*外部间距也是如此设置*/
		margin: 0px;
		/*统一设置高度为100%*/
		height: 100%;
		width: 100%;
	}
</style>
