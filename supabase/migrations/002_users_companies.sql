CREATE TABLE users (
  id                   uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name                 text NOT NULL,
  email                text NOT NULL,
  phone                text,
  avatar_url           text,
  bio                  text,
  preferred_region_id  uuid REFERENCES regions(id),
  desired_location     text,
  employment_type_pref text,
  created_at           timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE companies (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  region_id          uuid REFERENCES regions(id),
  company_name       text NOT NULL,
  industry           text,
  description        text,
  vision             text,
  culture_description text,
  logo_url           text,
  photo_urls         text[],
  employee_count     int,
  founded_year       int,
  location           text,
  website_url        text,
  contact_email      text NOT NULL,
  values_type        text CHECK (values_type IN ('challenger','stable','team','specialist')),
  status             text NOT NULL DEFAULT 'pending'
                     CHECK (status IN ('pending','approved','rejected')),
  rejection_reason   text,
  approved_at        timestamptz,
  created_at         timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE company_members (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id  uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role        text NOT NULL DEFAULT 'owner' CHECK (role IN ('owner','editor')),
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (company_id, user_id)
);
