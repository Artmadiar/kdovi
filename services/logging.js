const fs = require('fs');

module.exports = function (message, type, filename) {
  return new Promise((resolve) => {
    if (typeof type === 'undefined') {
      type = 'info';
    }

    const messageToWrite = `${new Date()} ('${type}') : ${message}`;

    if (typeof filename === 'undefined') {
      console.log(messageToWrite);
      resolve();
      return true;
    }

    fs.appendFile(`${filename}.${type}`, `${messageToWrite}\r\n`, resolve());
  });
};
