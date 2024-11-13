import fs from "fs";
import { downloadMediaMessage } from "@adiwajshing/baileys";
import { config } from "../config";
import ffmpeg from "fluent-ffmpeg";
import OpenAI from "openai";

const voiceToText = async (path: string): Promise<string> => {
    if (!fs.existsSync(path)) {
        throw new Error("No se encuentra el archivo");
    }
    try {
        const openai = new OpenAI({
            apiKey: config.apiKeyAI,
        });
        const resp = await openai.audio.transcriptions.create({
            file: fs.createReadStream(path),
            model: "whisper-1"
        });
        return resp.text;
    } catch (err) {
        console.log(err.response);
        return "ERROR";
    }
};

const convertOggMp3 = async (inputStream: any, outStream: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        ffmpeg(inputStream)
            .audioQuality(96)
            .toFormat("mp3")
            .save(outStream)
            .on("progress", (p) => null)
            .on("end", () => {
                resolve(true);
            });
    });
};

export const handlerAI = async (ctx: any): Promise<string> => {
    const buffer = await downloadMediaMessage(ctx, "buffer", { /* opciones adicionales aquí */ }) as Buffer;
    const pathTmpOgg = `${process.cwd()}/tmp/voice-note-${Date.now()}.ogg`;
    const pathTmpMp3 = `${process.cwd()}/tmp/voice-note-${Date.now()}.mp3`;
    await fs.writeFileSync(pathTmpOgg, buffer);
    await convertOggMp3(pathTmpOgg, pathTmpMp3);
    const text = await voiceToText(pathTmpMp3);
    fs.unlink(pathTmpMp3, (error) => {
        if (error) throw error;
    });
    fs.unlink(pathTmpOgg, (error) => {
        if (error) throw error;
    });
    return text;
};