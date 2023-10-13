export type UserType = {
    id: number;
    email: string;
    username: string;
    password: string;
    created_at: Date;
    deleted_at: Date | null;
    uid: string;
    reset_token: string | null;
    create_token: Date | null;
    expire_token: Date | null;
};