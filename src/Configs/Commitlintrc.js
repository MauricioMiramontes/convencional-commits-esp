exports.COMMITLINTRC = {
    extends: ["@commitlint/config-conventional"],
    rules: {
        "type-enum": [
            2,
            "always",
            ["ci", "chore", "docs", "feat", "fix", "perf", "refactor", "revert", "style", "test", "build"],
        ],
        "body-max-line-length": [0, "always", 72],
    },
};
