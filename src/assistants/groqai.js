import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    dangerouslyAllowBrowser: true,
});

export class Assistant {
    #client;
    #model;

    constructor(model = "llama-3.1-70b-versatile", client = groq) {
        this.#client = client;
        this.#model = model;
    }

    async chat(content, history) {
        try {
            // Filter out timestamp property as Groq API doesn't support it
            const cleanHistory = history.map(({ role, content }) => ({ role, content }));

            const result = await this.#client.chat.completions.create({
                model: this.#model,
                messages: [...cleanHistory, { content, role: "user" }],
            });

            return result.choices[0].message.content;
        } catch (error) {
            throw this.#parseError(error);
        }
    }

    async *chatStream(content, history) {
        try {
            // Filter out timestamp property as Groq API doesn't support it
            const cleanHistory = history.map(({ role, content }) => ({ role, content }));

            const result = await this.#client.chat.completions.create({
                model: this.#model,
                messages: [...cleanHistory, { content, role: "user" }],
                stream: true,
            });

            for await (const chunk of result) {
                yield chunk.choices[0]?.delta?.content || "";
            }
        } catch (error) {
            throw this.#parseError(error);
        }
    }

    #parseError(error) {
        return error;
    }
}
