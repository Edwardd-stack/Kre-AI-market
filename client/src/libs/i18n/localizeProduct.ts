import type { TFunction } from "i18next";
import type { Product } from "../types/product";
import { PROVINCES, REGIONS, SELLERS, VARIETIES, translatePlace } from "./places";

export interface LocalizedProduct {
  name: string;
  province: string;
  region: string;
  variety: string;
  seller: string;
}

/**
 * Mahsulot matnlarini tanlangan tilga moslash.
 * Koreyscha => bazadagi asl nom; boshqa tillar => qismlardan qayta yig'iladi:
 * "의성 일품 백미 4kg" => "Uiseong Ilpum White rice 4kg"
 */
export const localizeProduct = (product: Product, t: TFunction, lang: string): LocalizedProduct => {
  const province = translatePlace(PROVINCES, product.productProvince, lang);
  const region = translatePlace(REGIONS, product.productRegion, lang);
  const variety = translatePlace(VARIETIES, product.productVariety, lang);
  const seller = translatePlace(SELLERS, product.productSellerName, lang);

  const name =
    lang === "ko"
      ? product.productName
      : [region, variety, t(`category.${product.productCategory}`), `${product.productWeightKg}kg`]
          .filter(Boolean)
          .join(" ");

  return { name, province, region, variety, seller };
};
