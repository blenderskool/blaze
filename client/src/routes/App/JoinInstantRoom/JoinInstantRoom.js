import { h } from 'preact';
import { route } from 'preact-router';
import { useEffect } from 'preact/hooks';

import Loading from '../../../components/Loading/Loading';
import useInstantRoom from '../../../hooks/useInstantRoom';

function JoinInstantRoom() {
  const [getInstantRoom] = useInstantRoom((room) => {
    route(`/app/t/${room}`, true);
  });

  useEffect(getInstantRoom, []);

  return <Loading fullScreen />;
}

export default JoinInstantRoom;
