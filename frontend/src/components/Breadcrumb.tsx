import React from "react";
import { Node } from "../types";

type BreadcrumbProps = {
  breadcrumbs: Node[];
};

const Breadcrumb: React.FC<BreadcrumbProps> = ({ breadcrumbs }) => {
  if (breadcrumbs.length === 0) return null;

  return (
    <div className="mb-2 text-sm text-gray-500">
      {breadcrumbs.map((node, idx) => (
        <span key={node.id}>
          {node.name} {idx < breadcrumbs.length - 1 && "> "}{" "}
        </span>
      ))}
    </div>
  );
};

export default Breadcrumb;
