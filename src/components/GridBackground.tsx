export default function GridBackground() {
  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 dark:hidden"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.07) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
      />
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
      />
    </div>
  );
}
