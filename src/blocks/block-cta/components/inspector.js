/**
 * Inspector Controls
 */

// Setup the block
const { __ } = wp.i18n;
const { Component } = wp.element;

const { compose } = wp.compose;

// Import block components
const {
	InspectorControls,
	BlockDescription,
	withColors,
	ColorPalette,
	PanelColorSettings,
	MediaUpload
} = wp.editor;

// Import Inspector components
const {
	withFallbackStyles,
	Toolbar,
	Button,
	PanelBody,
	PanelRow,
	FormToggle,
	RangeControl,
	SelectControl,
	ToggleControl,
	IconButton,
	RadioControl
} = wp.components;

const { getComputedStyle } = window;

// Apply fallback styles
const applyFallbackStyles = withFallbackStyles((node, ownProps) => {
	const { buttonBackgroundColor, buttonTextColor } = ownProps;
	const buttonBackgroundColorValue =
		buttonBackgroundColor && buttonBackgroundColor.color;
	const buttonTextColorValue = buttonTextColor && buttonTextColor.color;
	const buttonTextNode =
		!buttonTextColorValue && node
			? node.querySelector('[contenteditable="true"]')
			: null;
	return {
		fallbackButtonBackgroundColor:
			buttonBackgroundColorValue || !node
				? undefined
				: getComputedStyle(node).backgroundColor,
		fallbackButtonTextColor:
			buttonTextColorValue || !buttonTextNode
				? undefined
				: getComputedStyle(buttonTextNode).color
	};
});

/**
 * Create an Inspector Controls wrapper Component
 */
class Inspector extends Component {
	constructor(props) {
		super(...arguments);
	}

	render() {
		// Setup the attributes
		const {
			buttonText,
			buttonUrl,
			buttonAlignment,
			buttonSize,
			buttonShape,
			buttonTarget,
			ctaTitle,
			ctaText,
			titleFontSize,
			ctaTextFontSize,
			ctaBackgroundColor,
			ctaTextColor,
			ctaLayout,
			dimRatio,
			imgURL,
			imgID,
			imgAlt
		} = this.props.attributes;

		const {
			setAttributes,
			fallbackButtonBackgroundColor,
			fallbackButtonTextColor,
			buttonTextColor,
			buttonBackgroundColor,
			setButtonTextColor,
			setButtonBackgroundColor
		} = this.props;

		// Button size values
		const buttonSizeOptions = [
			{ value: "ab-button-size-small", label: __("Small") },
			{ value: "ab-button-size-medium", label: __("Medium") },
			{ value: "ab-button-size-large", label: __("Large") },
			{ value: "ab-button-size-extralarge", label: __("Extra Large") }
		];

		// Button shape
		const buttonShapeOptions = [
			{ value: "round", label: __("Round") },
			{ value: "square", label: __("Square") },
			{ value: "outline", label: __("Outline") }
		];

		// Change the image
		const onSelectImage = img => {
			setAttributes({
				imgID: img.id,
				imgURL: img.url,
				imgAlt: img.alt
			});
		};

		// Clear the image
		const onRemoveImage = () => {
			setAttributes({
				imgID: null,
				imgURL: null,
				imgAlt: null
			});
		};

		// Update color values
		const onChangeBackgroundColor = value =>
			setAttributes({ ctaBackgroundColor: value });
		const onChangeTextColor = value => setAttributes({ ctaTextColor: value });
		const onChangeButtonColor = value =>
			setAttributes({ buttonBackgroundColor: value });
		const onChangeButtonTextColor = value =>
			setAttributes({ buttonTextColor: value });

		return (
			<InspectorControls key="inspector">
				<PanelColorSettings
					title={__("Text Color", "covertnine-blocks")}
					initialOpen={true}
					colorSettings={[
						{
							value: ctaTextColor,
							onChange: onChangeTextColor,
							label: __("Text Color", "covertnine-blocks")
						}
					]}
				/>
				<PanelColorSettings
					title={__("Button Color", "covertnine-blocks")}
					initialOpen={true}
					colorSettings={[
						{
							value: buttonBackgroundColor,
							onChange: onChangeButtonColor,
							label: __("Button Color", "covertnine-blocks")
						}
					]}
				/>

				<PanelColorSettings
					title={__("Button Text Color", "covertnine-blocks")}
					initialOpen={true}
					colorSettings={[
						{
							value: buttonTextColor.color,
							onChange: onChangeButtonTextColor,
							label: __("Button Text Color", "covertnine-blocks")
						}
					]}
				/>
				<PanelBody
					title={__("Layout", "covertnine-blocks")}
					initialOpen={false}
				>
					<RadioControl
						label={__("Content Width", "covertnine-blocks")}
						selected={ctaLayout}
						options={[
							{ label: "2/3", value: "two-thirds" },
							{ label: "3/4", value: "three-quarters" },
							{ label: "Full", value: "full" }
						]}
						onChange={ctaLayout => setAttributes({ ctaLayout })}
					/>
				</PanelBody>

				<PanelBody
					title={__("Background Options", "covertnine-blocks")}
					initialOpen={false}
				>
					<p>{__("Select a background image:", "covertnine-blocks")}</p>
					<MediaUpload
						onSelect={onSelectImage}
						type="image"
						value={imgID}
						render={({ open }) => (
							<div>
								<IconButton
									className="ab-cta-inspector-media"
									label={__("Edit image", "covertnine-blocks")}
									icon="format-image"
									onClick={open}
								>
									{__("Select Image", "covertnine-blocks")}
								</IconButton>

								{imgURL && !!imgURL.length && (
									<IconButton
										className="ab-cta-inspector-media"
										label={__("Remove Image", "covertnine-blocks")}
										icon="dismiss"
										onClick={onRemoveImage}
									>
										{__("Remove", "covertnine-blocks")}
									</IconButton>
								)}
							</div>
						)}
					/>

					{imgURL && !!imgURL.length && (
						<RangeControl
							label={__("Image Opacity", "covertnine-blocks")}
							value={dimRatio}
							onChange={value => this.props.setAttributes({ dimRatio: value })}
							min={0}
							max={100}
							step={10}
						/>
					)}

					<PanelColorSettings
						title={__("Background Color", "covertnine-blocks")}
						initialOpen={false}
						colorSettings={[
							{
								value: ctaBackgroundColor,
								onChange: onChangeBackgroundColor,
								label: __("Overlay Color", "covertnine-blocks")
							}
						]}
					/>
				</PanelBody>

				<PanelBody
					title={__("Button Options", "covertnine-blocks")}
					initialOpen={false}
				>
					<ToggleControl
						label={__("Open link in new window", "covertnine-blocks")}
						checked={buttonTarget}
						onChange={() =>
							this.props.setAttributes({ buttonTarget: !buttonTarget })
						}
					/>

					<SelectControl
						label={__("Button Size", "covertnine-blocks")}
						value={buttonSize}
						options={buttonSizeOptions.map(({ value, label }) => ({
							value: value,
							label: label
						}))}
						onChange={value => {
							this.props.setAttributes({ buttonSize: value });
						}}
					/>

					<SelectControl
						label={__("Button Shape", "covertnine-blocks")}
						value={buttonShape}
						options={buttonShapeOptions.map(({ value, label }) => ({
							value: value,
							label: label
						}))}
						onChange={value => {
							this.props.setAttributes({ buttonShape: value });
						}}
					/>
				</PanelBody>
			</InspectorControls>
		);
	}
}

export default compose([
	withColors("buttonBackgroundColor", { buttonTextColor: "color" }),
	applyFallbackStyles
])(Inspector);
