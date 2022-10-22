import { h } from 'preact';
import { createLocalStorageDispatch } from 'react-localstorage-hooks';
import NicknameInput from '../../../components/NicknameInput/NicknameInput';

const registerUser = createLocalStorageDispatch('blaze', (state, e) => {
  e.preventDefault();
  const formData = new FormData(e.target);

  return {
    user: {
      name: formData.get('nickname'),
    },
    rooms: [],
  };
});

function NewUser() {
  return (
    <main className="app-container" style={{ justifyContent: 'center' }}>
      <form onSubmit={registerUser} style={{ margin: 'auto' }}>
        <NicknameInput input={{ style: { marginBottom: 40 } }} />
        <button type="submit" class="btn wide">
          Continue
        </button>
      </form>
    </main>
  );
}

export default NewUser;