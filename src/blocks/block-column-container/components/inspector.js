/* eslint-disable no-cond-assign */

/**
 * Internal dependencies
 */
import icons from "../../../../assets/c9-col-layout-icons";

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const { InspectorControls, MediaUpload, ColorPalette } = wp.editor;
const {
	PanelBody,
	RangeControl,
	ToggleControl,
	SelectControl,
	IconButton,
	Button,
	FocalPointPicker,
	BaseControl,
	ButtonGroup,
	Tooltip
} = wp.components;

/**
 * External Dependencies.
 */
import React from "react";
import map from "lodash/map";

/**
 * Create an Inspector Controls wrapper Component
 */
export default class Inspector extends Component {
	constructor() {
		super(...arguments);
		const {
			attributes: { containerPadding, containerMargin, bgCustomX, bgCustomY },
			setAttributes
		} = this.props;

		this.setAttributes = setAttributes;

		this.linkedPaddingRef = React.createRef();
		this.togglePaddingLinkage = this.togglePaddingLinkage.bind(this);
		this.linkedMarginRef = React.createRef();
		this.toggleMarginLinkage = this.toggleMarginLinkage.bind(this);

		this.state = {
			containerPadding: containerPadding,
			containerMargin: containerMargin,
			setAttributes: setAttributes,
			customX: "auto" != bgCustomX.size,
			customY: "auto" != bgCustomY.size,
			bgCustomX: bgCustomX,
			bgCustomY: bgCustomY
		};
	}

	componentDidUpdate() {
		const {
			attributes: { preview }
		} = this.props;

		this.preview = preview;
	}

	updateBgX = (position, value) => {
		let sizeObject = Object.assign({}, this.state.bgCustomX);

		sizeObject[position] = value;
		this.setState({ bgCustomX: sizeObject });
		this.setAttributes({ bgCustomX: sizeObject });
	};

	updateBgY = (position, value) => {
		let sizeObject = Object.assign({}, this.state.bgCustomY);

		sizeObject[position] = value;
		this.setState({ bgCustomY: sizeObject });
		this.setAttributes({ bgCustomY: sizeObject });
	};

	togglePaddingLinkage = () => {
		let {
			attributes: { containerPadding }
		} = this.props;

		containerPadding = Object.assign({}, containerPadding);
		containerPadding.linked = !containerPadding.linked;
		containerPadding.icon = containerPadding.linked
			? "admin-links"
			: "editor-unlink";
		this.setState({ containerPadding });
		this.setAttributes({ containerPadding });
	};

	setPaddingUnit = value => {
		const {
			attributes: { containerPadding }
		} = this.props;

		let spacingObject = Object.assign({}, containerPadding);
		spacingObject.unit = value;
		this.setState({ containerPadding: spacingObject });
		this.setAttributes({ containerPadding: spacingObject });
	};

	updatePadding = (position, value) => {
		if (this.state.containerPadding.linked) {
			let spacingObject = {
				linked: this.state.containerPadding.linked,
				unit: this.state.containerPadding.unit,
				top: value,
				bottom: value,
				left: value,
				right: value,
				icon: this.state.containerPadding.icon
			};
			this.setState({ containerPadding: spacingObject });
			this.setAttributes({ containerPadding: spacingObject });
		} else {
			let spacingObject = Object.assign({}, this.state.containerPadding);
			spacingObject[position] = value;
			this.setState({ containerPadding: spacingObject });
			this.setAttributes({ containerPadding: spacingObject });
		}
	};

	toggleMarginLinkage = () => {
		let {
			attributes: { containerMargin }
		} = this.props;

		containerMargin = Object.assign({}, containerMargin);
		containerMargin.linked = !containerMargin.linked;
		containerMargin.icon = containerMargin.linked
			? "admin-links"
			: "editor-unlink";
		this.setState({ containerMargin });
		this.setAttributes({ containerMargin });
	};

	setMarginUnit = value => {
		const {
			attributes: { containerMargin }
		} = this.props;

		let spacingObject = Object.assign({}, containerMargin);
		spacingObject.unit = value;
		this.setState({ containerMargin: spacingObject });
		this.setAttributes({ containerMargin: spacingObject });
	};

