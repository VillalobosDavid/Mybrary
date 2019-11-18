// Plugins can be registered with FilePond using the registerPlugin method.
// Register the plugins "File Encode", "Image Preview" and "Image Resize"
FilePond.registerPlugin(FilePondPluginFileEncode, FilePondPluginImagePreview, FilePondPluginImageResize);

FilePond.setOptions({
	stylePanelAspectRatio   : 150 / 100,
	imageResizeTargetWidth  : 100,
	imageResizeTargetHeight : 150
});

// Turn all file input elements into ponds
FilePond.parse(document.body);
