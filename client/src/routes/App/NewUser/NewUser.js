import { h } from 'preact';
import { useState } from 'preact/hooks';

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
      <form class="new-user" onSubmit={registerUser}>
        <input
          required
          type="text"
          placeholder="Cool nickname"
          maxlength="10"
          aria-label="Enter a nickname"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={{ marginBottom: 40 }}
        />
        <button type="submit" class="btn wide">
          Continue
        </button>
      </form>
    </main>
  );
}

export default NewUser;