module.exports = {
    root: true,
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    env: {
      browser: true,
      es2022: true,
      node: true,
    },
    extends: [
      'next/core-web-vitals',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      'plugin:jsx-a11y/recommended',
      'plugin:import/recommended',
      'plugin:import/typescript',
    ],
    rules: {
      // Dilersen kurallar ekleyebilirsin
      'react/react-in-jsx-scope': 'off', // Next.js'de React import etmeye gerek yok
      '@next/next/no-html-link-for-pages': 'off',
      'import/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
          'newlines-between': 'always',
        },
      ],
    },
  }
  