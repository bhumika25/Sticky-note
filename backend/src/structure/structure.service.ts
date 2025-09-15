
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class StructureService {
  constructor(private prisma: PrismaService) {}

  async createStructure(data: { name: string; type: string; parentId?: number }) {
    if (data.parentId) {
      const parent = await this.prisma.structure.findUnique({
        where: { id: data.parentId },
      });

      if (!parent) {
        throw new Error("Parent not found");
      }

      // Enforce strict hierarchy rules
      if (data.type === "team" && parent.type !== "organisation") {
        throw new Error("A team must belong to an organisation");
      }
      if (data.type === "client" && parent.type !== "team") {
        throw new Error("A client must belong to a team");
      }
      if (data.type === "episode" && parent.type !== "client") {
        throw new Error("An episode must belong to a client");
      }
    } else {
      // Root nodes must be organisations
      if (data.type !== "organisation") {
        throw new Error("Only organisations can be created without a parent");
      }
    }

    return this.prisma.structure.create({ data });
  }

  async getHierarchy() {
    const structures = await this.prisma.structure.findMany({
      include: { notes: true },
    });

    const buildTree = (parentId: number | null) => {
      return structures
        .filter((s) => s.parentId === parentId)
        .map((s) => ({
          id: s.id,
          name: s.name,
          type: s.type,
          notes: s.notes,
          children: buildTree(s.id),
        }));
    };

    return buildTree(null); 
  }

 
  async getNodeWithChildren(id: number) {
    const node = await this.prisma.structure.findUnique({
      where: { id },
      include: { notes: true },
    });

    if (!node) {
      throw new Error("Node not found");
    }

    const structures = await this.prisma.structure.findMany({
      include: { notes: true },
    });

    const buildTree = (parentId: number) => {
      return structures
        .filter((s) => s.parentId === parentId)
        .map((s) => ({
          id: s.id,
          name: s.name,
          type: s.type,
          notes: s.notes,
          children: buildTree(s.id),
        }));
    };

    return {
      ...node,
      children: buildTree(node.id),
    };
  }
}
