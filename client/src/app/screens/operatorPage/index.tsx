import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, Card, Container, Grid, Stack, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import { useTranslation } from "react-i18next";
import OperatorService from "../../../services/OperatorService";
import type { ChatMessage, ChatSession } from "../../../libs/types/chat";
import MessageBubble from "../../components/chat/MessageBubble";
import ChatInput from "../../components/chat/ChatInput";
import OperatorLogin from "./OperatorLogin";
import SessionList from "./SessionList";

const KEY_STORAGE = "kre-operator-key";
const POLL_MS = 4000;

const readKey = () => {
  try {
    return sessionStorage.getItem(KEY_STORAGE); // brauzer yopilsa — qayta kirish kerak
  } catch {
    return null;
  }
};

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export default function OperatorPage() {
  const { t } = useTranslation();
  const [key, setKey] = useState<string | null>(readKey);
  const [loginError, setLoginError] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const service = useMemo(() => (key ? new OperatorService(key) : null), [key]);
  const selected = sessions.find((s) => s._id === selectedId) ?? null;

  const logout = useCallback(() => {
    try {
      sessionStorage.removeItem(KEY_STORAGE);
    } catch {
      /* */
    }
    setKey(null);
    setSessions([]);
    setSelectedId(null);
  }, []);

  /** Kirish: parolni tekshirish uchun suhbatlar ro'yxatini so'raymiz */
  const login = async (password: string) => {
    setLoginLoading(true);
    setLoginError(false);
    try {
      const data = await new OperatorService(password).getSessions();
      sessionStorage.setItem(KEY_STORAGE, password);
      setKey(password);
      setSessions(data);
    } catch {
      setLoginError(true);
    } finally {
      setLoginLoading(false);
    }
  };

  /** Polling: suhbatlar ro'yxati + tanlangan suhbat */
  useEffect(() => {
    if (!service) return;
    const load = async () => {
      try {
        setSessions(await service.getSessions());
        if (selectedId) setMessages((await service.getThread(selectedId)).messages);
      } catch {
        logout(); // parol o'zgargan bo'lsa
      }
    };
    load();
    const timer = setInterval(load, POLL_MS);
    return () => clearInterval(timer);
  }, [service, selectedId, logout]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, selectedId]);

  const reply = async (text: string) => {
    if (!service || !selectedId) return;
    setSending(true);
    try {
      const thread = await service.reply(selectedId, text);
      setMessages(thread.messages);
    } finally {
      setSending(false);
    }
  };

  if (!service) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <OperatorLogin error={loginError} loading={loginLoading} onLogin={login} />
      </Container>
    );
  }

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            {t("operator.title")}
          </Typography>
          <Button startIcon={<LogoutIcon />} onClick={logout}>
            {t("operator.logout")}
          </Button>
        </Stack>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <SessionList sessions={sessions} selectedId={selectedId} onSelect={setSelectedId} />
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ height: 640, display: "flex", flexDirection: "column" }}>
              {selected ? (
                <>
                  <Box sx={{ px: 2.5, py: 2, borderBottom: "1px solid #EEE9DD", bgcolor: "#FBFAF6" }}>
                    <Typography sx={{ fontWeight: 800 }}>{selected.chatNickname}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {selected.chatLang.toUpperCase()}
                    </Typography>
                  </Box>
                  <Box ref={listRef} sx={{ flexGrow: 1, overflowY: "auto", p: 2.5, bgcolor: "#F7F5EF" }}>
                    {messages.map((m) => (
                      <MessageBubble
                        key={m._id}
                        sender={m.messageSender}
                        text={m.messageText}
                        time={formatTime(m.createdAt)}
                        isFallback={m.messageIsFallback}
                        perspective="operator"
                        userLabel={selected.chatNickname}
                      />
                    ))}
                  </Box>
                  <Box sx={{ p: 1.5, borderTop: "1px solid #EEE9DD" }}>
                    <ChatInput placeholder={t("operator.reply")} disabled={sending} onSend={reply} />
                  </Box>
                </>
              ) : (
                <Stack sx={{ flexGrow: 1, alignItems: "center", justifyContent: "center", color: "text.secondary" }} spacing={1}>
                  <ForumOutlinedIcon sx={{ fontSize: 56, opacity: 0.4 }} />
                  <Typography>{t("operator.select")}</Typography>
                </Stack>
              )}
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
