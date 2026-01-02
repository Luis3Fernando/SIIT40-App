export const formatLogName = (fileName: string): string => {
  const cleanName = fileName.replace(".json", "");
  if (cleanName.length !== 6) return fileName;

  const day = cleanName.substring(0, 2);
  const month = cleanName.substring(2, 4);
  const year = `20${cleanName.substring(4, 6)}`;

  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}h ${m}m ${s}s`;
};
