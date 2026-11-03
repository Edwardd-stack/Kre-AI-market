import axios from "axios";
import { serverApi } from "../libs/config";
import type { Lang } from "../libs/enums/ai.enum";
import type { AiReportResult, AiSearchResult } from "../libs/types/ai";

class AiService {
  private readonly path: string;

  constructor() {
    this.path = serverApi;
  }

  /** Oddiy gap => AI filtr => mahsulotlar */
  public async search(query: string, lang: Lang): Promise<AiSearchResult> {
    const url = `${this.path}/ai/search`;
    const result = await axios.post(url, { query, lang });
    console.log("aiSearch filter:", result.data.filter);
    return result.data;
  }

  /** Narx statistikasi + AI yozgan bozor hisoboti */
  public async report(lang: Lang, days: number): Promise<AiReportResult> {
    const url = `${this.path}/ai/report`;
    const result = await axios.post(url, { lang, days });
    return result.data;
  }
}

export default AiService;
