import { useState } from "react";

type AddChildModalProps = {
  open: boolean;
  entityType?: "organisation" | "team" | "client" | "episode"; 
  onClose: () => void;
  onSubmit: (name: string) => void;
  content?: string
  
};

const Modal: React.FC<AddChildModalProps> = ({
  open,
  entityType,
  onClose,
  onSubmit,
  content
}) => {
  const [value, setValue] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white p-6 rounded shadow-lg w-80">
        <div></div>
        
        <h2 className="text-lg font-bold mb-4"> 
          {content? content: `Add ${entityType}`}
         
        </h2>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={`Enter ${entityType} name`}
          className="w-full border p-2 rounded mb-4"
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 bg-gray-300 rounded">
            Cancel
          </button>
          <button
            onClick={() => {
              if (value.trim()) {
                onSubmit(value.trim());
                setValue("");
                onClose();
              }
            }}
            className="px-3 py-1 bg-blue-500 text-white rounded"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
