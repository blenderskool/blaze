import { route } from 'preact-router';
import { createLocalStorageDispatch, useLocalStorageSelector } from 'react-localstorage-hooks';
import NicknameInput from '../../../components/NicknameInput/NicknameInput';
import { toast } from '../../../components/Toast';
import AppLanding from '../layouts/AppLanding/AppLanding';

import './Settings.scoped.scss';

const saveSettings = createLocalStorageDispatch('blaze', (state, e) => {
  e.preventDefault();
  const formData = new FormData(e.target);

  return {
    ...state,
    user: {
      ...state.user,
      name: formData.get('nickname')
    }
  };
});

const clearAllData = createLocalStorageDispatch('blaze', () => undefined);

function Settings() {
  const nickname = useLocalStorageSelector('blaze', (state) => state?.user?.name ?? '');

  return (
    <AppLanding title="Settings">
      <div className="settings">
        <form
          onSubmit={(e) => {
            saveSettings(e);
            toast('Changes saved successfully');
          }}
        >
          <NicknameInput input={{ value: nickname }} />
          <div>
            <button type="submit" class="btn wide save">
              Save
            </button>
            <hr class="divider" />
            <div class="clear-all-data">
              <span>
                Clear local data
              </span>
              <button
                type="button"
                class="btn outlined clear-all small" 
                onClick={() => {
                  clearAllData();
                  toast('Local data cleared successfully');
                  // Redirect to rooms page
                  route('/app', true);
                }}
              >
                Clear all
              </button>
            </div>
            <p class="clear-all-data-help">
              Clearing local data removes all the data stored by Blaze on this device.
              You'll be taken to new user setup screen.
            </p>
          </div>
        </form>
      </div>
    </AppLanding>
  );
}

export default Settings;