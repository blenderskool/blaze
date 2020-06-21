import { h } from 'preact';
import { useState } from 'preact/hooks';
import { route } from 'preact-router';

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
    <main>
      
      <form class="new-user" onSubmit={registerUser}>
        <input
          required
          type="text"
          placeholder="Cool nickname"
          maxlength="10"
          aria-label="Enter a nickname"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <button type="submit" class="wide">
          Continue
        </button>
      </form>
    </main>
  );
}

export default NewUser;