	updateMargin = (position, value) => {
		if (this.state.containerMargin.linked) {
			let spacingObject = {
				linked: this.state.containerMargin.linked,
				unit: this.state.containerMargin.unit,
				top: value,
				bottom: value,
				left: value,
				right: value,
				icon: this.state.containerMargin.icon
			};
			this.setState({ containerMargin: spacingObject });
			this.setAttributes({ containerMargin: spacingObject });
		} else {
			let spacingObject = Object.assign({}, this.state.containerMargin);
			spacingObject[position] = value;
			this.setState({ containerMargin: spacingObject });
			this.setAttributes({ containerMargin: spacingObject });
		}
	};

	updateID = value => {
		this.setState({ ID: value });
	};

	submitID = () => {
		// parse submitted item, check if valid id
		let checkURL = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|&v(?:i)?=))([^#&?]*).*/;
		let checkAlphaNumeric = /^[a-zA-Z0-9-_]+$/;
		let result;

		if ((result = this.state.ID.match(checkURL))) {
			this.setAttributes({ containerVideoID: result[1], cannotEmbed: false });
			this.setState({ ID: result[1] });
		} else if ((result = this.state.ID.match(checkAlphaNumeric))) {
			this.setAttributes({ containerVideoID: result[0], cannotEmbed: false });
			this.setState({ ID: result[0] });
		} else {
			if (this.preview && this.preview.i) {
				this.preview.destroy();
			}
			this.setAttributes({ cannotEmbed: true });
		}

		// check if player exists
		if (this.preview && this.preview.i) {
			this.preview.loadVideoById(this.state.ID);
		}
	};

	resetID = () => {
		this.setState({ ID: "" });
		if (this.preview && this.preview.i) {
			this.preview.destroy();
			this.setAttributes({
				containerVideoID: "",
				cannotEmbed: false,
				preview: this.preview
			});
		}
	};

	render() {
		const {
			attributes: {
				containerImgURL,
				containerImgID,
				bgImgSize,
				bgImgAttach,
				bgImgRepeat,
				overlayHue,
				overlayOpacity,
				blendMode,
				containerPadding,
				containerMargin,
				columns,
				minScreenHeight,
				focalPoint,
				columnsGap,
				columnMaxWidth,
				centerColumns,
				responsiveToggle
			},
			setAttributes
		} = this.props;

		let selectedRows = 1;

		if (columns) {
			selectedRows = parseInt(columns.toString().split("-"));
		}

		const cssUnits = [
			{ value: "px", label: __("Pixel (px)", "c9-blocks") },
			{ value: "%", label: __("Percent (%)", "c9-blocks") },
			{ value: "em", label: __("Em (em)", "c9-blocks") }
		];

		const paddingOptions = [
			{ value: "-1", label: __("None", "c9-blocks") },
			{ value: "0", label: __("Padding 0", "c9-blocks") },
			{ value: "1", label: __("Padding 1", "c9-blocks") },
			{ value: "2", label: __("Padding 2", "c9-blocks") },
			{ value: "3", label: __("Padding 3", "c9-blocks") },
			{ value: "4", label: __("Padding 4", "c9-blocks") },
			{ value: "5", label: __("Padding 5", "c9-blocks") },
			{ value: "auto", label: __("Auto", "c9-blocks") }
		];

		const marginOptions = [
			{ value: "-1", label: __("None", "c9-blocks") },
			{ value: "0", label: __("Margin 0", "c9-blocks") },
			{ value: "1", label: __("Margin 1", "c9-blocks") },
			{ value: "2", label: __("Margin 2", "c9-blocks") },
			{ value: "3", label: __("Margin 3", "c9-blocks") },
			{ value: "4", label: __("Margin 4", "c9-blocks") },
			{ value: "5", label: __("Margin 5", "c9-blocks") },
			{ value: "auto", label: __("Auto", "c9-blocks") }
		];

		const sizeTypes = [
			{ value: "cover", label: __("Cover", "c9-blocks") },
			{ value: "contain", label: __("Contain", "c9-blocks") },
			{ value: "", label: __("Custom", "c9-blocks") }
		];

		const repeatTypes = [
			{ value: "no-repeat", label: __("no-repeat", "c9-blocks") },
			{ value: "repeat", label: __("repeat", "c9-blocks") },
			{ value: "round", label: __("round", "c9-blocks") },
			{ value: "space", label: __("space", "c9-blocks") }
		];

		const onSelectImage = img => {
			setAttributes({
				containerImgURL: img.url
			});
		};

		const onRemoveImage = () => {
			setAttributes({
				containerImgURL: null,
				bgImgSize: "cover"
			});
		};

		return (
			<InspectorControls key="inspector">
				<BaseControl className="c9-container-base-control">
					<RangeControl
						className="c9-height-range-control"
						beforeIcon="arrow-left-alt2"
						afterIcon="arrow-right-alt2"
						label={__("Window Height (vh)", "c9-blocks")}
						value={minScreenHeight}
						onChange={minScreenHeight => setAttributes({ minScreenHeight })}
						min={0}
						max={100}
					/>
				</BaseControl>
				<PanelBody>
					<RangeControl
						label={__("Columns", "c9-blocks")}
						value={columns}
						onChange={nextColumns => {
							setAttributes({
								columns: nextColumns,
								layout: `c9-${nextColumns}-col-equal`
							});
						}}
						min={1}
						max={6}
						help={__(
							"Note: Changing the column count can cause loss of content.",
							"c9-blocks"
						)}
					/>

					<hr />

					{(2 == columns || 3 == columns || 4 == columns) && (
						<Fragment>
							<p>{__("Column Layout", "c9-blocks")}</p>
							<ButtonGroup aria-label={__("Column Layout", "c9-blocks")}>
								{map(columnLayouts[selectedRows], ({ name, key, icon }) => (
									<Tooltip text={name} key={key}>
										<Button
											key={key}
											className="c9-column-selector-button"
											isSmall
											onClick={() => {
												setAttributes({
													layout: key
												});
												this.setState({ selectLayout: false });
											}}
										>
											{icon}
										</Button>
									</Tooltip>
								))}
							</ButtonGroup>
							<p>
								<i>{__("Change the layout of your columns.", "c9-blocks")}</i>
							</p>
							<hr />
						</Fragment>
					)}
					<RangeControl
						label={__("Column Gap", "c9-blocks")}
						help={__("Adjust the spacing between columns.", "c9-blocks")}
						value={columnsGap}
						onChange={value => setAttributes({ columnsGap: value })}
						min={0}
						max={10}
						step={1}
					/>

					<hr />

					<RangeControl
						label={__("Column Inner Max Width (px)")}
						help={__(
							"Adjust the width of the content inside the container wrapper.",
							"c9-blocks"
						)}
						value={columnMaxWidth}
						onChange={value => setAttributes({ columnMaxWidth: value })}
						min={0}
						max={2000}
						step={1}
					/>

					{0 < columnMaxWidth && (
						<ToggleControl
							label={__("Center Columns In Container", "c9-blocks")}
							help={__(
								"Center the columns in the container when max-width is used.",
								"c9-blocks"
							)}
							checked={centerColumns}
							onChange={() =>
								setAttributes({
									centerColumns: !centerColumns
								})
							}
						/>
					)}

					<hr />

					<ToggleControl
						label={__("Responsive Columns", "c9-blocks")}
						help={__(
							"Columns will be adjusted to fit on tablets and mobile devices.",
							"c9-blocks"
						)}
						checked={responsiveToggle}
						onChange={() =>
							setAttributes({
								responsiveToggle: !responsiveToggle
							})
						}
					/>
				</PanelBody>
				<PanelBody
					title={__("Spacing Options", "c9-blocks")}
					initialOpen={false}
				>
					<h5 className="padding-label">Padding</h5>

					<p className="components-base-control__label">
						Configure between different levels of padding for each side.
					</p>

					<div className="padding-top-wrapper">
						<SelectControl
							options={paddingOptions}
							value={containerPadding.top}
							onChange={value => this.updatePadding("top", value)}
						/>
					</div>
					<div className="padding-sides-wrapper">
						<SelectControl
							options={paddingOptions}
							value={containerPadding.left}
							onChange={value => this.updatePadding("left", value)}
						/>
						<IconButton
							label={__("Linked Padding Toggle", "c9-blocks")}
							icon={this.state.containerPadding.icon}
							onClick={this.togglePaddingLinkage}
							ref={this.state.linkedPaddingRef}
						/>
						<SelectControl
							options={paddingOptions}
							value={containerPadding.right}
							onChange={value => this.updatePadding("right", value)}
						/>
					</div>
					<div className="padding-bottom-wrapper">
						<SelectControl
							options={paddingOptions}
							value={containerPadding.bottom}
							onChange={value => this.updatePadding("bottom", value)}
						/>
					</div>

					<hr />

					<h5 className="margin-label">Margins</h5>

					<p className="components-base-control__label">
						Configure between different levels of margin for top and bottom
						sides.
					</p>

					<div className="margin-top-wrapper">
						<SelectControl
							options={marginOptions}
							value={containerMargin.top}
							onChange={value => this.updateMargin("top", value)}
						/>
					</div>
					<div className="margin-sides-wrapper">
						<IconButton
							label={__("Linked Padding Toggle", "c9-blocks")}
							icon={this.state.containerMargin.icon}
							onClick={this.toggleMarginLinkage}
							ref={this.state.linkedMarginRef}
						/>
					</div>
					<div className="margin-bottom-wrapper">
						<SelectControl
							options={marginOptions}
							value={containerMargin.bottom}
							onChange={value => this.updateMargin("bottom", value)}
						/>
					</div>
				</PanelBody>
				<PanelBody
					title={__("Background Settings", "c9-blocks")}
					initialOpen={false}
				>
					<MediaUpload
						id="bg-image-select"
						label={__("Background Image", "c9-blocks")}
						onSelect={onSelectImage}
						type="image"
						value={containerImgID}
						render={({ open }) => (
							<div>
								<IconButton
									label={__("Edit image", "c9-blocks")}
									icon="format-image"
									onClick={open}
								>
									{__("Background Image", "c9-blocks")}
								</IconButton>

								{containerImgURL && !!containerImgURL.length && (
									<div>
										<IconButton
											label={__("Remove Image", "c9-blocks")}
											icon="dismiss"
											onClick={onRemoveImage}
										>
											{__("Remove", "c9-blocks")}
										</IconButton>

										<h5>Position</h5>
										<FocalPointPicker
											label={__("Focal Point Picker", "c9-blocks")}
											url={containerImgURL}
											value={focalPoint}
											onChange={value => setAttributes({ focalPoint: value })}
										/>
									</div>
								)}

								<h5>Color Overlay</h5>
								<span>Color Palette</span>
								<ColorPalette
									label={__("Overlay Color", "c9-blocks")}
									value={overlayHue}
									onChange={overlayHue => setAttributes({ overlayHue })}
								/>

								{overlayHue && !!overlayHue.length && (
									<RangeControl
										beforeIcon="arrow-left-alt2"
										afterIcon="arrow-right-alt2"
										label={__("Opacity", "c9-blocks")}
										value={overlayOpacity}
										onChange={overlayOpacity =>
											setAttributes({ overlayOpacity })
										}
										min={1}
										max={10}
									/>
								)}
								{overlayHue && (
									<SelectControl
										label={__("Blend Mode", "c9-blocks")}
										value={blendMode}
										options={[
											{ value: "overlay", label: __("Overlay", "c9-blocks") },
											{ value: "normal", label: __("Normal", "c9-blocks") },
											{
												value: "multiply",
												label: __("Multiply", "c9-blocks")
											},
											{ value: "screen", label: __("Screen", "c9-blocks") },
											{ value: "darken", label: __("Darken", "c9-blocks") },
											{ value: "lighten", label: __("Lighten", "c9-blocks") },
											{
												value: "color-dodge",
												label: __("Color Dodge", "c9-blocks")
											},
											{
												value: "color-burn",
												label: __("Color Burn", "c9-blocks")
											},
											{
												value: "hard-light",
												label: __("Hard Light", "c9-blocks")
											},
											{
												value: "soft-light",
												label: __("Soft Light", "c9-blocks")
											},
											{
												value: "difference",
												label: __("Difference", "c9-blocks")
											},
											{
												value: "exclusion",
												label: __("Exclusion", "c9-blocks")
											},
											{ value: "hue", label: __("Hue", "c9-blocks") },
											{
												value: "saturation",
												label: __("Saturation", "c9-blocks")
											},
											{ value: "color", label: __("Color", "c9-blocks") },
											{
												value: "luminosity",
												label: __("Luminosity", "c9-blocks")
											}
										]}
										onChange={blendMode => setAttributes({ blendMode })}
									/>
								)}

								<hr />

								{containerImgURL && !!containerImgURL.length && (
									<div>
										<h5>Attachment</h5>
										<ToggleControl
											label={__("Scroll | Fixed", "c9-blocks")}
											checked={bgImgAttach}
											onChange={bgImgAttach => setAttributes({ bgImgAttach })}
										/>

										<hr />

										<div>
											<h5>Size</h5>
											<SelectControl
												help={__(
													"Choose between cover, contain, or custom.",
													"c9-blocks"
												)}
												options={sizeTypes}
												value={bgImgSize}
												onChange={value => setAttributes({ bgImgSize: value })}
											/>
											{!bgImgSize && (
												<div>
													<h5>Horizontal</h5>
													<ToggleControl
														label={__("Auto | Manual", "c9-blocks")}
														checked={this.state.customX}
														onChange={value => {
															this.setState({ customX: value });

															if (value) {
																this.updateBgX("unit", "%");
																this.updateBgX("size", 100);
															} else {
																this.updateBgX("size", "auto");
															}
														}}
													/>
													{this.state.customX && (
														<div style={{ display: "flex" }}>
															<RangeControl
																value={this.state.bgCustomX.size}
																onChange={value =>
																	this.updateBgX("size", value)
																}
																className="bgSize"
																min={0}
																max={Number.MAX_SAFE_INTEGER}
															/>
															<SelectControl
																options={cssUnits}
																value={this.state.bgCustomX.unit}
																onChange={value =>
																	this.updateBgX("unit", value)
																}
																className="bgSize"
															/>
														</div>
													)}
													<h5>Vertical</h5>
													<ToggleControl
														label={__("Auto | Manual", "c9-blocks")}
														checked={this.state.customY}
														onChange={value => {
															this.setState({ customY: value });

															if (value) {
																this.updateBgY("unit", "%");
																this.updateBgY("size", 100);
															} else {
																this.updateBgY("size", "auto");
															}
														}}
													/>
													{this.state.customY && (
														<div style={{ display: "flex" }}>
															<RangeControl
																value={this.state.bgCustomY.size}
																onChange={value =>
																	this.updateBgY("size", value)
																}
																className="bgSize"
																min={0}
																max={Number.MAX_SAFE_INTEGER}
															/>
															<SelectControl
																options={cssUnits}
																value={this.state.bgCustomY.unit}
																onChange={value =>
																	this.updateBgY("unit", value)
																}
																className="bgSize"
															/>
														</div>
													)}
												</div>
											)}
											<hr />

											<h5>Repeat</h5>
											<SelectControl
												help={__(
													"Choose between no-repeat, repeat, round or space.",
													"c9-blocks"
												)}
												options={repeatTypes}
												value={bgImgRepeat}
												onChange={value =>
													setAttributes({ bgImgRepeat: value })
												}
											/>
										</div>
									</div>
								)}
							</div>
						)}
					/>
				</PanelBody>
			</InspectorControls>
		);
	}
}

