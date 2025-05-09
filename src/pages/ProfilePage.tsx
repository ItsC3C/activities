import { useEffect, useState } from "react";
import supabase from "../supabase";
import { User } from "@supabase/supabase-js";
import Avatar from "../components/Avatar";

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-gray-600 text-lg">Profiel aan het laden...</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-semibold mb-6">Mijn Profiel</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <Avatar user={user} />
        <div className="mt-6 space-y-3 text-gray-800 text-sm">
          <p>
            <strong>ID:</strong> {user.id}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Bevestigd op:</strong> {user.email_confirmed_at}
          </p>
          <p>
            <strong>Laatste login:</strong> {user.last_sign_in_at}
          </p>
          <p>
            <strong>Aangemaakt op:</strong> {user.created_at}
          </p>
          <p>
            <strong>Bijgewerkt op:</strong> {user.updated_at}
          </p>

          <div>
            <strong>App Metadata:</strong>
            <ul className="list-disc list-inside ml-4">
              <li>
                <strong>Provider:</strong> {user.app_metadata?.provider}
              </li>
              <li>
                <strong>Providers:</strong>{" "}
                {user.app_metadata?.providers?.join(", ")}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
