const errors = require('../../libs/errors');

const iconRequestParameters = {
  ClubID: 'Number',
  CardNumber: 'Number',
  NameOfMembership: 'String',
  Status: 'Status',
  FirstName: 'String',
  LastName: 'String',
  Email: 'Email',
  Street: 'String',
  FlatNumber: 'Number',
  Zipcode: 'Number',
  City: 'String',
  Country: 'String',
  CellPhone: 'Number',
  BirthDate: 'Date',
  Gender: 'Gender',
  LastLogin: 'Date',
  RegistrationTime: 'Date',
  MembershipsStartingDate: 'Date',
  MembershipsEndingDate: 'Date',
  ClubUsageLast7Days: 'Number',
  ClubUsageLast15Days: 'Number',
  ClubUsageLast30Days: 'Number',
  ClubUsageLast90Days: 'Number',
  ClubUsageLast120Days: 'Number',
  ClubUsageLast180Days: 'Number',
  ClubUsageLast240Days: 'Number',
  AllowPhoneCalls: 'Boolean',
  AllowSmsMsg: 'Boolean',
  Nip: 'Number'
};

const requiredFields = ['CardNumber', 'ClubID', 'FirstName', 'LastName', 'Email', 'Status'];
const validStatuses = ['ProspectActive', 'ProspectDump', 'MemberActive', 'MemberKid', 'MemberFreeze', 'MemberDebt', 'ExMember', 'Staff'];

function isValidDate(dateString) {
  const regEx = /^\d{4}-\d{2}-\d{2}$/;
  return dateString.match(regEx) != null;
}

function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function checkForErrors(param, key) {
  let error = false;
  switch (iconRequestParameters[key]) {
    case 'Number':
      if (isNaN(param)) {
        error = `${param} is not a number.`;
      }
      break;

    case 'Date':
      if (!isValidDate(param) || new Date(param).toString() === 'Invalid Date') {
        error = `${param} is invalid date, please use format YYYY-MM-DD.`;
      }
      break;

    case 'Boolean':
      if (param !== true && param !== false && param !== 'true' && param !== 'false' && param !== 'True' && param !== 'False') {
        error = `${param} is not a boolean.`;
      }
      break;

    case 'Email':
      if (!validateEmail(param)) {
        error = `${param} is invalid email`;
      }
      break;

    case 'Gender':
      if (param !== 'M' && param !== 'F') {
        error = "gender must be of value 'M' for men or 'F' female";
      }
      break;

    case 'Status':
      if (validStatuses.indexOf(param) < 0) {
        error = 'wrong status';
      }
      break;

    default:
      error = false;
  }

  return error;
}

module.exports = (req, res, next) => {
  const request = req.body;
  const badFields = [];

  // Look for bad fields in request
  // Filter returns true and bubles down if field has no error
  Object.keys(iconRequestParameters)
    .filter((key) => {
      // Checking if request has field `key`
      if (!Object.prototype.hasOwnProperty.call(request, key)) {
        badFields.push({ name: key, error: `Misssing ${key}` });
        return false;
      }

      return true;
    })
    .filter((key) => {
      // Checking if required fields are not empty
      if (requiredFields.indexOf(key) > -1 && (request[key] === '' || request[key] === null || request[key] === 'null')) {
        badFields.push({ name: key, error: `Field ${key} is Required` });
        return false;
      }

      return true;
    })
    .filter((key) => {
      // Delete empty keys (They would make mess in db sync)
      if (request[key] === '' || request[key] === null) {
        request[key] = null;
        return false;
      }

      return true;
    })
    .filter((key) => {
      // Check if data in request are correct
      const field = checkForErrors(request[key], key);

      if (field) {
        badFields.push({ name: key, error: field });
      }

      return true;
    });

  if (badFields.length > 0) {
    throw new errors.BadRequest(badFields);
  }

  next();
};
