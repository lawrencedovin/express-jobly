const { sqlForPartialUpdate } = require("./sql");

describe("sqlForPartialUpdate", () => {
  test("Does a single column update", () => {
    const result = sqlForPartialUpdate(
      { firstName: "lawrence" },
      { firstName: "first_name" }
    );
    expect(result).toEqual({
      setCols: '"first_name"=$1',
      values: ["lawrence"]
    });
  });
  
  test("Does a multiple column update", () => {
    const result = sqlForPartialUpdate(
      { firstName: "lawrence", lastName: "peanut", age: 28 },
      { firstName: "first_name", lastName: "last_name" }
    );
    expect(result).toEqual({
      setCols: '"first_name"=$1, "last_name"=$2, "age"=$3',
      values: ["lawrence", "peanut", 28]
    });
  });

//   test("Bad request for missing data", () => {
//     const result = sqlForPartialUpdate();
//     expect(result.statusCode).toEqual(400);
//   });
});