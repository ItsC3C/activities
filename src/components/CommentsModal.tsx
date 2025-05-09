import { X } from "lucide-react";

interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  comments: string[];
}

const CommentsModal: React.FC<CommentsModalProps> = ({
  isOpen,
  onClose,
  comments,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          <X className="w-5 h-5 mt-2.5 mr-2.5" />
        </button>
        <h2 className="text-xl font-bold mb-4">Reacties</h2>
        <div className="max-h-64 overflow-y-auto space-y-2">
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <div
                key={index}
                className="bg-gray-100 p-3 rounded text-gray-800"
              >
                {comment}
              </div>
            ))
          ) : (
            <p className="text-gray-500">Geen reacties beschikbaar.</p>
          )}
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded"
          >
            Sluiten
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentsModal;
