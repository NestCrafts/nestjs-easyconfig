const dotenv = require('dotenv');
const fs= require('fs');

Array.prototype.diff = function (a) {
    return this.filter(function (i) { return a.indexOf(i) < 0; });
};


const getKeys = (filepath)=>{
    return Object.keys(dotenv.parse(fs.readFileSync(filepath)))
}

const src =getKeys('.env.sample')
const myfile = getKeys('.env.dev')

console.log(src.diff(myfile))