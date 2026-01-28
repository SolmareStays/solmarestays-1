import { PortableText } from "./PortableText";

interface SanitySection {
  _type: string;
  _key: string;
  [key: string]: any;
}

interface SanitySectionRendererProps {
  sections: SanitySection[];
}

export function SanitySectionRenderer({ sections }: SanitySectionRendererProps) {
  if (!sections || !Array.isArray(sections)) return null;

  return (
    <div className="space-y-16 md:space-y-24">
      {sections.map((section) => {
        switch (section._type) {
          case "textSection":
            return (
              <div key={section._key} className="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl">
                {section.heading && (
                  <h2 className="font-serif text-3xl font-semibold text-foreground mb-6">
                    {section.heading}
                  </h2>
                )}
                {section.content && (
                  <div className="prose prose-stone max-w-none text-muted-foreground">
                    <PortableText value={section.content} />
                  </div>
                )}
              </div>
            );

          // Future sections can be added here
          // case "heroSection": ...
          // case "statsSection": ...

          default:
            // In development, might want to warn about unhandled sections
            console.warn(`Unhandled section type: ${section._type}`);
            return null;
        }
      })}
    </div>
  );
}
