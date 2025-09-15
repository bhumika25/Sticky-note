import React, { useState, useEffect } from "react";
import LeftNav from "../components/LeftNav";
import ContentScreen from "../components/Contentscreen";
import type { Node } from "../types";
import axios from "axios";

const StickyNote: React.FC = () => {
  const [tree, setTree] = useState<Node[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [loadingTree, setLoadingTree] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTree = async () => {
    setLoadingTree(true);
    try {
      const res = await axios.get<Node[]>("http://localhost:3001/structures");
      setTree(res.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load tree");
    } finally {
      setLoadingTree(false);
    }
  };

  useEffect(() => {
    fetchTree();
  }, []);

  const handleSelectNode = (node: Node) => {
    setSelectedNode(node);
  };

  const refreshTree = async () => {
    await fetchTree();
    // optionally reset selection
    setSelectedNode(null);
  };

  if (loadingTree) return <div className="p-4">Loading tree...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <>
      <div className="flex h-screen">
      <LeftNav onSelectNode={handleSelectNode} />
      <ContentScreen
        selectedNode={selectedNode}
        onRefresh={refreshTree}
        tree={tree}
        onSelectNode={handleSelectNode} 
      />
    </div>
    </>
   
  );
};

export default StickyNote;
