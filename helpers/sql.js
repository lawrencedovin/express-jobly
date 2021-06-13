const { BadRequestError } = require("../expressError");

// THIS NEEDS SOME GREAT DOCUMENTATION.

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  
  // Gets all keys from JS Object which is used to 
  // help map the JS object to SQL format for the cols
  const keys = Object.keys(dataToUpdate);

  // If keys don't exist then throws error
  if (keys.length === 0) throw new BadRequestError("No data");

  // jsToSQL is used to convert the JS keys that are in the dataToUpdate 
  // to SQL column names. ie. { firstName: "first_name" } would convert the key 
  // firstName to the database column name first_name for the query.

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  // Other functions destructure the returned object for the setCols and 
  // values.

  // values gets the current values from each Object based on the JS object
  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

console.log(sqlForPartialUpdate({firstName: 'Aliya', age: 32}, { firstName: "first_name" }));

module.exports = { sqlForPartialUpdate };

