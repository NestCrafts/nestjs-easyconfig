<p align="left">
  <a href="http://github.com/rubiin/nest-easyconfigs/" target="blank"><img src="https://i.imgur.com/BvxL0JR.png" width="320" height="200" alt="" /></a>
</p>
 <p float="left">
<a href="https://www.npmjs.com/package/nestjs-easyconfig"><img src="https://img.shields.io/npm/l/nestjs-easyconfig" alt="Package License" /></a>
<a href="https://www.npmjs.com/package/nestjs-easyconfig"><img src="https://img.shields.io/npm/dw/nestjs-easyconfig" alt="NPM Downloads" /></a>
 <a href="https://www.npmjs.com/package/nestjs-pgpromise"><img src="https://github.com/rubiin/nestjs-easyconfig/actions/workflows/github-ci.yml/badge.svg" alt="CI" /></a> 
<a href=""><img src="https://badgen.net/dependabot/dependabot/dependabot-core/?icon=dependabot" /></a>

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


Other config include dotenv's configs like encoding (Default: utf8) and debug(Default: false)

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
Example of type processing:
Imagine you have a configuration file at `.env` with the following:

```bash
FOO=bar
BAZ=2
BEEP=false
BOOP=some,thing,that,goes,wow
# note how we use an asterisk here to turn off the parsing for this variable
BLEEP=false*
# note how we use an asterisk in the array to turn off parsing for an array key value
PING=ping,true*,2,100
# note a string between bacticks won't be parsed
PONG=`some,thing,that,goes,wow`
```

After using this plugin, the environment variables are parsed to their proper types.

To test it out, simply log the returned object in your console:

```js
console.log(env);
```

And you'll see that it outputs the properly parsed variable types:

```js
{
  // String
  FOO: 'bar',
  // Number
  BAZ: 2,
  // Boolean
  BEEP: false,
  // Array
  BOOP: [ 'some', 'thing', 'that', 'goes', 'wow' ],
  // NOTE: this was not parsed due to the * asterisk override above
  BLEEP: 'false',
  // NOTE: only the `true*` above was opted out through the use of an asterisk
  PING: [ 'ping', 'true', 2, 100 ],
  // NOTE: this was not parsed because the string was between bacticks
  PONG: 'some,thing,that,goes,wow'
}
```

If your configuration line ends in `*` it will not be parsed by this package, which allows you to keep values as the `String` variable type if needed. Also when you encapsulate a value between bacticks e.g. \`value\`, the value won't be parsed and it will return as a `String` variable. This can be used in situations where you for example have a ',' inside your string and it should not be parsed as an array.


## Config

```js
    /**
     * path to the file to load.
     * If this is not passed, Easyconfig load the environment file based on
     * the NODE_ENV with the naming convention of `.env.<NODE_ENV>`.
     *
     * For example, if the NODE_ENV is `production`, the file `.env.<NODE_ENV>` will load.
     */
    path ? : string;

    /**
     * path of the file to check the keys against when safe option is set to true.
     * Defaults to .env.sample
     */

    sampleFilePath ? : string;

    /**
     * checks whether the used env file is missing some keys.
     *
     * For example, if the given `.env` file has the following content:
     * ```
     * VAR=true
     * ```
     *
     * and the `.env.sample` file has the following:
     * ```
     * VAR=true
     * VAR2=sample value
     * ```
     *
     * the following error log will be printed:
     * ```
     * MissingEnvVarsError: [VAR2] were defined in .env.example but are not present in the environment:
     *     This may cause the app to misbehave.
     * ```
     */
    safe ? : boolean;

    /**
     * As the lib uses dotenv, You may turn on dotenv's logging to help debug why certain keys or
     * values are not being set as you expect.
     *
     * default : false
     */

    debug ? : boolean;

    /**
     * This turns on parse logs which help debug how keys are being parsed.
     *
     * default : false
     */

    parseLog ? : boolean;

    /**
     * This option lets you specify the encoding of your file containing environment variables.
     *
     * ```
     */

    encoding ? : string;

    /**
     * This option allows you to pass in a pre-defined logger instance.
     * The logger must implement the NestJS LoggerService interface
     */

    logger ? : LoggerService;

    /**
     * This option allows you assign the values to process.env . Defaults to true
     */

    assignToProcessEnv ? : boolean;

    /**
     * This option allows you overide a value on process.env if its alreadt set . Defaults to false
     */

    overrideProcessEnv ? : boolean;

