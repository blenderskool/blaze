/** @jsx h */
import { h } from 'preact';

function Badge({ width, height, title, value, type }) {
  const styles = `
    .badge {
      border-radius: 4px;
      color: #fff;
      font-family: Verdana,DejaVu Sans,sans-serif;
      display: flex;
      align-items: center;
      overflow: hidden;
      font-size: 14px;
    }

    .title {
      margin-left: auto;
      flex: 1;
      height: 100%;
      text-align: center;
      background-color: #0D1322;
    }

    .value {
      background-color: #3BE8B0;
      color: #0D1322;
      padding: 0 6px;
      margin-left: auto;
      height: 100%;
      text-shadow: 1px 1px rgba(0, 0, 0, 0.15);
    }

    .error .value {
      background-color: #FA5050;
      color: #FFF;
    }
  `;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <title>{title}: {value}</title>
      <defs>
        <style type="text/css">
          {styles}
        </style>
      </defs>
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml">
        <div class={`badge ${type}`} style={{ height, width, lineHeight: `${height}px` }}>
          <div class="title">
            {title}
          </div>
          <div class="value">
            {value}
          </div>
        </div>
        </div>
      </foreignObject>
    </svg>
  );
}

export default Badge;
