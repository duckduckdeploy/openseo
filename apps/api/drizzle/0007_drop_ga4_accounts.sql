-- Google Analytics was removed: drop the Analytics grants. Their project connections went with ga4_connections.
DELETE FROM "google_accounts" WHERE "provider" = 'ga4';
