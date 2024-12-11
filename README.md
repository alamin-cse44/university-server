### To run this project locally, what you need to install?

- NODE.JS
- TYPESCRIPT
- EXPRESS.JS
- MONGOOSE
- MONGODB ATLAS / COMPASS

For the better code writing and avoiding unnecessary error I have installed —

- TYPESCRIPT ESLINT AND PRETTIER

## The way I have started my project is described bellow—

# init package.json file

- npm init -y

### Install express, mongoose, typescript [as dev dependency], cors, dotenv

- `npm install express`
- `npm install mongoose --save`
- **npm install typescript --save-dev**
- npm i cors
- npm i dotenv

# For typescript init a ts json file

- tsc -init [then in tsconfig.json file update the below lines]
- "rootDir": "./src",
- "outDir": "./dist",

# To run the ts file in js make a script in package.json file in script section

- "build": "tsc",

then run —→  

- npm run build [dist folder will be created and the js files will be available there]

## separate the listening port of mongoose connection in the server.ts file and setup config file for handling the .env file globally in an efficient way.

### Integrating eslint and prettier in the project

- https://blog.logrocket.com/linting-typescript-eslint-prettier/

### To run the ts file directly install the command but it is only for faster developing purpose.

- npm i ts-node-dev
- ts-node-dev --respawn --transpile-only src/server.ts  — to run the server file

### In the package.json file I have written some scripts to enhance the developing. Scripts are following

```
    "start:prod": "node ./dist/server.js",
    "start:dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "lint": "npx eslint src --ignore-pattern '.js,.ts'",
    "lint:fix": "npx eslint src --fix",
    "prettier": "prettier --ignore-path .gitignore --write \"./src/**/*.+(js|ts|json)\"",
    "prettier:fix": "npx prettier --write src",
```

Here, use the command **npm run start:dev**  and others necessary command when it is needed.  

- use start:dev to run the project in the production
- start:dev use for faster project run in the development
- build use for converting ts file into js
- lint, use to check the warnings / error
- lint:fix , use for auto fixing
- prettier, use for check and fix the extra gap.
