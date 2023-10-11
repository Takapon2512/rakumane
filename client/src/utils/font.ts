import { Noto_Sans_JP, Shadows_Into_Light, Nothing_You_Could_Do } from 'next/font/google'

export const notoSansJP = Noto_Sans_JP({ 
    weight: ["400", "500", "600"], 
    subsets: ["latin"], 
    display: "swap" 
})

export const shadowsIntoLight = Shadows_Into_Light({
    weight: ["400"], 
    subsets: ["latin"], 
    display: "swap" 
});

export const nothingYouCouldDo = Nothing_You_Could_Do({
    weight: ["400"], 
    subsets: ["latin"], 
    display: "swap" 
})