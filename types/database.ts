export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

// ─── Enum types ────────────────────────────────────────────────
export type ValuesType = "challenger" | "stable" | "team" | "specialist";
export type CompanyStatus = "pending" | "approved" | "rejected";
export type EmploymentType = "fulltime" | "parttime" | "contract";
export type WorkStyle = "remote" | "onsite" | "hybrid";
export type ApplicationStatus = "applied" | "screening" | "interview" | "offer" | "hired" | "rejected";
export type ArticleType = "story" | "interview" | "news";
export type NotificationType = "application_received" | "status_changed" | "message";

// ─── DiagnosisScores (for result page) ────────────────────────
export type DiagnosisScores = {
  challenger: number;
  stable: number;
  team: number;
  specialist: number;
};

// ─── Row types ─────────────────────────────────────────────────
export type RegionRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
};

export type UserRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  bio: string | null;
  preferred_region_id: string | null;
  desired_location: string | null;
  employment_type_pref: string | null;
  created_at: string;
};

export type CompanyRow = {
  id: string;
  region_id: string | null;
  company_name: string;
  industry: string | null;
  description: string | null;
  vision: string | null;
  culture_description: string | null;
  logo_url: string | null;
  photo_urls: string[] | null;
  employee_count: number | null;
  founded_year: number | null;
  location: string | null;
  website_url: string | null;
  contact_email: string;
  values_type: ValuesType | null;
  status: CompanyStatus;
  rejection_reason: string | null;
  approved_at: string | null;
  created_at: string;
};

export type CompanyMemberRow = {
  id: string;
  company_id: string;
  user_id: string;
  role: "owner" | "editor";
  created_at: string;
};

export type JobRow = {
  id: string;
  company_id: string;
  region_id: string | null;
  title: string;
  employment_type: EmploymentType;
  salary_min: number | null;
  salary_max: number | null;
  location: string | null;
  description: string | null;
  required_skills: string | null;
  benefits: string | null;
  work_style: WorkStyle | null;
  values_type: ValuesType | null;
  is_published: boolean;
  published_at: string | null;
  expires_at: string | null;
  created_at: string;
};

export type ApplicationRow = {
  id: string;
  user_id: string;
  job_id: string;
  status: ApplicationStatus;
  message: string | null;
  applied_at: string;
  updated_at: string;
};

export type FavoriteRow = {
  id: string;
  user_id: string;
  job_id: string | null;
  company_id: string | null;
  created_at: string;
};

export type DiagnosisQuestionRow = {
  id: string;
  question: string;
  category: ValuesType;
  order: number;
  is_active: boolean;
  version: string;
};

export type DiagnosisOptionRow = {
  id: string;
  question_id: string;
  label: string;
  score: number;
  order: number;
};

export type UserDiagnosisResultRow = {
  id: string;
  user_id: string;
  values_type: ValuesType;
  score_challenger: number;
  score_stable: number;
  score_team: number;
  score_specialist: number;
  created_at: string;
};

export type CompanyDiagnosisResultRow = {
  id: string;
  company_id: string;
  values_type: ValuesType;
  score_challenger: number;
  score_stable: number;
  score_team: number;
  score_specialist: number;
  created_at: string;
};

export type MatchingScoreRow = {
  id: string;
  user_id: string;
  company_id: string;
  score: number;
  calculated_at: string;
};

export type ArticleRow = {
  id: string;
  company_id: string | null;
  author_user_id: string | null;
  region_id: string | null;
  title: string;
  content: string;
  thumbnail_url: string | null;
  article_type: ArticleType;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  interviewee_name: string | null;
  interviewee_role: string | null;
};

export type EmailLogRow = {
  id: string;
  to_email: string;
  template_name: string;
  subject: string;
  status: "sent" | "failed";
  metadata: Json | null;
  sent_at: string;
};

export type AnnouncementRow = {
  id: string;
  title: string;
  content: string;
  target: "all" | "seeker" | "company";
  is_published: boolean;
  published_at: string | null;
};

// ─── nullable フィールドを optional にするヘルパー ─────────────
type Insertable<T> = {
  [K in keyof T as null extends T[K] ? never : K]: T[K];
} & {
  [K in keyof T as null extends T[K] ? K : never]?: T[K];
};

// ─── Supabase GenericTable requires Relationships field ────────
type Rel = {
  foreignKeyName: string;
  columns: string[];
  isOneToOne?: boolean;
  referencedRelation: string;
  referencedColumns: string[];
};
type R<
  T extends { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> },
  Rels extends Rel[] = []
> = T & { Relationships: Rels };

