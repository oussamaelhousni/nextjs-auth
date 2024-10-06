import { boolean, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(), // serial generate ids for us
  email: text("email").notNull().unique(),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow(),
  twoFactorSecret: text("2fa_secret"),
  twofactorActivated: boolean("2fa_activated").default(false),
});
