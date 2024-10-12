import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";
import { users } from "./usersSchema";

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: serial("id").primaryKey(), // serial generate ids for us
  userId: integer("user_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .unique(),
  token: text("token").notNull(),
  expiredAt: timestamp("expired_at", { withTimezone: true }),
});
