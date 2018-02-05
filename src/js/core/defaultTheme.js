
const defaultTheme = {
	background: 0x000000,
	hud: {
		text: 0xff0000,
		progress: 0x00ff00,
		bezel: 0x888888,
		widgetSize: 20,
		scale: {
			bar1: 0xffffff,
			bar2: 0xff0000,
		},
		compass: {
			top1: 0xb03a14,
			top2: 0x1ab4e5,
			bottom1: 0x581d0a,
			bottom2: 0x0c536a
		},
		ahi: {
			sky: 0x106f8d,
			earth: 0x802100,
			bar: 0xffff00,
			marks: 0xffffff
		},
	},
	box: {
		bounding: 0xffffff,
		select: 0x0000ff,
		highlight: 0xff0000
	},
	shading: {
		single: 0xffffff
	},
	popup: {
		text: 0xffffff,
		border: 0xffffff,
		background: 0x222222
	}
};

export { defaultTheme };