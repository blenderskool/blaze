<div align="center">
  <p align="center">
    <a href="https://blaze.now.sh">
      <img src="https://github.com/blenderskool/blaze/raw/next/client/src/assets/images/apple-touch-icon-152x152.png">
    </a>
  </p>

  <p align="center">
    <a href="https://www.producthunt.com/posts/blaze-2?utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-blaze-2" target="_blank">
      <img src="https://api.producthunt.com/widgets/embed-image/v1/top-post-badge.svg?post_id=174403&theme=dark&period=daily" alt="Blaze - Fast peer to peer file sharing web app ⚡ | Product Hunt Embed" width="139px" height="30px" />
    </a>
    <a href="https://bit.ly/36uX8oU" target="_blank">
      <img src="https://opensource.nyc3.cdn.digitaloceanspaces.com/attribution/assets/PoweredByDO/DO_Powered_by_Badge_blue.svg" alt="Digital Ocean" height="25px" />
    </a>
  </p>

  <h1>Blaze - A file sharing web app ⚡</h1>
</div>

Blaze is a file sharing progressive web app(PWA) that allows **users to transfer files between multiple devices.**
It works similar to SHAREit or the Files app by Google but uses web technologies to eliminate the process of installing
native apps for different devices and operating systems. It also supports instant file sharing with **multiple devices at once** which many file sharing apps lack.

