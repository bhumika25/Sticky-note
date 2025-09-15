// types.ts
export type Note = {
  id: number;
  type: "text" | "file" | "voice";
  content: string;
  timestamp: string;
  author?: string;
  attachments?: any;
  tags?: any;
  createdAt: string;
  title: any;
};

export type Node = {
  id: number;
  name: string;
  type: "organisation" | "team" | "client" | "episode";
  notes?: Note[];
  children?: Node[];
  latest_note?: { content: string; timestamp: string };
};
