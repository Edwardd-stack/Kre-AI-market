import { useState } from "react";
import type { FormEvent } from "react";
import { Alert, Avatar, Button, Card, CardContent, Stack, TextField, Typography } from "@mui/material";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { useTranslation } from "react-i18next";

interface OperatorLoginProps {
  error: boolean;
  loading: boolean;
  onLogin: (password: string) => void;
}

export default function OperatorLogin({ error, loading, onLogin }: OperatorLoginProps) {
  const { t } = useTranslation();
  const [password, setPassword] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (password) onLogin(password);
  };

  return (
    <Card sx={{ maxWidth: 400, mx: "auto", mt: 6 }}>
      <CardContent sx={{ p: 4 }}>
        <Stack component="form" onSubmit={submit} spacing={2.5} sx={{ alignItems: "center" }}>
          <Avatar sx={{ width: 64, height: 64, bgcolor: "primary.dark" }}>
            <SupportAgentIcon fontSize="large" />
          </Avatar>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            {t("operator.loginTitle")}
          </Typography>
          {error && <Alert severity="error" sx={{ width: "100%" }}>{t("operator.wrongPassword")}</Alert>}
          <TextField
            type="password"
            label={t("operator.password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            autoFocus
          />
          <Button type="submit" variant="contained" size="large" fullWidth disabled={loading || !password}>
            {t("operator.login")}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
