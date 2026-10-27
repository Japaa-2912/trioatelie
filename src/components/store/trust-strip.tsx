import { HandHeart, MessageCircle, Sparkles } from "lucide-react";

const items = [
  {
    icon: HandHeart,
    title: "Produção artesanal",
    description: "Cada peça é preparada com cuidado, do papel ao acabamento.",
  },
  {
    icon: Sparkles,
    title: "Personalização a combinar",
    description: "Tema, cores e detalhes são alinhados com você antes do pedido.",
  },
  {
    icon: MessageCircle,
    title: "Atendimento direto",
    description: "A conversa acontece com quem faz: sem intermediários.",
  },
];

export function TrustStrip() {
  return (
    <section className="border-b border-line/70 bg-ivory/45">
      <div className="container-page grid gap-0 divide-y divide-line/70 py-2 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="flex items-start gap-3.5 px-1 py-5 sm:px-6 sm:py-6 first:sm:pl-0 last:sm:pr-0"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-cream text-brand">
                <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-xs font-semibold text-ink">{item.title}</h2>
                <p className="mt-1 text-[0.7rem] leading-relaxed text-muted">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
