import Errors, { HttpCode, Message } from "../libs/Errors";
import { Product, ProductInquiry } from "../libs/types/product";
import { T } from "../libs/types/common";
import { escapeRegex } from "../libs/config";
import { ProductStatus } from "../libs/enums/product.enum";
import ProductModel from "../schema/Product.model";

/** Arzonlik bo'yicha saralanadigan maydonlar (o'sish tartibida) */
const ASC_ORDERS = ["productPrice", "productPricePerKg"];

class ProductService {
    private readonly productModel;

    constructor() {
        this.productModel = ProductModel;
    }

    /** Inquiry => MongoDB $match obyekti (AI qidiruv ham shuni qayta ishlatadi) */
    public buildMatch(inquiry: ProductInquiry): T {
        const match: T = { productStatus: ProductStatus.PROCESS };

        if (inquiry.productCategory) match.productCategory = inquiry.productCategory;
        if (inquiry.productProvince) match.productProvince = inquiry.productProvince;
        if (inquiry.productVariety) match.productVariety = inquiry.productVariety;
        if (inquiry.productWeightKg) match.productWeightKg = inquiry.productWeightKg;
        if (inquiry.maxPrice) match.productPrice = { $lte: inquiry.maxPrice };
        if (inquiry.maxPricePerKg) match.productPricePerKg = { $lte: inquiry.maxPricePerKg };
        if (inquiry.productMilledToday !== undefined)
            match.productMilledToday = inquiry.productMilledToday;
        if (inquiry.productCertifications?.length)
            match.productCertifications = { $all: inquiry.productCertifications };
        if (inquiry.search)
            match.productName = { $regex: new RegExp(escapeRegex(inquiry.search), "i") };

        return match;
    }

    public async getProducts(inquiry: ProductInquiry): Promise<Product[]> {
        const match = this.buildMatch(inquiry);

        const sort: T = ASC_ORDERS.includes(inquiry.order)
            ? { [inquiry.order]: 1 }    // eng arzonidan
            : { [inquiry.order]: -1 };  // eng yangisidan

        const result = await this.productModel
            .aggregate([
                { $match: match },
                { $sort: sort },
                { $skip: (inquiry.page - 1) * inquiry.limit },
                { $limit: inquiry.limit },
            ])
            .exec();
        if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

        return result;
    }

    /** Bazadagi mavjud viloyat va navlar — AI'ga "faqat shulardan tanla" deb beriladi */
    public async getFilterOptions(): Promise<{ provinces: string[]; varieties: string[] }> {
        const match = { productStatus: ProductStatus.PROCESS };
        const [provinces, varieties] = await Promise.all([
            this.productModel.distinct("productProvince", match).exec(),
            this.productModel.distinct("productVariety", match).exec(),
        ]);
        return { provinces: provinces as string[], varieties: varieties as string[] };
    }

    public async getProduct(id: string): Promise<Product> {
        const result = await this.productModel
            .findOne({ _id: id, productStatus: ProductStatus.PROCESS })
            .lean()
            .exec();
        if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

        return result as unknown as Product;
    }
}

export default ProductService;
