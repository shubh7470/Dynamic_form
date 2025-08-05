export default function reduceString(str: string, length = 10) {
  if (!str) return "";
  return str.length > length ? str.slice(0, length) + "..." : str;
}
