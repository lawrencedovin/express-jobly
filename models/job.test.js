"use strict";

const { NotFoundError, BadRequestError } = require("../expressError");
const db = require("../db.js");
const Job = require("./job.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testJobIds,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
  let newJob = {
    companyHandle: "c1",
    title: "Test",
    salary: 100,
    equity: "0.1",
  };

  test("works", async function () {
    let job = await Job.create(newJob);
    expect(job).toEqual({
      ...newJob,
      id: expect.any(Number),
    });
  });
});

/************************************** findAll */

describe("findAll", function () {
  test("works: no filter", async function () {
    let jobs = await Job.findAll();
    expect(jobs).toEqual([
      {
        id: testJobIds[0],
        title: "Job1",
        salary: 100,
        equity: "0.1",
        companyHandle: "c1"
      },
      {
        id: testJobIds[1],
        title: "Job2",
        salary: 200,
        equity: "0.2",
        companyHandle: "c1"
      },
      {
        id: testJobIds[2],
        title: "Job3",
        salary: 300,
        equity: "0",
        companyHandle: "c1"
      }
    ]);
  });

  test("works: by title", async function () {
    const title = "ob1"
    let jobs = await Job.findAll(title);
    console.log(jobs);
    expect(jobs).toEqual([
        {
          id: testJobIds[0],
          title: "Job1",
          salary: 100,
          equity: "0.1",
          companyHandle: "c1"
        }
    ]);
  });

//   test("works: by min salary", async function () {
//     console.log(jobs);
//     let jobs = await Job.findAll({ minSalary: 250 });
//     expect(jobs).toEqual([
//       {
//         id: testJobIds[2],
//         title: "Job3",
//         salary: 300,
//         equity: "0",
//         companyHandle: "c1"
//       },
//     ]);
//   });

//   test("works: by equity", async function () {
//     let jobs = await Job.findAll({ hasEquity: true });
//     expect(jobs).toEqual([
//       {
//         id: testJobIds[0],
//         title: "Job1",
//         salary: 100,
//         equity: "0.1",
//         companyHandle: "c1",
//         companyName: "C1",
//       },
//       {
//         id: testJobIds[1],
//         title: "Job2",
//         salary: 200,
//         equity: "0.2",
//         companyHandle: "c1",
//         companyName: "C1",
//       },
//     ]);
//   });

//   test("works: by min salary & equity", async function () {
//     let jobs = await Job.findAll({ minSalary: 150, hasEquity: true });
//     expect(jobs).toEqual([
//       {
//         id: testJobIds[1],
//         title: "Job2",
//         salary: 200,
//         equity: "0.2",
//         companyHandle: "c1",
//         companyName: "C1",
//       },
//     ]);
//   });

//   test("works: by name", async function () {
//     let jobs = await Job.findAll({ title: "ob1" });
//     expect(jobs).toEqual([
//       {
//         id: testJobIds[0],
//         title: "Job1",
//         salary: 100,
//         equity: "0.1",
//         companyHandle: "c1",
//         companyName: "C1",
//       },
//     ]);
//   });
});

/************************************** findAll */

// describe("findAll", function () {
//     test("works: no filter", async function () {
//         let jobs = await Job.findAll();
//         expect(jobs).toEqual([
//           {
//             id: testJobIds[0],
//             title: "Job1",
//             salary: 100,
//             equity: "0.1",
//             companyHandle: "c1",
//             companyName: "C1",
//           },
//           {
//             id: testJobIds[1],
//             title: "Job2",
//             salary: 200,
//             equity: "0.2",
//             companyHandle: "c1",
//             companyName: "C1",
//           },
//           {
//             id: testJobIds[2],
//             title: "Job3",
//             salary: 300,
//             equity: "0",
//             companyHandle: "c1",
//             companyName: "C1",
//           },
//           {
//             id: testJobIds[3],
//             title: "Job4",
//             salary: null,
//             equity: null,
//             companyHandle: "c1",
//             companyName: "C1",
//           },
//         ]);
//     });
//     test("works: name filter", async function () {
//       const name = 'c1';
//       let companies = await Company.findAll(name);
//       expect(companies).toEqual([
//         {
//           handle: "c1",
//           name: "C1",
//           description: "Desc1",
//           numEmployees: 1,
//           logoUrl: "http://c1.img",
//         }
//       ]);
//     });
//     test("works: minEmployees filter", async function () {
//       const name = '';
//       const minEmployees = 2;
//       let companies = await Company.findAll(name, minEmployees);
//       expect(companies).toEqual([
//         {
//           handle: "c2",
//           name: "C2",
//           description: "Desc2",
//           numEmployees: 2,
//           logoUrl: "http://c2.img",
//         },
//         {
//           handle: "c3",
//           name: "C3",
//           description: "Desc3",
//           numEmployees: 3,
//           logoUrl: "http://c3.img",
//         },
//       ]);
//     });
//     test("works: maxEmployees filter", async function () {
//       const name = '';
//       const minEmployees = 0;
//       const maxEmployees = 2;
//       let companies = await Company.findAll(name, minEmployees, maxEmployees);
//       expect(companies).toEqual([
//         {
//           handle: "c1",
//           name: "C1",
//           description: "Desc1",
//           numEmployees: 1,
//           logoUrl: "http://c1.img",
//         },
//         {
//           handle: "c2",
//           name: "C2",
//           description: "Desc2",
//           numEmployees: 2,
//           logoUrl: "http://c2.img",
//         },
//       ]);
//     });
//     test("works: multiple filters", async function () {
//       const name = 'c1';
//       const minEmployees = 0;
//       const maxEmployees = 2;
//       let companies = await Company.findAll(name, minEmployees, maxEmployees);
//       expect(companies).toEqual([
//         {
//           handle: "c1",
//           name: "C1",
//           description: "Desc1",
//           numEmployees: 1,
//           logoUrl: "http://c1.img",
//         },
//       ]);
//     });
//     test("bad request with minEmployees being larger than maxEmployees", async function () {
//       const name = '';
//       const minEmployees = 3;
//       const maxEmployees = 2;
//       try {
//         await Company.findAll(name, minEmployees, maxEmployees);
//         fail();
//       } catch (err) {
//         expect(err instanceof BadRequestError).toBeTruthy();
//       }
//     });
//   });

/************************************** get */

describe("get", function () {
  test("works", async function () {
    let job = await Job.get(testJobIds[0]);
    expect(job).toEqual({
      id: testJobIds[0],
      title: "Job1",
      salary: 100,
      equity: "0.1",
      company: {
        handle: "c1",
        name: "C1",
        description: "Desc1",
        numEmployees: 1,
        logoUrl: "http://c1.img",
      },
    });
  });

  test("not found if no such job", async function () {
    try {
      await Job.get(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

// /************************************** update */

describe("update", function () {
  let updateData = {
    title: "New",
    salary: 500,
    equity: "0.5",
  };
  test("works", async function () {
    let job = await Job.update(testJobIds[0], updateData);
    expect(job).toEqual({
      id: testJobIds[0],
      companyHandle: "c1",
      ...updateData,
    });
  });

  test("not found if no such job", async function () {
    try {
      await Job.update(0, {
        title: "test",
      });
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      await Job.update(testJobIds[0], {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Job.remove(testJobIds[0]);
    const res = await db.query(
        "SELECT id FROM jobs WHERE id=$1", [testJobIds[0]]);
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such job", async function () {
    try {
      await Job.remove(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
