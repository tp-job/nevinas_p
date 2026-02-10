import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { Assets } from '@/data/HomeData';

// Define the shape of the context value
interface ProfileContextType {
    avatar: string;
    setAvatar: (avatarName: string) => void;
    avatarUrl: string;
    avatarMap: Record<string, string>;
}

// Create the context with an initial value of null
const ProfileContext = createContext<ProfileContextType | null>(null);

// Custom hook to use the profile context
export const useProfile = (): ProfileContextType => {
    const ctx = useContext(ProfileContext);
    if (!ctx) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return ctx;
};

// Define the props for the provider component
interface ProfileProviderProps {
    children: ReactNode;
}

export const ProfileProvider = ({ children }: ProfileProviderProps) => {
    const [avatar, setAvatar] = useState<string>(() => {
        const saved = localStorage.getItem('avatar');
        return saved || 'nevinas';
    });

    useEffect(() => {
        localStorage.setItem('avatar', avatar);
    }, [avatar]);

    const avatarMap = useMemo<Record<string, string>>(() => ({
        nevinas: Assets.nevinas,
        feixiao: Assets.feixiao,
        changli: Assets.changli,
    }), []);

    const value = useMemo<ProfileContextType>(() => ({
        avatar,
        setAvatar,
        avatarUrl: avatarMap[avatar] || Assets.nevinas,
        avatarMap,
    }), [avatar, avatarMap]);

    return (
        <ProfileContext.Provider value={value}>
            {children}
        </ProfileContext.Provider>
    );
};