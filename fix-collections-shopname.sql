-- Fix existing collection entries that are missing shop_name
-- This updates all collections where shop_name is NULL by looking up the shop name from the shops table
UPDATE collections c
SET shop_name = s.name
FROM shops s
WHERE c.shop_id = s.shop_id
AND (c.shop_name IS NULL OR c.shop_name = '');

-- Verify the fix
SELECT c.id, c.shop_id, c.shop_name, c.amount, c.created_at
FROM collections c
ORDER BY c.created_at DESC
LIMIT 20;
