import axios from "axios";
import { serverApi } from "../libs/config";
import type { Product, ProductInquiry } from "../libs/types/product";

class ProductService {
  private readonly path: string;

  constructor() {
    this.path = serverApi;
  }

  public async getProducts(input: ProductInquiry): Promise<Product[]> {
    const url = `${this.path}/product/all`;
    const result = await axios.get(url, { params: input });
    console.log("getProducts:", result.data.length);
    return result.data;
  }
}

export default ProductService;
