import { addKeyword } from "@builderbot/bot";
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
