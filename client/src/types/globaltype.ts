export type LoginType = {
    email: string,
    name: string,
    password: string
};

export type WordType = {
    english: string,
    japanese: string
};

export interface WordDataType extends WordDBType {
    editing: boolean
}

export interface WordDBType {
    id: number;
    english: string;
    japanese: string;
    created_at: string;
    deleted_at: string | null;
    last_time_at: string | null;
    complete: boolean;
    today_learning: boolean;
    free_learning: boolean;
    user_answer: string;
    right_or_wrong: boolean;
    correct_count: number;
    question_count: number
    correct_rate: number;
    user_word_id: number;
    user_id: string;
}


export type SidebarType = {
    title: string,
    icon: React.JSX.Element,
    link: string,
    active: boolean
};

export type UserInputType = {
    minText: string,
    maxText: string,
    wordText: string
};

export type ResUserType = {
    id: number,
    email: string,
    username: string
    uid: string;
};

export type SettingType = {
    work_on_count: number;
    time_constraint: number;
}

export type CalendarType = {
    id: number;
    learning_date: Date;
    created_at: Date;
    user_id: number;
}