interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: string;
}

export function EmptyState({ title, description, action, icon = '📭' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <span className="text-5xl mb-4">{icon}</span>
      <h3 className="text-base font-semibold text-[var(--color-foreground)] mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-[var(--color-muted)] mb-4 max-w-xs">{description}</p>
      )}
      {action}
    </div>
  );
}
