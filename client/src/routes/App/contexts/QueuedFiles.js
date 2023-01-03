import { createContext } from 'preact';

const QueuedFiles = createContext({
  queuedFiles: [],
  setQueuedFiles: () => {},
});

function withQueuedFiles(Component) {
  const Wrapped = props => (
    <QueuedFiles.Consumer>
      {queued => <Component {...props} {...queued} />}
    </QueuedFiles.Consumer>
  );

  return Wrapped;
}

export {
  QueuedFiles,
  withQueuedFiles,
};
