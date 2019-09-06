
<p align="center">
  <a href="http://github.com/nest-easyconfigs/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>
<p align="center">.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/dm/@nestjs/core.svg" alt="NPM Downloads" /></a>
<a href="https://travis-ci.org/nestjs/nest"><img src="https://api.travis-ci.org/nestjs/nest.svg?branch=master" alt="Travis" /></a>


</p>
 
## Description

[Nestjs-easyconfig](https://github.com/rubiin/nestjs-easyconfig)  loads configs from your .env (Wraps dotenv module)

## Installation

```bash
$ npm install nestjs-easyconfig
```

## Usage
```javascript
import  { Module }  from  '@nestjs/common';
import { EasyconfigModule } from  'nestjs-easyconfig';

@Module({
 imports:  [EasyconfigModule.register({path: './config/.env'})],
})
export  class  AppModule  {}
```

## Stay in touch

- Author - [Rubin Bhandari](https://github.com/rubiin)
- Dev․to - [@rubinsays](https://dev.to/rubinsays)
- Discord - [@rubin#1186](https://discordapp.com/)

## License

  The package is [MIT licensed](LICENSE).

## Support on Beerpay
Hey dude! Help me out for a couple of :beers:!

[![Beerpay](https://beerpay.io/rubiin/nest-easyconfigs/badge.svg?style=beer-square)](https://beerpay.io/rubiin/nest-easyconfigs)  [![Beerpay](https://beerpay.io/rubiin/nest-easyconfigs/make-wish.svg?style=flat-square)](https://beerpay.io/rubiin/nest-easyconfigs?focus=wish)