// ─── Database type for Supabase client ────────────────────────
export type Database = {
  public: {
    Tables: {
      regions: R<{
        Row: RegionRow;
        Insert: Insertable<Omit<RegionRow, "id" | "created_at">>;
        Update: Partial<Omit<RegionRow, "id" | "created_at">>;
      }>;
      users: R<{
        Row: UserRow;
        Insert: { id: string; name: string; email: string } & Partial<Omit<UserRow, "id" | "name" | "email" | "created_at">>;
        Update: Partial<Omit<UserRow, "id" | "created_at">>;
      }>;
      companies: R<{
        Row: CompanyRow;
        Insert: Insertable<Omit<CompanyRow, "id" | "created_at">>;
        Update: Partial<Omit<CompanyRow, "id" | "created_at">>;
      }, [
        { foreignKeyName: "companies_region_id_fkey"; columns: ["region_id"]; referencedRelation: "regions"; referencedColumns: ["id"] }
      ]>;
      company_members: R<{
        Row: CompanyMemberRow;
        Insert: Omit<CompanyMemberRow, "id" | "created_at">;
        Update: Partial<Omit<CompanyMemberRow, "id" | "created_at">>;
      }, [
        { foreignKeyName: "company_members_company_id_fkey"; columns: ["company_id"]; referencedRelation: "companies"; referencedColumns: ["id"] },
        { foreignKeyName: "company_members_user_id_fkey"; columns: ["user_id"]; referencedRelation: "users"; referencedColumns: ["id"] }
      ]>;
      jobs: R<{
        Row: JobRow;
        Insert: Insertable<Omit<JobRow, "id" | "created_at">>;
        Update: Partial<Omit<JobRow, "id" | "created_at">>;
      }, [
        { foreignKeyName: "jobs_company_id_fkey"; columns: ["company_id"]; referencedRelation: "companies"; referencedColumns: ["id"] },
        { foreignKeyName: "jobs_region_id_fkey"; columns: ["region_id"]; referencedRelation: "regions"; referencedColumns: ["id"] }
      ]>;
      applications: R<{
        Row: ApplicationRow;
        Insert: Insertable<Omit<ApplicationRow, "id" | "applied_at" | "updated_at">>;
        Update: Partial<Omit<ApplicationRow, "id" | "user_id" | "job_id" | "applied_at">>;
      }, [
        { foreignKeyName: "applications_user_id_fkey"; columns: ["user_id"]; referencedRelation: "users"; referencedColumns: ["id"] },
        { foreignKeyName: "applications_job_id_fkey"; columns: ["job_id"]; referencedRelation: "jobs"; referencedColumns: ["id"] }
      ]>;
      favorites: R<{
        Row: FavoriteRow;
        Insert: Insertable<Omit<FavoriteRow, "id" | "created_at">>;
        Update: Partial<Omit<FavoriteRow, "id" | "created_at">>;
      }>;
      diagnosis_questions: R<{
        Row: DiagnosisQuestionRow;
        Insert: Omit<DiagnosisQuestionRow, "id">;
        Update: Partial<Omit<DiagnosisQuestionRow, "id">>;
      }>;
      diagnosis_options: R<{
        Row: DiagnosisOptionRow;
        Insert: Omit<DiagnosisOptionRow, "id">;
        Update: Partial<Omit<DiagnosisOptionRow, "id">>;
      }, [
        { foreignKeyName: "diagnosis_options_question_id_fkey"; columns: ["question_id"]; referencedRelation: "diagnosis_questions"; referencedColumns: ["id"] }
      ]>;
      user_diagnosis_answers: R<{
        Row: { id: string; user_id: string; question_id: string; option_id: string; score: number; answered_at: string };
        Insert: { user_id: string; question_id: string; option_id: string; score: number };
        Update: Record<string, never>;
      }>;
      user_diagnosis_results: R<{
        Row: UserDiagnosisResultRow;
        Insert: Omit<UserDiagnosisResultRow, "id" | "created_at">;
        Update: Partial<Omit<UserDiagnosisResultRow, "id" | "created_at">>;
      }>;
      company_diagnosis_answers: R<{
        Row: { id: string; company_id: string; question_id: string; option_id: string; score: number; answered_at: string };
        Insert: { company_id: string; question_id: string; option_id: string; score: number };
        Update: Record<string, never>;
      }>;
      company_diagnosis_results: R<{
        Row: CompanyDiagnosisResultRow;
        Insert: Omit<CompanyDiagnosisResultRow, "id" | "created_at">;
        Update: Partial<Omit<CompanyDiagnosisResultRow, "id" | "created_at">>;
      }>;
      matching_scores: R<{
        Row: MatchingScoreRow;
        Insert: Omit<MatchingScoreRow, "id" | "calculated_at">;
        Update: Partial<Omit<MatchingScoreRow, "id" | "calculated_at">>;
      }>;
      articles: R<{
        Row: ArticleRow;
        Insert: Insertable<Omit<ArticleRow, "id" | "created_at">>;
        Update: Partial<Omit<ArticleRow, "id" | "created_at">>;
      }, [
        { foreignKeyName: "articles_company_id_fkey"; columns: ["company_id"]; referencedRelation: "companies"; referencedColumns: ["id"] },
        { foreignKeyName: "articles_region_id_fkey"; columns: ["region_id"]; referencedRelation: "regions"; referencedColumns: ["id"] }
      ]>;
      tags: R<{
        Row: { id: string; name: string; category: "industry" | "value" | "workstyle" };
        Insert: { name: string; category: "industry" | "value" | "workstyle" };
        Update: { name?: string; category?: "industry" | "value" | "workstyle" };
      }>;
      company_tags: R<{
        Row: { company_id: string; tag_id: string };
        Insert: { company_id: string; tag_id: string };
        Update: Record<string, never>;
      }>;
      job_tags: R<{
        Row: { job_id: string; tag_id: string };
        Insert: { job_id: string; tag_id: string };
        Update: Record<string, never>;
      }>;
      email_logs: R<{
        Row: EmailLogRow;
        Insert: Omit<EmailLogRow, "id" | "sent_at">;
        Update: Record<string, never>;
      }>;
      announcements: R<{
        Row: AnnouncementRow;
        Insert: Insertable<Omit<AnnouncementRow, "id">>;
        Update: Partial<Omit<AnnouncementRow, "id">>;
      }>;
    };
    Views: Record<string, never>;
    Functions: {
      calculate_matching_score: {
        Args: { p_user_id: string; p_company_id: string };
        Returns: number;
      };
      calculate_all_matching_scores: {
        Args: { p_user_id: string };
        Returns: { company_id: string; score: number }[];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
