/*
  Warnings:

  - The values [Cancelled] on the enum `FriendshipStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "FriendshipStatus_new" AS ENUM ('Requested', 'Connected');
ALTER TABLE "Friends" ALTER COLUMN "friendStatus" DROP DEFAULT;
ALTER TABLE "Friends" ALTER COLUMN "friendStatus" TYPE "FriendshipStatus_new" USING ("friendStatus"::text::"FriendshipStatus_new");
ALTER TYPE "FriendshipStatus" RENAME TO "FriendshipStatus_old";
ALTER TYPE "FriendshipStatus_new" RENAME TO "FriendshipStatus";
DROP TYPE "FriendshipStatus_old";
ALTER TABLE "Friends" ALTER COLUMN "friendStatus" SET DEFAULT 'Requested';
COMMIT;
