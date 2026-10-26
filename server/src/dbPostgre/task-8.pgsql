UPDATE "Users" u
SET balance = u.balance + c.cashback
FROM (
    SELECT "userId", ROUND(SUM(prize) * 0.1, 2) AS cashback
    FROM "Contests"
    WHERE "createdAt" >= TIMESTAMP '2025-12-25 00:00:00'
      AND "createdAt" <  TIMESTAMP '2026-01-15 00:00:00'
    GROUP BY "userId"
) AS c
WHERE u.id = c."userId"
  AND u.role = 'customer';