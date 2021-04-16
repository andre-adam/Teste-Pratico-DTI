
import { Pool } from 'pg';

export default new Pool ({
    max: 20,
    // connectionString: 'postgres://adam:adam@localhost:5432/product',
    connectionString: 'postgres://postgres:postgres@104.236.203.148:5432/product',
    idleTimeoutMillis: 30000
});