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
});