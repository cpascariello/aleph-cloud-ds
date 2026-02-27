type DemoSectionProps = {
  title: string;
  children: React.ReactNode;
};

export function DemoSection({ title, children }: DemoSectionProps) {
  return (
    <section className="mb-10">
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      {children}
    </section>
  );
}
