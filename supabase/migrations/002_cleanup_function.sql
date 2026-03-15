-- ================================================================
-- Ghar Sajaoo — Nightly Cleanup Maintenance
-- Purpose: Remove abandoned carts and unpaid orders older than 10 days
-- ================================================================

-- 1. Create the cleanup function
CREATE OR REPLACE FUNCTION public.cleanup_junk_data()
RETURNS void AS $$
BEGIN
  -- Delete idle carts (older than 10 days)
  DELETE FROM public.cart_sessions
  WHERE updated_at < NOW() - INTERVAL '10 days';

  -- Delete unpaid/abandoned orders (older than 10 days)
  -- PAID orders (confirmed, shipped, delivered) are kept forever
  DELETE FROM public.orders
  WHERE status IN ('pending', 'abandoned')
  AND updated_at < NOW() - INTERVAL '10 days';

  RAISE NOTICE 'Nightly cleanup completed successfully.';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Schedule the job using pg_cron (Daily at Midnight)
-- Ensure pg_cron extension is enabled first: CREATE EXTENSION IF NOT EXISTS pg_cron;
SELECT cron.schedule(
  'nightly-cleanup-job', -- unique name for the job
  '0 0 * * *',           -- cron schedule (midnight)
  'SELECT public.cleanup_junk_data()'
);
