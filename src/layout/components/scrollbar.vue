<!--
自适应滚动条 by 张鑫
使用时设置 html, body 等 overflow: hidden 设置滚动区域容器的 overflow: scroll或auto 并设置
-->
<template>
	<div id="scrollbar-container"
		:style="{'opacity': scrollHover||scrollMoving||scrollVisibleCounter < 2?'1':'0'}"
	>
		<span :style="{'height': (scrollTop+4) + 'px'}" :class="{'scrollbar-block': !scrollMoving&&!scrollMoving}" />
		<div id="scrollbar-thumb"
			:class="{'scrollbar-thumb-hover': scrollHover}"
			draggable="true" @dragstart="start($event)" @dragend="end($event)" @dragover="over($event)" @dragleave="leave($event)"
			@mousedown="down($event)" @mouseenter="scrollHover = true" @mouseleave="scrollHover = false"
		/>
		<span :style="{'height': (scrollSize+4)+'px'}" :class="{'scrollbar-block': !scrollMoving&&!scrollMoving}" />
	</div>
</template>

<script>
export default {
	name: 'scrollbar',
	components: {},
	props:{
		anchor: {type:String, default:'body'},
	},
	data() {
		return {
			scrollTop: 4,
			scrollSize: 4,
			scrollVisible: false,
			scrollVisibleCounter: 5,
			scrollMoving: false,
			startY: 0,
			pageTop: 0,
			scrollHover: false
		};
	},
	computed:{
	},
	beforeMount() {
	},
	mounted() {
		this.refreshSize()

		const scrollAnchor = document.getElementById(this.$props.anchor)
		scrollAnchor.addEventListener("scroll", ()=>{this.refreshSize();this.scrollVisibleCounter = 0}, true)

		setInterval(()=>{
			this.scrollVisibleCounter++
		}, 1000)

		document.addEventListener("mousemove", ()=>{this.$nextTick(() => {
			this.scrollVisible = true
			this.scrollVisibleCounter = 0
			this.refreshSize()
		})}, true)

		// 高度随anchor高度变化
		const bar = document.getElementById("scrollbar-container")
		bar.style.height = scrollAnchor.offsetHeight + 'px'
		addEventListener("resize",()=>{
			// const bar = document.getElementById("scrollbar-container")
			bar.style.height = scrollAnchor.offsetHeight + 'px'
		}, true)

		setTimeout(()=>{this.show = true}, 300)
	},
	methods: {
		start(e) {
			e.preventDefault()
			// console.log(e.offsetY, "start")
		},
		end(e) {
			e.preventDefault()
			// console.log(e.offsetY, "end")
		},
		over(e) {
			e.preventDefault()
			// console.log(e.offsetY, "over")
		},
		leave(e) {
			e.preventDefault()
			// console.log(e.offsetY, "leave")
		},
		dragStart(e) {
			console.log(e)
		},
		refreshSize() {
			const scrollAnchor = document.getElementById(this.$props.anchor)
			// console.log(scrollAnchor.scrollTop, scrollAnchor.scrollHeight)
			this.scrollTop = (scrollAnchor.scrollTop / scrollAnchor.scrollHeight) * scrollAnchor.clientHeight
			this.scrollSize = ((scrollAnchor.scrollHeight - scrollAnchor.scrollTop - scrollAnchor.clientHeight) / scrollAnchor.scrollHeight) * scrollAnchor.clientHeight
		},
		down(e) {
			//拖动事件
			this.scrollMoving = true
			this.startY = e.pageY // e.offsetY e.pageY e.screenY
			const scrollAnchor = document.getElementById(this.$props.anchor)
			this.pageTop = scrollAnchor.scrollTop

			let type = scrollAnchor.style.scrollSnapType
			let behavior = scrollAnchor.style.scrollBehavior
			scrollAnchor.style.scrollSnapType = 'none'
			scrollAnchor.style.scrollBehavior = 'auto'

			document.addEventListener("mousemove",(e)=>{this.scrollMove(e)}, true)
			document.addEventListener("mouseup",(e)=>{this.mouseup(e, type, behavior)}, true)

			// 修改anchor的滚动方式 避免scroll-snap影响
		},
		mouseup(e, type, behavior) {
			const scrollAnchor = document.getElementById(this.$props.anchor)
			scrollAnchor.style.scrollSnapType = type
			scrollAnchor.style.scrollBehavior = behavior
			this.$nextTick(()=>{
				this.scrollMoving=false
				document.removeEventListener("mousemove",(e)=>{this.scrollMove(e)}, true)
				document.removeEventListener("mousemoveup", (e)=>{this.mouseup(e, type, behavior)}, true)
			})
		},
		scrollMove(e) {
			this.scrollVisibleCounter = 0
			if(this.scrollMoving === false) return
			const scrollAnchor = document.getElementById(this.$props.anchor)
			scrollAnchor.scrollTop = this.pageTop + scrollAnchor.scrollHeight * (e.pageY - this.startY) / scrollAnchor.clientHeight
		},
		mouseleave(e) {
			console.log(e)
			this.scrollHover = true
		}
	}
};
</script>

<style scoped>
#scrollbar-container {
	transition: all 300ms ease;
	z-index: 110;
	width: 0;
	height: 100%;
	position: absolute;
	right: min(.2rem, 0.5vw);
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
}

#scrollbar-container:hover {
}

#scrollbar-thumb {
	z-index: 20;
	transition: 150ms ease;
	/*transition-delay: 25ms;*/
	transition-property: height, width;
	outline: none;
	background: rgba(94,94,94, .7);
	/*box-shadow: 0 0 1px rgba(224,224,224, .3);*/
	border: none;
	flex-grow: 1;
	border-radius: 100vw;
	width: min(.5rem, 1.5vw);
	margin-right: min(.75rem, 1.5vw);
}
#scrollbar-thumb:hover, .scrollbar-thumb-hover {
	width: min(.75rem, 1.75vw)
}

.scrollbar-block {
	transition: 50ms ease;
	transition-property: height, width;
}
</style>
