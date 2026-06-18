CREATE TABLE jobs (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id      uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  region_id       uuid REFERENCES regions(id),
  title           text NOT NULL,
  employment_type text NOT NULL CHECK (employment_type IN ('fulltime','parttime','contract')),
  salary_min      int,
  salary_max      int,
  location        text,
  description     text,
  required_skills text,
  benefits        text,
  work_style      text CHECK (work_style IN ('remote','onsite','hybrid')),
  values_type     text CHECK (values_type IN ('challenger','stable','team','specialist')),
  is_published    boolean NOT NULL DEFAULT false,
  published_at    timestamptz,
  expires_at      timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE applications (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  job_id      uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  status      text NOT NULL DEFAULT 'applied'
              CHECK (status IN ('applied','screening','interview','offer','hired','rejected')),
  message     text,
  applied_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, job_id)
);

CREATE TABLE favorites (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  job_id      uuid REFERENCES jobs(id) ON DELETE CASCADE,
  company_id  uuid REFERENCES companies(id) ON DELETE CASCADE,
  created_at  timestamptz NOT NULL DEFAULT now(),
  CHECK (
    (job_id IS NOT NULL AND company_id IS NULL) OR
    (job_id IS NULL AND company_id IS NOT NULL)
  )
);
