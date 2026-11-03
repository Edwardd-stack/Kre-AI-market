import { useState } from "react";
import type { MouseEvent } from "react";
import { Box, Button, ListItemIcon, ListItemText, Menu, MenuItem, Typography } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { useTranslation } from "react-i18next";
import { Lang } from "../../../libs/enums/ai.enum";

/** Har bir til o'z yozuvida + qisqa kodi */
const LANGUAGES: { code: Lang; native: string; english: string }[] = [
  { code: Lang.KO, native: "한국어", english: "Korean" },
  { code: Lang.EN, native: "English", english: "English" },
  { code: Lang.RU, native: "Русский", english: "Russian" },
  { code: Lang.UZ, native: "O'zbekcha", english: "Uzbek" },
];

/** Til kodi uchun kichik "nishon" (badge) */
function CodeBadge({ code, active }: { code: Lang; active: boolean }) {
  return (
    <Box
      sx={{
        width: 30,
        height: 30,
        borderRadius: "50%",
        display: "grid",
        placeItems: "center",
        fontSize: 11,
        fontWeight: 800,
        letterSpacing: "0.04em",
        color: active ? "#1B1B1B" : "primary.dark",
        bgcolor: active ? "secondary.main" : "#EEF3EF",
        transition: "0.2s",
      }}
    >
      {code.toUpperCase()}
    </Box>
  );
}

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const current = LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0];

  const open = (e: MouseEvent<HTMLElement>) => setAnchor(e.currentTarget);
  const close = () => setAnchor(null);
  const select = (code: Lang) => {
    i18n.changeLanguage(code);
    close();
  };

  return (
    <>
      <Button
        onClick={open}
        aria-haspopup="menu"
        aria-expanded={Boolean(anchor)}
        startIcon={<LanguageIcon />}
        endIcon={
          <KeyboardArrowDownIcon
            sx={{ transition: "transform 0.2s", transform: anchor ? "rotate(180deg)" : "none" }}
          />
        }
        sx={{
          color: "#fff",
          px: 1.75,
          py: 0.75,
          borderRadius: 999,
          border: "1px solid rgba(255,255,255,0.25)",
          bgcolor: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(6px)",
          "&:hover": { bgcolor: "rgba(255,255,255,0.14)", borderColor: "secondary.main" },
        }}
      >
        <Typography component="span" sx={{ fontWeight: 700, fontSize: 14 }}>
          {current.native}
        </Typography>
      </Button>

      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={close}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              mt: 1,
              minWidth: 220,
              borderRadius: 3,
              border: "1px solid #E7E2D6",
              boxShadow: "0 16px 40px rgba(20,64,42,0.18)",
              p: 0.5,
            },
          },
        }}
      >
        {LANGUAGES.map((lang) => {
          const active = lang.code === current.code;
          return (
            <MenuItem
              key={lang.code}
              selected={active}
              onClick={() => select(lang.code)}
              sx={{
                borderRadius: 2,
                py: 1,
                gap: 1.5,
                "&.Mui-selected": { bgcolor: "#FFF8E6" },
                "&.Mui-selected:hover": { bgcolor: "#FFF2D1" },
              }}
            >
              <CodeBadge code={lang.code} active={active} />
              <ListItemText
                primary={lang.native}
                secondary={lang.english}
                slotProps={{
                  primary: { sx: { fontWeight: 700, fontSize: 14 } },
                  secondary: { sx: { fontSize: 12 } },
                }}
              />
              {active && (
                <ListItemIcon sx={{ minWidth: 0, color: "secondary.dark" }}>
                  <CheckRoundedIcon fontSize="small" />
                </ListItemIcon>
              )}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}
