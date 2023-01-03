import AppLanding from '../layouts/AppLanding/AppLanding';

import './Support.scoped.scss';

function Support() {
  return (
    <AppLanding
      title="Support Blaze"
      subtitle="Few ways you can support the project"
    >
      <div className="support">
        <h2 class="section-title sponsor-title">
          <img src="https://github.com/blenderskool.png?size=100" />
          Sponsor me!
        </h2>

        <p>
          Hey, I'm Akash Hamirwasia. I started building Blaze in 2018 to make
          file sharing easy. I make most of my side projects open source with
          the hope that people like me would be able to learn from and use the
          things I build.
        </p>

        <a
          class="btn wide outlined small"
          href="https://github.com/sponsors/blenderskool"
          target="_blank"
        >
          Sponsor through GitHub
        </a>
        <a
          class="btn wide outlined small"
          href="https://www.buymeacoffee.com/akashhamirwasia"
          target="_blank"
        >
          Sponsor through BMC
        </a>

        <h2 class="section-title sponsor-title">
          <img src="https://github.com/github.png?size=100" />
          Support the development
        </h2>

        <p>
          You can view the source code of Blaze, find bugs and contribute a fix.
          You can also suggest and pickup development of new features.
        </p>
        <a
          class="btn wide outlined small"
          href="https://github.com/blenderskool/blaze"
          target="_blank"
        >
          View GitHub repository
        </a>
      </div>
    </AppLanding>
  );
}

export default Support;
