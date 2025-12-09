const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const copyFrom = require('pg-copy-streams').from;
const { Transform } = require('stream');
require('dotenv').config();

// paths
const csvFile = path.resolve(__dirname, '../../data/truestate_assignment_dataset.csv');

// connect to db - needs env var
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// helper to run query
const query = async (text, params) => {
    return await pool.query(text, params);
};

// init tables
async function init() {
    try {
        // create table
        // postgres syntax: SERIAL for auto id, standard types
        await query(`CREATE TABLE IF NOT EXISTS sales (
      transaction_id SERIAL PRIMARY KEY,
      customer_id TEXT,
      customer_name TEXT,
      phone_number TEXT,
      gender TEXT,
      age INTEGER,
      customer_region TEXT,
      customer_type TEXT,
      product_id TEXT,
      product_name TEXT,
      brand TEXT,
      product_category TEXT,
      tags TEXT,
      quantity INTEGER,
      price_per_unit REAL,
      discount_percentage REAL,
      total_amount REAL,
      final_amount REAL,
      date TEXT,
      payment_method TEXT,
      order_status TEXT,
      delivery_type TEXT,
      store_id TEXT,
      store_location TEXT,
      salesperson_id TEXT,
      employee_name TEXT
    )`);

        // indexes
        await query(`CREATE INDEX IF NOT EXISTS idx_date ON sales(date)`);
        await query(`CREATE INDEX IF NOT EXISTS idx_name ON sales(customer_name)`);
        await query(`CREATE INDEX IF NOT EXISTS idx_phone ON sales(phone_number)`);

        console.log("DB Init done.");
        loadData(); // try loading if empty
    } catch (e) {
        console.log("init error: " + e.message);
    }
}

