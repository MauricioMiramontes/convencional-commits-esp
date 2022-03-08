const Dependencies = require("./Dependencies.js");
const HuskyScripts = require("./husky.js");

module.exports = {
    install: `yarn add ${Dependencies.join(" ")} --dev`,
    installComitizen: "sudo yarn global add commitizen",
    initHusky: "npx husky-init",
    createHuskyHooks: `${HuskyScripts.join("; ")}`,
};
