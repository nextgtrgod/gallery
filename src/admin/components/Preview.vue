<template>
<div class="preview" :style="style">
	<img :src="src.jpeg" class="original" :class="orientation">
	<img
		class="view"
		:src="src.jpeg"
		:alt="name"
		:class="{ loaded }"
	>
</div>
</template>


<script>
export default {
	name: 'Preview',
	props: {
		src: {
			type: Object,
		},
		name: {
			type: String,
		},
		color: {
			type: String,
		},
	},
	data: () => ({
		loaded: false,
		aspect: {
			node: 1,
			original: 1,
		},
	}),
	created() {
		this.preload()
	},
	methods: {
		preload() {
			let img = new Image()
			img.src = this.src.jpeg

			img.onload = () => {

				this.loaded = true
				this.aspect.original = img.naturalWidth / img.naturalHeight

				this.init()
			}
		},
		init() {
			let observer = new ResizeObserver(entries => {

				let { width, height } = entries[0].contentRect

				this.aspect.node = width / height
			})

			observer.observe(this.$el)
		},
	},
	computed: {
		style() {
			return {
				backgroundColor: this.color || '#000',
			}
		},

		orientation() {
			return this.aspect.node > this.aspect.original
				? 'vertical'
				: 'horizontal'
		},
	},
}
</script>


<style lang="scss" scoped>

.preview {
	width: 100%;
	height: 100%;
	box-shadow: 0 0 16px #000;
}

img.view {
	position: relative;
	width: 100%;
	height: 100%;
	object-fit: cover;
	image-rendering: pixelated;
	opacity: 0;
	transition: opacity .3s;

	&.loaded {
		opacity: 1;
	}
}

img.original {
	position: absolute;
	opacity: 0;
	transition: opacity .2s;

	&.horizontal {
		top: 0;
		left: 50%;
		height: 100%;
		transform: translateX(-50%);
	}

	&.vertical {
		top: 50%;
		left: 0;
		width: 100%;
		transform: translateY(-50%);
	}
}

</style>