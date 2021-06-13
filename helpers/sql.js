const { BadRequestError } = require("../expressError");

/**
 * Helper which is similar to a PATCH request to make partial updates 
 * gets JSON data and coverts it to an SQL format 
 * to help construct a SET clause in a SQL UPDATE query. 
 * Currently used in the update methods in the user model and company model.
 * 
 * @param {*} dataToUpdate {Object} dataToUpdate gets the JSON data in key, value pairs 
 * that is going to be used to update the database after the keys are converted to 
 * database column name in SQL format. ie dataToUpdate = {firstName: 'Aliya', age: 32}
 * 
 * @param {*} jsToSql {Object} jsToSQL is used to convert the JS keys 
 * that are in the dataToUpdate to SQL column names. ie. { firstName: "first_name" } 
 * would convert the key firstName to the database column name first_name for the query.
 * 
 * @returns {Object} {setCols, values}
 * The return object is destructured to be used by other classes 
 * with an update function when making updates to their tables.
 * For example plugging in to sqlForPartialUpdate: 
 * dataToUpdate = {firstName: 'Aliya', age: 32} 
 * jsToSql = { firstName: "first_name" }
 * 
 * will return 
 * { setCols: '"first_name"=$1, "age"=$2', values: [ 'Aliya', 32 ] }
 */

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  
  // Gets all keys from JS Object which is used to 
  // help map the JS object to SQL format for the cols
  const keys = Object.keys(dataToUpdate);

  // If keys don't exist then throws error
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };

