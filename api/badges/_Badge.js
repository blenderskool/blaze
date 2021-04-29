/** @jsx h */
import { h } from 'preact';

function Badge({ width, height, title, value, type }) {
  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Jost:wght@500&display=swap');
  
    .badge {
      border-radius: 4px;
      color: #fff;
      font-family: 'Jost', Verdana, DejaVu Sans, sans-serif;
      font-weight: 500;
      display: flex;
      align-items: center;
      overflow: hidden;
      font-size: 14px;
      line-height: 1.8;
      -webkit-font-smoothing: antialiased;
      -moz-font-smoothing: antialiased;
      -o-font-smoothing: antialiased;      
    }
    .badge * {
      box-sizing: border-box;
    }

    .title {
      width: 70%;
      height: 100%;
      text-align: center;
      background-color: #0D1322;
    }

    .value {
      border: 1px solid #3BE8B0;
      background-color: #173f3c;
      color: #3BE8B0;
      padding: 0 6px;
      width: 40%;
      text-align: center;
      height: 100%;
      line-height: 1.6;
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }

    .error .value {
      background-color: #441f28;
      color: #ff7979;
      border-color: #ff7979;
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
        <div class={`badge ${type}`} style={{ height, width }}>
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
