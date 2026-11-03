import { useState } from "react";
import type { FormEvent } from "react";
import { Box, Button, Chip, CircularProgress, InputBase, Paper, Stack, Typography } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useTranslation } from "react-i18next";

interface AiSearchBoxProps {
  loading: boolean;
  onSearch: (query: string) => void;
}

export default function AiSearchBox({ loading, onSearch }: AiSearchBoxProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const examples = t("search.examples", { returnObjects: true }) as string[];

  const submit = (text: string) => {
    const value = text.trim();
    if (!value || loading) return;
    setQuery(value);
    onSearch(value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit(query);
  };

  return (
    <Box>
      <Paper
        component="form"
        onSubmit={handleSubmit}
        elevation={0}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          p: 1,
          pl: 2.5,
          borderRadius: 999,
          border: "2px solid",
          borderColor: "secondary.main",
          boxShadow: "0 12px 32px rgba(20, 64, 42, 0.18)",
        }}
      >
        <AutoAwesomeIcon sx={{ color: "secondary.main" }} />
        <InputBase
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("search.placeholder")}
          inputProps={{ maxLength: 200, "aria-label": t("search.button") }}
          sx={{ flex: 1, fontSize: { xs: 15, sm: 17 } }}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={loading || !query.trim()}
          sx={{ borderRadius: 999, px: { xs: 2, sm: 3 }, py: 1.2, minWidth: 110 }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : t("search.button")}
        </Button>
      </Paper>

      <Stack direction="row" sx={{ alignItems: "center", flexWrap: "wrap", gap: 1, mt: 2 }}>
        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.75)", mr: 0.5 }}>
          {t("search.examplesTitle")}
        </Typography>
        {examples.map((example) => (
          <Chip
            key={example}
            label={example}
            onClick={() => submit(example)}
            disabled={loading}
            sx={{
              bgcolor: "rgba(255,255,255,0.12)",
              color: "#fff",
              "&:hover": { bgcolor: "rgba(255,255,255,0.22)" },
            }}
          />
        ))}
      </Stack>
    </Box>
  );
}
