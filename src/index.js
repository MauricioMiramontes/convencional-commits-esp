#!/usr/bin/env node
const {exec} = require('child_process');
const {readFileSync, writeFileSync} = require('fs');

const DEPENDENCIES = [
    "@commitlint/config-conventional @commitlint/cli",
    "eslint",
    "husky",
    "lint-staged",
    "prettier"
];

const HuskyScripts = [
    "npx husky set .husky/pre-commit 'npm run pre-commit'",
    "npx husky add .husky/commit-msg 'npx --no-install commitlint --edit'"
]

function InitHusky() {
    console.log("Iniciando Husky...");
    exec("npx husky-init", (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`${stdout}`);
        console.log("Husky iniciado correctamente!");
        CreateHuskyHooks();
    })
}

function InstallDependencies() {
    console.log("Iniciando instalacion de dependencias...");
    exec(`yarn add ${DEPENDENCIES.join(" ")} --dev; yarn global add commitizen` , (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`${stdout}`);
        InitHusky();
    })
}


function CreateHuskyHooks() {
    console.log("Creando hooks de Husky...");
    exec(`${HuskyScripts.join("; ")}`, 
    (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`${stdout}`);
    })
  
    const str = readFileSync('./package.json', 'utf-8')
    let pkg = JSON.parse(str)
    pkg.scripts ||= {}
    if (pkg.scripts['pre-commit'] !== undefined) console.log("El comando pre-commit ya existe en el package.json");
    else {
        console.log(`Creando comando pre-commit en el package.json`);
        pkg.scripts['pre-commit'] = 'lint-staged'
    }
    writeFileSync('./package.json', JSON.stringify(pkg, null, 2))
}

function main() {
    console.log("Iniciando instalacion de commits convencionales en el repositorio actual...");
    InstallDependencies();
}

if (require.main === module) {
    main();
}