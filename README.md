<div align="center">
  <p align="center">
    <a href="https://blaze.now.sh">
      <img src="https://github.com/blenderskool/blaze/raw/next/client/src/assets/images/apple-touch-icon-152x152.png" width="80">
    </a>
  </p>
  <p align="center">  
    <h3>Blaze - A P2P file sharing web app ⚡</h3>
  </p>

  <p align="center">
    <img src="https://blaze.now.sh/api/badges/status" height="22" />
    <img src="https://blaze.now.sh/api/badges/release" height="22" />
    <img src="https://blaze.now.sh/api/badges/license" height="22" />
  </p>
  
  <p align="center">
    <a href="https://www.producthunt.com/posts/blaze-2?utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-blaze-2" target="_blank">
      <img src="https://api.producthunt.com/widgets/embed-image/v1/top-post-badge.svg?post_id=174403&theme=dark&period=daily" alt="Blaze - Fast peer to peer file sharing web app ⚡ | Product Hunt Embed" width="139px" height="30px" />
    </a>
    <a href="https://bit.ly/36uX8oU" target="_blank">
      <img src="https://opensource.nyc3.cdn.digitaloceanspaces.com/attribution/assets/PoweredByDO/DO_Powered_by_Badge_blue.svg" alt="Digital Ocean" height="25px" />
    </a>
  </p>
</div>

Blaze is a file sharing progressive web app(PWA) that allows **users to transfer files between multiple devices.**
It works similar to SHAREit or the Files app by Google but uses web technologies to eliminate the process of installing
native apps for different devices and operating systems. It also supports instant file sharing with **multiple devices at once** which many file sharing apps lack.

