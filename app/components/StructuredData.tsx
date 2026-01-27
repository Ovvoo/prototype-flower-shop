/**
 * StructuredData Component
 * Компонент для вставки JSON-LD разметки
 */

export function StructuredData({ data }: { data: object | object[] }) {
  const schemas = Array.isArray(data) ? data : [data];

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      ))}
    </>
  );
}
