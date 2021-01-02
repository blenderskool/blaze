/** @jsx h */
import { h } from 'preact';
import render from 'preact-render-to-string';
import fetch from 'node-fetch';

import Badge from './_Badge';

export default async (req, res) => {

  res.setHeader('content-type', 'image/svg+xml');
  res.setHeader('Cache-control', 'max-age=0, s-maxage=3600');

  try {
    const { tag_name } = await (await fetch('https://api.github.com/repos/blenderskool/blaze/releases/latest')).json();
    res.send(render(<Badge type="success" width={120} height={25} title="release" value={tag_name} />));
  } catch(err) {
    res.send(render(<Badge type="error" width={110} height={25} title="release" value="error" />));
  }
};
