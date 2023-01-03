import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';

import './FileDrop.scoped.scss';

function FileDrop({ onFile, ...props }) {
  const [border, setBorder] = useState('none');

  const handleDrag = borderStyle => e => {
    e.preventDefault();
    setBorder(borderStyle);
  };

  useEffect(() => {
    const onDragOver = handleDrag('solid');
    const onDragLeave = handleDrag('none');
    const dropHandler = e => {
      e.preventDefault();

      const files = e.dataTransfer.files;
      setBorder('none');

      if (files != null) {
        onFile(files);
      }
    }

    window.addEventListener('dragover', onDragOver);
    window.addEventListener('dragleave', onDragLeave);
    window.addEventListener('drop', dropHandler);

    return () => {
      window.removeEventListener('dragover', onDragOver);
      window.removeEventListener('dragleave', onDragLeave);
      window.removeEventListener('drop', dropHandler);
    };
  });

  return (
    <div class="dropzone" style={{ border }} {...props} />
  );
}

export default FileDrop;