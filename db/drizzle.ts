import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const sql = neon(process.env.DATABASE_URL!); // ! means that we are sure DATABSE_URL is defined

const db = drizzle(sql);

// after creating db we can use it any where inside our application
export default db;
