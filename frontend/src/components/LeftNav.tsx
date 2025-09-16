import React, { useEffect, useState } from "react";
import axios from "axios";
import { Node } from "../types";
import Modal from "./Modal";

type TreeNodeProps = {
  node: Node;
  level?: number;
  onSelectNode: (node: Node) => void;
  selectedNodeId: number | null;
};

const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  level = 0,
  onSelectNode,
  selectedNodeId,
}) => {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedNodeId === node.id;

  const handleClick = () => {
    onSelectNode(node);
    if (hasChildren) setExpanded(!expanded);
  };

  return (
    <li>
      <div
        className={`flex items-center justify-between cursor-pointer p-2 rounded transition
          ${isSelected ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`}
        style={{ paddingLeft: `${level * 16}px` }}
        onClick={handleClick}
      >
        <div className="flex flex-col">
          <span className="font-medium">{node.name}</span>
          <span
            className={`text-xs capitalize ${isSelected ? "text-blue-100" : "text-gray-400"
              }`}
          >
            {node.type}
          </span>
          {node.latest_note && (
            <span
              className={`text-xs truncate ${isSelected ? "text-blue-100" : "text-gray-500"
                }`}
            >
              {node.latest_note.content}
            </span>
          )}
        </div>

        {hasChildren && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 transform transition-transform duration-200 ${expanded ? "rotate-180" : ""
              }`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>

      {expanded && hasChildren && (
        <ul className="space-y-1 mt-1">
          {node.children!.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              onSelectNode={onSelectNode}
              selectedNodeId={selectedNodeId}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

type LeftNavProps = {
  onSelectNode: (node: Node) => void;
  selectedNodeId: number | null; 
};

const LeftNav: React.FC<LeftNavProps> = ({ onSelectNode, selectedNodeId }) => {
  const [tree, setTree] = useState<Node[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchTree = async () => {
    try {
      setLoading(true);
      const res = await axios.get<Node[]>("http://localhost:3001/structures");
      setTree(res.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch tree");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectNode = (node: Node) => {
    onSelectNode(node);
  };

  const handleAddOrganisation = async (name: string) => {
    try {
      await axios.post("http://localhost:3001/structures", {
        name,
        type: "organisation",
      });
      fetchTree();
    } catch {
      alert("Failed to add organisation");
    }
  };

  useEffect(() => {
    fetchTree();
  }, []);

  if (loading) return <div className="p-4">Loading hierarchy...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="bg-gray-100 p-4 border-r h-screen overflow-y-auto w-64">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Organisations</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
        >
          + Add
        </button>
      </div>
      <ul className="space-y-1">
        {tree.map((node) => (
          <TreeNode
            key={node.id}
            node={node}
            onSelectNode={handleSelectNode}
            selectedNodeId={selectedNodeId}
          />
        ))}
      </ul>
      <Modal
        open={modalOpen}
        entityType="organisation"
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddOrganisation}
      />
    </div>
  );
};

export default LeftNav;
export { TreeNode };
export type { Node };
