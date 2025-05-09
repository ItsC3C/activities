import { useState } from "react";
import {
  useGetActivitiesQuery,
  useDeleteActivityMutation,
} from "../redux/activitiesApi";
import ActivityModal from "../components/ActivityModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import EditModal from "../components/EditModal";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { Activity } from "../types/Activity";

const ActivitiesPage = () => {
  const { data: activities = [], isLoading } = useGetActivitiesQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<string | null>(null);
  const [activityToEdit, setActivityToEdit] = useState<Activity | null>(null);
  const [deleteActivity] = useDeleteActivityMutation();

  const handleDeleteClick = (activityId: string) => {
    setActivityToDelete(activityId);
    setIsDeleteModalOpen(true);
  };

  const handleEditClick = (activity: Activity) => {
    setActivityToEdit(activity);
    setIsEditModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (activityToDelete) {
      try {
        await deleteActivity(activityToDelete).unwrap();
        setIsDeleteModalOpen(false);
      } catch (error) {
        console.error("Failed to delete activity:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-gray-600 text-lg">
          Activiteiten aan het laden...
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold mb-6">Activiteiten</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setIsModalOpen(true)}
        >
          Voeg activiteit toe
        </button>
      </div>

      <ActivityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {activityToEdit && (
        <EditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          activity={activityToEdit}
        />
      )}

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        activityTitle={
          activities.find((activity) => activity.id === activityToDelete)
            ?.title || ""
        }
      />

      {activities.length === 0 ? (
        <p className="text-gray-500">Geen activiteiten gevonden.</p>
      ) : (
        <ul className="space-y-4">
          {activities.map((activity) => (
            <li
              key={activity.id}
              className="bg-white p-4 rounded-lg shadow-md border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium text-blue-700">
                  {activity.title}
                </h2>
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => handleDeleteClick(activity.id)}
                    className="mt-4 text-red-500 hover:text-red-700"
                  >
                    <Trash2Icon className="w-5 h-5 inline-block mr-1" />
                  </button>
                  <button
                    onClick={() => handleEditClick(activity)}
                    className="mt-4 text-blue-500 hover:text-blue-700"
                  >
                    <PencilIcon className="w-5 h-5 inline-block mr-1" />
                  </button>
                </div>
              </div>
              {activity.image && (
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="mt-4 rounded-lg w-full h-48 object-cover"
                />
              )}
              <p className="text-gray-600 mt-2">{activity.description}</p>
              <p className="text-sm text-gray-400 mt-1">
                📍 {activity.location?.latitude}, {activity.location?.longitude}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActivitiesPage;