Blaze primarily uses [WebTorrent](https://webtorrent.io) and WebSockets protocol (as a fallback) to transfer files between multiple devices. Files shared **via WebTorrent are peer-to-peer**(as they use WebRTC internally) which means there is direct transfer between the sender and receiver **without any intermediate server**. Do note that tracker servers in WebTorrent are used which carry metadata and facilitate the file transfer but do not get the complete file in any form.

### Features
- 💡 No account creation or signups.
- 🚀 One-to-One and Many-to-Many file transfers.
- 🔮 Works across different networks and devices.
- ⚡ Easy to use, and no app installation required.
- 📱 PWA for device-level integrations.

### Try it out!
- Go to a deployed client of Blaze - https://blaze.now.sh
- Set a basic nickname(this is not stored on any server)
- Create a new room. Room is where peers must join to share files among each other.
- On another device, follow the above steps and join the same room. (Make sure to give a different nickname)
- Both your devices should show up. Now start sharing some files!
 
Read more about how Blaze works at a basic level in this [Medium article](https://medium.com/@AkashHamirwasia/new-ways-of-sharing-files-across-devices-over-the-web-using-webrtc-2554abaeb2e6).

### Deploy your own instance of Blaze
<p>
  <a href="https://cloud.digitalocean.com/apps/new?repo=https://github.com/blenderskool/blaze/tree/master&refcode=ddb2a965377c">
    <img src="https://www.deploytodo.com/do-btn-blue.svg" alt="Deploy to DO" width="200">
  </a>
  <a href="https://heroku.com/deploy?template=https://github.com/blenderskool/blaze/tree/master">
    <img src="https://www.herokucdn.com/deploy/button.svg" alt="Deploy">
  </a>
</p>

Read more on [Deploying on your own server](#running-blaze-in-production)

## Sponsors
Blaze is sponsored by:
<p>
  <a href="https://bit.ly/36uX8oU">
    <img src="https://opensource.nyc3.cdn.digitaloceanspaces.com/attribution/assets/SVG/DO_Logo_horizontal_blue.svg" width="201px">
  </a>
</p>

## Build process
- For the frontend, webpack is setup internally via preact-cli. Overrides can be made in `preact.config.js` file.
- For the backend, [sucrase](https://www.npmjs.com/package/sucrase) is used to transform ES modules imports/exports to CommonJS.


<details><summary><b>Environment variables</b></summary>
<p>
Following environment variables can be set in the build process:


| variable             | description                                                           | default                                           |
|----------------------|-----------------------------------------------------------------------|---------------------------------------------------|
| **client**           | Variables for **client** should be set as build args if using Docker. |                                                   |
| `WS_HOST`            | URL to the server that is running the Blaze WebSockets server.        | 'ws://\<your-local-ip\>:3030'                     |
| `SERVER_HOST`        | URL to the server that running the Blaze HTTP server.                 | 'http://\<your-local-ip\>:3030'                   |
| `WS_SIZE_LIMIT`      | Max file size limit when transferring files over WebSockets in bytes. | 100000000 (100 MBs)                               |
| `TORRENT_SIZE_LIMIT` | Max file size limit when transferring files over WebTorrent in bytes. | 700000000 (700 MBs)                               |
| **server**           |                                                                       |                                                   |
| `ORIGIN`             | Array of string URLs to allow CORS.                                   | *                                                 |
| `PORT`               | Port for the server to run.                                           | 3030                                              |
| `WS_SIZE_LIMIT`      | Max file size limit when transferring files over WebSockets in bytes. | 100000000 (100 MBs)                               |
| `DISABLE_SSE_EVENTS` | Disable server side events to reduce long-lived connections.          | false                                             |
| `TRUST_PROXY`        | Whether server is behind a trusted proxy and can read forwarded IPs.  | _false_ when standalone, _true_ in docker-compose |
----------------------------------------------------------------------------------------------------------------------------------------------------

**NOTE:** Any URL in the environment variables should not end with `/`.

</p>
</details>

## Running Blaze in production
Blaze can be easily deployed on your own server using Docker and `docker-compose`. The frontend and the backend is completely decoupled from each other.

### Docker images
Following Docker images are available:
- **[Blaze Server](https://hub.docker.com/r/akashhamirwasia/blaze-server)**: This is the backend Node.js server that is used for WebSockets communication. The environment variables listed for the server in previous section can be passed to the container. It exposes port `3030`.

- **[Blaze Client](https://hub.docker.com/r/akashhamirwasia/blaze-client)**: This is the frontend progressive web app of Blaze used by clients for sharing files. Nginx is used as a web server for this statically generated frontend. The environment variables listed above must be **passed as ARGS while building the image**. The frontend container exposes port `80`.

- **[Blaze](https://hub.docker.com/r/akashhamirwasia/blaze)**: This is a higher level image that includes both Blaze Server and Blaze Client images above. It must be used when docker-compose is not available in the environment, or there is a limit to run only a single container. docker-compose must be used to run Blaze in other cases which is explained in next section.
  <details><summary><b>Running high level Blaze image</b></summary>
  <pre>docker run -p 8080:80 -p 3030:3030 -e PORT=80 akashhamirwasia/blaze:latest</pre>
  <p>  
    <b>NOTE:</b> The <code>PORT</code> environment variable and the container port should be the same.(In the above example, it is set as <code>80</code>).
  </p>
  </details>

### Using docker-compose
A `docker-compose.yml` file is present at the root of this project which runs both the server and client containers and sets up a proxy for WebSocket connections on the frontend in Nginx configuration. To run using docker-compose:

```bash
git clone https://github.com/blenderskool/blaze
cd blaze
docker-compose up -d
```

### Directly via Node.js

**Building the frontend**
```bash
npm run build:fe
```
The frontend built code would be located in the `client/build` directory.


**Starting the server and frontend app**
```bash
npm start
```
Blaze app can now be accessed at port `8080` :tada:

## Privacy and Analytics
- Blaze server does not track or record the files that are being shared both by WebSockets and WebTorrent.
- Any user related data like nickname, room names are always stored on device, and are only shared with the server when the user joins a room for file sharing.
- Blaze client uses Google Analytics to record the following:
  - [Basic visit data](https://developers.google.com/analytics/devguides/collection/analyticsjs#what_data_does_the_google_analytics_tag_capture) as recorded by [Google Analytics](https://support.google.com/analytics/answer/6004245?ref_topic=2919631)
  - If Blaze PWA is installed on the device, and whether files are shared using share targets.

## Contributing
Documentation on contributing can be found in [CONTRIBUTING.md](https://github.com/blenderskool/blaze/blob/master/CONTRIBUTING.md)

## License
Blaze is [MIT Licensed](https://github.com/blenderskool/blaze/blob/master/LICENSE)
