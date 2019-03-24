const React = require("react");
const ReactDOMServer = require("react-dom/server");
const beautifyHTML = require("js-beautify").html;
const assign = require("object-assign");
const _escaperegexp = require("lodash.escaperegexp");
const path = require("path");
const fs = require("fs");

const { VIEW_PATH } = require("../constants");

const BEAUTIFY = false;
const DOCTYPE = "<!DOCTYPE html>";
const BABEL_CONFIG = {
  presets: [
    "@babel/preset-react",
    [
      "@babel/preset-env",
      {
        targets: {
          node: "current"
        }
      }
    ]
  ],
  plugins: ["@babel/transform-flow-strip-types"]
};

module.exports = (req, res) =>
  new Promise((resolve, reject) => {
    const routes = req.body.routes;

    require("@babel/register")({
      only: [VIEW_PATH],
      ...BABEL_CONFIG
    });

    const routeMap = Object.entries(routes).reduce(
      (map, [routeName, routeView]) => {
        const componentModule = require(path.join(VIEW_PATH, routeView));
        const component = componentModule.default || componentModule;
        const markup =
          DOCTYPE +
          ReactDOMServer.renderToStaticMarkup(
            React.createElement(component, req.body.data)
          );
        map[routeName] = BEAUTIFY ? beautifyHTML(markup) : markup;
        return map;
      },
      {}
    );

    resolve(routeMap);
  });
