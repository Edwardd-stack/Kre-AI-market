import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Lang } from "../../../libs/enums/ai.enum";

const LABELS: Record<Lang, string> = {
  [Lang.KO]: "한국어",
  [Lang.EN]: "EN",
  [Lang.RU]: "RU",
};

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const handleChange = (_: unknown, value: Lang | null) => {
    if (value) i18n.changeLanguage(value);
  };

  return (
    <ToggleButtonGroup
      size="small"
      exclusive
      value={i18n.language}
      onChange={handleChange}
      aria-label="language"
      sx={{
        bgcolor: "rgba(255,255,255,0.08)",
        "& .MuiToggleButton-root": {
          color: "rgba(255,255,255,0.75)",
          border: "1px solid rgba(255,255,255,0.2)",
          px: 1.5,
          fontWeight: 700,
        },
        "& .Mui-selected": {
          color: "#1B1B1B !important",
          bgcolor: "secondary.main !important",
        },
      }}
    >
      {Object.values(Lang).map((lang) => (
        <ToggleButton key={lang} value={lang}>
          {LABELS[lang]}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
