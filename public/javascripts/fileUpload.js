// Getting all the variables defined in the ":root" element(s) of ALL CSS FILE(S)
const rootStyles = window.getComputedStyle(document.documentElement);
if (
	rootStyles.getPropertyValue('--book-cover-width-large') != null &&
	rootStyles.getPropertyValue('--book-cover-width-large') !== ''
) {
	// "--book-cover-width-large" variable is available. NO need to create an EventListener
	ready();
} else {
	// "--book-cover-width-large" variable is NOT available. Need to create an EventListener.
	// "main-css" is the ID of the CSS library "main.css" defined in "layout/layouts.ejs".
	// Create a "load" EvenListener for the element and call "ready()" function when loaded.
	document.getElementById('main-css').addEventListener('load', ready());
}

function ready() {
	// Getting WIDTH and ASPECT-RATIO values from "book.css" CSS file.
	const coverWidth = parseFloat(rootStyles.getPropertyValue('--book-cover-width-large'));
	const coverAspectRatio = 1 / parseFloat(rootStyles.getPropertyValue('--book-cover-aspect-ratio'));
	const coverHeight = coverWidth * coverAspectRatio;
	// console.log('coverWidth: ' + coverWidth);
	// console.log('coverAspectRatio: ' + coverAspectRatio);
	// console.log('coverHeight: ' + coverHeight);

	// Plugins can be registered with FilePond using the "registerPlugin" method.
	// Register the plugins "File Encode", "Image Preview" and "Image Resize"
	FilePond.registerPlugin(FilePondPluginFileEncode, FilePondPluginImagePreview, FilePondPluginImageResize);

	FilePond.setOptions({
		stylePanelAspectRatio: coverAspectRatio,
		imageResizeTargetWidth: coverWidth,
		imageResizeTargetHeight: coverHeight
	});

	// Turn all file input elements into ponds
	FilePond.parse(document.body);
}

// parse(context): Parses a given section of the DOM tree for elements with class ".filepond"
//                 and turns them into FilePond elements.
// registerPlugin(plugin): Registers a FilePond plugin(s) for later use.
// setOptions(options): Sets page level default options for all FilePond instances.
