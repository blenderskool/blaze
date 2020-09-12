import { h } from 'preact';
import { Share2, Zap } from 'preact-feather';
import joinRoom from '../../../assets/images/working/join-room.png';
import sendFile from '../../../assets/images/working/send-file.png';
import install from '../../../assets/images/working/install.png';
import chrome from '../../../assets/images/browser-icons/chrome.svg';
import firefox from '../../../assets/images/browser-icons/firefox.svg';
import edge from '../../../assets/images/browser-icons/edge.svg';
import safari from '../../../assets/images/browser-icons/safari.svg';

import './Working.scss';

const Working = () => (
  <main class="how-it-works">
    <section class="hero">
      <div>
        <h1 class="title">How Blaze works</h1>
        <h2 class="subtitle">Designed to work on any device, anywhere!</h2>
      </div>
    </section>

    <div class="body-wrapper">
      <section class="step">
        <div class="info">
          <h2>Start by joining a room</h2>
          <p>
            A room is a collection of users among which you want to send/receive files.
            Rooms in Blaze can be thought of as group chats in messaging apps. Each user in a room
            must have a unique name for them to correctly join the room.
          </p>
          <p>
            All your previously joined rooms show up in
            <a href="/app/"> Recent Rooms </a>
            page for quick access in the future.
            These rooms itself are not persisted on any database and are immediately destroyed once all the users of that room leave.
          </p>
        </div>
        <img src={joinRoom} alt="Joining a room in Blaze" />
      </section>

      <section class="step">
        <img src={sendFile} alt="Sending files in Blaze" loading="lazy" />
        <div class="info">
          <h2>
            Send a file!
            <Zap size={28} style="margin: 0 0 8px 4px" />
          </h2>
          <p>
            Sending a file is easy in Blaze. Just click on the 'Send File' button at the bottom right and choose the files that you
            want to send. Once the files are selected, they would be shared with all the other users in that room.
          </p>
          <p>
            Blaze uses
            <a href="http://webtorrent.io/" target="_blank" rel="noreferrer"> WebTorrent </a>
            or WebSockets for sharing files depending on the WebRTC support of the browsers being used.
            <a href="https://webrtc.org/" target="_blank" rel="noreferrer"> WebRTC </a>
            is the proctol that makes it possible for the peer-to-peer connection for file transfer.
          </p>
          <p>
            Do note that if the sender of a file leaves the room and the file isn't transferred to any user yet, the file transfer
            would get cancelled resulting in no-one receiving the file. This is because your files are not stored on any server and are
            transferred in real-time when you are online.
          </p>
        </div>
      </section>

      <section class="step">
        <div class="info">
          <h2>Next steps</h2>
          <p>
            If you enjoyed using Blaze, you can add Blaze to your home screen! Doing this
            not only makes Blaze easy to access but also allows it shows up in the share tray when you are sharing something from other apps
            using <Share2 size={20} /> button.
          </p>
          <p>
            Since Blaze is an open-source project, I would love to hear your thoughts and how Blaze can be improved. If you find this project
            useful, consider giving
            <a href="https://github.com/blenderskool/blaze" target="_blank" rel="noreferrer"> Blaze a star on GitHub!</a>
          </p>
          <p>
            Blaze has been tested on:
            <ul class="browsers">
              <li>
                <img src={chrome} />
                <span>Google Chrome</span>
              </li>
              <li>
                <img src={edge} />
                <span>Microsoft Edge</span>
              </li>
              <li>
                <img src={firefox} />
                <span>Firefox Browser</span>
              </li>
              <li>
                <img src={safari} />
                <span>Safari</span>
              </li>
            </ul>
          </p>
        </div>
        <img src={install} alt="Adding Blaze to home screen" loading="lazy" />
      </section>

      <section class="callout">
        <h2>Ready to share some files?</h2>
        <a class="btn" href="/app">Start Sharing</a>
      </section>
    </div>
  </main>
);

export default Working;