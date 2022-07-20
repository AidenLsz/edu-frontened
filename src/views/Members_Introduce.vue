<template>
	<div>
		<el-row>
			<div id="Top_Nav" class="Top_Nav">
			</div>
			<!-- 老师 -->
			<el-row style="margin: 20px 0px 10px 0px">
				<label style="font-size: 20px">指导老师</label>
			</el-row>
			<el-row v-for="Row_Index in Math.ceil(member_data.teachers.length/3)" :key="'T_R_' + Row_Index"
				style="margin-left: 10vw; margin-right: 10vw; padding-left: 3vw">
				<el-col :span="7" v-if="(Row_Index - 1) * 3 + 0 < member_data.teachers.length" class="Teacher_Card">
					<el-row>
						<img class="img_background_teacher" :src="Get_Teacher_Img(Row_Index, 0)"
							style="border-radius: 50%" alt="暂无图片">
					</el-row>
					<el-row style="padding-top: 20px">
						<label style="font-size: 18px">{{member_data.teachers[(Row_Index - 1) * 3 + 0].name}}</label>
					</el-row>
					<el-row style="padding-top: 10px">
						<span><i class="el-icon-message"
								style="color: #409EFD; font-size: 16px; margin-right: 15px"></i>{{member_data.teachers[(Row_Index - 1) * 3 + 0].mail}}</span>
					</el-row>
					<el-row style="padding-top: 10px">
						<span><i class="el-icon-s-home" style="color: #409EFD; font-size: 16px; margin-right: 15px"></i>
							<el-link :href="member_data.teachers[(Row_Index - 1) * 3 + 0].page" :underline="false"
								target="_blank">{{member_data.teachers[(Row_Index - 1) * 3 + 0].name}}的个人主页</el-link>
						</span>
					</el-row>
					<el-row style="padding-top: 10px">
						<p style="white-space: pre-line; line-height: 30px; text-align: left;">
							{{member_data.teachers[(Row_Index - 1) * 3 + 0].intro}}</p>
					</el-row>
				</el-col>
				<el-col :span="7" :offset="1" v-if="(Row_Index - 1) * 3 + 1 < member_data.teachers.length"
					class="Teacher_Card">
					<el-row>
						<img class="img_background_teacher" :src="Get_Teacher_Img(Row_Index, 1)"
							style="border-radius: 50%" alt="暂无图片">
					</el-row>
					<el-row style="padding-top: 20px">
						<label style="font-size: 18px">{{member_data.teachers[(Row_Index - 1) * 3 + 1].name}}</label>
					</el-row>
					<el-row style="padding-top: 10px">
						<span><i class="el-icon-message"
								style="color: #409EFD; font-size: 16px; margin-right: 15px"></i>{{member_data.teachers[(Row_Index - 1) * 3 + 1].mail}}</span>
					</el-row>
					<el-row style="padding-top: 10px">
						<span><i class="el-icon-s-home" style="color: #409EFD; font-size: 16px; margin-right: 15px"></i>
							<el-link :href="member_data.teachers[(Row_Index - 1) * 3 + 1].page" :underline="false"
								target="_blank">{{member_data.teachers[(Row_Index - 1) * 3 + 1].name}}的个人主页</el-link>
						</span>
					</el-row>
					<el-row style="padding-top: 10px">
						<p style="white-space: pre-line; line-height: 30px; text-align: left;">
							{{member_data.teachers[(Row_Index - 1) * 3 + 1].intro}}</p>
					</el-row>
				</el-col>
				<el-col :span="7" :offset="1" v-if="(Row_Index - 1) * 3 + 2 < member_data.teachers.length"
					class="Teacher_Card">
					<el-row>
						<img class="img_background_teacher" :src="Get_Teacher_Img(Row_Index, 2)"
							style="border-radius: 50%" alt="暂无图片">
					</el-row>
					<el-row style="padding-top: 20px">
						<label style="font-size: 18px">{{member_data.teachers[(Row_Index - 1) * 3 + 2].name}}</label>
					</el-row>
					<el-row style="padding-top: 10px">
						<span><i class="el-icon-message"
								style="color: #409EFD; font-size: 16px; margin-right: 15px"></i>{{member_data.teachers[(Row_Index - 1) * 3 + 2].mail}}</span>
					</el-row>
					<el-row style="padding-top: 10px">
						<span><i class="el-icon-s-home" style="color: #409EFD; font-size: 16px; margin-right: 15px"></i>
							<el-link :href="member_data.teachers[(Row_Index - 1) * 3 + 2].page" :underline="false"
								target="_blank">{{member_data.teachers[(Row_Index - 1) * 3 + 2].name}}的个人主页</el-link>
						</span>
					</el-row>
					<el-row style="padding-top: 10px">
						<p style="white-space: pre-line; line-height: 30px; text-align: left;">
							{{member_data.teachers[(Row_Index - 1) * 3 + 2].intro}}</p>
					</el-row>
				</el-col>
			</el-row>
			<el-divider></el-divider>
			<!-- 团队成员 -->
			<el-row style="margin: 30px 0px 30px 0px">
				<label style="font-size: 20px">团队成员</label>
			</el-row>
			<el-row v-for="Row_Index in Math.ceil(member_data.students.length/3)" :key="'S_R_' + Row_Index"
				style="margin-left: 10vw; margin-right: 10vw; padding-left: 3vw">
				<el-col :span="7" v-if="(Row_Index - 1) * 3 + 0 < member_data.students.length" class="Student_Card">
					<el-row>
						<img class="img_background_student" :src="Get_Student_Img(Row_Index, 0)"
							style="border-radius: 50%" alt="暂无图片">
					</el-row>
					<el-row style="padding-top: 20px">
						<label style="font-size: 18px">{{member_data.students[(Row_Index - 1) * 3 + 0].name}}</label>
					</el-row>
					<el-row style="padding-top: 10px">
						<span><i class="el-icon-message"
								style="color: #409EFD; font-size: 16px; margin-right: 15px"></i>{{member_data.students[(Row_Index - 1) * 3 + 0].mail}}</span>
					</el-row>
					<el-row style="padding-top: 10px">
						<span
							style="white-space: pre-line; line-height: 30px; ">{{member_data.students[(Row_Index - 1) * 3 + 0].intro}}</span>
					</el-row>
				</el-col>
				<el-col :span="7" :offset="1" v-if="(Row_Index - 1) * 3 + 1 < member_data.students.length"
					class="Student_Card">
					<el-row>
						<img class="img_background_student" :src="Get_Student_Img(Row_Index, 1)"
							style="border-radius: 50%" alt="暂无图片">
					</el-row>
					<el-row style="padding-top: 20px">
						<label style="font-size: 18px">{{member_data.students[(Row_Index - 1) * 3 + 1].name}}</label>
					</el-row>
					<el-row style="padding-top: 10px">
						<span><i class="el-icon-message"
								style="color: #409EFD; font-size: 16px; margin-right: 15px"></i>{{member_data.students[(Row_Index - 1) * 3 + 1].mail}}</span>
					</el-row>
					<el-row style="padding-top: 10px">
						<span
							style="white-space: pre-line; line-height: 30px; ">{{member_data.students[(Row_Index - 1) * 3 + 1].intro}}</span>
					</el-row>
				</el-col>
				<el-col :span="7" :offset="1" v-if="(Row_Index - 1) * 3 + 2 < member_data.students.length"
					class="Student_Card">
					<el-row>
						<img class="img_background_student" :src="Get_Student_Img(Row_Index, 2)"
							style="border-radius: 50%" alt="暂无图片">
					</el-row>
					<el-row style="padding-top: 20px">
						<label style="font-size: 18px">{{member_data.students[(Row_Index - 1) * 3 + 2].name}}</label>
					</el-row>
					<el-row style="padding-top: 10px">
						<span><i class="el-icon-message"
								style="color: #409EFD; font-size: 16px; margin-right: 15px"></i>{{member_data.students[(Row_Index - 1) * 3 + 2].mail}}</span>
					</el-row>
					<el-row style="padding-top: 10px">
						<span
							style="white-space: pre-line; line-height: 30px; ">{{member_data.students[(Row_Index - 1) * 3 + 2].intro}}</span>
					</el-row>
				</el-col>
			</el-row>
			<!-- 特任工程师，暂无内容，所以分割线暂时先去掉了 -->
			<el-row style="margin: 30px 0px 30px 0px; display: none">
				<label style="font-size: 20px">特任工程师</label>
			</el-row>
			<el-row v-for="Row_Index in Math.ceil(member_data.invitedEngineer.length/3)" :key="'IE_R_' + Row_Index"
				style="margin-left: 10vw; margin-right: 10vw; padding-left: 3vw">
				<el-col :span="7" v-if="(Row_Index - 1) * 3 + 0 < member_data.invitedEngineer.length"
					class="Student_Card">
					<el-row>
						<img class="img_background_student" :src="Get_InvitedEngineer_Img(Row_Index, 0)"
							style="border-radius: 50%" alt="暂无图片">
					</el-row>
					<el-row style="padding-top: 20px">
						<label
							style="font-size: 18px">{{member_data.invitedEngineer[(Row_Index - 1) * 3 + 0].name}}</label>
					</el-row>
					<el-row style="padding-top: 10px">
						<span><i class="el-icon-message"
								style="color: #409EFD; font-size: 16px; margin-right: 15px"></i>{{member_data.invitedEngineer[(Row_Index - 1) * 3 + 0].mail}}</span>
					</el-row>
					<el-row style="padding-top: 10px">
						<span
							style="white-space: pre-line; line-height: 30px; ">{{member_data.invitedEngineer[(Row_Index - 1) * 3 + 0].intro}}</span>
					</el-row>
				</el-col>
				<el-col :span="7" :offset="1" v-if="(Row_Index - 1) * 3 + 1 < member_data.invitedEngineer.length"
					class="Student_Card">
					<el-row>
						<img class="img_background_student" :src="Get_InvitedEngineer_Img(Row_Index, 1)"
							style="border-radius: 50%" alt="暂无图片">
					</el-row>
					<el-row style="padding-top: 20px">
						<label
							style="font-size: 18px">{{member_data.invitedEngineer[(Row_Index - 1) * 3 + 1].name}}</label>
					</el-row>
					<el-row style="padding-top: 10px">
						<span><i class="el-icon-message"
								style="color: #409EFD; font-size: 16px; margin-right: 15px"></i>{{member_data.invitedEngineer[(Row_Index - 1) * 3 + 1].mail}}</span>
					</el-row>
					<el-row style="padding-top: 10px">
						<span
							style="white-space: pre-line; line-height: 30px; ">{{member_data.invitedEngineer[(Row_Index - 1) * 3 + 1].intro}}</span>
					</el-row>
				</el-col>
				<el-col :span="7" :offset="1" v-if="(Row_Index - 1) * 3 + 2 < member_data.invitedEngineer.length"
					class="Student_Card">
					<el-row>
						<img class="img_background_student" :src="Get_InvitedEngineer_Img(Row_Index, 2)"
							style="border-radius: 50%" alt="暂无图片">
					</el-row>
					<el-row style="padding-top: 20px">
						<label
							style="font-size: 18px">{{member_data.invitedEngineer[(Row_Index - 1) * 3 + 2].name}}</label>
					</el-row>
					<el-row style="padding-top: 10px">
						<span><i class="el-icon-message"
								style="color: #409EFD; font-size: 16px; margin-right: 15px"></i>{{member_data.invitedEngineer[(Row_Index - 1) * 3 + 2].mail}}</span>
					</el-row>
					<el-row style="padding-top: 10px">
						<span
							style="white-space: pre-line; line-height: 30px; ">{{member_data.invitedEngineer[(Row_Index - 1) * 3 + 2].intro}}</span>
					</el-row>
				</el-col>
			</el-row>
			<el-divider></el-divider>
			<!-- 实习生 -->
			<el-row style="margin: 30px 0px 30px 0px;">
				<label style="font-size: 20px">实习生</label>
			</el-row>
			<el-row v-for="Row_Index in Math.ceil(member_data.trainee.length/3)" :key="'IE_R_' + Row_Index"
				style="margin-left: 10vw; margin-right: 10vw; padding-left: 3vw">
				<el-col :span="7" v-if="(Row_Index - 1) * 3 + 0 < member_data.trainee.length" class="Student_Card">
					<el-row>
						<img class="img_background_student" :src="Get_Trainee_Img(Row_Index, 0)"
							style="border-radius: 50%" alt="暂无图片">
					</el-row>
					<el-row style="padding-top: 20px">
						<label style="font-size: 18px">{{member_data.trainee[(Row_Index - 1) * 3 + 0].name}}</label>
					</el-row>
					<el-row style="padding-top: 10px">
						<span><i class="el-icon-message"
								style="color: #409EFD; font-size: 16px; margin-right: 15px"></i>{{member_data.trainee[(Row_Index - 1) * 3 + 0].mail}}</span>
					</el-row>
					<el-row style="padding-top: 10px">
						<span
							style="white-space: pre-line; line-height: 30px; ">{{member_data.trainee[(Row_Index - 1) * 3 + 0].intro}}</span>
					</el-row>
				</el-col>
				<el-col :span="7" :offset="1" v-if="(Row_Index - 1) * 3 + 1 < member_data.trainee.length"
					class="Student_Card">
					<el-row>
						<img class="img_background_student" :src="Get_Trainee_Img(Row_Index, 1)"
							style="border-radius: 50%" alt="暂无图片">
					</el-row>
					<el-row style="padding-top: 20px">
						<label style="font-size: 18px">{{member_data.trainee[(Row_Index - 1) * 3 + 1].name}}</label>
					</el-row>
					<el-row style="padding-top: 10px">
						<span><i class="el-icon-message"
								style="color: #409EFD; font-size: 16px; margin-right: 15px"></i>{{member_data.trainee[(Row_Index - 1) * 3 + 1].mail}}</span>
					</el-row>
					<el-row style="padding-top: 10px">
						<span
							style="white-space: pre-line; line-height: 30px; ">{{member_data.trainee[(Row_Index - 1) * 3 + 1].intro}}</span>
					</el-row>
				</el-col>
				<el-col :span="7" :offset="1" v-if="(Row_Index - 1) * 3 + 2 < member_data.trainee.length"
					class="Student_Card">
					<el-row>
						<img class="img_background_student" :src="Get_Trainee_Img(Row_Index, 2)"
							style="border-radius: 50%" alt="暂无图片">
					</el-row>
					<el-row style="padding-top: 20px">
						<label style="font-size: 18px">{{member_data.trainee[(Row_Index - 1) * 3 + 2].name}}</label>
					</el-row>
					<el-row style="padding-top: 10px">
						<span><i class="el-icon-message"
								style="color: #409EFD; font-size: 16px; margin-right: 15px"></i>{{member_data.trainee[(Row_Index - 1) * 3 + 2].mail}}</span>
					</el-row>
					<el-row style="padding-top: 10px">
						<span
							style="white-space: pre-line; line-height: 30px; ">{{member_data.trainee[(Row_Index - 1) * 3 + 2].intro}}</span>
					</el-row>
				</el-col>
			</el-row>
			<el-divider></el-divider>
			<!-- 技术顾问 -->
			<el-row style="margin: 30px 0px 30px 0px">
				<label style="font-size: 20px">技术顾问</label>
			</el-row>
			<el-row v-for="Row_Index in Math.ceil(member_data.techConsultant.length/3)" :key="'TC_R_' + Row_Index"
				style="margin-left: 10vw; margin-right: 10vw; padding-left: 3vw">
				<el-col :span="7" v-if="(Row_Index - 1) * 3 + 0 < member_data.techConsultant.length"
					class="Student_Card">
					<el-row>
						<img class="img_background_student" :src="Get_TechConsultant_Img(Row_Index, 0)"
							style="border-radius: 50%" alt="暂无图片">
					</el-row>
					<el-row style="padding-top: 20px">
						<label
							style="font-size: 18px">{{member_data.techConsultant[(Row_Index - 1) * 3 + 0].name}}</label>
					</el-row>
					<el-row style="padding-top: 10px">
						<span><i class="el-icon-message"
								style="color: #409EFD; font-size: 16px; margin-right: 15px"></i>{{member_data.techConsultant[(Row_Index - 1) * 3 + 0].mail}}</span>
					</el-row>
					<el-row style="padding-top: 10px">
						<span
							style="white-space: pre-line; line-height: 30px; ">{{member_data.techConsultant[(Row_Index - 1) * 3 + 0].intro}}</span>
					</el-row>
				</el-col>
				<el-col :span="7" :offset="1" v-if="(Row_Index - 1) * 3 + 1 < member_data.techConsultant.length"
					class="Student_Card">
					<el-row>
						<img class="img_background_student" :src="Get_TechConsultant_Img(Row_Index, 1)"
							style="border-radius: 50%" alt="暂无图片">
					</el-row>
					<el-row style="padding-top: 20px">
						<label
							style="font-size: 18px">{{member_data.techConsultant[(Row_Index - 1) * 3 + 1].name}}</label>
					</el-row>
					<el-row style="padding-top: 10px">
						<span><i class="el-icon-message"
								style="color: #409EFD; font-size: 16px; margin-right: 15px"></i>{{member_data.techConsultant[(Row_Index - 1) * 3 + 1].mail}}</span>
					</el-row>
					<el-row style="padding-top: 10px">
						<span
							style="white-space: pre-line; line-height: 30px; ">{{member_data.techConsultant[(Row_Index - 1) * 3 + 1].intro}}</span>
					</el-row>
				</el-col>
				<el-col :span="7" :offset="1" v-if="(Row_Index - 1) * 3 + 2 < member_data.techConsultant.length"
					class="Student_Card">
					<el-row>
						<img class="img_background_student" :src="Get_TechConsultant_Img(Row_Index, 2)"
							style="border-radius: 50%" alt="暂无图片">
					</el-row>
					<el-row style="padding-top: 20px">
						<label
							style="font-size: 18px">{{member_data.techConsultant[(Row_Index - 1) * 3 + 2].name}}</label>
					</el-row>
					<el-row style="padding-top: 10px">
						<span><i class="el-icon-message"
								style="color: #409EFD; font-size: 16px; margin-right: 15px"></i>{{member_data.techConsultant[(Row_Index - 1) * 3 + 2].mail}}</span>
					</el-row>
					<el-row style="padding-top: 10px">
						<span
							style="white-space: pre-line; line-height: 30px; ">{{member_data.techConsultant[(Row_Index - 1) * 3 + 2].intro}}</span>
					</el-row>
				</el-col>
			</el-row>
			<el-divider></el-divider>
			<!-- 历任成员 -->
			<el-row style="margin: 30px 0px 30px 0px">
				<label style="font-size: 20px">历任成员</label>
			</el-row>
			<el-row v-for="Row_Index in Math.ceil(member_data.historyMembers.length/3)" :key="'HM_R_' + Row_Index"
				style="margin-left: 10vw; margin-right: 10vw; padding-left: 3vw">
				<el-col :span="7" v-if="(Row_Index - 1) * 3 + 0 < member_data.historyMembers.length"
					class="Student_Card">
					<el-row>
						<img class="img_background_student" :src="Get_HistoryMember_Img(Row_Index, 0)"
							style="border-radius: 50%" alt="暂无图片">
					</el-row>
					<el-row style="padding-top: 20px">
						<label
							style="font-size: 18px">{{member_data.historyMembers[(Row_Index - 1) * 3 + 0].name}}</label>
					</el-row>
					<el-row style="padding-top: 10px">
						<span><i class="el-icon-message"
								style="color: #409EFD; font-size: 16px; margin-right: 15px"></i>{{member_data.historyMembers[(Row_Index - 1) * 3 + 0].mail}}</span>
					</el-row>
					<el-row style="padding-top: 10px">
						<span
							style="white-space: pre-line; line-height: 30px; ">{{member_data.historyMembers[(Row_Index - 1) * 3 + 0].intro}}</span>
					</el-row>
				</el-col>
				<el-col :span="7" :offset="1" v-if="(Row_Index - 1) * 3 + 1 < member_data.historyMembers.length"
					class="Student_Card">
					<el-row>
						<img class="img_background_student" :src="Get_HistoryMember_Img(Row_Index, 1)"
							style="border-radius: 50%" alt="暂无图片">
					</el-row>
					<el-row style="padding-top: 20px">
						<label
							style="font-size: 18px">{{member_data.historyMembers[(Row_Index - 1) * 3 + 1].name}}</label>
					</el-row>
					<el-row style="padding-top: 10px">
						<span><i class="el-icon-message"
								style="color: #409EFD; font-size: 16px; margin-right: 15px"></i>{{member_data.historyMembers[(Row_Index - 1) * 3 + 1].mail}}</span>
					</el-row>
					<el-row style="padding-top: 10px">
						<span
							style="white-space: pre-line; line-height: 30px; ">{{member_data.historyMembers[(Row_Index - 1) * 3 + 1].intro}}</span>
					</el-row>
				</el-col>
				<el-col :span="7" :offset="1" v-if="(Row_Index - 1) * 3 + 2 < member_data.historyMembers.length"
					class="Student_Card">
					<el-row>
						<img class="img_background_student" :src="Get_HistoryMember_Img(Row_Index, 2)"
							style="border-radius: 50%" alt="暂无图片">
					</el-row>
					<el-row style="padding-top: 20px">
						<label
							style="font-size: 18px">{{member_data.historyMembers[(Row_Index - 1) * 3 + 2].name}}</label>
					</el-row>
					<el-row style="padding-top: 10px">
						<span><i class="el-icon-message"
								style="color: #409EFD; font-size: 16px; margin-right: 15px"></i>{{member_data.historyMembers[(Row_Index - 1) * 3 + 2].mail}}</span>
					</el-row>
					<el-row style="padding-top: 10px">
						<span
							style="white-space: pre-line; line-height: 30px; ">{{member_data.historyMembers[(Row_Index - 1) * 3 + 2].intro}}</span>
					</el-row>
				</el-col>
			</el-row>
		</el-row>
	</div>
