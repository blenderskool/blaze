importScripts('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.min.js');

/**
 * Compresses files to zip format
 * @param {FileList} files List of files to be compressed
 */
function zipFiles(files) {
  if (!files || !files.length) return;

  const zip = new JSZip();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    /**
     * Certain operating systems don't have file extension in the name of the file,
     * hence it is added here to the name so that it works correctly on other systems
     */
    const ext = '.'+file.type.split('/')[1];
    const name = file.name.endsWith(ext) ? file.name : file.name + ext;

    zip.file(name, file);
  }

  return zip.generateAsync({
    type: 'arraybuffer',
    compression: 'DEFLATE',
    compressionOptions: {
      level: 5
    }
  });
}

addEventListener('message', evt => {

  zipFiles(evt.data)
  .then(zipfile => {
    postMessage(zipfile);
  });

});