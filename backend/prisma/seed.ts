import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // -----------------------------
  // organisation 1
  // -----------------------------
  const org1 = await prisma.structure.create({
    data: { name: "Sunrise Health", type: "organisation" },
  });

  const team1 = await prisma.structure.create({
    data: { name: "Cardiology Team", type: "team", parentId: org1.id },
  });

  const client1 = await prisma.structure.create({
    data: { name: "John Doe", type: "client", parentId: team1.id },
  });

  const episode1 = await prisma.structure.create({
    data: { name: "Heart Surgery Follow-up", type: "episode", parentId: client1.id },
  });

  // Notes for org1
  await prisma.note.create({
    data: { title: "Org-wide Announcement", content: "Quarterly planning session", structureId: org1.id },
  });

  // Notes for team1
  await prisma.note.create({
    data: { title: "Team Review", content: "Weekly cardiology meeting", structureId: team1.id },
  });

  // Notes for client1
  await prisma.note.create({
    data: { title: "Initial Consultation", content: "Patient reports chest pain", structureId: client1.id },
  });

  // Notes for episode1
  await prisma.note.create({
    data: { title: "Follow-up", content: "Patient recovering well", structureId: episode1.id },
  });

  // -----------------------------
  // organisation 2
  // -----------------------------
  const org2 = await prisma.structure.create({
    data: { name: "Harborview Clinic", type: "organisation" },
  });

  const team2 = await prisma.structure.create({
    data: { name: "Pediatrics Team", type: "team", parentId: org2.id },
  });

  const client2 = await prisma.structure.create({
    data: { name: "Jane Miller", type: "client", parentId: team2.id },
  });

  const episode2 = await prisma.structure.create({
    data: { name: "Routine Checkup", type: "episode", parentId: client2.id },
  });

  // Notes for org2
  await prisma.note.create({
    data: { title: "Org Announcement", content: "Annual health inspection", structureId: org2.id },
  });

  // Notes for team2
  await prisma.note.create({
    data: { title: "Team Meeting", content: "Monthly pediatrics review", structureId: team2.id },
  });

  // Notes for client2
  await prisma.note.create({
    data: { title: "Consultation", content: "Child presenting mild fever", structureId: client2.id },
  });

  // Notes for episode2
  await prisma.note.create({
    data: { title: "Checkup Notes", content: "Vitals normal", structureId: episode2.id },
  });

  console.log("Seed data created for two organisations!");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