// load data from csv if empty
async function loadData() {
    try {
        const r = await query("SELECT count(*) as count FROM sales");
        if (parseInt(r.rows[0].count) > 0) {
            console.log(`DB has ${r.rows[0].count} rows. Skipping load.`);
            return;
        }

        console.log('Loading CSV via STREAM (fast upload)...');
        if (!fs.existsSync(csvFile)) {
            console.warn('No CSV found.');
            return;
        }

        const client = await pool.connect();

        // transform stream to convert object to CSV line for COPY
        const toCsv = new Transform({
            objectMode: true,
            transform(row, encoding, callback) {
                // map CSV columns to DB columns order
                // simple CSV line generation handles commas/quotes roughly
                // pg-copy-streams expects raw text/csv format
                // Order must match the COPY command columns

                const fields = [
                    row['Customer ID'], row['Customer Name'], row['Phone Number'], row['Gender'], row['Age'], row['Customer Region'], row['Customer Type'],
                    row['Product ID'], row['Product Name'], row['Brand'], row['Product Category'], row['Tags'],
                    row['Quantity'], row['Price per Unit'], row['Discount Percentage'], row['Total Amount'], row['Final Amount'],
                    row['Date'], row['Payment Method'], row['Order Status'], row['Delivery Type'],
                    row['Store ID'], row['Store Location'], row['Salesperson ID'], row['Employee Name']
                ];

                // simple CSV escape
                const line = fields.map(f => {
                    if (f === null || f === undefined) return '';
                    let s = String(f);
                    // escape quotes
                    if (s.includes('"') || s.includes(',') || s.includes('\n')) {
                        s = '"' + s.replace(/"/g, '""') + '"';
                    }
                    return s;
                }).join(',') + '\n';

                callback(null, line);
            }
        });

        try {
            const stream = client.query(copyFrom(`COPY sales (
              customer_id, customer_name, phone_number, gender, age, customer_region, customer_type,
              product_id, product_name, brand, product_category, tags,
              quantity, price_per_unit, discount_percentage, total_amount, final_amount,
              date, payment_method, order_status, delivery_type,
              store_id, store_location, salesperson_id, employee_name
        ) FROM STDIN WITH (FORMAT csv)`));

            const fileStream = fs.createReadStream(csvFile);

            fileStream.on('error', (e) => console.log("File read err", e));
            stream.on('error', (e) => console.log("Stream err", e));
            stream.on('finish', () => console.log("Data load completed successfully via STREAM."));

            // pipe: file -> csv-parser (to obj) -> toCsv (to line) -> db stream 
            // Logic check: csv-parser might not be needed if we trust the CSV structure, 
            // but re-serializing ensures we sanitize and map columns correctly.
            fileStream.pipe(csv()).pipe(toCsv).pipe(stream);

        } catch (e) {
            console.log("Stream setup err", e);
            client.release();
        }
    } catch (e) {
        console.log("loadData err", e);
    }
}

// Main logic
async function getSales({ search, filters, sort, page = 1, limit = 10 }) {
    let sql = "SELECT * FROM sales WHERE 1=1";
    let countSql = "SELECT count(*) as total FROM sales WHERE 1=1";
    let p = [];
    let paramIdx = 1; // PG uses $1, $2...

    // search logic
    if (search) {
        // syntax: LIKE $1
        const s = ` AND (customer_name ILIKE $${paramIdx} OR phone_number ILIKE $${paramIdx + 1})`;
        sql += s;
        countSql += s;
        const t = `%${search}%`;
        p.push(t, t); // push twice for 2 placeholders
        paramIdx += 2;
    }

    // filters
    if (filters) {
        // region
        if (filters['Customer Region']) {
            const r = Array.isArray(filters['Customer Region']) ? filters['Customer Region'] : [filters['Customer Region']];
            if (r.length > 0) {
                // generate $x, $y...
                const placeholders = r.map(() => `$${paramIdx++}`).join(',');
                sql += ` AND customer_region IN (${placeholders})`;
                countSql += ` AND customer_region IN (${placeholders})`;
                p.push(...r);
            }
        }
        // gender
        if (filters['Gender']) {
            const g = Array.isArray(filters['Gender']) ? filters['Gender'] : [filters['Gender']];
            if (g.length > 0) {
                const placeholders = g.map(() => `$${paramIdx++}`).join(',');
                sql += ` AND gender IN (${placeholders})`;
                countSql += ` AND gender IN (${placeholders})`;
                p.push(...g);
            }
        }
        // category
        if (filters['Product Category']) {
            const c = Array.isArray(filters['Product Category']) ? filters['Product Category'] : [filters['Product Category']];
            if (c.length > 0) {
                const placeholders = c.map(() => `$${paramIdx++}`).join(',');
                sql += ` AND product_category IN (${placeholders})`;
                countSql += ` AND product_category IN (${placeholders})`;
                p.push(...c);
            }
        }
        // age
        if (filters['Age Range'] && Array.isArray(filters['Age Range'])) {
            const [min, max] = filters['Age Range'];
            sql += ` AND age BETWEEN $${paramIdx++} AND $${paramIdx++}`;
            countSql += ` AND age BETWEEN $${paramIdx - 2} AND $${paramIdx - 1}`; // slight hack on idx
            p.push(min, max);
        }
    }

    // sorting
    if (sort) {
        const { field, order } = sort;
        const map = {
            'Customer Name': 'customer_name',
            'Date': 'date',
            'Quantity': 'quantity',
            'Total Amount': 'total_amount'
        };
        const f = map[field] || 'date';
        const o = (order && order.toLowerCase() === 'desc') ? 'DESC' : 'ASC';
        sql += ` ORDER BY ${f} ${o}`;
    } else {
        sql += ` ORDER BY date DESC`;
    }

    // paging
    const off = (page - 1) * limit;
    sql += ` LIMIT $${paramIdx++} OFFSET $${paramIdx++}`;
    p.push(limit, off);

    try {
        const countRes = await query(countSql, p.slice(0, p.length - 2)); // remove limit/offset for count
        const tot = parseInt(countRes.rows[0].total);

        const dataRes = await query(sql, p);

        return {
            data: dataRes.rows,
            total: tot,
            page,
            totalPages: Math.ceil(tot / limit)
        };
    } catch (e) {
        console.log("query err", e);
        throw e;
    }
}

async function getFilterOptions() {
    try {
        const regions = await query("SELECT DISTINCT customer_region FROM sales WHERE customer_region IS NOT NULL");
        const categories = await query("SELECT DISTINCT product_category FROM sales WHERE product_category IS NOT NULL");
        const payments = await query("SELECT DISTINCT payment_method FROM sales WHERE payment_method IS NOT NULL");

        return {
            regions: regions.rows.map(r => r.customer_region).sort(),
            categories: categories.rows.map(r => r.product_category).sort(),
            paymentMethods: payments.rows.map(r => r.payment_method).sort()
        };
    } catch (e) {
        console.log("filter opts err", e);
        return { regions: [], categories: [], paymentMethods: [] };
    }
}

// start init on load
init();

module.exports = {
    loadData,
    getSales,
    getFilterOptions
};
