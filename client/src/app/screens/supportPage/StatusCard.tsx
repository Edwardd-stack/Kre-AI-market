import { Avatar, Box, Card, CardContent, Divider, Stack, ToggleButton, ToggleButtonGroup, Tooltip, Typography } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { keyframes } from "@mui/material/styles";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { useTranslation } from "react-i18next";
import { SupportMode } from "../../../libs/enums/chat.enum";
import type { SupportStatus } from "../../../libs/types/chat";

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(46,125,50,0.5); }
  70% { box-shadow: 0 0 0 10px rgba(46,125,50,0); }
  100% { box-shadow: 0 0 0 0 rgba(46,125,50,0); }
`;

interface StatusCardProps {
  status: SupportStatus | null;
  demoMode: SupportMode | "AUTO";
  onDemoChange: (mode: SupportMode | "AUTO") => void;
}

export default function StatusCard({ status, demoMode, onDemoChange }: StatusCardProps) {
  const { t } = useTranslation();
  const human = status?.mode === SupportMode.HUMAN;

  return (
    <Card
      sx={{
        overflow: "hidden",
        borderColor: human ? "#BFD8C7" : "#F0D9A0",
      }}
    >
      <Box
        sx={{
          p: 2.5,
          color: "#fff",
          background: human
            ? "linear-gradient(135deg, #2F7A51 0%, #14402A 100%)"
            : "linear-gradient(135deg, #D9A630 0%, #9C7419 100%)",
        }}
      >
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <Box sx={{ position: "relative" }}>
            <Avatar sx={{ width: 52, height: 52, bgcolor: "rgba(255,255,255,0.18)" }}>
              {human ? <SupportAgentIcon fontSize="large" /> : <AutoAwesomeIcon fontSize="large" />}
            </Avatar>
            <Box
              sx={{
                position: "absolute",
                right: 0,
                bottom: 2,
                width: 13,
                height: 13,
                borderRadius: "50%",
                bgcolor: "#4CD964",
                border: "2px solid #fff",
                animation: `${pulse} 2s infinite`,
              }}
            />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
              {status ? (human ? t("support.modeHuman") : t("support.modeAi")) : "…"}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.25 }}>
              {status && (human ? t("support.modeHumanDesc") : t("support.modeAiDesc"))}
            </Typography>
          </Box>
        </Stack>
      </Box>

      <CardContent>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 1.5 }}>
          <ScheduleIcon color="primary" />
          <Box>
            <Typography variant="caption" color="text.secondary">
              {t("support.kstNow")}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.1, fontVariantNumeric: "tabular-nums" }}>
              {status ? `${status.kstWeekday} ${status.kstTime}` : "--:--"}
            </Typography>
          </Box>
        </Stack>
        {status && (
          <>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {t("support.hours", { start: String(status.startHour).padStart(2, "0"), end: status.endHour })}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {t("support.fallbackNote", { minutes: status.operatorWaitMinutes })}
            </Typography>
          </>
        )}

        {/* Demo rejim — faqat server SUPPORT_DEMO_MODE=true bo'lsa ko'rinadi */}
        {status?.demoEnabled && (
          <>
            <Divider sx={{ my: 2 }} />
            <Stack direction="row" spacing={0.5} sx={{ alignItems: "center", mb: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: "secondary.dark" }}>
                🧪 {t("support.demoTitle")}
              </Typography>
              <Tooltip title={t("support.demoHint")} arrow placement="top">
                <InfoOutlinedIcon sx={{ fontSize: 16, color: "text.secondary", cursor: "help" }} />
              </Tooltip>
            </Stack>
            <ToggleButtonGroup
              size="small"
              exclusive
              fullWidth
              value={demoMode}
              onChange={(_, v: SupportMode | "AUTO" | null) => v && onDemoChange(v)}
            >
              <ToggleButton value="AUTO">{t("support.demoAuto")}</ToggleButton>
              <ToggleButton value={SupportMode.HUMAN}>{t("support.demoHuman")}</ToggleButton>
              <ToggleButton value={SupportMode.AI}>{t("support.demoAi")}</ToggleButton>
            </ToggleButtonGroup>
          </>
        )}
      </CardContent>
    </Card>
  );
}
