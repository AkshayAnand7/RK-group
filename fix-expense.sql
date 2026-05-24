ALTER TABLE collections ADD COLUMN IF NOT EXISTS expense_remark TEXT;
ALTER TABLE collections ADD COLUMN IF NOT EXISTS wages NUMERIC DEFAULT 0;

NOTIFY pgrst, 'reload schema';
