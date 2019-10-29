<p align="center">
  <a href="http://github.com/nest-easyconfigs/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>
<p align="center">.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjs-eastconfig"><img src="https://img.shields.io/npm/l/nestjs-easyconfig" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjs-eastconfig"><img src="https://img.shields.io/npm/dw/nestjs-easyconfig" alt="NPM Downloads" /></a>
<a href="https://circleci.com/rubiin/nestjs-easyconfig"><img src="https://circleci.com/gh/rubiin/nestjs-easyconfig/tree/master.svg?style=shield" alt="circleci" /></a>
<a href=""><img src="https://badgen.net/dependabot/dependabot/dependabot-core/?icon=dependabot" /></a>
<a href="https://beerpay.io/rubiin/nestjs-easyconfig"><img src="https://beerpay.io/rubiin/nestjs-easyconfig/badge.svg?style=plastic" /></a>

</p>
 
## Description

[Nestjs-easyconfig](https://github.com/rubiin/nestjs-easyconfig) loads configs from your `.env` (Wraps dotenv module) ⚙️ 🔥

## Installation

```bash
$ npm install nestjs-easyconfig
$ yarn add nestjs-easyconfig
```

## Usage

### With config file supplied (basic):

```javascript
import { Module } from '@nestjs/common';
import { EasyconfigModule } from 'nestjs-easyconfig';

@Module({
  imports: [EasyconfigModule.register({ path: './config/.env' })],
})
export class AppModule {}
```

### With config file supplied and safe set to true:

```javascript
import { Module } from '@nestjs/common';
import { EasyconfigModule } from 'nestjs-easyconfig';

@Module({
  imports: [EasyconfigModule.register({ path: './config/.env', safe: true })],
})
export class AppModule {}
```

By default safe is set to false. When safe is set to `true`, the module compares the supplied env
file with the sample env file to find missing keys. If any keys which are in .env.sample but not in the evironment used, it is immediately reported in console.

`Note`: To use this, a sample env file `.env.sample` should be placed in the root dir

### Without config file supplied:

```javascript
import { Module } from '@nestjs/common';
import { EasyconfigModule } from 'nestjs-easyconfig';

@Module({
  imports: [EasyconfigModule.register({})],
})
export class AppModule {}
```

In this case, you have to pass in the <b>NODE_ENV</b> value and the `.env` file to read will be determined accordingly.
Loads environment variables from `.env.[development|test|production][.local]` files
For example, <b>NODE_ENV=dev</b> will make the app read `.env.dev`

> Note: The .env file also has to be in root folder

### Getting environment variables

Regardless of how the `EasyconfigModule` is imported into the app, you can get the variable values using the `EasyconfigService`.

```javascript
import { Controller, Get } from '@nestjs/common';
import { EasyconfigService } from 'nestjs-easyconfig';

@Controller('api')
export class AppController {
  constructor (private config: EasyconfigService) {}
  @Get()
  findAll() {
    return {
      value: this.config.get('key')
    };
  }
}
```

> Note: the `get` method will automatically cast environment variables

### Type processing
Module uses dotenv-parse-variables lib (https://www.npmjs.com/package/dotenv-parse-variables) to process env file.
Example of type processing:

```
    foo=test
    bar=1
    baz=true
    qux=test,1,true,
    bat=false*,
    qwe=`1,2,3`,
    asd=test,1,true*
```
will be processed to
```javascript
    {
        foo: 'test',
        bar: 1,
        baz: true,
        qux: ['test', 1, true],
        bat: 'false',
        qwe: '1,2,3',
        asd: ['test', 1, 'true']
    }
```

## Contributing

To contribute to project, follow these steps:

   - Fork this repository.
   - Create a branch: git checkout -b <branch_name>.
   - Make your changes and commit them: `git commit -m '<commit_message>'
   - Push to the original branch: git push origin <project_name>/<location>
   - Create the pull request.

## Stay in touch

- Author - [Rubin Bhandari](https://github.com/rubiin)
- Dev․to - [@rubinsays](https://dev.to/rubiin)
- Discord - [@rubin#1186](https://discordapp.com/)

## License

The package is [MIT licensed](LICENSE).

## Support on Beerpay

Hey dude! Help me out for a couple of :beers:!

[![Beerpay](https://beerpay.io/rubiin/nestjs-easyconfig/badge.svg?style=beer-square)](https://beerpay.io/rubiin/nestjs-easyconfig) [![Beerpay](https://beerpay.io/rubiin/nestjs-easyconfig/make-wish.svg?style=flat-square)](https://beerpay.io/rubiin/nestjs-easyconfig?focus=wish)
