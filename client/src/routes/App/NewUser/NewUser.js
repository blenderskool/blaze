import { h } from 'preact';
import { useState } from 'preact/hooks';
import Header from '../../Pages/components/Header/Header';
import Footer from '../../Pages/components/Footer/Footer';

function NewUser({ onRegister }) {
  const [username, setUsername] = useState('');

  const registerUser = () => {
    localStorage.setItem('blaze', JSON.stringify({
      user: {
        name: username
      },
      rooms: [],
    }));

    onRegister();
  };

  return (
    <main style={{ margin: 'auto' }}>
      <Header />
      <form class="new-user" onSubmit={registerUser}>
        <input
          type="text"
          placeholder="Nickname or blank for Anonymous"
          maxlength="10"
          aria-label="Enter a nickname"
          value={username}
          onChange={e => {
            let val = e.target.value
            if (!val) {
              e.target.value = 'Anon' + Math.floor(Math.random()*9999)
            } else {
              setUsername(val)
            }
          }}
          style={{ marginBottom: 40 }}
        />
        <button type="submit" class="wide">
          Continue
        </button>
      </form>
      <Footer />
    </main>
  );
}

export default NewUser;
