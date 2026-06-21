import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// Office account — login via Google OAuth. Single-tenant: one office = one email.
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  googleId: text("google_id").notNull().unique(),
  email: text("email").notNull(),
  name: text("name"),
  picture: text("picture"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Client — one client can have multiple cases.
export const clients = sqliteTable("clients", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),          // office (single-tenant)
  name: text("name").notNull(),
  phone: text("phone"),                          // wa.me reminder goes here
  address: text("address"),
  notes: text("notes"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Case — core of hearing tracking. Linked to client.
export const cases = sqliteTable("cases", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),                        // office (single-tenant)
  clientId: integer("client_id").notNull().references(() => clients.id),
  caseNumber: text("case_number").notNull(),
  courtName: text("court_name"),
  caseType: text("case_type"),
  oppositeParty: text("opposite_party"),
  nextHearingDate: text("next_hearing_date"),                  // "YYYY-MM-DD"
  stage: text("stage"),                                        // what next date is for
  notes: text("notes"),
  status: text("status").default("active"),                    // active | disposed
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),                   // auto-updates on every update
});