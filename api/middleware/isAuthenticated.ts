import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    const token: string | undefined = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "トークンがありません。" });

    console.log(token);

    verify(token, process.env.SECRET_KEY || "", (err, decoded) => {
        if (err) return res.status(401).json({ error: "ログインする権限がありません。" });
        if (decoded === undefined) return res.status(401).json({ error: "ログインする権限がありません。" });

        if (typeof decoded !== "string") req.body.user_id = decoded.user_id;

        next();
    });
}