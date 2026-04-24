export const formatEventDate = (startsAt: string) => {
  const date = new Date(startsAt);

  return {
    day: new Intl.DateTimeFormat('pt-BR', { day: '2-digit' }).format(date),
    month: new Intl.DateTimeFormat('pt-BR', { month: 'short' })
      .format(date)
      .replace('.', '')
      .toUpperCase(),
  };
};
