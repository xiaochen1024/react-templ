import "styles/pages/home.less";

import React from "react";
import { render } from "react-dom";
import { Router } from "react-router-dom";
import { renderRoutes } from "react-router-config";
import createHistory from "history/createBrowserHistory";
import { Provider } from "mobx-react";

import MainContainer from "scripts/components/MainContainer";
import TestStore from "scripts/stores/TestStore";
import server from "scripts/configs/server";

const rootElement = document.getElementById("app");
const history = createHistory({ basename: server.serverContext });
const routes = [
  {
    path: "/",
    component: MainContainer,
    routes: []
  }
];

const stores = {
  testStore: new TestStore()
};

render(
  <Provider {...stores}>
    <Router history={history}>{renderRoutes(routes)}</Router>
  </Provider>,
  rootElement
);
