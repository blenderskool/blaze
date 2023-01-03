import { h } from 'preact';

import './Loading.scoped.scss';

function Loading({ fullScreen, children }) {

  return (
    <div class={`loading ${fullScreen ? 'full-screen' : ''}`}>
      <div class="loading-animation-wrapper">
        <svg class="lightning" width="119" height="169" viewBox="0 0 119 169" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10 85.8299L86 12L65 69.4989L109 71.5402L19.5 160L51.5 86.8506L10 85.8299Z"
            stroke="#3BE8B0"
            stroke-width="10"
            stroke-linejoin="round"
            stroke-linecap="round"
            stroke-dasharray="460"
            stroke-dashoffset="-460"
          />
        </svg>
        <svg width="119" height="169" viewBox="0 0 119 169" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle class="node" cx="86" cy="12" r="12" fill="#636979" />
          <circle cx="12" cy="83" r="12" fill="#3BE8B0" />
          <circle class="node" cx="22" cy="157" r="12" fill="#636979" />
          <circle class="node" cx="107" cy="71" r="12" fill="#636979" />
        </svg>
      </div>
      {
        fullScreen && (
          <div class="message">
            {children}
          </div>
        )
      }
    </div>
  );
}

Loading.defaultProps = {
  children: 'Preparing file transfer',
};

export default Loading;
