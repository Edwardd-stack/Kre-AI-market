import { Request, Response } from "express";
import Errors, { HttpCode } from "../libs/Errors";
import { T } from "../libs/types/common";
import { ProductInquiry } from "../libs/types/product";
import { ProductCategory } from "../libs/enums/product.enum";
import ProductService from "../models/Product.service";

const productService = new ProductService();

const productController: T = {};

productController.getProducts = async (req: Request, res: Response) => {
    try {
        console.log("getProducts");
        const { page, limit, order, productCategory, productProvince, maxPricePerKg, search } =
            req.query;

        const inquiry: ProductInquiry = {
            order: order ? String(order) : "createdAt",
            page: page ? Number(page) : 1,
            limit: limit ? Number(limit) : 12,
        };
        if (productCategory) inquiry.productCategory = productCategory as ProductCategory;
        if (productProvince) inquiry.productProvince = String(productProvince);
        if (maxPricePerKg) inquiry.maxPricePerKg = Number(maxPricePerKg);
        if (search) inquiry.search = String(search);

        const result = await productService.getProducts(inquiry);

        res.status(HttpCode.OK).json(result);
    } catch (err) {
        console.log("Error, getProducts:", err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard);
    }
};

productController.getProduct = async (req: Request, res: Response) => {
    try {
        console.log("getProduct");
        const id = String(req.params.id);
        const result = await productService.getProduct(id);

        res.status(HttpCode.OK).json(result);
    } catch (err) {
        console.log("Error, getProduct:", err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard);
    }
};

export default productController;
