const RouterPath = require("../../RouterPath.js");

class RouterPathLogin extends RouterPath {
  constructor(subsystem, router) {
    super(subsystem, router, "/login");
  }

  get(req, res) {
    res.send("Hello World!");
  }

  post(req, res) {

  }
}

module.exports = RouterPathLogin;
