import React, { useEffect, useState } from "react";
import { Node } from "../types";
import Modal from "./Modal";
import Breadcrumb from "./Breadcrumb";
import NotesSection from "./NotesSection";
import getBreadcrumbPath from "../utils/helper";

import { PlusCircle } from "lucide-react";


type ContentScreenProps = {
  selectedNode: Node | null;
  onRefresh: () => void;
  tree: Node[];
  onSelectNode: (node: Node) => void;
};

const ContentScreen: React.FC<ContentScreenProps> = ({ selectedNode, onRefresh, tree, onSelectNode }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [childType, setChildType] = useState<"team" | "client" | "episode" | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<Node[]>([]);

  useEffect(() => {
    if (!selectedNode || !tree) {
      setBreadcrumbs([]);
      return;
    }

    for (const root of tree) {
      const path = getBreadcrumbPath(root, selectedNode.id);
      if (path) {
        setBreadcrumbs(path);
        break;
      }
    }
  }, [selectedNode, tree]);

  if (!selectedNode) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <h1 className="text-xl text-gray-400 italic">
          Please select an item from the hierarchy
        </h1>
      </div>
    );
  }

  const openModal = (type: "team" | "client" | "episode") => {
    setChildType(type);
    setModalOpen(true);
  };

  const handleAddChild = async (name: string) => {
    if (!selectedNode || !childType) return;
    try {
      await fetch(`http://localhost:3001/structures`, {
        method: "POST",
        body: JSON.stringify({ name, type: childType, parentId: selectedNode.id }),
        headers: { "Content-Type": "application/json" },
      });
      setModalOpen(false);
      onRefresh();
    } catch {
      alert(`Failed to add ${childType}`);
    }
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      {/* Breadcrumb */}
      <Breadcrumb breadcrumbs={breadcrumbs} />

      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b pb-3">
        <h1 className="text-3xl font-semibold text-gray-800 flex items-center gap-2">
          {selectedNode.name}
          <span className="text-sm font-medium text-gray-500">({selectedNode.type})</span>
        </h1>
        <div className="flex gap-2">
          {selectedNode.type === "organisation" && (
            <button onClick={() => openModal("team")} className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700">
              <PlusCircle size={16} /> Team
            </button>
          )}
          {selectedNode.type === "team" && (
            <button onClick={() => openModal("client")} className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-purple-700">
              <PlusCircle size={16} /> Client
            </button>
          )}
          {selectedNode.type === "client" && (
            <button onClick={() => openModal("episode")} className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-orange-700">
              <PlusCircle size={16} /> Episode
            </button>
          )}
        </div>
      </div>

      {/* Notes Section with tags */}
      <div className="space-y-4">
        <NotesSection node={selectedNode} onRefresh={onRefresh} onSelectNode={onSelectNode} />
      </div>

      {/* Modal */}
      <Modal
        open={modalOpen}
        entityType={childType || "team"}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddChild}
      />
    </div>
  );
};

export default ContentScreen;
