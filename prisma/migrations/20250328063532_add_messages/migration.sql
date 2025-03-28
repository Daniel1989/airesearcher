/*
  Warnings:

  - You are about to drop the `_MeetingAgents` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_MeetingAgents";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "round" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "meetingId" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "agentName" TEXT NOT NULL,
    CONSTRAINT "Message_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Message_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_AgentToMeeting" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_AgentToMeeting_A_fkey" FOREIGN KEY ("A") REFERENCES "Agent" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_AgentToMeeting_B_fkey" FOREIGN KEY ("B") REFERENCES "Meeting" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_AgentToMeeting_AB_unique" ON "_AgentToMeeting"("A", "B");

-- CreateIndex
CREATE INDEX "_AgentToMeeting_B_index" ON "_AgentToMeeting"("B");
