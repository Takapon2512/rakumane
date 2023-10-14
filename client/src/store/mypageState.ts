import { atom } from 'recoil';

//Type
import { WordType, WordDataType, WordDBType } from '@/types/globaltype';

export const remainNumState = atom({
    key: 'remainNumState',
    default: 0
});

export const wordsState = atom<WordDataType[]>({
    key: 'wordsState',
    default: []
});