-- Add driver_name to trips
ALTER TABLE trips ADD COLUMN IF NOT EXISTS driver_name TEXT;

-- Reload schema cache
NOTIFY pgrst, 'reload schema';
