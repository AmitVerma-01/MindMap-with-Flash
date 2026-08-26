import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

interface PriceCardProps {
  name: string;
  description: string;
  price: number;
  monthlyCredits: number;
  popular?: boolean;
  activated?: boolean;
  onSelect?: () => void;
  loading?: boolean;
  disabled?: boolean;
  selectable?: boolean;
  ctaLabel?: string;
}

export default function PriceCard({
  name,
  description,
  price,
  monthlyCredits,
  popular = false,
  activated = false,
  onSelect,
  loading = false,
  disabled = false,
  selectable = true,
  ctaLabel,
}: PriceCardProps) {
  const isPro = price > 0;
  const defaultCta = isPro ? "Upgrade to Pro" : "Select Free Plan";

  return (
    <div className="w-full h-full flex flex-col min-h-[420px]">
      <div className="mb-4 min-h-[80px]">
        <div className="h-6 mb-2">
          {popular && <Badge variant="primary">MOST POPULAR</Badge>}
        </div>
        <h3 className="text-xl font-bold text-foreground mb-1">{name}</h3>
        <p className="text-muted text-sm">{description}</p>
      </div>

      <div className="mb-4 min-h-[72px]">
        <div className="flex items-baseline gap-1.5">
          <span className="text-4xl font-bold text-foreground">
            ${price}
          </span>
          <span className="text-muted text-sm">/month</span>
        </div>
        <div className="h-5 mt-1.5">
          {isPro && (
            <p className="text-xs text-primary">Save 20% with annual billing</p>
          )}
        </div>
      </div>

      <ul className="space-y-2 mb-6 flex-grow">
        <FeatureItem
          included
          text={
            isPro
              ? `${monthlyCredits} credits/month`
              : `${monthlyCredits} credits/month`
          }
        />
        <FeatureItem included text={isPro ? "Advanced AI generation" : "Basic AI generation"} />
        <FeatureItem included text={isPro ? "Unlimited sets" : "Save up to 10 sets"} />
        <FeatureItem included text="Study mode with self-grading" />
        <FeatureItem included={isPro} text="Export CSV & JSON" />
        <FeatureItem included={isPro} text="Priority support" />
        <FeatureItem included={isPro} text="Regenerate individual cards" />
      </ul>

      <div className="w-full mt-auto">
        {disabled || !selectable ? (
          <Button variant="ghost" fullWidth disabled>
            Coming Soon
          </Button>
        ) : activated ? (
          <Button variant="secondary" fullWidth disabled>
            Current Plan
          </Button>
        ) : (
          <Button fullWidth onClick={onSelect} disabled={loading}>
            {loading ? "Selecting..." : ctaLabel ?? defaultCta}
          </Button>
        )}
      </div>
    </div>
  );
}

function FeatureItem({ included, text }: { included: boolean; text: string }) {
  return (
    <li className="flex items-start gap-2">
      {included ? (
        <CheckIcon className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
      ) : (
        <XIcon className="w-4 h-4 text-muted flex-shrink-0 mt-0.5" />
      )}
      <span className={`text-xs ${included ? "text-foreground/80" : "text-muted"}`}>
        {text}
      </span>
    </li>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
