const HuskyScripts = [
    "npx husky set .husky/pre-commit 'npm run pre-commit'",
    "npx husky add .husky/commit-msg 'npx --no-install commitlint --edit'",
];

exports.HUSKY_SCRIPTS = HuskyScripts;
