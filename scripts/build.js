const fs = require('fs');
const path = require('path');
const root = require('rootrequire');

const dist = (...args) => path.resolve(root, 'dist', ...args);

const pantoner = {
  coated: require('pantoner/json/pantone-coated.json'),
  uncoated: require('pantoner/json/pantone-uncoated.json'),
  metallic: require('pantoner/json/pantone-metallic.json'),
  pastelsNeons: require('pantoner/json/pantone-pastels-neons.json'),
  skin: require('pantoner/json/pantone-skin.json'),
  colorOfTheYear: require('pantoner/json/pantone-color-of-the-year.json')
};

const postcss = require('postcss-color-pantone/colors.json');

const result = {};

const cleanPantone = str => str.replace(/[ -]{1,}/g, '_');

const add = (pantone, hex) => {
  result[`pantone_${cleanPantone(pantone)}`] = hex.toLowerCase();
};

const addArray = arr => {
  for (const { pantone, hex } of arr) {
    add(pantone, hex);
  }
};

const addObj = obj => {
  for (const pantone in obj) {
    add(pantone, obj[pantone]);
  }
};

addArray(pantoner.coated);
addArray(pantoner.uncoated);
addArray(pantoner.metallic);
addArray(pantoner.pastelsNeons);
addArray(pantoner.skin);
addArray(pantoner.colorOfTheYear);
addObj(postcss);

fs.rmdirSync(dist(), { recursive: true, force: true });
fs.mkdirSync(dist(), { recursive: true });

fs.writeFileSync(dist('pantone-table.json'), JSON.stringify(result, null, 2));
fs.writeFileSync(dist('pantone-table.js'), `module.exports = require('./pantone-table.json');\n`);
fs.writeFileSync(dist('pantone-table.es.js'), ((obj) => {
  let esmodule = '';

  for (const [ pantone, hex ] of Object.entries(result)) {
    esmodule += `export const ${pantone} = '${hex}';\n`;
  }

  return esmodule;
})(result));

// fs.copyFileSync('README.md', 'dist/README.md');
// fs.copyFileSync('LICENSE', 'dist/LICENSE');
