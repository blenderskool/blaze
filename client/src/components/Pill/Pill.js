import { h } from 'preact';
import './Pill.scss';

function Pill(props) {
  return (
    <span class="pill" {...props} />
  );
}

export default Pill;