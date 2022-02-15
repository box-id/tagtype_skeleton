module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
    rules: {
        "@typescript-eslint/no-inferrable-types": [
            "warn",
            {
                ignoreParameters: true,
            },
        ],
        "@typescript-eslint/no-explicit-any": ["off"],
        "@typescript-eslint/no-unused-vars": [
            "warn",
            {
                ignoreRestSiblings: true,
                argsIgnorePattern: "^_",
            },
        ],
        "no-console": ["error", { allow: ["info", "warn", "error"] }],
    },
}
