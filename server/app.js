import fs from "fs";
import express from "express";
import logger from "morgan";
import path from "path";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import ReactViews from "express-react-views";
import compression from "compression";
// import favicon from 'serve-favicon';

import server from "./config/server";

// Routes
import IndexRouter from "./routes/index";

// Middlewares
import parseConfig from "./middlewares/parseConfig";

const __DEV__ = process.env.NODE_ENV === "development";

global.server = server;
global.__DEV__ = __DEV__;

const app = express();

// 服务器配置文件
app.locals.server = server;

// Express模板引擎配置
app.set("views", `${__dirname}/views`);

// Webpack Hot Module Replacement配置
if (__DEV__) {
  // 配置webpack热更新
  require("./config/configWebpackMiddleware")(app); // eslint-disable-line global-require

  app.use(
    server.serverContext,
    express.static(path.join(__dirname, "../client"))
  );
  app.use(
    server.serverContext,
    express.static(path.join(__dirname, "../.tmp/client"))
  );
  app.use(logger("dev"));
  app.set("view engine", "jsx");
  app.engine("jsx", ReactViews.createEngine({ transformViews: true }));
} else {
  /**
   * app.locals.assetsManifest在不同环境获取方式有区别
   * 开发环境在configWebpackMiddleware模块中从webpack MemoryFileSystem读取assetsManifest.json
   * 生产环境从本地文件系统直接读取assetsManifest.json
   */
  const jsonPath = `${__dirname}/../client/assetsManifest.json`;
  app.locals.assetsManifest = JSON.parse(fs.readFileSync(jsonPath));

  app.use(
    server.serverContext,
    express.static(path.join(__dirname, "../client"), {
      maxAge: 5184000000 // 缓存60天
    })
  );
  app.use(compression());
  app.use(logger("combined"));
  app.set("view engine", "js");
  app.engine("js", ReactViews.createEngine({ transformViews: false }));
}

// app.use(favicon(
//   path.join(__dirname, '../client/images/tmp_favicon.ico'),
//   { maxAge: 60 * 60 * 24 * 2 },
// ));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(parseConfig());

app.use(server.serverContext, IndexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (__DEV__) {
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render("error", {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: {}
  });
});

export default app;
