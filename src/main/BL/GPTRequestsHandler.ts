import OpenAI from 'openai';

export default class GPTHandler {
  private key: string;

  private openai: OpenAI;

  messages: OpenAI.Chat.Completions.CreateChatCompletionRequestMessage[];

  constructor(apiKey: string) {
    this.key = apiKey;
    this.openai = new OpenAI({ apiKey: this.key });
    this.messages = [];
  }

  async askGPT(
    prompt: OpenAI.Chat.Completions.CreateChatCompletionRequestMessage[]
  ) {
    try {
      this.messages.push(prompt[0]);

      const completion1 = await this.openai.chat.completions.create({
        messages: this.messages,
        model: 'gpt-3.5-turbo',
      });

      if (completion1?.object) {
        this.messages.push({
          role: completion1.choices[0].message.role,
          content: completion1.choices[0].message.content,
        });
      }

      this.messages.push(prompt[1]);

      const completion2 = await this.openai.chat.completions.create({
        messages: this.messages,
        model: 'gpt-3.5-turbo',
      });

      if (completion2?.object) {
        this.messages.push({
          role: completion2.choices[0].message.role,
          content: completion2.choices[0].message.content,
        });
      }
      const messeages = this.messages;
      this.clear();
      return messeages;
    } catch (error: unknown) {
      // @ts-expect-error
      return error.message;
    }
  }

  clear() {
    this.messages = [];
  }
}
