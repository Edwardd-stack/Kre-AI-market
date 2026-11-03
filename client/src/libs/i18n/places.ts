/**
 * Bazadagi koreyscha nomlar (hudud, shahar, nav, sotuvchi) uchun tarjimalar.
 * Ma'lumot bazada bitta tilda (koreyscha) saqlanadi — tarjima faqat ko'rsatishda.
 * Koreyscha tanlanganda asl nom ko'rsatiladi.
 */
type Dict = Record<string, { en: string; ru: string; uz: string }>;

export const PROVINCES: Dict = {
  강원: { en: "Gangwon", ru: "Канвондо", uz: "Kangvon" },
  경기: { en: "Gyeonggi", ru: "Кёнгидо", uz: "Kyonggi" },
  경북: { en: "Gyeongbuk", ru: "Кёнсан-Пукто", uz: "Kyongbuk" },
  전남: { en: "Jeonnam", ru: "Чолла-Намдо", uz: "Jeonnam" },
  전북: { en: "Jeonbuk", ru: "Чолла-Пукто", uz: "Jeonbuk" },
  충남: { en: "Chungnam", ru: "Чхунчхон-Намдо", uz: "Chungnam" },
};

export const REGIONS: Dict = {
  김제: { en: "Gimje", ru: "Кимдже", uz: "Gimje" },
  익산: { en: "Iksan", ru: "Иксан", uz: "Iksan" },
  김포: { en: "Gimpo", ru: "Кимпхо", uz: "Gimpo" },
  평택: { en: "Pyeongtaek", ru: "Пхёнтхэк", uz: "Pxyontxek" },
  철원: { en: "Cheorwon", ru: "Чхорвон", uz: "Chxorvon" },
  여주: { en: "Yeoju", ru: "Ёджу", uz: "Yoju" },
  이천: { en: "Icheon", ru: "Ичхон", uz: "Ichxon" },
  당진: { en: "Dangjin", ru: "Тангджин", uz: "Dangjin" },
  해남: { en: "Haenam", ru: "Хэнам", uz: "Xenam" },
  의성: { en: "Uiseong", ru: "Ыйсон", uz: "Uyson" },
  상주: { en: "Sangju", ru: "Санджу", uz: "Sangju" },
  안성: { en: "Anseong", ru: "Ансон", uz: "Anson" },
};

export const VARIETIES: Dict = {
  신동진: { en: "Shindongjin", ru: "Синдонджин", uz: "Shindongjin" },
  추청: { en: "Chucheong", ru: "Чучхон", uz: "Chuchxon" },
  오대: { en: "Odae", ru: "Одэ", uz: "Ode" },
  고시히카리: { en: "Koshihikari", ru: "Косихикари", uz: "Koshixikari" },
  해들: { en: "Haedeul", ru: "Хэдыль", uz: "Xedil" },
  삼광: { en: "Samgwang", ru: "Самгван", uz: "Samgvan" },
  새청무: { en: "Saecheongmu", ru: "Сэчхонму", uz: "Sechxonmu" },
  일품: { en: "Ilpum", ru: "Ильпум", uz: "Ilpum" },
  영호진미: { en: "Yeonghojinmi", ru: "Ёнходжинми", uz: "Yongxojinmi" },
  참드림: { en: "Chamdeurim", ru: "Чамдырим", uz: "Chamdirim" },
};

export const SELLERS: Dict = {
  "김제농협 RPC": { en: "Gimje Nonghyup RPC", ru: "RPC Нонхёп Кимдже", uz: "Gimje Nonghyup RPC" },
  "익산 미곡종합처리장": { en: "Iksan Rice Processing Complex", ru: "Рисовый комплекс Иксан", uz: "Iksan guruch qayta ishlash majmuasi" },
  "김포 정미소": { en: "Gimpo Rice Mill", ru: "Рисовая мельница Кимпхо", uz: "Gimpo guruch tegirmoni" },
  "평택농협 RPC": { en: "Pyeongtaek Nonghyup RPC", ru: "RPC Нонхёп Пхёнтхэк", uz: "Pxyontxek Nonghyup RPC" },
  "철원 미곡종합처리장": { en: "Cheorwon Rice Processing Complex", ru: "Рисовый комплекс Чхорвон", uz: "Chxorvon guruch qayta ishlash majmuasi" },
  "여주 쌀 RPC": { en: "Yeoju Rice RPC", ru: "Рисовый RPC Ёджу", uz: "Yoju guruch RPC" },
  "이천 임금님표 RPC": { en: "Icheon Imgeumnimpyo RPC", ru: "RPC Имгымнимпхё Ичхон", uz: "Ichxon Imgimnimpyo RPC" },
  "당진 해나루 RPC": { en: "Dangjin Haenaru RPC", ru: "RPC Хэнару Тангджин", uz: "Dangjin Xenaru RPC" },
  "해남 땅끝 RPC": { en: "Haenam Ttangkkeut RPC", ru: "RPC Ттанккыт Хэнам", uz: "Xenam Ttangkkit RPC" },
  "의성 정미소": { en: "Uiseong Rice Mill", ru: "Рисовая мельница Ыйсон", uz: "Uyson guruch tegirmoni" },
  "상주농협 RPC": { en: "Sangju Nonghyup RPC", ru: "RPC Нонхёп Санджу", uz: "Sangju Nonghyup RPC" },
  "안성 미곡처리장": { en: "Anseong Rice Processing Center", ru: "Рисовый центр Ансон", uz: "Anson guruch qayta ishlash markazi" },
};

/** Lug'atdan tarjima; topilmasa yoki til koreyscha bo'lsa — asl nom */
export const translatePlace = (dict: Dict, value: string | undefined, lang: string): string => {
  if (!value) return "";
  if (lang === "ko") return value;
  const entry = dict[value];
  return entry ? entry[lang as "en" | "ru" | "uz"] ?? entry.en : value;
};
