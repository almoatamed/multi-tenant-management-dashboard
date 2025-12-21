import router from "@/router";
import { nextTick, ref } from "vue";

export type User = {
    username: string;
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    active: boolean;
};

type UserState = {
    userInfo: User;
    token: string;
};

export const userStorageKey = `MTMS:USER`;

export const setUserState = (userData: UserState | null) => {
    user.value = userData;

    if (userData) {
        localStorage.setItem(userStorageKey, JSON.stringify(userData, null, 4));
    } else {
        localStorage.removeItem(userStorageKey);
    }
    console.log("setting user data", userData);
};

export const loggingOut = ref(false);
export const logout = async () => {
    setUserState(null);
    await nextTick();
    router.push({
        name: "Login",
    });
};

export const getUserStateFromLocalStorage = (): UserState | null => {
    try {
        const storedData = localStorage.getItem(userStorageKey);
        if (!storedData) {
            return null;
        }
        return JSON.parse(storedData);
    } catch (error) {
        console.error("Error retrieving user info from storage", error);
        localStorage.clear();
        logout();
        return null;
    }
};

const initialUserState = getUserStateFromLocalStorage();
console.log(initialUserState);
export const user = ref<null | UserState>(initialUserState);
