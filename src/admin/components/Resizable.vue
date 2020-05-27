<template>
<div class="resizable" :class="{ resizing, dragging }" :style="style">
	<slot/>

	<div class="controls">
		<button
			v-for="(options, name) in directions" :key="name"
			:class="name"
			:style="{ cursor: options.cursor }"
			@mousedown="e => onDown(e, { name, ...options })"
		/>
	</div>
</div>
</template>


<script>
import { mapState } from 'vuex'
import clamp from '@/admin/utils/clamp'

let directions = {
	'right': 		{ t: 0, l: 0, w: 1, h: 1, x: 1, y: 0, cursor: 'ew-resize' },
	'bottom': 		{ t: 0, l: 0, w: 1, h: 1, x: 0, y: 1, cursor: 'ns-resize' },
	'bottom-right': { t: 0, l: 0, w: 1, h: 1, x: 1, y: 1, cursor: 'nwse-resize' },

	'top-left':		{ t: 1, l: 1, w: -1, h: -1, x: 1, y: 1, cursor: 'nwse-resize' },
	'top':			{ t: 1, l: 1, w: -1, h: -1, x: 0, y: 1, cursor: 'ns-resize' },
	'left':			{ t: 1, l: 1, w: -1, h: -1, x: 1, y: 0, cursor: 'ew-resize' },
	
	'bottom-left':	{ t: 0, l: 1, w: -1, h: 1, x: 1, y: 1, cursor: 'nesw-resize' },
	'top-right':	{ t: 1, l: 0, w: 1, h: -1, x: 1, y: 1, cursor: 'nesw-resize' },

	'drag':			{ t: 1, l: 1, w: 0, h: 0, x: 1, y: 1, cursor: 'move' },
}

export default {
	name: 'Resizable',
	props: {
		id: {
			type: String,
			required: true,
		},
	},
	data: () => ({
		directions,
		resizing: false,
		dragging: false,
	}),
	methods: {
		onDown({ pageX, pageY }, direction) {

			this.direction = direction

			if (this.direction.name === 'drag') this.dragging = true
			else this.resizing = true

			document.body.style.cursor = this.direction.cursor

			let clientRect = this.$el.getBoundingClientRect()

			this.initial = {
				top: clientRect.top,
				left: clientRect.left,
				width: clientRect.width,
				height: clientRect.height,
				mouse: {
					x: pageX,
					y: pageY,
				},
			}

			this.delta = { x: 0, y: 0 }

			window.addEventListener('mousemove', this.onMove)
			window.addEventListener('mouseup', this.onUp)
		},

		onMove({ pageX, pageY }) {
			let { x, y, t, l, w, h } = this.direction

			this.delta.x = (pageX - this.initial.mouse.x) * x
			this.delta.y = (pageY - this.initial.mouse.y) * y

			this.left = clamp(0, this.initial.left + l * this.delta.x)
			this.top = clamp(0, this.initial.top + t * this.delta.y)

			this.width = clamp(this.grid.cell, this.initial.width + w * this.delta.x)
			this.height = clamp(this.grid.cell, this.initial.height + h * this.delta.y)

			this.updateStyle({
				left: this.left + 'px',
				top: this.top + 'px',
				width: this.width + 'px',
				height: this.height + 'px',
			})
		},

		onUp() {
			window.removeEventListener('mousemove', this.onMove)
			window.removeEventListener('mouseup', this.onUp)

			document.body.style.cursor = null

			let size = {
				x: Math.round(this.width / this.offset),
				y: Math.round(this.height / this.offset),
			}

			let pos = {
				x: Math.round(this.left / this.offset + 1),
				y: Math.round(this.top / this.offset + 1),
			}

			this.$store.commit('update', { id: this.id, size, pos })

			this.updateStyle(this.style)

			this.dragging = false
			this.resizing = false
		},

		updateStyle(style) {
			for (let prop in style)
				this.$el.style[prop] = style[prop]
		},
	},
	computed: {
		...mapState({
			grid: state => state.grid,
			image(state) {
				return state.images.find(image => image.id === this.id)
			},
		}),

		size() {
			return this.image.size
		},

		pos() {
			return this.image.pos
		},

		offset() {
			return this.grid.cell + this.grid.gap
		},

		style() {
			return {
				left: 	(this.pos.x - 1) * this.offset + 'px',
				top: 	(this.pos.y - 1) * this.offset + 'px',
				width: 	this.size.x * this.offset - this.grid.gap + 'px',
				height: this.size.y * this.offset - this.grid.gap + 'px',
			}
		},
	},
}
</script>


<style lang="scss" scoped>

.resizable {
	position: absolute;
	user-select: none;

	&:hover,
	&.resizing {
		.controls {
			opacity: 1;
			pointer-events: all;
		}
	}

	&.resizing {
		::v-deep img.original {
			opacity: .25;
		}
	}

	&.dragging {
		.controls {
			opacity: 0;
		}
	}
}

.controls {
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

		&:after {
			content: '';
			display: block;
			width: 100%;
			height: 100%;
			border-radius: 50%;
			background-color: #FFF;
			border: 3px solid;
			box-sizing: border-box;
		}
	}
}

button {
	&.drag {
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		width: 95%;
		height: 95%;

		&:after {
			display: none;
		}
	}

	&.top-left {
		top: 0;
		left: 0;
		transform: translate(-50%, -50%);
	}

	&.top {
		top: 0;
		left: 0;
		right: 0;
		transform: translateY(-50%);
	}

	&.top-right {
		top: 0;
		right: 0;
		transform: translate(50%, -50%);
	}

	&.right {
		top: 0;
		right: 0;
		bottom: 0;
		transform: translateX(50%);
	}

	&.bottom-right {
		right: 0;
		bottom: 0;
		transform: translate(50%, 50%);
	}

	&.bottom {
		left: 0;
		right: 0;
		bottom: 0;
		transform: translateY(50%);
	}

	&.bottom-left {
		left: 0;
		bottom: 0;
		transform: translate(-50%, 50%);
	}

	&.left {
		top: 0;
		left: 0;
		bottom: 0;
		transform: translateX(-50%);
	}
}

</style>