export default function StructuredData({ data }) {
  const items = Array.isArray(data) ? data : [data];

  return items.map((item, index) => (
    <script
      key={`${item["@type"] || "schema"}-${index}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
    />
  ));
}
