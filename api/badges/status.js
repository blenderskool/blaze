/** @jsx h */
import { h } from 'preact';
import render from 'preact-render-to-string';
import fetch from 'node-fetch';

import Badge from './_Badge';

export default async (req, res) => {

  res.setHeader('content-type', 'image/svg+xml');
  res.setHeader('Cache-control', 'max-age=0, s-maxage=60');

  try {
    await fetch('https://blaze.beaconapp.in');
    res.send(render(<Badge type="success" width={90} height={25} title="status" value="up" />));
  } catch(err) {
    res.send(render(<Badge type="error" width={110} height={25} title="status" value="down" />));
  }
};
