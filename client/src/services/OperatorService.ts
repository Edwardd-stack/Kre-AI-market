import axios from "axios";
import { serverApi } from "../libs/config";
import type { ChatSession, ChatThread } from "../libs/types/chat";

/** Operator tomoni: har bir so'rovda "x-operator-key" header yuboriladi */
class OperatorService {
  private readonly path: string;
  private readonly key: string;

  constructor(key: string) {
    this.path = serverApi;
    this.key = key;
  }

  private get headers() {
    return { "x-operator-key": this.key };
  }

  public async getSessions(): Promise<ChatSession[]> {
    const result = await axios.get(`${this.path}/support/sessions`, { headers: this.headers });
    return result.data;
  }

  public async getThread(sessionId: string): Promise<ChatThread> {
    const result = await axios.get(`${this.path}/support/${sessionId}/messages`, { headers: this.headers });
    return result.data;
  }

  public async reply(sessionId: string, text: string): Promise<ChatThread> {
    const result = await axios.post(`${this.path}/support/${sessionId}/message`, { text }, { headers: this.headers });
    return result.data;
  }
}

export default OperatorService;
