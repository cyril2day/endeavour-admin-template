<p align="center">
  <a href="https://github.com/vuejs/core">
    <img src="https://img.shields.io/badge/vue-3.2.31-brightgreen.svg" alt="vue">
  </a>
  <a href="https://github.com/quasarframework/quasar">
    <img src="https://img.shields.io/npm/v/quasar?label=quasar" alt="quasar">
  </a>
  <a>
    <img src="https://img.shields.io/npm/v/%40quasar/app-vite?label=@quasar/app-vite" alt="quasar-app-vite">
  </a>
  <a href="https://github.com/vitest-dev/vitest">
    <img src="https://img.shields.io/npm/v/vitest?color=729B1B&label=vitest" alt="vitest">
  </a>
  <a href="https://github.com/cyril2day/endeavor-admin-template">
    <img src="https://github.com/cyril2day/endeavor-admin-template/actions/workflows/build.yml/badge.svg?branch=master" alt="Build Status"> 
  </a>
  <a href="https://github.com/cyril2day/endeavor-admin-template">
    <img src="https://github.com/cyril2day/endeavor-admin-template/actions/workflows/test.yml/badge.svg?branch=master" alt="Tests Status"> 
  </a>
  <a href="http://makeapullrequest.com">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat" alt="PRs Welcome">
  </a>
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT">
  </a>
</p>

# Endeavor Admin Template

A front-end solution for admin interfaces based on Vue 3, Typescript and [Quasar](https://quasar.dev). 

This project compliments [Laravel Restful API](https://github.com/markheramis/laravel-restful-api) backend which focuses on REST API and Microservices.

## Setting Up

```bash
# clone the project
git clone https://github.com/cyril2day/endeavor-admin-template.git
```

```bash
# cd into the project directory
cd endeavor-admin-template
```

```bash
# install quasar cli as global
npm install -g @quasar/cli
```

```bash
# install yarn
npm install --global yarn
```

```bash
# install project dependencies through yarn
yarn install
```


## Development

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
yarn dev
```

### Lint the files

```bash
yarn lint
```

### Format the files

```bash
yarn format
```

### Run tests

Test suite configured is [Vitest](https://vitest.dev). E2E will be [Cyrpress](https://www.cypress.io/) (coming soon)

```bash
yarn test:unit
# or
yarn coverage
```

### Build the app for production

```bash
yarn build
```

### Customize the configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).


## Todos

- Standalone mock server 
- Cypress integration


## Credits

Many thanks to the following awesome projects:

- [vue-typescript-admin-template](https://github.com/Armour/vue-typescript-admin-template)
- [Quasar](https://github.com/quasarframework/quasar)
- [Vitest](https://github.com/vitest-dev/vitest)
- [Vue](https://github.com/vuejs/core)
- [Typescript](https://github.com/microsoft/TypeScript)
- [Laravel Restful API](https://github.com/markheramis/laravel-restful-api)


## License

This project is open-source licensed under the [MIT license](https://opensource.org/licenses/MIT). Copyright (c) 2022-present cy.lonsido@gmail.com
