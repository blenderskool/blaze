import { h } from 'preact';
import { createLocalStorageDispatch } from 'react-localstorage-hooks';
import NicknameInput from '../../../components/NicknameInput/NicknameInput';
import network from '../../../assets/images/illustrations/network.svg';
import logo from '../../../assets/images/logo.svg';

import './NewUser.scoped.scss';

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
    <main className="app-container">
      <img src={logo} alt="Blaze" class="brand" />

      <img
        class="network-img"
        src={network}
        alt="Devices connected using Blaze"
      />

      <div class="register-info">
        <h1>Choose a nickname</h1>
        <p>
          Nicknames are used to identify different devices in a common file
          sharing room. A room must always have devices with unique nicknames.
        </p>
      </div>

      <form onSubmit={registerUser} class="register-form">
        <NicknameInput input={{ style: { marginBottom: 40 } }} />
        <button type="submit" class="btn wide">
          Continue
        </button>
      </form>
    </main>
  );
}

export default NewUser;
