export const timeSince = (date: Date) => {
  const seconds = Math.floor(((new Date() as any) - (date as any)) / 1000);

  let interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) === 1
      ? "1 year ago"
      : Math.floor(interval) + " years ago";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) === 1
      ? "1 month ago"
      : Math.floor(interval) + " months ago";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) === 1
      ? "1 day ago"
      : Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) === 1
      ? "1 hour ago"
      : Math.floor(interval) + " hours ago";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) === 1
      ? "1 minute ago"
      : Math.floor(interval) + " minutes ago";
  }
  return Math.floor(seconds) + " seconds ago";
};
