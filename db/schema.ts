import { sql } from "drizzle-orm";
import { integer, primaryKey, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  externalId: text("external_id"),
  username: text("username").notNull().unique(),
  displayName: text("display_name").notNull(),
  email: text("email"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [uniqueIndex("users_external_id_idx").on(table.externalId)]);

export const userRoles = sqliteTable("user_roles", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  role: text("role", { enum: ["akademisyen", "abd_asd_baskani", "abd_sekreteri", "lee_ogrenci_isleri", "enstitu_sekreteri", "enstitu_yoneticisi", "admin"] }).notNull(),
  departmentId: text("department_id"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [uniqueIndex("user_roles_scope_idx").on(table.userId, table.role, table.departmentId)]);

export const roleModuleAccess = sqliteTable("role_module_access", {
  role: text("role", { enum: ["akademisyen", "abd_asd_baskani", "abd_sekreteri", "lee_ogrenci_isleri", "enstitu_sekreteri", "enstitu_yoneticisi", "admin"] }).notNull(),
  module: text("module", { enum: ["my_courses", "program_profile", "review_queue", "publish_control", "quality_reports", "database_admin", "user_roles", "permission_matrix"] }).notNull(),
  enabled: integer("enabled", { mode: "boolean" }).notNull().default(false),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedBy: text("updated_by"),
}, (table) => [primaryKey({ columns: [table.role, table.module] })]);

export const programs = sqliteTable("programs", {
  id: text("id").primaryKey(),
  externalId: text("external_id"),
  nameTr: text("name_tr").notNull(),
  nameEn: text("name_en"),
  level: text("level", { enum: ["master", "doctorate"] }).notNull(),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [uniqueIndex("programs_external_id_idx").on(table.externalId)]);

export const programProfiles = sqliteTable("program_profiles", {
  id: text("id").primaryKey(),
  programName: text("program_name").notNull(),
  level: text("level").notNull(),
  degree: text("degree").notNull().default(""),
  manager: text("manager").notNull().default(""),
  language: text("language").notNull().default("Türkçe"),
  qualificationRules: text("qualification_rules").notNull().default(""),
  sectionsJson: text("sections_json").notNull().default("[]"),
  outcomesJson: text("outcomes_json").notNull().default("[]"),
  tyycRowsJson: text("tyyc_rows_json").notNull().default("[]"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedBy: text("updated_by"),
}, (table) => [uniqueIndex("program_profiles_program_level_idx").on(table.programName, table.level)]);

export const courses = sqliteTable("courses", {
  id: text("id").primaryKey(),
  externalId: text("external_id"),
  programId: text("program_id").notNull().references(() => programs.id),
  code: text("code").notNull(),
  nameTr: text("name_tr").notNull(),
  nameEn: text("name_en"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [uniqueIndex("courses_external_id_idx").on(table.externalId)]);

export const courseVersions = sqliteTable("course_versions", {
  id: text("id").primaryKey(),
  courseId: text("course_id").notNull().references(() => courses.id),
  academicYear: text("academic_year").notNull(),
  version: integer("version").notNull().default(1),
  status: text("status", { enum: ["draft", "in_review", "changes_requested", "approved", "published", "archived"] }).notNull().default("draft"),
  ects: integer("ects"),
  purposeTr: text("purpose_tr"),
  purposeEn: text("purpose_en"),
  contentTr: text("content_tr"),
  contentEn: text("content_en"),
  publishedAt: text("published_at"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [uniqueIndex("course_versions_unique_idx").on(table.courseId, table.academicYear, table.version)]);

export const learningOutcomes = sqliteTable("learning_outcomes", {
  id: text("id").primaryKey(),
  courseVersionId: text("course_version_id").notNull().references(() => courseVersions.id),
  order: integer("display_order").notNull(),
  descriptionTr: text("description_tr").notNull(),
  descriptionEn: text("description_en"),
});

export const approvalRequests = sqliteTable("approval_requests", {
  id: text("id").primaryKey(),
  courseVersionId: text("course_version_id").notNull().references(() => courseVersions.id),
  requestedBy: text("requested_by").notNull(),
  reviewedBy: text("reviewed_by"),
  decision: text("decision", { enum: ["pending", "approved", "changes_requested"] }).notNull().default("pending"),
  note: text("note"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  reviewedAt: text("reviewed_at"),
});

export const files = sqliteTable("files", {
  id: text("id").primaryKey(),
  courseVersionId: text("course_version_id").references(() => courseVersions.id),
  objectKey: text("object_key").notNull().unique(),
  visibility: text("visibility", { enum: ["public", "private"] }).notNull(),
  contentType: text("content_type").notNull(),
  originalName: text("original_name").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const auditLogs = sqliteTable("audit_logs", {
  id: text("id").primaryKey(),
  actorId: text("actor_id").notNull(),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  details: text("details"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
