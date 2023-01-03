import { h } from 'preact';
import './NicknameInput.scoped.scss';

function NicknameInput({ input }) {
  return (
    <label>
      <span>Nickname</span>
      <input
        required
        type="text"
        name="nickname"
        maxlength="10"
        aria-label="Enter a nickname"
        placeholder="Cool nickname..."
        {...input}
      />
    </label>
  );
}

export default NicknameInput;