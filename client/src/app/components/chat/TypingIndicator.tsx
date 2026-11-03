import { Box, Stack, Typography } from "@mui/material";
import { keyframes } from "@mui/material/styles";

const bounce = keyframes`
  0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
  40% { transform: translateY(-5px); opacity: 1; }
`;

/** "AI yozmoqda…" — uchta sakrovchi nuqta */
export default function TypingIndicator({ label }: { label: string }) {
  return (
    <Stack direction="row" spacing={1.25} sx={{ alignItems: "center", my: 1, pl: 1 }}>
      <Stack direction="row" spacing={0.5}>
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            sx={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              bgcolor: "secondary.main",
              animation: `${bounce} 1.2s ${i * 0.15}s infinite ease-in-out`,
            }}
          />
        ))}
      </Stack>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
    </Stack>
  );
}
