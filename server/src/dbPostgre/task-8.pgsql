UPDATE "Users" u
SET balance = u.balance + c.cashback
FROM (
    SELECT "userId", ROUND(SUM(prize) * 0.1, 2) AS cashback
    FROM "Contests"
    WHERE (EXTRACT(MONTH FROM "createdAt") = 12 AND EXTRACT(DAY FROM "createdAt") >= 25)
       OR (EXTRACT(MONTH FROM "createdAt") = 1 AND EXTRACT(DAY FROM "createdAt") <= 14)
    GROUP BY "userId"
) AS c
WHERE u.id = c."userId"
  AND u.role = 'customer'
