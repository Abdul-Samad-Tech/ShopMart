export function validateBody(schema) {
  return (req, res, next) => {
    const parsed = schema.safeParse(req.body ?? {});
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message || 'Invalid request';
      return res.status(400).json({ message });
    }
    req.body = parsed.data;
    next();
  };
}
