## Для всех проектов спринт 1-2
### инициализируем node приложение:
yarn init --yes

### устанавливаем express:
yarn add express

### устанавливаем nodemon в devDependencies:
yarn add nodemon --dev

### устанавливаем typescript и типы для express, node:
yarn add typescript ts-node @types/node @types/express --dev

### генерируем tsconfig (или создаем вручную файл tsconfig.json в корневой папке проекта):
yarn tsc --init

###  предпочтительные настройки (содержимое) tsconfig.json:
```
{
"compilerOptions": {
"target": "es2016",
"module": "commonjs",
"outDir": "./dist",
"strict": true,
"noImplicitReturns": true,
"esModuleInterop": true,
"allowSyntheticDefaultImports": true,
"skipLibCheck": true,
"forceConsistentCasingInFileNames": true
},
"include": ["src/**/*"],
"exclude": ["node_modules", "**/*.test.ts"]
}
```
### в package.json добавляем scripts:

``` 
"scripts": {
"dev": "yarn nodemon --inspect dist/index.js",
"watch": "tsc -w"
},
```

### JEST
1. Установка и настройка библиотек:
```
yarn add jest ts-jest @types/jest supertest @types/supertest
```
```
yarn ts-jest config:init
```
```
"scripts": {
"jest": "jest"
},
```

2. В корне проекта создаем папку  __tests__

3. В папке  __tests__  создаем файл  name.e2e.test.ts  (в качестве примера создан файл blogs.e2e.tests.ts)



###  Для Валидации
```
yarn add express-validator
```
### Для uuid
```
yarn add @types/uuid
```
### Для date-fns
```
yarn add @types/date-fns
```

### JSONjewebtocken
```
yarn add @types/jsonwebtoken
```
### для писем
```
yarn add @types/nodemailer
```
### Для дебага в тестах

```
yarn add morgan-body
```

```
yarn add body-parser
```

```
yarn add @types/body-parser
```


### Vercel

vercel.json


```

{
"version": 2,
"name": "sprint2_hw1",
"builds": [
{
"src": "src/index.ts",
"use": "@vercel/node"
}
],
"routes": [
{
"src": "/(.*)",
"dest": "src/index.ts"
}
]
}
```


# !!Если все удалить node_modules, то запустить!!
```
yarn install
```
# Баги
после обновления ноды заново сделай
1) yarn install
2) jest --version

если установлен jest идем дальше, если нет то ставишь его
3)yarn list supertest

если супертест установлен идем дальше
4)yarn add @types/supertest -dev
5)yarn add @types/jest -dev

это мы установили типы ts для этих библиотек