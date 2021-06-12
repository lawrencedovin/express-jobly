const { BadRequestError } = require("../expressError");

// THIS NEEDS SOME GREAT DOCUMENTATION.

function sqlForPartialUpdate(dataToUpdate, jsToSql) {

  // const object1 = {
  //   a: 'somestring',
  //   b: 42,
  //   c: false
  // };
  
  // console.log(Object.keys(object1));
  // expected output: Array ["a", "b", "c"]
  
  // Gets all keys from JS Object which is used to 
  // help map the JS object to SQL format for the cols
  const keys = Object.keys(dataToUpdate);

  // If keys don't exist then throws error
  if (keys.length === 0) throw new BadRequestError("No data");

  // Patch request for updating user's name or age?

  // jsToSQL is {firstName: 'Aliya', age: 32} JSON format 
  // then it converts to SQL code can add multiple 
  // key value pairs from the db to update.

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );


  // const { setCols, values } = sqlForPartialUpdate(
  //   data,
  //   {
  //     firstName: "first_name",
  //     lastName: "last_name",
  //     isAdmin: "is_admin",
  //   });
  // const usernameVarIdx = "$" + (values.length + 1);

  // const querySql = `UPDATE users 
  //                   SET ${setCols} 
  //                   WHERE username = ${usernameVarIdx} 
  //                   RETURNING username,
  //                             first_name AS "firstName",
  //                             last_name AS "lastName",
  //                             email,
  //                             is_admin AS "isAdmin"`;
  // const result = await db.query(querySql, [...values, username]);
  // const user = result.rows[0];

  // other functions destructure the returned object for the setCols and 
  // values. setCols is SQL code that converts JS object to SQL.
  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']

  // values gets the current values from each Object based on the JS object
  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
