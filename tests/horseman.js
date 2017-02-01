var Horseman = require('node-horseman');
var horseman = new Horseman();

horseman
  .userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0')
  .open('http://www.facebook.com/login.php')
  .type('input[id="email"]', 'shobrookjonathan@gmail.com')
  .type('input[id="pass"]', 'Fafablacksheep808313')
  .click('[id="loginbutton"]')
  // Wait for page to load
  .evaluate()
  .log() // prints out the number of results
  .screenshot('test.png')
  .evaluate()
  .close();