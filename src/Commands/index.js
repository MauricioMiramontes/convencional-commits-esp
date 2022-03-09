const Dependencies = require("./Dependencies");
const HuskyScripts = require("./husky");

module.exports = {
    install: {
        command: `yarn add ${Dependencies.join(" ")} --dev`,
        message: "Iniciando instalación de dependencias...",
    },
    installComitizen: {
        command: "sudo yarn global add commitizen",
        message: "Iniciando instalación de Commitizen...",
    },
    initHusky: {
        command: "npx husky-init",
        message: "Iniciando instalación de Husky...",
    },
    createHuskyHooks: {
        command: `${HuskyScripts.join("; ")}`,
        message: "Iniciando creación de hooks de Husky...",
    },
};
