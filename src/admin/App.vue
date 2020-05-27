<template>
<main id="app">
	<div class="grid" :class="{ visible: showGrid }"/>

	<resizable v-for="image in images" :key="image.id" :id="image.id">
		<preview v-bind="image"/>
	</resizable>

	<ul class="controls">
		<ui-switch v-model="showGrid"/>
	</ul>

</main>
</template>


<script>
import { mapState } from 'vuex'
import Resizable from '@/admin/components/Resizable'
import Preview from '@/admin/components/Preview'
import uiSwitch from '@/admin/components/Switch'

// import html2canvas from 'html2canvas'

export default {
	name: 'App',
	components: {
		Resizable,
		Preview,
		uiSwitch,
	},
	data: () => ({
		showGrid: true,
	}),
	created() {
		let root = document.documentElement

		root.style.setProperty('--cell', this.grid.cell + 'px')
		root.style.setProperty('--gap', this.grid.gap + 'px')
	},
	mounted() {
		// html2canvas(document.body).then(function(canvas) {
		// 	document.body.appendChild(canvas)
		// })
	},
	computed: {
		...mapState({
			grid: state => state.grid,
			images: state => state.images,
		}),
	}
}
</script>


<style lang="scss">
@import './styles/reset.css';
// @import './styles/fonts.css';
@import './styles/animations.css';

body {
	// font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji;
}

:root {
	--color-text-rgb: 255, 255, 255;
}

#app {
	position: relative;
	height: 100vh;
	width: 200vw;
	display: grid;
	grid-template-columns: repeat(auto-fill, var(--cell));
	grid-template-rows: repeat(auto-fill, var(--cell));
	grid-gap: var(--gap);
	// min-height: -webkit-fill-available;
}

.grid {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;

	--gap-color: rgba(255, 205, 1, 1);

	background:
		linear-gradient(to bottom, rgba(var(--color-text-rgb), .25) 1px, transparent 1px),
		linear-gradient(to right,  rgba(var(--color-text-rgb), .25) 1px, transparent 1px),

		linear-gradient(to bottom, var(--color-text) 1px, transparent 1px),
		linear-gradient(to bottom, var(--color-text) 1px, transparent 1px),

		linear-gradient(to right,  var(--color-text) 1px, transparent 1px),
		linear-gradient(to right,  var(--color-text) 1px, transparent 1px);

		// linear-gradient(to bottom, transparent var(--cell), var(--gap-color) var(--gap)),
		// linear-gradient(to right, transparent var(--cell), var(--gap-color) var(--gap));

	--width: calc(var(--cell) + var(--gap));
	--inner-cell: calc(var(--cell) / 10);

	background-size:
		var(--inner-cell) var(--inner-cell),
		var(--inner-cell) var(--inner-cell),

		var(--width) var(--width),
		var(--width) var(--width),

		var(--width) var(--width),
		var(--width) var(--width),

		100% var(--width),
		var(--width) 100%;

	background-position:
		0 0,
		0 0,

		0 0,
		0 calc(-1 * var(--gap)),

		0 0,
		calc(-1 * var(--gap)) 0,

		0 0,
		0 0;

	pointer-events: none;
	opacity: 0;
	transition: opacity .3s;

	&.visible {
		opacity: .5;
	}
}

.controls {
	position: fixed;
	right: 20px;
	bottom: 20px;
	font-size: 32px;

	li {
		display: flex;
		align-items: center;
		justify-items: flex-end;
	}
}

canvas {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
}

</style>