import { useState, useEffect } from "react";
import { useUpdateActivityMutation } from "../redux/activitiesApi";
import { Activity } from "../types/Activity";
import { X } from "lucide-react";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: Activity;
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, activity }) => {
  const [title, setTitle] = useState(activity.title);
  const [description, setDescription] = useState(activity.description);
  const [image, setImage] = useState(activity.image || "");
  const [latitude, setLatitude] = useState(activity.location?.latitude || "");
  const [longitude, setLongitude] = useState(
    activity.location?.longitude || ""
  );

  const [updateActivity, { isLoading }] = useUpdateActivityMutation();

  useEffect(() => {
    if (isOpen) {
      setTitle(activity.title);
      setDescription(activity.description);
      setImage(activity.image || "");
      if (activity.location) {
        setLatitude(activity.location.latitude);
        setLongitude(activity.location.longitude);
      } else {
        setLatitude("");
        setLongitude("");
      }
    }
  }, [isOpen, activity]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateActivity({
        id: activity.id,
        title,
        description,
        image,
        location: {
          latitude,
          longitude,
        },
      }).unwrap();

      onClose();
    } catch (error) {
      console.error("Failed to update activity:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl"
        >
          <X className="w-5 h-5 mt-3.5 mr-3.5" />
        </button>
        <h2 className="text-xl font-bold mb-4">Bewerk activiteit</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Titel"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border border-gray-300 p-2 rounded"
          />
          <textarea
            placeholder="Beschrijving"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
          />
          <input
            type="text"
            placeholder="Afbeelding URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
          />
          <input
            type="text"
            placeholder="Latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
          />
          <input
            type="text"
            placeholder="Longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {isLoading ? "Bewerken..." : "Bewerken"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
