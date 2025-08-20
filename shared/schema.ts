import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

// Users table for admin authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Students table for student management and attendance
export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  student_id: text("student_id").unique(),
  phone: text("phone"),
  course: text("course"),
  is_active: boolean("is_active").notNull().default(true),
  biometric_data: text("biometric_data"), // Store biometric hash
  face_data: text("face_data"), // Store face recognition data
  created_at: timestamp("created_at").defaultNow(),
});

// Attendance records table
export const attendance = pgTable("attendance", {
  id: serial("id").primaryKey(),
  student_id: integer("student_id").references(() => students.id),
  timestamp: timestamp("timestamp").defaultNow(),
  status: text("status").notNull().default("present"), // present, late, absent
  method: text("method").notNull().default("manual"), // manual, face_scan, biometric, id_upload
  location: text("location"),
  ip_address: text("ip_address"),
  device_info: text("device_info"),
});

// Admin logs table
export const admin_logs = pgTable("admin_logs", {
  id: serial("id").primaryKey(),
  admin_email: text("admin_email").notNull(),
  action: text("action").notNull(),
  details: text("details"),
  timestamp: timestamp("timestamp").defaultNow(),
  created_at: timestamp("created_at").defaultNow(),
});

// Relations
export const studentsRelations = relations(students, ({ many }) => ({
  attendance: many(attendance),
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
  student: one(students, {
    fields: [attendance.student_id],
    references: [students.id],
  }),
}));

// Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertStudentSchema = createInsertSchema(students).omit({
  id: true,
  created_at: true,
});

export const insertAttendanceSchema = createInsertSchema(attendance).omit({
  id: true,
  timestamp: true,
});

export const insertAdminLogSchema = createInsertSchema(admin_logs).omit({
  id: true,
  timestamp: true,
  created_at: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Student = typeof students.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Attendance = typeof attendance.$inferSelect;
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;
export type AdminLog = typeof admin_logs.$inferSelect;
export type InsertAdminLog = z.infer<typeof insertAdminLogSchema>;
