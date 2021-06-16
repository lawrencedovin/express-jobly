"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for jobs. */

class Job {
  /** Create a job (from data), update db, return new company data.
   *
   * data should be { id, title, salary, equity, company_handle }
   *
   * Returns { id, title, salary, equity, company_handle }
   *
   * Throws BadRequestError if job already in database.
   * */

  static async create({ title, salary, equity, companyHandle }) {

    const result = await db.query(
          `INSERT INTO jobs
           (title, salary, equity, company_handle)
           VALUES ($1, $2, $3, $4)
           RETURNING id, title, salary, equity, company_handle AS "companyHandle"`,
        [
          title,
          salary,
          equity,
          companyHandle,
        ],
    );
    const job = result.rows[0];

    return job;
  }

  /** Find all jobs.
   *
   * Returns [{ id, title, salary, equity, company_handle }]
   * */

  static async findAll() {
    const jobsRes = await db.query(
          `SELECT id, 
                  title, 
                  salary, 
                  equity, 
                  company_handle AS "companyHandle"
           FROM jobs
           ORDER BY id`);
    return jobsRes.rows;
  }

  /** Filter all jobs by title, salary, equity, company_handle query string.
   *
   * Returns [{ id, title, salary, equity, company_handle }]
   * */

    static async filterTitleMinSalaryHasEquityEmployees(title='', minSalary=0, hasEquity='') {
      // if (minEmployees > maxEmployees) {
      //   throw new BadRequestError(`minEmployees: ${minEmployees} cannot be greater than maxEmployees: ${maxEmployees}`);
      // }
      // const jobsRes = await db.query(
      //       `SELECT id,
      //               title,
      //               salary,
      //               equity,
      //               company_handle AS "companyHandle"
      //         FROM jobs
      //         GROUP BY id
      //         HAVING salary >= $1
      //         AND equity <= $2
      //         AND lower(title) LIKE $3
      //         ORDER BY num_employees ASC`,
      //         [minSalary, maxEmployees, `%${title}%`]);
      // return jobsRes.rows;
      const jobsRes = await db.query(
        `SELECT id,
                title,
                salary,
                equity,
                company_handle AS "companyHandle"
          FROM jobs
          GROUP BY id
          HAVING salary >= $1
          AND lower(title) LIKE $2
          ORDER BY id ASC`,
          [minSalary, `%${title}%`]);
      return jobsRes.rows;
    }

  /** Given a job handle, return data about job.
   *
   * Returns { id, title, salary, equity, company_handle }
   *   where jobs is [{ id, title, salary, equity, company_handle }]
   *
   * Throws NotFoundError if not found.
   **/

  static async get(id) {
    const jobRes = await db.query(
          `SELECT id,
                  title,
                  salary,
                  equity,
                  company_handle AS "companyHandle"
           FROM jobs
           WHERE id = $1`,
        [id]);

    const job = jobRes.rows[0];

    if (!job) throw new NotFoundError(`No job exists with an id of: ${id}`);

    const companiesRes = await db.query(
          `SELECT handle,
                  name,
                  description,
                  num_employees AS "numEmployees",
                  logo_url AS "logoUrl"
           FROM companies
           WHERE handle = $1`, [job.companyHandle]);

    delete job.companyHandle;
    job.company = companiesRes.rows[0];

    return job;
  }

  /** Update company data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: { id, title, salary, equity, company_handle }
   *
   * Returns { id, title, salary, equity, company_handle }
   *
   * Throws NotFoundError if not found.
   */

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(
        data,
        {
          companyHandle: "company_handle"
        });
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE jobs
                      SET ${setCols} 
                      WHERE id = ${idVarIdx} 
                      RETURNING id,
                                title,
                                salary,
                                equity,
                                company_handle AS "companyHandle"`;
    const result = await db.query(querySql, [...values, id]);
    const job = result.rows[0];

    if (!job) throw new NotFoundError(`No job exists with an id of: ${id}`);

    return job;
  }

  /** Delete given job from database; returns undefined.
   *
   * Throws NotFoundError if job not found.
   **/

  static async remove(id) {
    const result = await db.query(
          `DELETE
           FROM jobs
           WHERE id = $1
           RETURNING id`,
        [id]);
    const job = result.rows[0];

    if (!job) throw new NotFoundError(`No job exists with an id of: ${id}`);
  }
}


module.exports = Job;
