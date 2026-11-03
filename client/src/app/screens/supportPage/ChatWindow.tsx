import { useEffect, useRef } from "react";
import { Avatar, Box, Card, Chip, Stack, Typography } from "@mui/material";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useTranslation } from "react-i18next";
import { ChatSender, SupportMode } from "../../../libs/enums/chat.enum";
import type { ChatMessage, SupportStatus } from "../../../libs/types/chat";
import MessageBubble from "../../components/chat/MessageBubble";
import TypingIndicator from "../../components/chat/TypingIndicator";
import ChatInput from "../../components/chat/ChatInput";

interface ChatWindowProps {
  status: SupportStatus | null;
  messages: ChatMessage[];
  sending: boolean;
  awaitingOperator: boolean;
  onSend: (text: string) => void;
}

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export default function ChatWindow({ status, messages, sending, awaitingOperator, onSend }: ChatWindowProps) {
  const { t } = useTranslation();
  const listRef = useRef<HTMLDivElement>(null);
  const human = status?.mode === SupportMode.HUMAN;

  /** Yangi xabar kelganda pastga aylantirish */
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, sending, awaitingOperator]);

  return (
    <Card sx={{ display: "flex", flexDirection: "column", height: { xs: 560, md: 640 } }}>
      {/* Sarlavha */}
      <Stack
        direction="row"
        spacing={1.5}
        sx={{ alignItems: "center", px: 2.5, py: 1.75, borderBottom: "1px solid #EEE9DD", bgcolor: "#FBFAF6" }}
      >
        <Avatar sx={{ bgcolor: human ? "primary.dark" : "secondary.main" }}>
          {human ? <SupportAgentIcon /> : <AutoAwesomeIcon />}
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography sx={{ fontWeight: 800 }}>{t("support.chatTitle")}</Typography>
          <Typography variant="caption" color="text.secondary">
            {status && (human ? t("support.modeHuman") : t("support.modeAi"))}
          </Typography>
        </Box>
        {status && (
          <Chip
            size="small"
            label={human ? t("support.operator") : t("support.ai")}
            color={human ? "primary" : "secondary"}
          />
        )}
      </Stack>

      {/* Xabarlar */}
      <Box
        ref={listRef}
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          px: { xs: 1.5, sm: 2.5 },
          py: 2.5,
          background: "linear-gradient(180deg, #F7F5EF 0%, #FBFAF6 100%)",
        }}
      >
        {/* Salomlashuv — bazaga yozilmaydi, rejimga qarab ko'rsatiladi */}
        {status && (
          <MessageBubble
            sender={human ? ChatSender.OPERATOR : ChatSender.AI}
            text={human ? t("support.welcomeHuman") : t("support.welcomeAi")}
            perspective="customer"
          />
        )}

        {messages.map((m) => (
          <MessageBubble
            key={m._id}
            sender={m.messageSender}
            text={m.messageText}
            time={formatTime(m.createdAt)}
            isFallback={m.messageIsFallback}
            perspective="customer"
          />
        ))}

        {sending && !human && <TypingIndicator label={t("support.aiTyping")} />}
        {awaitingOperator && !sending && (
          <TypingIndicator label={t("support.waitingOperator", { minutes: status?.operatorWaitMinutes ?? 2 })} />
        )}
      </Box>

      {/* Kiritish */}
      <Box sx={{ p: 1.5, borderTop: "1px solid #EEE9DD", bgcolor: "#fff" }}>
        <ChatInput placeholder={t("support.placeholder")} disabled={sending} onSend={onSend} />
      </Box>
    </Card>
  );
}
