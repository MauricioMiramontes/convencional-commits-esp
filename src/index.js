#!/usr/bin/env node
/* eslint-disable no-await-in-loop */
/* eslint-disable guard-for-in */
/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
const { readFileSync, writeFileSync, appendFile, existsSync } = require("fs");
const { promisify } = require("util");
const { exec } = require("child_process");

const execute = promisify(exec);

const { CONFIG_FILES } = require("./Configs/index");
const COMMANDS = require("./Commands/index");
const SCRIPTS = require("./Configs/Scripts.json");

/**
 * Se crean los archivos de configuración de: eslintrc, eslintignore, prettierrc y lintstagedrc.
 *
 * @return {void}
 */

const CreateConfigFiles = () => {
    console.log("Creando archivos de configuración...");
    for (const key in CONFIG_FILES) {
        const { name, data, stringify } = CONFIG_FILES[key];
        const FILE_CONTENT = stringify ? JSON.stringify(data) : data;
        if (!existsSync(name)) {
            appendFile(name, FILE_CONTENT, (error) => {
                if (error) throw error;
                console.log(`Archivo ${name} creado correctamente!`);
            });
        } else {
            console.log(`Archivo ${name} ya existe!`);
        }
    }
};

/**
 *   Carga y retorna un archivo JSON dada una ruta valida
 *
 * @param {string} filePath Ruta del archivo JSON a abrir.
 *
 * @return {object} En caso de cumplir con la condición.
 *
 */
const loadFile = (filePath) => {
    let contentFile = "";
    try {
        contentFile = readFileSync(filePath, "utf-8");
        contentFile = JSON.parse(contentFile);
    } catch (error) {
        console.log("No se encontro el archivo package.json, porfavor asegurate de estar en la raiz del proyecto");
    }
    return contentFile;
};

/**
 * Agrega dentro del archivo package.json la ruta para la configuración de commitizen.
 * Esta funcion estara comentada hasta que se haya publicado el paquete cz-configuraciones-es
 *
 * @return {void}
 */

const CreateCommitizenConfig = () => {
    console.log("Agregando configuracion de Commitizen al package.json...");
    const contentPackage = loadFile("./package.json");
    if (contentPackage) {
        const { config = {} } = contentPackage;
        const { commitizen = {} } = config;
        let { path = "" } = commitizen;
        path = "./node_modules/@televisa-digital/cz-configuration";
        const COMMITIZEN_CONFIG = { config: { commitizen: { path } } };
        Object.assign(contentPackage, COMMITIZEN_CONFIG);
        const FILE_CONTENT = JSON.stringify(contentPackage, "", 4);
        writeFileSync("./package.json", FILE_CONTENT);
    }
};

/**
 * Agrega dentro del archivo package.json los scripts que se encuentran en el archivo Configs/Scripts.js
 *
 * @return {void}
 */
const CreateScripts = () => {
    console.log("Creando scripts...");
    const contentPackage = loadFile("./package.json");
    if (contentPackage) {
        const { scripts = {} } = contentPackage;
        for (const key in SCRIPTS) {
            const COMMAND = SCRIPTS[key];
            if (!scripts[key]) {
                console.log(`Creando comando ${key} en el package.json`);
                scripts[key] = COMMAND;
            }
        }
        Object.assign(contentPackage, { scripts });
        const FILE_CONTENT = JSON.stringify(contentPackage, "", 4);
        writeFileSync("./package.json", FILE_CONTENT);
    }
};

/**
 * Se ejecuta en consola un comando dado por parámetro.
 *
 * @param {string} command  Comandos a ejecutar.
 * @param {string} message  Mensaje personalizado.
 *
 * @return {boolean}
 */
const executeCommand = async (command, message) => {
    console.info(message);
    let responseCommand = false;
    try {
        const { stdout, stderr } = await execute(command);
        const RESPONSE = stdout || stderr;
        console.log(RESPONSE);
        responseCommand = true;
    } catch (NotifyErrorCommand) {
        console.error(NotifyErrorCommand.message);
    }
    return responseCommand;
};

/**
 * Se inicia la instalacion de las dependencias de la aplicación.
 * Se hace la iniciacion de Huksy y la creacion de los scripts y archivos de configuración.
 *
 * @return {void}
 *
 */
const main = async () => {
    console.log("Iniciando instalación de commits convencionales en el repositorio actual...");
    for (const key in COMMANDS) {
        const { command, message } = COMMANDS[key];
        const EXECUTE = await executeCommand(command, message);
        if (!EXECUTE) {
            console.error(`Imposible ejecutar el commando ${command}`);
            break;
        }
    }
    CreateCommitizenConfig();
    CreateScripts();
    CreateConfigFiles();
};

if (require.main === module) {
    main();
}
