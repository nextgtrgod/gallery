<template>
<div class="resizable" :class="{ 'on-resize': onResize }" :style="style">
	<slot/>

	<button class="drag"/>

	<div class="resizers">
		<button
			v-for="name in resizers" :key="name"
			:class="name"
			@mousedown="e => start(e, name)"
		/>
	</div>
</div>
</template>


<script>
import { mapState } from 'vuex'

export default {
	name: 'Resizable',
	props: {
		pos: {
			type: Object,
		},
		size: {
			type: Object,
		},
	},
	data: () => ({
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		onResize: false,
		delta: {
			x: 0,
			y: 0,
		},
		resizers: [ 'top-left', 'top', 'top-right', 'right', 'bottom-right', 'bottom', 'bottom-left', 'left' ],
	}),
	methods: {
		start(e) {
			this.onResize = true

			this.x = e.pageX
			this.y = e.pageY

			let clientRect = this.$el.getBoundingClientRect()

			this.width = clientRect.width
			this.height = clientRect.height

			window.addEventListener('mousemove', this.resize)
			window.addEventListener('mouseup', this.stop)
		},
		resize(e) {
			this.delta.x = e.pageX - this.x
			this.delta.y = e.pageY - this.y

			this.$el.style.width = (this.width + this.delta.x + 'px')
			this.$el.style.height = (this.height + this.delta.y + 'px')
		},
		stop() {
			window.removeEventListener('mousemove', this.resize)
			window.removeEventListener('mouseup', this.stop)

			this.$el.style.width = (this.width + Math.round(this.delta.x / this.offset) * this.offset) + 'px'
			this.$el.style.height = (this.height + Math.round(this.delta.y / this.offset) * this.offset) + 'px'

			this.onResize = false
		},
	},
	computed: {
		...mapState({
			grid: state => state.grid,
		}),

		offset() {
			return this.grid.cell + this.grid.gap
		},

		style() {
			return {
				gridArea: `${this.pos.y} / ${this.pos.x} / ${this.pos.y + this.size.y} / ${this.pos.x + this.size.x}`
			}
		},
	},
}
</script>


<style lang="scss" scoped>

.resizable {
	position: relative;
	user-select: none;

	&:hover,
	&.on-resize {
		.resizers {
			opacity: 1;
			pointer-events: all;
		}
	}

	&.on-resize {
		::v-deep img.original {
			opacity: .25;
		}
	}
}

img {
	position: relative;
	width: 100%;
	height: 100%;
	z-index: 1;

	&:nth-child(1) {
		grid-area: 3 / 4 / 15 / 17;
	}
}

button.drag {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	margin: auto;
	width: 95%;
	height: 95%;
	cursor: move;
	z-index: 2;
}

.resizers {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	color: #4286F4;
	border: 3px solid;
	opacity: 0;
	transition: opacity .2s;
	pointer-events: none;
	z-index: 1;

	button {
		position: absolute;
		width: 20px;
		height: 20px;
		margin: auto;
		border-radius: 50%;
		background-color: #FFF;
		border: 3px solid;
		box-sizing: border-box;
	}
}

button {
	&.top-left {
		top: 0;
		left: 0;
		transform: translate(-50%, -50%);
		cursor: nwse-resize; 
	}

	&.top {
		top: 0;
		left: 0;
		right: 0;
		transform: translateY(-50%);
		cursor: ns-resize;
	}

	&.top-right {
		top: 0;
		right: 0;
		transform: translate(50%, -50%);
		cursor: nesw-resize; 
	}

	&.right {
		top: 0;
		right: 0;
		bottom: 0;
		transform: translateX(50%);
		cursor: ew-resize;
	}

	&.bottom-right {
		right: 0;
		bottom: 0;
		transform: translate(50%, 50%);
		cursor: nwse-resize; 
	}

	&.bottom {
		left: 0;
		right: 0;
		bottom: 0;
		transform: translateY(50%);
		cursor: ns-resize; 
	}

	&.bottom-left {
		left: 0;
		bottom: 0;
		transform: translate(-50%, 50%);
		cursor: nesw-resize; 
	}

	&.left {
		top: 0;
		left: 0;
		bottom: 0;
		transform: translateX(-50%);
		cursor: ew-resize; 
	}
}

</style>