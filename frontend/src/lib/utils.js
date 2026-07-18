export function cn(...classes) {
  return classes.flat(Infinity).filter(Boolean).join(" ");
}

export function excerpt(text, maxLength = 160) {
  if (!text) {
    return "";
  }

  return text.length > maxLength ? `${text.slice(0, maxLength).trim()}...` : text;
}

export function formatDate(value) {
  if (!value) {
    return "Recently";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function normalizeRole(role) {
  if (!role) {
    return "Member";
  }

  return `${role[0]}${role.slice(1).toLowerCase()}`;
}
