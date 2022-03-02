#!/usr/bin/env node
const {exec} = require('child_process');

const Dependencies = [
    "@commitlint/config-conventional",
    "@commitlint/cli",
    "eslint",
    "husky",
    "lint-staged",
    "prettier"
];

const HuskyScripts = [
    ".husky/commit-msg 'npx --no-install commitlint --edit'",
    ".husky/pre-commit 'npm run pre-commit'",
]

async function InstallDependencies() {
    console.log("Iniciando instalacion de dependencias...");
    for await (let dependencia of Dependencies) {
        console.log("Instalando dependencia: " + dependencia);
        exec("sudo npm install --save-dev" + dependencia, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            console.log(`${stdout}`);
        })
    }
    exec("npm install -g commitizen" , (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`${stdout}`);
    })
}

async function CreateHuskyHooks() {
    console.log("Creando hooks de husky...");
    await exec("npx husky-init", (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`${stdout}`);
    })
    // "prepare": "husky install"
    for(let script of HuskyScripts) {
        exec("npx husky add " + script, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            console.log(`${stdout}`);
        })
    }

}

function main() {
    console.log("Iniciando instalacion de commits convencionales en el repositorio actual...");
    InstallDependencies().then(CreateHuskyHooks())
}

if (require.main === module) {
    main();
}