import { useEffect, useState } from "react";
import supabase from "../supabase";
import { User } from "@supabase/supabase-js";
import { Comment } from "../types/Comment";

const CommentsPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("User ophalen mislukt:", userError?.message);
        return;
      }

      setUser(user);

      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Comments ophalen mislukt:", error.message);
      } else {
        setComments(data || []);
      }

      setLoading(false);
    };

    fetchComments();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-gray-600 text-lg">Comments aan het laden...</span>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-semibold mb-6">Mijn Comments</h1>

      {comments.length === 0 ? (
        <p className="text-gray-500">Je hebt nog geen comments geplaatst.</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment) => (
            <li
              key={comment.id}
              className="bg-white p-4 rounded-lg shadow border border-gray-100"
            >
              <div className="text-sm text-gray-500 mb-2">
                {new Date(comment.created_at).toLocaleString()}
              </div>
              <p className="text-gray-800">{comment.comments}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CommentsPage;
