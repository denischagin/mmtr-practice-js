const {
  isBracketsBalanced,
  findFirstSingleChar,
  getDigitalRoot,
  getCommonDirectoryPath,
} = require('./src/07-conditions-n-loops-tasks');
const { logger } = require('./src/08-functions-n-closures-tasks');

const gcdp = logger(getCommonDirectoryPath, console.log);

gcdp(['/web/images/image1.png', '/web/images/image2.png']);
gcdp(['/web/assets/style.css', '/web/scripts/app.js', 'home/setting.conf']);
gcdp(['/web/assets/style.css', '/.bin/mocha',  '/read.me']);
gcdp(['/web/favicon.ico', '/web-scripts/dump', '/verbalizer/logs']);

//  *   ['/web/images/image1.png', '/web/images/image2.png']  => '/web/images/'
//  *   ['/web/assets/style.css', '/web/scripts/app.js',  'home/setting.conf'] => ''
//  *   ['/web/assets/style.css', '/.bin/mocha',  '/read.me'] => '/'
//  *   ['/web/favicon.ico', '/web-scripts/dump', '/verbalizer/logs'] => '/'