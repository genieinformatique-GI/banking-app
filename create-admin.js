const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function createAdmin() {
  const email = 'admin@blockchainbank.com';
  const password = 'AdminPassword123!';
  const firstName = 'Admin';
  const lastName = 'User';
  const role = 'admin';
  const status = 'active';

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const query = `
    INSERT INTO users (email, password_hash, first_name, last_name, role, status)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id;
  `;

  const values = [email, passwordHash, firstName, lastName, role, status];

  try {
    const res = await pool.query(query, values);
    console.log('Admin user created with ID:', res.rows[0].id);
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('=> Change this password after first login!');
  } catch (err) {
    console.error('Error creating admin user:', err);
  } finally {
    await pool.end();
  }
}

createAdmin();
