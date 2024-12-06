import { addKeyword } from "@builderbot/bot";
import patioServiceApi from "../services/patio_service_api";
import Constants from "~/utils/constants";
import { EVENTS } from "@builderbot/bot";
import fs from "fs";
import path from "path";

const menuPath = path.join(process.cwd(), "assets/messages", "menu.txt");
const menuText = fs.readFileSync(menuPath, "utf8");

export const optionsFlow = addKeyword(EVENTS.ACTION ).addAction(
  async (ctx, { state, endFlow }) => {
    return endFlow(menuText);
  }
);
