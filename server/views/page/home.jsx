import React from 'react';
import DefaultLayout from '../layout/default';

const HomePage = (props) => {
  const { assetsManifest } = props;
  const stylesheets = [assetsManifest.home.css];
  const scripts = [assetsManifest.home.js];

  return (
    <DefaultLayout {...props} stylesheets={stylesheets} scripts={scripts}>
      <div id="app" className="page" />
    </DefaultLayout>
  );
};

export default HomePage;
