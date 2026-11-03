import {
    SUPPORT_END_HOUR,
    SUPPORT_START_HOUR,
    SUPPORT_TIMEZONE,
} from "../config";

/**
 * Koreya vaqtini server qayerda turganidan qat'i nazar aniqlash.
 * (Render serveri AQSh/Yevropada bo'lishi mumkin — new Date().getHours() noto'g'ri bo'lardi)
 */
export const getKstNow = (now: Date = new Date()) => {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: SUPPORT_TIMEZONE,
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
    }).formatToParts(now);

    const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
    return {
        weekday: get("weekday"),            // "Mon" ... "Sun"
        hour: Number(get("hour")),
        time: `${get("hour")}:${get("minute")}`,
    };
};

/** Dushanba–Juma, 09:00–17:59 KST => true */
export const isBusinessHours = (now: Date = new Date()): boolean => {
    const { weekday, hour } = getKstNow(now);
    const weekend = weekday === "Sat" || weekday === "Sun";
    return !weekend && hour >= SUPPORT_START_HOUR && hour < SUPPORT_END_HOUR;
};
