
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

[Nest-easyconfigs](https://github.com/rubiin/nest-easyconfigs)  loads configs from your .env (Wraps dotenv module)

## Installation

```bash
$ npm install nest-easyconfigs
```

## Usage
```javascript
import  { Module }  from  '@nestjs/common';
import { EasyconfigModule } from  'nest-easyconfigs';

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
