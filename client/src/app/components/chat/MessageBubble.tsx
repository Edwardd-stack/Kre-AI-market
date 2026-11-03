import { Avatar, Box, Chip, Stack, Typography } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import PersonIcon from "@mui/icons-material/Person";
import { useTranslation } from "react-i18next";
import { ChatSender } from "../../../libs/enums/chat.enum";

interface MessageBubbleProps {
  sender: ChatSender;
  text: string;
  time?: string;
  isFallback?: boolean;
  /** "customer" — mijoz sahifasi (USER o'ngda), "operator" — operator paneli (OPERATOR o'ngda) */
  perspective: "customer" | "operator";
  userLabel?: string;
}

const STYLE: Record<ChatSender, { bg: string; color: string; border: string; avatarBg: string }> = {
  [ChatSender.USER]: { bg: "#1F5E3B", color: "#fff", border: "#1F5E3B", avatarBg: "#2F7A51" },
  [ChatSender.OPERATOR]: { bg: "#FFFFFF", color: "#1C2321", border: "#E1E7E3", avatarBg: "#14402A" },
  [ChatSender.AI]: { bg: "#FFF8E6", color: "#1C2321", border: "#F0D9A0", avatarBg: "#C99A2E" },
  [ChatSender.SYSTEM]: { bg: "transparent", color: "#5B6461", border: "transparent", avatarBg: "#999" },
};

export default function MessageBubble({ sender, text, time, isFallback, perspective, userLabel }: MessageBubbleProps) {
  const { t } = useTranslation();

  if (sender === ChatSender.SYSTEM) {
    // Server tizim xabarlarini kod ko'rinishida yuboradi — bu yerda tarjima qilinadi
    const systemText = text === "AI_UNAVAILABLE" ? t("support.systemAiUnavailable") : text;
    return (
      <Stack sx={{ alignItems: "center", my: 1.5 }}>
        <Box
          sx={{
            px: 2,
            py: 1,
            maxWidth: 520,
            borderRadius: 2,
            bgcolor: "#FDF0EE",
            border: "1px solid #F3C9C2",
            color: "#8A2E22",
            fontSize: 13,
            textAlign: "center",
            lineHeight: 1.6,
          }}
        >
          ⚠️ {systemText}
        </Box>
      </Stack>
    );
  }

  const mine =
    (perspective === "customer" && sender === ChatSender.USER) ||
    (perspective === "operator" && sender === ChatSender.OPERATOR);
  const style = STYLE[sender];
  const label =
    sender === ChatSender.AI ? t("support.ai") : sender === ChatSender.OPERATOR ? t("support.operator") : userLabel ?? t("support.you");
  const icon =
    sender === ChatSender.AI ? <AutoAwesomeIcon sx={{ fontSize: 18 }} /> : sender === ChatSender.OPERATOR ? <SupportAgentIcon sx={{ fontSize: 18 }} /> : <PersonIcon sx={{ fontSize: 18 }} />;

  return (
    <Stack direction={mine ? "row-reverse" : "row"} spacing={1.25} sx={{ alignItems: "flex-end", mb: 1.75 }}>
      <Avatar sx={{ width: 32, height: 32, bgcolor: style.avatarBg }}>{icon}</Avatar>
      <Box sx={{ maxWidth: { xs: "82%", sm: "72%" } }}>
        <Typography
          variant="caption"
          sx={{ display: "block", mb: 0.4, fontWeight: 700, color: "text.secondary", textAlign: mine ? "right" : "left" }}
        >
          {label}
        </Typography>
        {isFallback && (
          <Chip
            size="small"
            icon={<AutoAwesomeIcon />}
            label={t("support.aiFallback")}
            sx={{ mb: 0.75, bgcolor: "#FFF2D1", color: "#7A5A12", fontSize: 11 }}
          />
        )}
        <Box
          sx={{
            px: 2,
            py: 1.25,
            bgcolor: style.bg,
            color: style.color,
            border: `1px solid ${style.border}`,
            borderRadius: 3,
            borderBottomRightRadius: mine ? 4 : 18,
            borderBottomLeftRadius: mine ? 18 : 4,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            lineHeight: 1.6,
            fontSize: 15,
            boxShadow: sender === ChatSender.USER ? "0 4px 12px rgba(31,94,59,0.18)" : "0 2px 6px rgba(0,0,0,0.04)",
          }}
        >
          {text}
        </Box>
        {time && (
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.4, textAlign: mine ? "right" : "left", fontSize: 11 }}>
            {time}
          </Typography>
        )}
      </Box>
    </Stack>
  );
}
