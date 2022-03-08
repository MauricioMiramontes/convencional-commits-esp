#!/usr/bin/env node
/* eslint-disable no-console */
const { exec } = require("child_process");
const { readFileSync, writeFileSync, appendFile } = require("fs");
const { CONFIG_FILES } = require("./Configs/index");
const { install, installComitizen, initHusky, createHuskyHooks }  = require("./Commands/index");

// function CreateConfigFiles() {
//     console.log("Creando archivos de configuracion...");
//     for (let i = 0; i < CONFIG_FILES.length; i += 1) {
//         const { name, data, stringify } = CONFIG_FILES[i];
//         appendFile(name, stringify ? JSON.stringify(data) : data, (err) => {
//             if (err) throw err;
//             console.log(`Archivo ${name} creado correctamente!`);
//         });
//     }
// }

// function CreateScripts() {
//     console.log("Creando scripts...");
//     let str = "";
//     try {
//         str = readFileSync("./package.json", "utf-8");
//     } catch (e) {
//         console.log("No se encontro el archivo package.json, porfavor asegurate de estar en la raiz del proyecto");
//         return;
//     }
//     const pkg = JSON.parse(str);

//     const scipt = pkg.scripts.length !== 0 ? pkg.scripts : {};

//     if (scipt["pre-commit"] !== undefined) console.log("El comando pre-commit ya existe en el package.json");
//     else {
//         console.log("Creando comando pre-commit en el package.json");
//         scipt["pre-commit"] = "lint-staged";
//     }
//     if (scipt["release:beta"] !== undefined) console.log("El comando release:beta ya existe en el package.json");
//     else {
//         console.log("Creando comando release:beta en el package.json");
//         scipt["release:beta"] = "standar-version -- --prerelease beta";
//     }
//     if (scipt.release !== undefined) console.log("El comando release ya existe en el package.json");
//     else {
//         console.log("Creando comando release en el package.json");
//         scipt.release = "standard-version";
//     }
//     writeFileSync("./package.json", JSON.stringify(pkg, null, 2));
//     CreateConfigFiles();
// }

const executeCommand = (command, msg) =>
  new Promise((resolve, reject) => {
    console.log(msg);
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`error: ${error}`);
        resolve(false);
      }
      if (stderr) {
        console.error(`${stderr}`);
        resolve(false);
      }
      console.log(stdout);
      resolve(true);
    });
  });

function main() {
  console.log(
    "Iniciando instalacion de commits convencionales en el repositorio actual..."
  );
  executeCommand(install, "Iniciando instalación de dependencias...")
    .then((installResponse) => {
      if (installResponse) {
        executeCommand(installComitizen, "Iniciando instalación de Commitizen...")
        .then((installCommitizenResponse) => {
            if (installCommitizenResponse) {
                executeCommand(initHusky, "Iniciando instalación de Husky...")
                .then((initHuskyResponse) => {
                    if (initHuskyResponse) {
                        executeCommand(createHuskyHooks, "Iniciando creación de hooks de Husky...")
                        .then((createHuskyHooksResponse) => {
                            if (createHuskyHooksResponse) {
                                console.log('exito');
                            }
                        });
                    }
                });
            }
        });
    }
    });
}

if (require.main === module) {
  main();
}
