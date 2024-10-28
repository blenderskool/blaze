// Adapted from https://github.com/sindresorhus/multi-download/blob/v4.0.0/index.js
// to take File as input https://developer.mozilla.org/en-US/docs/Web/API/File

/**
 * Creates a promise that resolves after the specified number of milliseconds
 */
const delay = milliseconds => new Promise(resolve => {
  setTimeout(resolve, milliseconds);
});

/**
 * Downloads a single file
 * @param file - An instance of the File type representing the file to download
 */
const download = async (file) => {
  const a = document.createElement('a');
  const url = URL.createObjectURL(file);
  a.download = file.name;
  a.href = url;
  a.style.display = 'none';
  document.body.append(a);
  a.click();
  await delay(100);  // for Chrome
  a.remove();
  URL.revokeObjectURL(url);
};

/**
 * Initiates multiple file downloads with a constant delay between each one
 * @param files - An array of instances of the File type representing the files to download
 */
export const multiDownload = async (files) => {
  if (!files) {
    throw new Error('`files` required');
  };

  for (const file of files) {
    download(file);
    await delay(1000);
  }
};
