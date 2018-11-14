module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "babel",
        "react"
    ],
    "rules": {
        "indent": [
            "error",
            "tab",
            {
                "ObjectExpression": "first",
                "flatTernaryExpressions": true,
                "ignoredNodes": ["JSXElement", 'JSXElement > *', 'JSXAttribute', 'JSXIdentifier', 'JSXNamespacedName', 'JSXMemberExpression', 'JSXSpreadAttribute', 'JSXExpressionContainer', 'JSXOpeningElement', 'JSXClosingElement', 'JSXText', 'JSXEmptyExpression', 'JSXSpreadChild']
            }
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "never"
        ],
        "no-unused-vars": "warn",
        "no-invalid-this": 0,
        "babel/no-invalid-this": 1,
        //"class-methods-use-this": "warn",
        "no-console": [
            "off",
            { "allow": ["error"] }
        ],
        "operator-linebreak": [
            "error",
            "before",
            { "overrides": {
                "=": "ignore"
            }}
        ],
        "no-multi-spaces": [
            "error",
            { "exceptions": {} }
        ],
        "react/jsx-no-bind": [
            "error",
            { "ignoreRefs": true }
        ],
        "react/no-unescaped-entities": [
            "error", 
            {"forbid": ["<", ">", "{", "}"]}
        ],
        "react/jsx-indent": [
           0
        ]
    },
    "parser": "babel-eslint",
    "parserOptions": { "sourceType": "module" }
};