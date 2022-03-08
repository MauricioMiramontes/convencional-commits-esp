#!/usr/bin/env node
/* eslint-disable no-console */
const { exec } = require("child_process");
const { readFileSync, writeFileSync, appendFile } = require("fs");
const { CONFIG_FILES } = require("./Configs/index");
const { HUSKY_SCRIPTS } = require("./Configs/HuskyScripts");
const { DEPENDENCIES } = require("./Configs/Dependencies");

function InstallDependencies() {
    console.log("Iniciando instalacion de dependencias...");
    exec(`yarn add ${DEPENDENCIES.join(" ")} --dev;`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        if (stderr) {
            console.log(`${stderr}`);
            return;
        }
        console.log(`${stdout}`);
        // InstallCommitizen();
        InitHusky();
    });
}

function InstallCommitizen() {
    console.log("Instalando Commitizen...");
    exec("yarn global add commitizen", (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        if (stderr) {
            console.log(`${stderr}`);
            return;
        }
        console.log(`${stdout}`);
        InitHusky();
    });
}

function InitHusky() {
    console.log("Iniciando Husky...");
    exec("npx husky-init", (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        if (stderr) {
            console.log(`${stderr}`);
            return;
        }
        console.log(`${stdout}`);
        console.log("Husky iniciado correctamente!");
        CreateHuskyHooks();
    });
}

function CreateHuskyHooks() {
    console.log("Creando hooks de Husky...");
    exec(`${HUSKY_SCRIPTS.join("; ")}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        if (stderr) {
            console.log(`${stderr}`);
            return;
        }
        console.log(`${stdout}`);
        CreateScripts();
    });
}

function CreateConfigFiles() {
    console.log("Creando archivos de configuracion...");
    for (let i = 0; i < CONFIG_FILES.length; i += 1) {
        const { name, data, stringify } = CONFIG_FILES[i];
        appendFile(name, stringify ? JSON.stringify(data) : data, (err) => {
            if (err) throw err;
            console.log(`Archivo ${name} creado correctamente!`);
        });
    }
}

function CreateScripts() {
    console.log("Creando scripts...");
    let str = "";
    try {
        str = readFileSync("./package.json", "utf-8");
    } catch (e) {
        console.log("No se encontro el archivo package.json, porfavor asegurate de estar en la raiz del proyecto");
        return;
    }
    const pkg = JSON.parse(str);

    const scipt = pkg.scripts.length !== 0 ? pkg.scripts : {};

    if (scipt["pre-commit"] !== undefined) console.log("El comando pre-commit ya existe en el package.json");
    else {
        console.log("Creando comando pre-commit en el package.json");
        scipt["pre-commit"] = "lint-staged";
    }
    if (scipt["release:beta"] !== undefined) console.log("El comando release:beta ya existe en el package.json");
    else {
        console.log("Creando comando release:beta en el package.json");
        scipt["release:beta"] = "standar-version -- --prerelease beta";
    }
    if (scipt.release !== undefined) console.log("El comando release ya existe en el package.json");
    else {
        console.log("Creando comando release en el package.json");
        scipt.release = "standard-version";
    }
    writeFileSync("./package.json", JSON.stringify(pkg, null, 2));
    CreateConfigFiles();
}

function main() {
    console.log("Iniciando instalacion de commits convencionales en el repositorio actual...");
    InstallDependencies();
}

if (require.main === module) {
    main();
}
