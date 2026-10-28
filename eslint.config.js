export default [{
  files: ['api/**/*.js','server/**/*.js','scripts/**/*.mjs','tests/**/*.js'],
  languageOptions: {ecmaVersion:'latest',sourceType:'module'},
  rules: {
    'no-constant-condition':'error','no-dupe-args':'error','no-dupe-keys':'error',
    'no-duplicate-case':'error','no-unreachable':'error','no-unsafe-finally':'error',
    'valid-typeof':'error','constructor-super':'error','no-async-promise-executor':'error',
    'no-promise-executor-return':'error','no-unexpected-multiline':'error'
  }
}];
