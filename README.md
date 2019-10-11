<p align="center">
  <a href="https://blaze.unubo.app">
    <img src="https://github.com/blenderskool/blaze/blob/master/static/images/apple-touch-icon-152x152.png">
  </a>
 </p>

# Blaze - A file sharing web app

Blaze is a file sharing web app that uses WebSockets and WebRTC to transfer files between multiple devices.
It currently uses `socket.io` to make real time connections on `express` backend. The frontend is built on vanilla JavaScript.
The current method of sharing files involves compressing the files to `zip` format and sharing this zip file as chunks of ArrayBuffer. This may change to increase the efficiency of file transfer.


## Project structure
The project is divided into the backend and the frontend.


### Backend
Right now, only `index.js` file contains all the server-side code required for the backend. It is built on `express` and `socket.io` which allows usage of WebSockets and WebRTC. We may switch to using WebSockets natively as it is supported in almost all modern browsers.

### Frontend
The frontend code is in the `public`, `static` folders. Once the frontend is built for production, all the built files are stored in `dist` folder which can be deployed along with the server code.

#### `static` folder
This folder is used to store the static files such as images, fonts, and JavaScript files that shouldn't be bundled with rest of the code.

#### `public` folder
This folder contains the code for the frontend (written in [Svelte](https://svelte.dev/)) which gets compiled and bundled to JavaScript. It also contains the HTML layouts of different pages, along with stylesheets written in Sass.

- Svelte is used for the UI of the app.
- No UI library is being used as of now.
- Sass is used for CSS pre-processing.
- `/app` route is a PWA, single page app.


## Contributing
Thanks for contributing to Blaze! Make sure to **Fork** this repository into your account before making any commits. Then use the following commands to setup the project
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


## Building for production
```bash
npm run build
```
The frontend built code would be located in the `dist` folder

## License
Blaze is [MIT Licensed](https://github.com/blenderskool/blaze/blob/master/LICENSE.md)
