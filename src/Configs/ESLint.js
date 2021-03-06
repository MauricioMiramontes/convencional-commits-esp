exports.ESLINT_CONFIG = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: ["plugin:react/recommended", "airbnb", "prettier"],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 13,
        sourceType: "module",
    },
    plugins: ["react", "prettier"],
    rules: {
        "function-paren-newline": ["error", "consistent"],
        "linebreak-style": ["error", "unix"],
        "no-undef": "error",
        "no-underscore-dangle": [
            2,
            {
                allow: ["_type"],
            },
        ],
        "prettier/prettier": "error",
        quotes: ["error", "double"],
        semi: ["error", "always"],
    },
};

exports.ESLINT_IGNORE = `/.vscode
/.next
/dist
/node_modules
eslintFormat.js
/reports
/public`;
