interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  activityTitle?: string;
  isDeleteAll?: boolean;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  activityTitle = "",
  isDeleteAll = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">
          {isDeleteAll
            ? "Weet je zeker dat je alles wilt vergeten?"
            : `Weet je zeker dat je ${activityTitle} wilt verwijderen?`}
        </h2>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded"
          >
            Annuleren
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Verwijderen
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
