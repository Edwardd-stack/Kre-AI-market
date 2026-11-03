import { Avatar, Badge, Box, Card, Chip, List, ListItemButton, Stack, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { useTranslation } from "react-i18next";
import type { ChatSession } from "../../../libs/types/chat";

interface SessionListProps {
  sessions: ChatSession[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const formatTime = (iso: string) => {
  const d = new Date(iso);
  const today = new Date().toDateString() === d.toDateString();
  return today
    ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : d.toLocaleDateString([], { month: "2-digit", day: "2-digit" });
};

export default function SessionList({ sessions, selectedId, onSelect }: SessionListProps) {
  const { t } = useTranslation();

  return (
    <Card sx={{ height: { xs: "auto", md: 640 }, display: "flex", flexDirection: "column" }}>
      <Box sx={{ px: 2.5, py: 2, borderBottom: "1px solid #EEE9DD", bgcolor: "#FBFAF6" }}>
        <Typography sx={{ fontWeight: 800 }}>
          {t("operator.sessions")} ({sessions.length})
        </Typography>
      </Box>
      <List sx={{ overflowY: "auto", flexGrow: 1, p: 1 }}>
        {!sessions.length && (
          <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: "center" }}>
            {t("operator.empty")}
          </Typography>
        )}
        {sessions.map((s) => (
          <ListItemButton
            key={s._id}
            selected={s._id === selectedId}
            onClick={() => onSelect(s._id)}
            sx={{ borderRadius: 2, mb: 0.5, alignItems: "flex-start", gap: 1.5, "&.Mui-selected": { bgcolor: "#EEF5F0" } }}
          >
            <Badge color="error" badgeContent={s.chatUnreadByOperator} max={99}>
              <Avatar sx={{ bgcolor: "primary.light", width: 38, height: 38 }}>
                <PersonIcon fontSize="small" />
              </Avatar>
            </Badge>
            <Box sx={{ minWidth: 0, flexGrow: 1 }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", justifyContent: "space-between" }}>
                <Typography sx={{ fontWeight: 700, fontSize: 14 }} noWrap>
                  {s.chatNickname}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
                  {formatTime(s.chatLastMessageAt)}
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" noWrap>
                {s.chatLastMessage || "—"}
              </Typography>
              <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
                <Chip size="small" label={s.chatLang.toUpperCase()} sx={{ height: 20, fontSize: 10 }} />
                {s.chatAwaitingOperator && (
                  <Chip size="small" color="error" label={t("operator.waiting")} sx={{ height: 20, fontSize: 10 }} />
                )}
              </Stack>
            </Box>
          </ListItemButton>
        ))}
      </List>
    </Card>
  );
}
