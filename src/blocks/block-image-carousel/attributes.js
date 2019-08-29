const attributes = {
	instanceId: {
		type: "number"
	},
	slides: {
		type: "number",
		default: 3
	},
	showControls: {
		type: "boolean",
		default: true
	},
	showIndicators: {
		type: "boolean",
		default: true
	},
	autoSlide: {
		type: "boolean",
		default: false
	},
	wrapAround: {
		type: "boolean",
		default: true
	},
	url: {
		type: "array",
		default: [null, null, null]
	},
	id: {
		type: "array",
		default: [null, null, null]
	},
	captionTitle: {
		type: "array",
		default: [null, null, null]
	},
	captionContent: {
		type: "array",
		default: [null, null, null]
	}
};

export default attributes;
