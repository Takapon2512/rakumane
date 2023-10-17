import { Router } from "express";
import { Pool } from "../server";
import { MysqlError } from "mysql";

//type
import { WordDBType } from "../types/globalType";

export const scheduleRouter = Router();

