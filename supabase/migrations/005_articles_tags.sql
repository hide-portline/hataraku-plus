CREATE TABLE articles (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id      uuid REFERENCES companies(id) ON DELETE SET NULL,
  author_user_id  uuid REFERENCES users(id) ON DELETE SET NULL,
  region_id       uuid REFERENCES regions(id),
  title           text NOT NULL,
  content         text NOT NULL,
  thumbnail_url   text,
  article_type    text NOT NULL DEFAULT 'story'
                  CHECK (article_type IN ('story','interview','news')),
  is_published    boolean NOT NULL DEFAULT false,
  published_at    timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE tags (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name      text NOT NULL UNIQUE,
  category  text NOT NULL CHECK (category IN ('industry','value','workstyle'))
);

CREATE TABLE company_tags (
  company_id  uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  tag_id      uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (company_id, tag_id)
);

CREATE TABLE job_tags (
  job_id   uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  tag_id   uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (job_id, tag_id)
);

CREATE TABLE announcements (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text NOT NULL,
  content       text NOT NULL,
  target        text NOT NULL DEFAULT 'all' CHECK (target IN ('all','seeker','company')),
  is_published  boolean NOT NULL DEFAULT false,
  published_at  timestamptz
);
