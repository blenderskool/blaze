/** @jsx h */
import { h } from 'preact';
import render from 'preact-render-to-string';

import Badge from './_Badge';

export default async (req, res) => {

  res.setHeader('content-type', 'image/svg+xml');
  res.setHeader('Cache-control', 'max-age=0, s-maxage=86400');

  res.send(render(<Badge type="success" width={110} height={25} title="license" value="MIT" />));
};
