// src/utils/queueUtils.ts

/**
 * Нормалізує назву черги, прибираючи всі можливі префікси.
 */
export const normalizeQueueName = (queue: string): string => {
  let result = queue.trim();

  // Прибираємо префікси: "Черга", "GPV", "GPW", "ГПВ"
  result = result.replace(/^(Черга|GPV|GPW|ГПВ)\s*/i, "");

  // Замінюємо дефіс на крапку (1-1 → 1.1)
  result = result.replace(/-/g, ".");

  return result.trim();
};

/**
 * Форматує назву черги для відображення.
 */
export const formatQueueName = (queue: string): string => {
  return `Черга ${normalizeQueueName(queue)}`;
};