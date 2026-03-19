/*
  Warnings:

  - You are about to drop the column `invitedById` on the `invitations` table. All the data in the column will be lost.
  - Changed the type of `action` on the `activity_logs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `invitedByMemberId` to the `invitations` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'EXPIRED', 'REVOKED');

-- CreateEnum
CREATE TYPE "ActivityLogAction" AS ENUM ('WORKSPACE_CREATED', 'WORKSPACE_RENAMED', 'WORKSPACE_ARCHIVED', 'WORKSPACE_DELETED', 'MEMBER_ADDED', 'MEMBER_ROLE_CHANGED', 'MEMBER_REMOVED', 'INVITE_SENT', 'INVITE_ACCEPTED', 'INVITE_REVOKED');

-- DropForeignKey
ALTER TABLE "invitations" DROP CONSTRAINT "invitations_invitedById_fkey";

-- DropIndex
DROP INDEX "invitations_token_idx";

-- AlterTable
ALTER TABLE "activity_logs" DROP COLUMN "action",
ADD COLUMN     "action" "ActivityLogAction" NOT NULL;

-- AlterTable
ALTER TABLE "invitations" DROP COLUMN "invitedById",
ADD COLUMN     "invitedByMemberId" TEXT NOT NULL,
ADD COLUMN     "revokedAt" TIMESTAMP(3),
ADD COLUMN     "status" "InvitationStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "workspaces" ADD COLUMN     "archived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "invitations_workspaceId_status_idx" ON "invitations"("workspaceId", "status");

-- CreateIndex
CREATE INDEX "invitations_workspaceId_email_status_idx" ON "invitations"("workspaceId", "email", "status");

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_invitedByMemberId_fkey" FOREIGN KEY ("invitedByMemberId") REFERENCES "workspace_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;
