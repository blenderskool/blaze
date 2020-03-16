<p align="center">
  <a href="https://blaze.unubo.app">
    <img src="https://github.com/blenderskool/blaze/blob/master/static/images/apple-touch-icon-152x152.png">
  </a>
</p>

<p align="center">
  <a href="https://www.producthunt.com/posts/blaze-2?utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-blaze-2" target="_blank">
    <img src="https://api.producthunt.com/widgets/embed-image/v1/top-post-badge.svg?post_id=174403&theme=dark&period=daily" alt="Blaze - Fast peer to peer file sharing web app ⚡ | Product Hunt Embed" style="width: 139px; height: 30px;" width="139px" height="30px" />
  </a>
  <a title="MadeWithSvelte.com Shield" href="https://madewithsvelte.com/p/blaze/shield-link">
    <img src="https://madewithsvelte.com/storage/repo-shields/1916-shield.svg"/>
  </a>
</p>

# Blaze - A file sharing web app
Blaze is a file sharing progressive web app(PWA) that allows users to transfer files between multiple devices.
It works similar to SHAREit or the Files app by Google but uses web technologies to eliminate the process of installing
native apps for different devices and operating systems. It also supports instant file sharing with multiple devices at once which many file sharing apps lack.

Blaze uses WebSockets and WebRTC to transfer files between multiple devices.
It currently uses `socket.io` to make real-time connections on `express` backend. The frontend is built on [Svelte](https://svelte.dev).
The current method of sharing files involves compressing the files to `zip` format and sharing this zip file as chunks of ArrayBuffer. This may change to increase the efficiency of the file transfer.  
Read more about how Blaze works at a basic level in this [Medium article](https://medium.com/@AkashHamirwasia/new-ways-of-sharing-files-across-devices-over-the-web-using-webrtc-2554abaeb2e6).

<p>
  <a href="https://heroku.com/deploy?template=https://github.com/blenderskool/blaze/tree/master">
    <img src="https://www.herokucdn.com/deploy/button.svg" alt="Deploy">
  </a>
  <a href="http://play-with-docker.com?stack=https://raw.githubusercontent.com/blenderskool/blaze/master/docker-compose.yml">
    <img src="https://cdn.rawgit.com/play-with-docker/stacks/cff22438/assets/images/button.png" alt="Try in PWD">
  </a>
</p>

## Project structure
The project is divided into the backend and the frontend.


### Backend
Right now, only `index.js` file contains all the server-side code. It is built on `express` and `socket.io` which allows usage of WebSockets and WebRTC. **We may switch to using WebSockets natively as it is supported in almost all modern browsers.**

### Frontend
The frontend code is in the `public`, `static` folders. Once the frontend is built for production, all the built files are stored in `dist` folder which can be deployed along with the server code.

#### `static` folder
This folder is used to store the static files such as images, fonts, and JavaScript files that shouldn't be bundled with the rest of the code.

#### `public` folder
This folder contains the code for the frontend (written in [Svelte](https://svelte.dev/)) which gets compiled and bundled to JavaScript. It also contains the HTML layouts of different pages, along with stylesheets written in Sass.

- Svelte is used for the UI of the app.
- No UI library is being used as of now.
- Sass is used for CSS pre-processing.
- `/app` route is a PWA, single-page app.


### Build process
Build process is setup using Gulp. It uses Rollup to bundle the Frontend Svelte code, and Workbox to create the service worker for PWA support.

## Contributing
Thanks for contributing to Blaze! Make sure to **Fork** this repository into your account before making any commits. Then use the following commands to set up the project
```bash
git clone https://github.com/<your-github-username>/blaze
git remote add upstream https://github.com/blenderskool/blaze.git
cd blaze
npm install
```

All development happens on the `next` branch. The `master` branch contains the known stable version of Blaze. To make your contributions, create a new branch from `next`.
```bash
git checkout -b my-branch next
```

Start the live development server. The server would run at port `3030` and the app can be accessed on `localhost:3030/app`
```bash
npm run dev
```

Now you can make your changes, and commit them. Make sure you have a clear and summarized message for your commits
```bash
git add .
git commit -m "My fixes"
```

Sync your forked repository with the changes in this(upstream) repository
```bash
git fetch upstream
git rebase upstream/next
```

Push the changes to your fork.
```bash
git push origin my-branch
```

This is a good time, to open a pull request in this repository with the changes you have made. Make sure you open a pull request to merge to `next` branch and not the `master` branch directly.


## Running Blaze in production

### Building the frontend
```bash
npm run build
```
The frontend built code would be located in the `dist` folder.


### Starting the server
```bash
npm start
```
Blaze should be running on port `3030` :tada:.

## License
Blaze is [MIT Licensed](https://github.com/blenderskool/blaze/blob/master/LICENSE.md)
