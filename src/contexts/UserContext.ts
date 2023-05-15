import { createContext } from "react";

export interface User {
    userId: number | null;
    name: string;
    email: string;
}

interface UserContextValue {
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>
}

const UserContext = createContext<UserContextValue>({
    user: { userId: null, name: '', email: '' },
    setUser: () => { }
})

export default UserContext;