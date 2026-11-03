import { useCallback, useEffect, useState } from "react";
import { Alert, Box, Container, Grid, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import ChatService from "../../../services/ChatService";
import { getErrorMessage } from "../../../libs/config";
import type { Lang } from "../../../libs/enums/ai.enum";
import { ChatSender, SupportMode } from "../../../libs/enums/chat.enum";
import type { ChatMessage, SupportStatus } from "../../../libs/types/chat";
import StatusCard from "./StatusCard";
import QuickQuestions from "./QuickQuestions";
import ChatWindow from "./ChatWindow";

const chatService = new ChatService();
const SESSION_KEY = "kre-chat-session";
const POLL_MS = 3000;     // yangi xabarlarni tekshirish oralig'i
const STATUS_MS = 60000;  // ish vaqti holatini yangilash

const readSession = () => {
  try {
    return localStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
};
const writeSession = (id: string | null) => {
  try {
    if (id) localStorage.setItem(SESSION_KEY, id);
    else localStorage.removeItem(SESSION_KEY);
  } catch {
    /* private rejim */
  }
};

export default function SupportPage() {
  const { t, i18n } = useTranslation();
  const [status, setStatus] = useState<SupportStatus | null>(null);
  const [demoMode, setDemoMode] = useState<SupportMode | "AUTO">("AUTO");
  const [sessionId, setSessionId] = useState<string | null>(readSession);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [awaitingOperator, setAwaitingOperator] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const forcedMode = demoMode === "AUTO" ? undefined : demoMode;

  /** Ish vaqti holati (har daqiqada) */
  useEffect(() => {
    const load = () => chatService.getStatus(forcedMode).then(setStatus).catch(() => undefined);
    load();
    const timer = setInterval(load, STATUS_MS);
    return () => clearInterval(timer);
  }, [forcedMode]);

  /** Suhbatni yuklash */
  const loadThread = useCallback(async (id: string) => {
    try {
      const thread = await chatService.getThread(id);
      setMessages(thread.messages);
      setAwaitingOperator(thread.session.chatAwaitingOperator);
    } catch {
      // Sessiya topilmadi (masalan, baza tozalangan) — yangidan boshlaymiz
      writeSession(null);
      setSessionId(null);
      setMessages([]);
    }
  }, []);

  /** Polling: operator yoki AI javoblarini 3 soniyada bir tekshiramiz */
  useEffect(() => {
    if (!sessionId) return;
    loadThread(sessionId);
    const timer = setInterval(() => loadThread(sessionId), POLL_MS);
    return () => clearInterval(timer);
  }, [sessionId, loadThread]);

  const handleSend = async (text: string) => {
    setSending(true);
    setError(null);
    const lang = i18n.language as Lang;
    // Xabar darhol ko'rinsin (optimistic UI)
    const tempMessage: ChatMessage = {
      _id: `temp-${Date.now()}`,
      sessionId: sessionId ?? "",
      messageSender: ChatSender.USER,
      messageText: text,
      messageIsFallback: false,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMessage]);

    try {
      // Sessiya birinchi xabar yuborilganda yaratiladi — bo'sh suhbatlar bazani to'ldirmaydi
      let id = sessionId;
      if (!id) {
        const session = await chatService.createSession(lang);
        id = session._id;
        writeSession(id);
        setSessionId(id);
      }
      const thread = await chatService.sendMessage(id, text, lang, forcedMode);
      setMessages(thread.messages);
      setAwaitingOperator(thread.session.chatAwaitingOperator);
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m._id !== tempMessage._id));
      setError(getErrorMessage(err));
    } finally {
      setSending(false);
    }
  };

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 3.5 }}>
          <Typography variant="h3" sx={{ fontSize: { xs: 28, md: 36 } }}>
            {t("support.title")}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            {t("support.subtitle")}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {t("error.title")}: {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={3}>
              <StatusCard status={status} demoMode={demoMode} onDemoChange={setDemoMode} />
              <QuickQuestions disabled={sending} onAsk={handleSend} />
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <ChatWindow
              status={status}
              messages={messages}
              sending={sending}
              awaitingOperator={awaitingOperator}
              onSend={handleSend}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