```

## Contributing

In general, we follow the "fork-and-pull" Git workflow.

1. Fork the repo on GitHub
2. Clone the project to your own machine
3. Work on your fork
    1. Make your changes and additions
        - Most of your changes should be focused on `src/` and `test/` folders and/or `README.md`. 
        - Files in `dist/` folder are autogenerated when running tests (`npm run build`) and need not to be changed **manually**. 
    2. Change or add tests if needed
    3. Run tests and make sure they pass
    4. Add changes to README.md if needed
4. Commit changes to your own branch
5. **Make sure** you merge the latest from "upstream" and resolve conflicts if there is any
6. Repeat step 3(3) above
7. git add and run npm run commit and fill in the details accordingly
8. Push your work back up to your fork
9. Submit a Pull request so that we can review your changes

## Stay in touch

- Author - [Rubin Bhandari](https://github.com/rubiin)
- Dev․to - [@rubiin](https://dev.to/rubiin)
- Discord - [@rubin#1186](https://discordapp.com/)

## License

The package is [MIT licensed](LICENSE).

## Support on Beerpay

Hey dude! Help me out for a couple of :beers:!

[![Beerpay](https://beerpay.io/rubiin/nestjs-easyconfig/badge.svg?style=beer-square)](https://beerpay.io/rubiin/nestjs-easyconfig) [![Beerpay](https://beerpay.io/rubiin/nestjs-easyconfig/make-wish.svg?style=flat-square)](https://beerpay.io/rubiin/nestjs-easyconfig?focus=wish)

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/dlukanin"><img src="https://avatars1.githubusercontent.com/u/875405?v=4" width="100px;" alt=""/><br /><sub><b>Dmitry Lukanin</b></sub></a><br /><a href="#infra-dlukanin" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/rubiin/nestjs-easyconfig/commits?author=dlukanin" title="Tests">⚠️</a> <a href="https://github.com/rubiin/nestjs-easyconfig/commits?author=dlukanin" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/bradtaniguchi"><img src="https://avatars3.githubusercontent.com/u/10079147?v=4" width="100px;" alt=""/><br /><sub><b>Brad</b></sub></a><br /><a href="#infra-bradtaniguchi" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/rubiin/nestjs-easyconfig/commits?author=bradtaniguchi" title="Code">💻</a></td>
    <td align="center"><a href="https://coollabs.io"><img src="https://avatars1.githubusercontent.com/u/5845193?v=4" width="100px;" alt=""/><br /><sub><b>Andras Bacsai</b></sub></a><br /><a href="#infra-andrasbacsai" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
    <td align="center"><a href="http://www.eugenistoc.com"><img src="https://avatars1.githubusercontent.com/u/928780?v=4" width="100px;" alt=""/><br /><sub><b>Eugen Istoc</b></sub></a><br /><a href="https://github.com/rubiin/nestjs-easyconfig/commits?author=genu" title="Tests">⚠️</a> <a href="https://github.com/rubiin/nestjs-easyconfig/commits?author=genu" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/jmcdo29"><img src="https://avatars3.githubusercontent.com/u/28268680?v=4" width="100px;" alt=""/><br /><sub><b>Jay McDoniel</b></sub></a><br /><a href="https://github.com/rubiin/nestjs-easyconfig/commits?author=jmcdo29" title="Tests">⚠️</a> <a href="https://github.com/rubiin/nestjs-easyconfig/commits?author=jmcdo29" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/byteglory"><img src="https://avatars3.githubusercontent.com/u/72143629?v=4" width="100px;" alt=""/><br /><sub><b>Rubin shrestha</b></sub></a><br /><a href="#infra-byteglory" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/rubiin/nestjs-easyconfig/commits?author=byteglory" title="Tests">⚠️</a> <a href="https://github.com/rubiin/nestjs-easyconfig/commits?author=byteglory" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/Aavash"><img src="https://avatars1.githubusercontent.com/u/16209762?v=4" width="100px;" alt=""/><br /><sub><b>Aavash Khatri</b></sub></a><br /><a href="#infra-Aavash" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/rubiin/nestjs-easyconfig/commits?author=Aavash" title="Tests">⚠️</a> <a href="https://github.com/rubiin/nestjs-easyconfig/commits?author=Aavash" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
