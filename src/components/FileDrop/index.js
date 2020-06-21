import { h } from 'preact';
import { useState } from 'preact/hooks';

function FileDrop({ onFile, ...props }) {
  const [border, setBorder] = useState('none');

  const handleDrag = borderStyle => e => {
    e.preventDefault();
    setBorder(borderStyle);
  }

  const dropHandler = e => {
    e.preventDefault();

    const files = e.dataTransfer.files;
    setBorder('none');

    if (files != null) {
      onFile(files);
    }
  }

  return (
    <div
      class="dropzone"
      onDrop={dropHandler}
      onDragOver={handleDrag('solid')}
      onDragLeave={handleDrag('none')}
      style={{ border }}
      {...props}
    />
  );
}

export default FileDrop;