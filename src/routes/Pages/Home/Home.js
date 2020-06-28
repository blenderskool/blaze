import { h } from 'preact';
import network from '../../../assets/images/illustrations/network_compress.png';
import twoDevices from '../../../assets/images/illustrations/two_devices_compress.png';
import threeDevices from '../../../assets/images/illustrations/three_devices_compress.png';
import world from '../../../assets/images/illustrations/world_compressed.png';
import Pill from '../../../components/Pill/Pill';
import './Home.scss';

const Home = () => (
  <main>
    <section class="hero">

      <div class="info">
        <h1 class="title">Share files the modern way</h1>
        <h2 class="subtitle">Using just a web browser across any device on Earth!</h2>

        <a href="/app" class="btn">
          Start Sharing
        </a>
        <a class="ph-mob" href="https://www.producthunt.com/posts/blaze-2?utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-blaze-2" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/top-post-badge.svg?post_id=174403&theme=dark&period=daily" alt="Blaze - Fast peer to peer file sharing web app ⚡ | Product Hunt Embed" style="width: 250px; height: 54px;" width="250px" height="54px" /></a>
      </div>

      <img class="network-img" src={network} alt="Devices connected using Blaze" />

      <svg class="waves" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,160L21.8,160C43.6,160,87,160,131,181.3C174.5,203,218,245,262,234.7C305.5,224,349,160,393,133.3C436.4,107,480,117,524,106.7C567.3,96,611,64,655,80C698.2,96,742,160,785,176C829.1,192,873,160,916,138.7C960,117,1004,107,1047,112C1090.9,117,1135,139,1178,170.7C1221.8,203,1265,245,1309,234.7C1352.7,224,1396,160,1418,128L1440,96L1440" />
      </svg>

    </section>


    <section class="features">
      <div class="feature">
        <img src={twoDevices} alt="Laptop and mobile connected together" loading="lazy" />
        <h2>Easy to use</h2>
        <p>
          Blaze is a web app, just open it in your browser, join a room, and start sharing. No need to download specific apps for different platforms.
        </p>
      </div>

      <div class="feature">
        <img src={threeDevices} alt="Laptop and two mobiles connected together" loading="lazy" />
        <h2 style="margin-top: 25px">Multi-device <Pill>Experimental</Pill></h2>
        <p>
          Traditionally, sharing files to multiple devices has been a hassle. With Blaze, you can share files across multiple devices with ease.
        </p>
      </div>
      
      <div class="feature">
        <img src={world} alt="Devices in different parts of the world using Blaze to share files" loading="lazy" />
        <h2>Anywhere</h2>
        <p>
          Blaze is built on modern web technologies, allowing it to work on devices far away from each other. It just needs to be connected to the internet.
        </p>
      </div>
    </section>

    <section class="about" id="about">

      <blockquote>
        <span>"</span>I built Blaze because I wanted a fast, radically different way to transfer files between my laptop and mobile<span>"</span>

        <footer>
          <a href="https://github.com/blenderskool" target="_blank" rel="noopener noreferrer">
            <img src="https://github.com/blenderskool.png?size=100" alt="Akash Hamirwasia" />
          </a>
          <cite class="author">Akash Hamirwasia</cite>
          <cite class="position">Creator of Blaze</cite>
        </footer>
      </blockquote>

    </section>

    <section class="hero final-cta">

      <h2 class="title">Let's get sharing!</h2>
      <h3 class="subtitle">No registrations required, completely free</h3>

      <a href="/app" class="btn">
        Start sharing
      </a>

    </section>

    <footer>
      A project by <a href="https://github.com/blenderskool" target="_blank" rel="noopener noreferrer">Akash Hamirwasia</a>
    </footer>

  </main>
);

export default Home;
