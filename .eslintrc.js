module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	extends: [
		"airbnb-base",
	],
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
	},
	rules: {
		"arrow-parens": 0,
		camelcase: ["error", { allow: [".*"] }],
		"func-names": ["error", "never"],
		indent: ["error", "tab"],
		"no-bitwise": 0,
		"no-continue": 0,
		"no-sparse-arrays": 0,
		"no-tabs": 0,
		"object-shorthand": 0,
		"prefer-rest-params": 0,
		"prefer-default-export": 0,
		quotes: ["error", "double", { allowTemplateLiterals: true }],
	},
};
