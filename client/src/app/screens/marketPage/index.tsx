import { useCallback, useEffect, useState } from "react";
import { Alert, Box, Button, Chip, Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import ProductService from "../../../services/ProductService";
import AiService from "../../../services/AiService";
import { getErrorMessage } from "../../../libs/config";
import type { Lang } from "../../../libs/enums/ai.enum";
import type { Product } from "../../../libs/types/product";
import type { AiSearchResult } from "../../../libs/types/ai";
import AiSearchBox from "./AiSearchBox";
import FilterSummary from "./FilterSummary";
import ProductList from "./ProductList";

const productService = new ProductService();
const aiService = new AiService();

export default function MarketPage() {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [aiResult, setAiResult] = useState<AiSearchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /** Barcha mahsulotlar (AI'siz) */
  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    setAiResult(null);
    try {
      const data = await productService.getProducts({ order: "createdAt", page: 1, limit: 40 });
      setProducts(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  /** AI qidiruv: gap => filtr => mahsulotlar */
  const handleSearch = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await aiService.search(query, i18n.language as Lang);
      setAiResult(result);
      setProducts(result.products);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  return (
    <Box>
      {/* HERO + AI qidiruv */}
      <Box
        sx={{
          background: "radial-gradient(circle at 85% 0%, #2F7A51 0%, #1F5E3B 40%, #14402A 100%)",
          color: "#fff",
          py: { xs: 6, md: 9 },
        }}
      >
        <Container maxWidth="md">
          <Chip label={t("hero.badge")} color="secondary" size="small" sx={{ mb: 2 }} />
          <Typography variant="h2" sx={{ fontSize: { xs: 32, md: 48 }, mb: 1.5 }}>
            {t("hero.title")}
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.8)", mb: 4, maxWidth: 620 }}>
            {t("hero.subtitle")}
          </Typography>
          <AiSearchBox loading={loading} onSearch={handleSearch} />
        </Container>
      </Box>

      {/* NATIJALAR */}
      <Container maxWidth="lg" sx={{ py: 5 }}>
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
            action={<Button color="inherit" size="small" onClick={loadAll}>{t("error.retry")}</Button>}
          >
            {t("error.title")}: {error}
          </Alert>
        )}

        {aiResult && !loading && (
          <FilterSummary query={aiResult.query} filter={aiResult.filter} onReset={loadAll} />
        )}

        {!loading && (
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
            {t("search.results", { count: products.length })}
          </Typography>
        )}
        {loading && (
          <Typography variant="subtitle2" color="secondary.dark" sx={{ mb: 2, fontWeight: 700 }}>
            {t("search.loading")}
          </Typography>
        )}

        <ProductList products={products} loading={loading} />
      </Container>
    </Box>
  );
}
