import React from 'react';
import _ from 'lodash';

const DefaultLayout = (props) => {
  const { assetsManifest } = props;
  const stylesheets = props.stylesheets || [];
  const scripts = props.scripts || [];

  const styleElements = _.map(stylesheets, (styleSrc, idx) => {
    if (!/^(https?:)?\/\//g.test(styleSrc)) {
      styleSrc = `${props.h5root}/${styleSrc}`;
    }
    return (<link key={`styleElement${idx}`} rel="stylesheet" href={styleSrc} />);
  });

  const scriptElements = _.map(scripts, (scriptSrc, idx) => {
    if (!/^(https?:)?\/\//g.test(scriptSrc)) {
      scriptSrc = `${props.h5root}/${scriptSrc}`;
    }
    return (<script key={`scriptElement${idx}`} type="text/javascript" src={scriptSrc} charSet="utf-8" />);
  });

  const globals = `
    window.__PLATFORM__ = "${props.platform}";
    window.__OS_FAMILY__ = "${props.osFamily}";
    window.__OS_VERSION__ = "${props.osVersion}";
    window.__SERVER__ = ${JSON.stringify(props.exposedServer)};
  `;

  const universalStyles = 'body,html { font-family: PingFang SC,Helvetica Neue,Hiragino Sans GB,Helvetica,Microsoft YaHei,Arial }';

  return (
    <html lang="zh">
      <head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Cache-Control" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        <meta name="description" content="" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="format-detection" content="telephone=no" />
        <title>{props.title}</title>
        {/* <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" /> */}
        <link rel="stylesheet" href={assetsManifest.vendor.css} />
        <style dangerouslySetInnerHTML={{ __html: universalStyles }} />

        {styleElements}

        <script type="text/javascript" dangerouslySetInnerHTML={{ __html: globals }} />
      </head>
      <body>
        {props.children}

        <script type="text/javascript" src={assetsManifest.runtime.js} charSet="utf-8" />
        <script type="text/javascript" src={assetsManifest.vendor.js} charSet="utf-8" />
        {scriptElements}
      </body>
    </html>
  );
};

DefaultLayout.defaultProps = { title: 'react-templ' };

export default DefaultLayout;
