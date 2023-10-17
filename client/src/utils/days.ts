import dayjs, { Dayjs } from "dayjs";

export const year: number = dayjs().year();

//月を管理する関数
export const getMonth = (month: number) => {
    const year: number = dayjs().year();
    const firstDayOfTheMonth: number = dayjs(new Date(year, month, 1)).day();
    let currentMonthCount: number = -firstDayOfTheMonth;
    const daysMatrix: Dayjs[][] = new Array(5).fill([]).map(() => {
        return new Array(7).fill(null).map(() => {
            currentMonthCount++;
            return dayjs(new Date(year, month, currentMonthCount));
        });
    });
    return daysMatrix;
};