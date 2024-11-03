module.exports = {
  plugins: ['testing-library', 'jest'],
  overrides: [
    {
      files: ['**/?(*.)+(spec|test).[jt]s?(x)'],
      extends: ['plugin:testing-library/react'],
    },
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    // Base rules
    'react/react-in-jsx-scope': 'off',
    'import/extensions': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    'react/prop-types': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'react/display-name': 'off',
    'no-console': 'warn',
    '@typescript-eslint/no-empty-function': 'warn',
    '@typescript-eslint/ban-ts-comment': 'warn',
    'react/jsx-props-no-spreading': 'off',
    'import/prefer-default-export': 'off',
    'import/no-unresolved': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'react-hooks/exhaustive-deps': 'warn',

    // Indentation rules
    'react/jsx-indent': 'off',
    'react/jsx-indent-props': 'off',
    'indent': 'off',
    '@typescript-eslint/indent': 'off',

    // Layout rules
    'react/jsx-first-prop-new-line': 'off',
    'react/jsx-max-props-per-line': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react-hooks/exhaustive-deps': 'off',

    // Directive rules
    'lines-around-directive': 'off',           // ปิดกฎเรื่องบรรทัดว่างรอบ directive
    'padding-line-between-statements': [       // กำหนดเองแบบยืดหยุ่น
      'warn',
      {
        blankLine: 'any',                      // อนุญาตให้มีหรือไม่มีบรรทัดว่างก็ได้
        prev: 'directive',
        next: '*'
      }
    ],
    'strict': 'off',                          // ไม่บังคับเรื่อง strict mode
    'lines-between-class-members': 'warn',    // แค่เตือนเรื่องบรรทัดว่างระหว่าง class members

    'max-classes-per-file': 'off',
  }
};