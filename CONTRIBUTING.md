# Contributing to Blaze
Thanks for contributing to Blaze :zap:! Make sure to **Fork** this repository into your account before making any commits.

## Project setup
Run the following commands to set up Blaze on your system
```bash
git clone https://github.com/<your-github-username>/blaze
cd blaze
git remote add upstream https://github.com/blenderskool/blaze.git
npm install
```

## Understanding the project structure
The project is structured into following directories, with each directory dedicated to separate module of Blaze.

### Backend
All the backend(or server) related source code resides under the `server` directory. It is built on Node.js with [express](http://expressjs.com/) for HTTP server and [ws](https://www.npmjs.com/package/ws) library for WebSockets. Thin wrappers have been created for easier interfacing with sockets.

### Frontend
The frontend source code is in the `client` directory. The dependencies of the frontend has been kept to a minimum to keep bundle sizes low. Once the frontend is built for production, all the built files are stored in `build` directory which can be deployed as a static app.

- [Preact](https://preactjs.com/) is being used on the frontend(previously used Svelte).
- Sass is used for CSS pre-processing and maintaing consistent themeing across the frontend.
- `/app` route is a PWA, single-page app. Rest of the routes are pre-rendered during build time.
- [Feather icons](https://feathericons.com/) is used for icons.

<details><summary><b>Sub-directories</b></summary>
<ul>
<li><code>assets</code> - used to store the static assets such as images.</li>
<li><code>components</code> - contains all the UI components of Blaze.</li>
<li><code>hooks</code> - custom Preact hooks.</li>
<li><code>routes</code> - components related to different routes of Blaze and router configuration.</li>
<ul>
  <li><code>App</code> - subroutes of the single-page app under <code>/app</code> route.</li>
  <li><code>Pages</code> - rest of the routes that need to be pre-rendered.</li>
</ul>
<li><code>scss</code> - theme level scss. (Note: component specific scss goes within the corresponding component directory)</li>
<li><code>utils</code> - javascript utility functions</li>
</ul>
</details>

### common
The `common` directory contains javascript modules that are **shared by both frontend and backend**. These include constants in `constants.js` file and utility functions in `utils` sub-directory.

### nginx
The `nginx` directory contains configuration files for nginx to be used in Docker containers. These usually don't change much.
- `compose-nginx.conf` - Used when the project is run using docker-compose.
- `image-nginx.template` - Used when the project is run on a single container from higher level Docker image.

### api
The `api` directory contains a few serverless functions deployed on Vercel. Serverless functions are used in Blaze only for very basic server logic that can be kept separate from the main Blaze backend (which is the `server` directory).


## Creating a feature branch
All development happens on the `next` branch. The `master` branch contains the known stable version of Blaze. To make your contributions, create a new branch from `next`.
```bash
git checkout next
git checkout -b my-branch next
```

## Development server
In most cases you would want to run the dev server for both frontend and backend to test your changes. Hence start the dev server by running the following command at the root of the project. This would start two servers:
- The backend server at port `3030`.
- The frontend live server at port `8080`.

```bash
npm run dev
```

## Commiting your changes and creating a PR
Now you can make your changes, and commit them. We don't have any specific convention as of now, but try to have a clear and summarized message for your commits. Refer https://chris.beams.io/posts/git-commit/#seven-rules for guidelines.

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
