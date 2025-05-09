import { type User } from "@supabase/supabase-js";
import { createContext, useState, useEffect, useContext } from "react";
import supabase from "../supabase";

type UserContextPropTypes = {
  children: React.ReactNode;
};
type UserContextType = {
  user: User | null;
};

export const useUser = () => useContext(UserContext);

export const UserContext = createContext<UserContextType>({ user: null });
const UserContextProvider = ({ children }: UserContextPropTypes) => {
  const [user, setUser] = useState<UserContextType>({ user: null });
  useEffect(() => {
    // CHECK IF USER IS ALLREADY AUTHENTICATED
    (async function () {
      const { data } = await supabase.auth.getUser();
      setUser({ user: data.user });
    })();

    //listen to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) =>
      setUser({ user: session?.user ?? null })
    );

    // clean up
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);
  return <UserContext value={user}>{children}</UserContext>;
};
export default UserContextProvider;