const columnLayouts = {
	1: [
		{
			name: __("1 Column", "c9-blocks"),
			key: "c9-1-col-equal",
			col: 1,
			icon: icons.oneEqual
		}
	],
	2: [
		{
			name: __("2 Columns - 50/50", "c9-blocks"),
			key: "c9-2-col-equal",
			col: 2,
			icon: icons.twoEqual
		},
		{
			name: __("2 Columns - 75/25", "c9-blocks"),
			key: "c9-2-col-wideleft",
			col: 2,
			icon: icons.twoLeftWide
		},
		{
			name: __("2 Columns - 25/75", "c9-blocks"),
			key: "c9-2-col-wideright",
			col: 2,
			icon: icons.twoRightWide
		}
	],
	3: [
		{
			name: __("3 Columns - 33/33/33", "c9-blocks"),
			key: "c9-3-col-equal",
			col: 3,
			icon: icons.threeEqual
		},
		{
			name: __("3 Columns - 25/50/25", "c9-blocks"),
			key: "c9-3-col-widecenter",
			col: 3,
			icon: icons.threeWideCenter
		},
		{
			name: __("3 Columns - 50/25/25", "c9-blocks"),
			key: "c9-3-col-wideleft",
			col: 3,
			icon: icons.threeWideLeft
		},
		{
			name: __("3 Columns - 25/25/50", "c9-blocks"),
			key: "c9-3-col-wideright",
			col: 3,
			icon: icons.threeWideRight
		}
	],
	4: [
		{
			name: __("4 Columns - 25/25/25/25", "c9-blocks"),
			key: "c9-4-col-equal",
			col: 4,
			icon: icons.fourEqual
		},
		{
			name: __("4 Columns - 40/20/20/20", "c9-blocks"),
			key: "c9-4-col-wideleft",
			col: 4,
			icon: icons.fourLeft
		},
		{
			name: __("4 Columns - 20/20/20/40", "c9-blocks"),
			key: "c9-4-col-wideright",
			col: 4,
			icon: icons.fourRight
		}
	],
	5: [
		{
			name: __("5 Columns", "c9-blocks"),
			key: "c9-5-col-equal",
			col: 5,
			icon: icons.fiveEqual
		}
	],
	6: [
		{
			name: __("6 Columns", "c9-blocks"),
			key: "c9-6-col-equal",
			col: 6,
			icon: icons.sixEqual
		}
	]
};