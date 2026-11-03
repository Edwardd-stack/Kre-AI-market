import { useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import { IconButton, InputBase, Paper } from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

interface ChatInputProps {
  placeholder: string;
  disabled?: boolean;
  onSend: (text: string) => void;
}

/** Enter — yuborish, Shift+Enter — yangi qator */
export default function ChatInput({ placeholder, disabled, onSend }: ChatInputProps) {
  const [text, setText] = useState("");

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    const value = text.trim();
    if (!value || disabled) return;
    onSend(value);
    setText("");
  };

  const handleKey = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault(); // koreyscha IME tugallanmaguncha yubormaymiz
      submit();
    }
  };

  return (
    <Paper
      component="form"
      onSubmit={submit}
      elevation={0}
      sx={{
        display: "flex",
        alignItems: "flex-end",
        gap: 1,
        p: 1,
        pl: 2,
        borderRadius: 3,
        border: "1px solid #E1E7E3",
        bgcolor: "#fff",
        "&:focus-within": { borderColor: "primary.main", boxShadow: "0 0 0 3px rgba(31,94,59,0.12)" },
      }}
    >
      <InputBase
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKey}
        placeholder={placeholder}
        multiline
        maxRows={4}
        sx={{ flex: 1, py: 0.75, fontSize: 15 }}
        slotProps={{ input: { maxLength: 1000 } }}
      />
      <IconButton
        type="submit"
        disabled={disabled || !text.trim()}
        sx={{
          bgcolor: "primary.main",
          color: "#fff",
          width: 42,
          height: 42,
          "&:hover": { bgcolor: "primary.dark" },
          "&.Mui-disabled": { bgcolor: "#DDE5E0", color: "#fff" },
        }}
      >
        <SendRoundedIcon fontSize="small" />
      </IconButton>
    </Paper>
  );
}
