CREATE DATABASE "chat"

CREATE TYPE "enum_Users_role" AS ENUM ('customer', 'creator');

CREATE TABLE "Users" (
    "id"          SERIAL PRIMARY KEY,
    "firstName"   VARCHAR(255) NOT NULL,
    "lastName"    VARCHAR(255) NOT NULL,
    "displayName" VARCHAR(255) NOT NULL,
    "password"    VARCHAR(255) NOT NULL,
    "email"       VARCHAR(255) NOT NULL UNIQUE,
    "avatar"      VARCHAR(255) NOT NULL DEFAULT 'anon.png',
    "role"        "enum_Users_role" NOT NULL,
    "balance"     DECIMAL NOT NULL DEFAULT 0,
    "accessToken" TEXT,
    "rating"      FLOAT NOT NULL DEFAULT 0,

    CONSTRAINT "Users_balance_check" CHECK ("balance" >= 0)
);

CREATE TABLE "Conversations" (
    "id"            SERIAL PRIMARY KEY,
    "user1Id"       INTEGER NOT NULL REFERENCES "Users" ("id") ON DELETE CASCADE,
    "user2Id"       INTEGER NOT NULL REFERENCES "Users" ("id") ON DELETE CASCADE,
    "blackList1"    BOOLEAN NOT NULL DEFAULT FALSE,
    "blackList2"    BOOLEAN NOT NULL DEFAULT FALSE,
    "favoriteList1" BOOLEAN NOT NULL DEFAULT FALSE,
    "favoriteList2" BOOLEAN NOT NULL DEFAULT FALSE,
    "createdAt"     TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt"     TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT "Conversations_order_check" CHECK ("user1Id" < "user2Id"),
    CONSTRAINT "Conversations_pair_unique"  UNIQUE ("user1Id", "user2Id")
);

CREATE TABLE "Messages" (
    "id"           SERIAL PRIMARY KEY,
    "sender"       INTEGER NOT NULL REFERENCES "Users" ("id"),
    "body"         TEXT NOT NULL,
    "conversation" INTEGER NOT NULL REFERENCES "Conversations" ("id"),
    "createdAt"    TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt"    TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "Catalogs" (
    "id"          SERIAL PRIMARY KEY,
    "userId"      INTEGER NOT NULL REFERENCES "Users" ("id") ON DELETE CASCADE,
    "catalogName" VARCHAR(255) NOT NULL
);

CREATE TABLE "CatalogChats" (
    "catalogId"      INTEGER NOT NULL REFERENCES "Catalogs" ("id") ON DELETE CASCADE,
    "conversationId" INTEGER NOT NULL REFERENCES "Conversations" ("id") ON DELETE CASCADE,

    PRIMARY KEY ("catalogId", "conversationId")
);