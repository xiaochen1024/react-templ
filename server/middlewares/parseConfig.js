import _ from "lodash";

export default function() {
  return function(req, res, next) {
    const serverConfig = req.app.locals.server;

    res.locals.exposedServer = _.pick(serverConfig, [
      "h5root",
      "gateway",
      "serverContext"
    ]);

    next();
  };
}
