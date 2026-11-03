import axios from "axios";
import { serverApi } from "../libs/config";
import type { PriceHistory } from "../libs/types/price";

class PriceService {
  private readonly path: string;

  constructor() {
    this.path = serverApi;
  }

  public async getPriceHistory(days: number): Promise<PriceHistory[]> {
    const url = `${this.path}/price/history`;
    const result = await axios.get(url, { params: { days } });
    console.log("getPriceHistory:", result.data.length);
    return result.data;
  }
}

export default PriceService;
