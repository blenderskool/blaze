function QRCode(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" {...props}>
      <path d="M0 0h24v24H0z" stroke="none"/>
      <rect x="4" y="4" width="6" height="6" rx="1"/>
      <path d="M7 17v.01"/>
      <rect x="14" y="4" width="6" height="6" rx="1"/>
      <path d="M7 7v.01"/>
      <rect x="4" y="14" width="6" height="6" rx="1"/>
      <path d="M17 7v.01M14 14h3M20 14v.01M14 14v3M14 20h3M17 17h3M20 17v3"/>
    </svg>
  );
}

export default QRCode;
