const rootStyles = window.getComputedStyle(document.documentElement);
if (
	rootStyles.getPropertyValue('--book-cover-width-large') != null &&
	rootStyles.getPropertyValue('--book-cover-width-large') !== ''
) {
	ready();
} else {
	// "main-css" is the ID of the Main CSS library, when its loaded call "ready()" function
	document.getElementById('main-css').addEventListener('load', ready());
}

function ready() {
	// Getting WIDTH and ASPECT-RATIO values from CSS
	const coverWidth = parseFloat(rootStyles.getPropertyValue('--book-cover-width-large'));
	const coverAspectRatio = parseFloat(rootStyles.getPropertyValue('--book-cover-aspect-ratio'));
	const coverHeight = coverWidth / coverAspectRatio;
	console.log('coverWidth: ' + coverWidth);
	console.log('coverAspectRatio: ' + coverAspectRatio);
	console.log('coverHeight: ' + coverHeight);

	// Plugins can be registered with FilePond using the registerPlugin method.
	// Register the plugins "File Encode", "Image Preview" and "Image Resize"
	FilePond.registerPlugin(FilePondPluginFileEncode, FilePondPluginImagePreview, FilePondPluginImageResize);

	FilePond.setOptions({
		stylePanelAspectRatio   : 1 / coverAspectRatio,
		imageResizeTargetWidth  : coverWidth,
		imageResizeTargetHeight : coverHeight
	});

	// Turn all file input elements into ponds
	FilePond.parse(document.body);
}
