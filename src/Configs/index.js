const { ESLINT_CONFIG, ESLINT_IGNORE } = require("./ESLint");
const { PRETTIER_RC } = require("./Prettierrc");
const { LINTSTAGEDRC } = require("./Lintstagedrc");


exports.CONFIG_FILES = [
    {
        name: ".eslintrc.json",
        data: ESLINT_CONFIG,
        stringify: true
    },
    {
        name: ".eslintignore",
        data: ESLINT_IGNORE,
        stringify: false
    },
    {
        name: ".prettierrc",
        data: PRETTIER_RC,
        stringify: true
    },
    {
        name: ".lintstagedrc",
        data: LINTSTAGEDRC,
        stringify: true
    }
]