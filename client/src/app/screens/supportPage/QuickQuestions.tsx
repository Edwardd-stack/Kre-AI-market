import { Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpCenterOutlined";
import { useTranslation } from "react-i18next";

interface QuickQuestionsProps {
  disabled: boolean;
  onAsk: (text: string) => void;
}

export default function QuickQuestions({ disabled, onAsk }: QuickQuestionsProps) {
  const { t } = useTranslation();
  const questions = t("support.quick", { returnObjects: true }) as string[];

  return (
    <Card>
      <CardContent>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1.5 }}>
          <HelpOutlineIcon color="primary" fontSize="small" />
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {t("support.quickTitle")}
          </Typography>
        </Stack>
        <Stack spacing={1}>
          {questions.map((q) => (
            <Chip
              key={q}
              label={q}
              onClick={() => onAsk(q)}
              disabled={disabled}
              variant="outlined"
              sx={{
                justifyContent: "flex-start",
                height: "auto",
                py: 1,
                borderRadius: 2,
                "& .MuiChip-label": { whiteSpace: "normal", textAlign: "left" },
                "&:hover": { bgcolor: "#F2F7F4", borderColor: "primary.main" },
              }}
            />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