</template>
<script>
	export default {
		name: "Members",
		mounted() {
			this.To_Top();
		},
		data() {
			return {
				member_data: {
					// 指导教师
					"teachers": [{
							"intro": "陈恩红，博士，教授，博导，国家杰出青年基金获得者，科技部重点领域创新团队负责人，CCF会士。中国科学技术大学计算机科学与技术学院副院长，语音及语言信息处理国家工程实验室副主任，大数据分析及应用安徽省重点实验室主任。",
							"mail": "cheneh@ustc.edu.cn",
							"name": "陈恩红",
							"page": "http://staff.ustc.edu.cn/~cheneh"
						},
						{
							"intro": "刘淇，特任教授，博导，中国计算机学会(CCF)大数据专家委员会委员、中国人工智能学会(CAAI)机器学习专委会委员、中科院青年创新促进会优秀会员、IEEE/ACM会员。",
							"mail": "qiliuql@ustc.edu.cn",
							"name": "刘淇",
							"page": "http://staff.ustc.edu.cn/~qiliuql"
						},
						{
							"intro": "黄振亚，博士，特任副研究员，硕导。担任IEEE TKDE、ACM TIST等学术期刊审稿人，以及NeurIPS、AAAI、SDM等多个国际会议的程序委员会委员。",
							"mail": "huangzhy@ustc.edu.cn",
							"name": "黄振亚",
							"page": "http://staff.ustc.edu.cn/~huangzhy"
						}
					],
					// 团队成员
					"students": [{
							"name": "童世炜",
							"mail": "tongsw@mail.ustc.edu.cn",
							"intro": "不爱打球的摄影师不是好的零号员工 (-.-)"
						},
						{
							"name": "黄威",
							"mail": "chinawolfman@hotmail.com",
							"intro": "208 腐烂开心果\n糊弄学大师"
						},
						{
							"name": "雷思琦",
							"mail": "leisiqi@mail.ustc.edu.cn",
							"intro": "海纳百川，有啥说啥"
						},
						{
							"name": "黄野",
							"mail": "huangyehy@mail.ustc.edu.cn",
							"intro": "铁血平台跳跃游戏爱好者"
						},
						{
							"name": "马一潇",
							"mail": "iiishawn@yahoo.com",
							"intro": "211唯一指定废物\n专业浪费纳税人的钱\ngood luck and fair sea"
						},
						{
							"name": "何理扬",
							"mail": "heliyang@mail.ustc.edu.cn",
							"intro": "中国科学技术大学研究生一年级\n感兴趣的方向是信息检索"
						},
						{
							"name": "吕瑞",
							"mail": "lvrui2018@mail.ustc.edu.cn",
							"intro": "中国科学技术大学 2018级本科\n计算机科学与技术专业"
						},
						{
							"name": "杨哲",
							"mail": "yz01@mail.ustc.edu.cn",
							"intro": "我爱CV"
						},
						{
							"name": "宁雨亭",
							"mail": "ningyt@mail.ustc.edu.cn",
							"intro": "睡觉大王\n拥有一只同样爱睡觉的小猫"
						},
						{
							"name": "张鑫",
							"mail": "438518244@qq.com",
							"intro": "略懂音乐，审美过关，经常面向ddl编程"
						},
						{
							"name": "洪玉婷",
							"mail": "1044653353@qq.com",
							"intro": "大闸蟹爱好者"
						},
						{
							"name": "覃龙虎",
							"mail": "longhuseven@163.com",
							"intro": "弗兰小伙一名\n爱运动，爱美食，爱代码。"
						},
						{
							"name": "曹智",
							"mail": "2667505886@qq.com",
							"intro": "exile in the coney island"
						},
						{
							"name": "单明晖",
							"mail": "767743659@qq.com",
							"intro": "不想画画的程序猿不是金牌厨师"
						},
						{
							"name": "姚方舟",
							"mail": "bfsudcs_fanzy@163.com",
							"intro": "never goona look back"
						},
						{
							"name": "林鑫",
							"mail": "linx@mail.ustc.edu.cn",
							"intro": "中国科学技术大学2019级研究生在读"
						},
						{
							"name": "韩东轩",
							"mail": "handongxuan@outlook.com",
							"intro": "中科大21级博士，间歇性踌躇满志，持续性混吃等死。"
						},
						{
							"name": "余阳",
							"mail": "yflyl613@mail.ustc.edu.cn",
							"intro": "中国科学技术大学2021级研究生\nShit happens everyday and life goes on."
						},
						{
							"name": "张裕人",
							"mail": "yr160698@mail.ustc.edu.cn",
							"intro": "A420窗户管理员，nice型选手"
						},
						{
							"name": "申一凯",
							"mail": "shenyikai@mail.ustc.edu.cn",
							"intro": "兴趣使然的前端画图工"
						},
						{
							"name": "黄炜喆",
							"mail": "871982879@qq.com",
							"intro": "USTC / CS /\n 程序猿 / 二次元 /\n JO厨巨厨 / 云吸猫"
						},
						{
							"name": "肖桐",
							"mail": "xt20020109@mail.ustc.edu.cn",
							"intro": "遇到困难睡大觉"
						},
						{
							"name": "林嘉滢",
							"mail": "crystall@mail.ustc.edu.cn",
							"intro": "什么都想去尝试的好奇鬼\n喜欢笑，喜欢大笑，喜欢捧腹大笑，只是不会微笑"
						}
						,{
							"name": "李佳桐",
							"mail": "satosasara@mail.ustc.edu.cn",
							"intro": "一条仍然怀有梦想的咸鱼，一个喜欢炼丹的厨师"
						}
						,{
							"name": "刘正韬",
							"mail": "ztl223@mail.ustc.edu.cn",
							"intro": "这个人懒爆了，什么都没有留下"
						}
						,{
							"name": "郭禹祥",
							"mail": "guoyx18@mail.ustc.edu.cn",
							"intro": "喜欢统计的大数据搬砖者"
						}
						,{
							"name": "李平治",
							"mail": "pingzhili@mail.ustc.edu.cn",
							"intro": "什么都想尝试的beginner"
						}, 
					],
					// 特邀工程师
					"invitedEngineer": [

					],
					// 实习生
					"trainee": [
						{
							"name": "汪先涛",
							"mail": "wangxiantao@mail.ustc.edu.cn",
							"intro": "男，程序员，二次元"
						}, {
							"name": "沈嘉徽",
							"mail": "shenjiahui@mail.ustc.edu.cn",
							"intro": "退堂鼓表演艺术家"
						}, {
							"name": "张子乾",
							"mail": "757427552@qq.com",
							"intro": "悉尼科技大学研究生\n信息技术-数字互动媒体专业"
						}, {
							"name": "窦紫微",
							"mail": "douziwei@mail.ustc.edu.cn",
							"intro": "斯人若彩虹，遇上方知有"
						}, {
							"name": "刘成龙",
							"mail": "sepcnt@mail.ustc.edu.cn",
							"intro": "尝试追赶大佬们的步伐"
						}, {
							"name": "王晓雅",
							"mail": "xya5058@mail.ustc.edu.cn",
							"intro": "中科大21级科传研究生\n拥有一只菜狗的菜狗"
						}, {
							"name": "袁雨",
							"mail": "yyhappier@mail.ustc.edu.cn",
							"intro": "豆豆龙战士"
						}, {
							"name": "张一锐",
							"mail": "zhangyirui@mail.ustc.edu.cn",
							"intro": "中科大20级本科生\n努力成为靠谱成年人🤔"
						}, {
							"name": "江鹏飞",
							"mail": "jpf123@mail.ustc.edu.cn",
							"intro": "中国科学技术大学本科生二年级\n因为个性，所以没签名"
						}, {
							"name": "李双志",
							"mail": "aiden_lsz@mail.ustc.edu.cn",
							"intro": "中国科学技术大学大三在读\n好好生活"
						},
					],
					// 技术顾问
					"techConsultant": [{
						"name": "阴钰",
						"mail": "yxonic@gmail.com",
						"intro": "实际上喜欢写作但从来不写"
					}, {
						"name": "高维博",
						"mail": "weibogao@mail.ustc.edu.cn",
						"intro": "Web在211养蝾螈。"
					}, {
						"name": "张征",
						"mail": "zhangzheng@mail.ustc.edu.cn",
						"intro": "减肥永远在路上；ddl重度依赖者"
					}],
					// 历任成员
					"historyMembers": [{
							"name": "杨青",
							"mail": "yq_hf@mail.ustc.edu.cn",
							"intro": "中国科学技术大学2018级硕士研究生"
						},
						{
							"name": "梁先锋",
							"mail": "liangxianfeng96@gmail.com",
							"intro": "（特任工程师）\n做一条安静的咸鱼"
						}, {
							"name": "韩浩宇",
							"mail": "hhy1212@mail.ustc.edu.cn",
							"intro": "（特任工程师）\n一个只想安安静静coding的工具人"
						}, {
							"name": "唐华楹",
							"mail": "iamthy@mail.ustc.edu.cn",
							"intro": "中国科学技术大学2021级研究生\n基于ddl的摸鱼科学与技术专业"
						}, {
							"name": "翟佳伦",
							"mail": "jlzhai@ustc.edu",
							"intro": "头铁"
						},{
							"name": "包美凯",
							"mail": "baomeikai@163.com",
							"intro": "^V^"
						},{
							"name": "金鑫",
							"mail": "kingx8128@gmail.com",
							"intro": "游戏天赋点满型选手"
						},{
							"name": "高海涵",
							"mail": "kd193104@mail.ustc.edu.cn",
							"intro": "中科大18级本科，现从事数据挖掘、机器学习和NLP方面的科研"
						},{
							"name": "王季璐",
							"mail": "wjl2001@mail.ustc.edu.cn",
							"intro": "中国科学技术大学18级金融本科生\n不断尝试的人生体验家"
						},{
							"name": "龚政",
							"mail": "gz70229@mail.ustc.edu.cn",
							"intro": "208三亚渔民"
						},{
							"name": "房松涛",
							"mail": "songtao@mail.ustc.edu.cn",
							"intro": "不怕山高路远，只怕中途偷懒"
						},{
							"name": "黄杰",
							"mail": "jiehuang@mail.ustc.edu.cn",
							"intro": "Work hard.\nBe strong.\nDon't complain."
						},{
							"name": "项子扬",
							"mail": "xiangzy@mail.ustc.edu.cn",
							"intro": "纯音乐爱好者\n愿世人都能睡到自然醒"
						},{
							"name": "黄小青",
							"mail": "xqhuang@mail.ustc.edu.cn",
							"intro": "中国科学技术大学博士生一年级"
						},{
							"name": "邬靖宇",
							"mail": "wujingyu@mail.ustc.edu.cn",
							"intro": "干啥啥不行，吃啥啥不剩，\n学啥啥不会，写啥啥bug。"
						},{
							"name": "胡子睿",
							"mail": "1300985820@qq.com",
							"intro": "人类高质量研究生\n喜欢听广东话的湖南人∩喜欢吃湖南菜的广东人"
						},{
							"name": "毛雪菲",
							"mail": "maoxuefeifinnie@gmail.com",
							"intro": "不知名小美工Finnie"
						},{
							"name": "王童",
							"mail": "twangg@umich.edu",
							"intro": "密西根大学MSI2023级研究生"
						},{
							"name": "靳浩然",
							"mail": "jhr584289035@mail.ustc.edu.cn",
							"intro": "希望能永远对生活怀揣激情和向往"
						},{
							"name": "韩子勤",
							"mail": "hanziqin@mail.ustc.edu.cn",
							"intro": "前端开发新人。\n减肥与反弹的波动过程中。"
						},
					],
					"img_path": {
						// 指导教师
						"陈恩红": "/members/陈恩红.jpg",
						"刘淇": "/members/刘淇.jpg",
						"黄振亚": "/members/黄振亚.jpeg",
						// 团队成员
						"何理扬": "/members/何理扬.jpg",
						"吕瑞": "/members/吕瑞.jpg",
						"宁雨亭": "/members/宁雨亭.jpg",
						"张鑫": "/members/张鑫.jpg",
						"曹智": "/members/曹智.jpg",
						"杨哲": "/members/杨哲.jpg",
						"洪玉婷": "/members/洪玉婷.jpg",
						"童世炜": "/members/童世炜.jpg",
						"覃龙虎": "/members/覃龙虎.jpg",
						"雷思琦": "/members/雷思琦.jpg",
						"马一潇": "/members/马一潇.jpg",
						"黄威": "/members/黄威.jpg",
						"黄野": "/members/黄野.jpg",
						"单明晖": "/members/单明晖.jpeg",
						"姚方舟": "/members/姚方舟.jpeg",
						"林鑫": "/members/林鑫.jpeg",
						"韩东轩": "/members/韩东轩.jpeg",
						"余阳": "/members/余阳.png",
						"张裕人": "/members/张裕人.jpeg",
						"申一凯": "/members/申一凯.jpg",
						"黄炜喆": "/members/黄炜喆.png",
						"肖桐": "/members/肖桐.png",
						"林嘉滢": "/members/林嘉滢.jpg",
						"李佳桐": "/members/李佳桐.jpg",
						"刘正韬": "/members/刘正韬.jpg",
						"郭禹祥": "/members/郭禹祥.jpg",
						"李平治": "/members/李平治.jpg",
						// 特邀工程师

						// 实习生
						"汪先涛": "/members/汪先涛.jpg",
						"沈嘉徽": "/members/沈嘉徽.jpg",
						"张子乾": "/members/张子乾.jpg",
						"窦紫微": "/members/窦紫微.jpg",
						"刘成龙": "/members/刘成龙.jpg",
						"王晓雅": "/members/王晓雅.jpg",
						"袁雨": "/members/袁雨.jpg",
						"张一锐": "/members/张一锐.jpg",
						"江鹏飞": "/members/江鹏飞.jpg",
						"李双志": "/members/李双志.png",

						// 技术顾问
						"阴钰": "/members/阴钰.jpg",
						"高维博": "/members/高维博.jpeg",
						"张征": "/members/张征.jpeg",
						// 历任成员
						"杨青": "/members/杨青.jpg",
						"梁先锋": "/members/梁先锋.jpeg",
						"韩浩宇": "/members/韩浩宇.jpeg",
						"唐华楹": "/members/唐华楹.jpeg",
						"翟佳伦": "/members/翟佳伦.jpg",
						"包美凯": "/members/包美凯.jpg",
						"金鑫": "/members/金鑫.jpg",
						"高海涵": "/members/高海涵.jpeg",
						"王季璐": "/members/王季璐.jpg",
						"龚政": "/members/龚政.jpg",
						"房松涛": "/members/房松涛.jpg",
						"黄杰": "/members/黄杰.jpg",		
						"项子扬": "/members/项子扬.jpg",
						"黄小青": "/members/黄小青.jpg",
						"邬靖宇": "/members/邬靖宇.jpg",
						"胡子睿": "/members/胡子睿.jpg",
						"毛雪菲": "/members/毛雪菲.jpg",
						"王童": "/members/王童.jpg",
						"靳浩然": "/members/靳浩然.jpg",
						"韩子勤": "/members/韩子勤.jpg",
					}
				}
			}
		},
		methods: {
			To_Top(){
				document.getElementById("Top_Nav").scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"})
			},
			Get_Student_Img(row, index) {
				var i = (row - 1) * 3 + index
				var student = this.member_data.students[i];
				if (this.member_data.img_path[student.name]) {
					return this.member_data.img_path[student.name];
				} else {
					return "/members/unknown.png"
				}
			},
			Get_InvitedEngineer_Img(row, index) {
				var i = (row - 1) * 3 + index
				var invitedEngineer = this.member_data.invitedEngineer[i];
				if (this.member_data.img_path[invitedEngineer.name]) {
					return this.member_data.img_path[invitedEngineer.name];
				} else {
					return "/members/unknown.png"
				}
			},
			Get_TechConsultant_Img(row, index) {
				var i = (row - 1) * 3 + index
				var techConsultant = this.member_data.techConsultant[i];
				if (this.member_data.img_path[techConsultant.name]) {
					return this.member_data.img_path[techConsultant.name];
				} else {
					return "/members/unknown.png"
				}
			},
			Get_HistoryMember_Img(row, index) {
				var i = (row - 1) * 3 + index
				var historyMember = this.member_data.historyMembers[i];
				if (this.member_data.img_path[historyMember.name]) {
					return this.member_data.img_path[historyMember.name];
				} else {
					return "/members/unknown.png"
				}
			},
			Get_Teacher_Img(row, index) {
				var i = (row - 1) * 3 + index
				var teacher = this.member_data.teachers[i];
				if (this.member_data.img_path[teacher.name]) {
					return this.member_data.img_path[teacher.name];
				} else {
					return "/members/unknown.png"
				}
			},
			Get_Trainee_Img(row, index) {
				var i = (row - 1) * 3 + index
				var trainee = this.member_data.trainee[i];
				if (this.member_data.img_path[trainee.name]) {
					return this.member_data.img_path[trainee.name];
				} else {
					return "/members/unknown.png"
				}
			},
		}
	}