Blaze primarily uses [WebTorrent](https://webtorrent.io) and WebSockets protocol (as a fallback) to transfer files between multiple devices. Files shared **via WebTorrent are peer-to-peer**(as they use WebRTC internally) which means there is direct transfer between the sender and receiver **without any intermediate server**. Do note that tracker servers in WebTorrent are used which carry metadata and facilitate the file transfer but do not get the complete file in any form.

### Try it out!
- Go to a deployed client of Blaze - https://blaze.now.sh
- Set a basic nickname(this is not stored on any server)
- Create a new room. Room is where peers must join to share files among each other.
- On another device, follow the above steps and join the same room. (Make sure to give a different nickname)
- Both your devices should show up. Now start sharing some files!
 
Read more about how Blaze works at a basic level in this [Medium article](https://medium.com/@AkashHamirwasia/new-ways-of-sharing-files-across-devices-over-the-web-using-webrtc-2554abaeb2e6).

### Deploy your own instance of Blaze
<p>
  <a href="https://heroku.com/deploy?template=https://github.com/blenderskool/blaze/tree/master">
    <img src="https://www.herokucdn.com/deploy/button.svg" alt="Deploy">
  </a>
  <a href="http://play-with-docker.com?stack=https://raw.githubusercontent.com/blenderskool/blaze/master/docker-compose.yml">
    <img src="https://cdn.rawgit.com/play-with-docker/stacks/cff22438/assets/images/button.png" alt="Try in PWD">
  </a>
</p>

Read more on [Deploying on your own server](#deploying-on-your-own-server)

## Table of Contents
- [Sponsors](#sponsors)
- [Project structure](#project-structure)
  - [Backend](#backend)
  - [Frontend](#frontend)
    - [Sub-directories](#sub-directories)
  - [Common](#common)
  - [Build process](#build-process)
- [Deploying on your own server](#deploying-on-your-own-server)
  - [Using docker-compose](#using-docker-compose)
- [Contributing](#contributing)
- [Running Blaze in production](#running-blaze-in-production)
  - [Building the frontend](#building-the-frontend)
  - [Starting the server](#starting-the-server)
- [Privacy and Analytics](#privacy-and-analytics)
- [License](#license)


## Sponsors
Blaze is sponsored by:
<p>
  <a href="https://bit.ly/36uX8oU">
    <img src="https://opensource.nyc3.cdn.digitaloceanspaces.com/attribution/assets/SVG/DO_Logo_horizontal_blue.svg" width="201px">
  </a>
</p>

## Project structure
The project is structured into following directories - backend, frontend, common and nginx.

### Backend
All the backend(or server) related source code resides under the `server` directory. It is built on Node.js with [express](http://expressjs.com/) for HTTP server and [ws](https://www.npmjs.com/package/ws) library for WebSockets. Thin wrappers have been created for easier interfacing with sockets.

### Frontend
The frontend source code is in the `client` directory. The dependencies of the frontend has been kept to a minimum to keep bundle sizes low. Once the frontend is built for production, all the built files are stored in `build` directory which can be deployed as a static app.

- [Preact](https://preactjs.com/) is being used on the frontend(previously used Svelte).
- Sass is used for CSS pre-processing and maintaing consistent themeing across the frontend.
- `/app` route is a PWA, single-page app. Rest of the routes are pre-rendered during build time.
- [Feather icons](https://feathericons.com/) is used for icons.

#### Sub-directories
- `assets` - used to store the static assets such as images.
- `components` - contains all the UI components of Blaze.
- `hooks` - custom Preact hooks
- `routes` - components related to different routes of Blaze and router configuration.
  - `App` - subroutes of the single-page app under `/app` route.
  - `Pages` - rest of the routes that need to be pre-rendered.
- `scss` - theme level scss. (Note: component specific scss goes within the corresponding component directory)
- `utils` - javascript utility functions

### Common
The `common` directory contains javascript modules that are **shared by both frontend and backend**. These include constants in `constants.js` file and utility functions in `utils` sub-directory.

### Nginx
The `nginx` directory contains configuration files for nginx to be used in Docker containers. These usually don't change much.
- `compose-nginx.conf` - Used when the project is run using docker-compose.
- `image-nginx.template` - Used when the project is run on a single container from higher level Docker image.

### Build process
The build process for the frontend internally setup with webpack via preact-cli. Overrides can be made in `preact.config.js` file. Following environment variables can be set in the build process:

| variable             | description                                                           | default                         |
|----------------------|-----------------------------------------------------------------------|---------------------------------|
| **client**           |                                                                       |                                 |
| `WS_HOST`            | URL to the server that is running the Blaze WebSockets server.        | 'ws://\<your-local-ip\>:3030'   |
| `SERVER_HOST`        | URL to the server that running the Blaze HTTP server.                 | 'http://\<your-local-ip\>:3030' |
| `WS_SIZE_LIMIT`      | Max file size limit when transferring files over WebSockets in bytes. | 100000000 (100 MBs)             |
| `TORRENT_SIZE_LIMIT` | Max file size limit when transferring files over WebTorrent in bytes. | 700000000 (700 MBs)             |
| **server**           |                                                                       |                                 |
| `ORIGIN`             | Array of string URLs to allow CORS.                                   | *                               |
| `PORT`               | Port for the server to run                                            | 3030                            |
| `WS_SIZE_LIMIT`      | Max file size limit when transferring files over WebSockets in bytes  | 100000000 (100 MBs)             |
----------------------------------------------------------------------------------------------------------------------------------

## Deploying on your own server
Blaze can be easily deployed on your own server using Docker. The frontend and the backend is completely decoupled from each other. Following Docker images are available:
- Blaze Server: This is the backend Node.js server that is used for WebSockets. The environment variables listed for the server above can be passed to the container. It exposes port `3030`.
- Blaze Client: This is the frontend progressive web app of Blaze used by clients for sharing files. Nginx is used as a web server for this statically generated frontend. The environment variables listed above can be passed as ARGS while **building the image**. The frontend container exposes port `80`.
- Blaze: This is a higher level image that includes both Blaze Server and Blaze Client images above. It must be used when docker-compose is not available in the environment, or there is a limit to run only a single container. docker-compose must be used to run Blaze in other cases which is explained in next section.

### Using docker-compose
A `docker-compose.yml` file is present at the root of this project which runs both the server and client containers and sets up a proxy for WebSocket connections on the frontend in Nginx configuration. To run using docker-compose:

```bash
git clone https://github.com/blenderskool/blaze
cd blaze
docker-compose up -d
```

## Contributing
Documentation on contributing can be found in [CONTRIBUTING.md](https://github.com/blenderskool/blaze/blob/master/CONTRIBUTING.md)

## Running Blaze in production

### Building the frontend
```bash
npm run build:fe
```
The frontend built code would be located in the `client/build` directory.


### Starting the server and frontend app
```bash
npm start
```
Blaze app can now be accessed at port `8080` :tada:

## Privacy and Analytics
- Blaze server does not track or record the files that are being shared both by WebSockets and WebTorrent.
- Any user related data like nickname, room names are always stored on device, and are only shared with the server when the user joins a room for file sharing.
- Blaze client uses Google Analytics to record the following:
  - [Basic visit data](https://developers.google.com/analytics/devguides/collection/analyticsjs#what_data_does_the_google_analytics_tag_capture) as recorded by [Google Analytics](https://support.google.com/analytics/answer/6004245?ref_topic=2919631)
  - If Blaze is installed on the device, and whether files are shared using share targets.

## License
Blaze is [MIT Licensed](https://github.com/blenderskool/blaze/blob/master/LICENSE)
