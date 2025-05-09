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
  const [sortBy, setSortBy] = useState<string>("title");
  const [filterText, setFilterText] = useState<string>("");
  const [isDeleteAll, setIsDeleteAll] = useState(false);

  const handleDeleteClick = (activityId: string) => {
    setActivityToDelete(activityId);
    setIsDeleteModalOpen(true);
  };

  const handleEditClick = (activity: Activity) => {
    setActivityToEdit(activity);
    setIsEditModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (isDeleteAll) {
        await Promise.all(activities.map((a) => deleteActivity(a.id).unwrap()));
      } else if (activityToDelete) {
        await deleteActivity(activityToDelete).unwrap();
      }
      setIsDeleteModalOpen(false);
      setActivityToDelete(null);
      setIsDeleteAll(false);
    } catch (error) {
      console.error("Verwijderen mislukt:", error);
    }
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(e.target.value);
  };

  const filteredActivities = activities.filter((activity) =>
    activity.title.toLowerCase().includes(filterText.toLowerCase())
  );

  const sortedActivities = filteredActivities.sort((a, b) => {
    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    } else if (sortBy === "date") {
      return (
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    }
    return 0;
  });

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

      <div className="mb-4 flex items-center gap-4">
        <select
          value={sortBy}
          onChange={handleSortChange}
          className="bg-white border border-gray-300 rounded px-4 py-2"
        >
          <option value="title">Sorteren op Titel</option>
          <option value="date">Sorteren op Nieuwste</option>
        </select>

        <input
          type="text"
          value={filterText}
          onChange={handleFilterChange}
          placeholder="Zoek op titel..."
          className="bg-white border border-gray-300 rounded px-4 py-2 w-full md:w-1/3"
        />

        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={() => {
            setIsDeleteAll(true);
            setIsDeleteModalOpen(true);
          }}
        >
          Verwijder alles
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
        onClose={() => {
          setIsDeleteModalOpen(false);
          setIsDeleteAll(false);
        }}
        onConfirm={handleConfirmDelete}
        activityTitle={
          activities.find((activity) => activity.id === activityToDelete)
            ?.title || ""
        }
        isDeleteAll={isDeleteAll}
      />

      {sortedActivities.length === 0 ? (
        <p className="text-gray-500">Geen activiteiten gevonden.</p>
      ) : (
        <ul className="space-y-4">
          {sortedActivities.map((activity) => (
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
              {activity.location && (
                <p className="text-sm text-gray-400 mt-1">
                  📍 {activity.location?.latitude},{" "}
                  {activity.location?.longitude}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActivitiesPage;
