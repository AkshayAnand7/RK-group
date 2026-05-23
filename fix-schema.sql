-- Run this in your Supabase SQL Editor to fix the schema cache error

-- Add missing columns to 'collections' table
ALTER TABLE collections ADD COLUMN IF NOT EXISTS staff_name TEXT;
ALTER TABLE collections ADD COLUMN IF NOT EXISTS shop_name TEXT;
ALTER TABLE collections ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT false;

-- Add missing columns to 'trips' table
ALTER TABLE trips ADD COLUMN IF NOT EXISTS staff_name TEXT;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS customer_number TEXT;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS vehicle TEXT;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS status TEXT;

-- Reload the PostgREST schema cache
NOTIFY pgrst, 'reload schema';