</script>
<style lang="scss" scoped>
	.img_background_teacher {
		margin-top: 30px;
		background-repeat: no-repeat;
		background-position: center center;
		background-size: cover;
		width: 240px;
		height: 240px;
		object-fit: cover;
	}

	.img_background_student {
		background-repeat: no-repeat;
		background-position: center center;
		background-size: cover;
		width: 120px;
		height: 120px;
		object-fit: cover;
	}

	.Teacher_Card {
		padding: 2vh 2vw 5vh 2vw;
		height: 650px;
		margin-bottom: 50px;
		-webkit-box-shadow: 8px 10px 12px rgba(25, 25, 25, 0.1);
		box-shadow: 8px 10px 12px rgba(25, 25, 25, 0.1);
		border-radius: 40px;
		background: #F8FBFF;
	}

	.Student_Card {
		padding: 2vh 2vw 5vh 2vw;
		height: 360px;
		margin-bottom: 50px;
		-webkit-box-shadow: 8px 10px 12px rgba(25, 25, 25, 0.1);
		box-shadow: 8px 10px 12px rgba(25, 25, 25, 0.1);
		border-radius: 40px;
		background: #F8FBFF;
	}

	.el-divider--horizontal {
		display: block;
		height: 2px;
		width: 90vw;
		margin: 10px 5vw;
	}

	.Top_Nav{
    position: relative;
    top: -90px;
    width: 10px;
    height: 10px;
    background: transparent;
}
</style>
