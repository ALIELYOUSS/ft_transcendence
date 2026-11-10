export declare const SAFE_USER_SELECT: {
    id: true;
    username: true;
    email: true;
    bio: true;
    avatarUrl: true;
    role: true;
    createdAt: true;
    updatedAt: true;
    interests: {
        select: {
            name: true;
        };
    };
};
export declare function interestsInput(names: string[]): {
    connectOrCreate: {
        where: {
            name: string;
        };
        create: {
            name: string;
        };
    }[];
};
export declare function rethrowPrismaError(error: unknown): never;
