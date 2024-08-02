// adapted from https://github.com/sindresorhus/multi-download/blob/v4.0.0/index.js
// to take File as input https://developer.mozilla.org/en-US/docs/Web/API/File
const delay = milliseconds => new Promise(resolve => {
  setTimeout(resolve, milliseconds);
});

const download = async (file) => {
  const a = document.createElement('a');
  const url = URL.createObjectURL(file);
  a.download = file.name;
  a.href = url;
  a.style.display = 'none';
  document.body.append(a);
  a.click();

  // Chrome requires the timeout
  await delay(100);
  a.remove();

  URL.revokeObjectURL(url);
};

const multiDownload = async (files) => {
  if (!files) {
    throw new Error('`files` required');
  }

  for (const [index, file] of files.entries()) {
    await delay(index * 1000); // eslint-disable-line no-await-in-loop
    download(file);
  }
}
