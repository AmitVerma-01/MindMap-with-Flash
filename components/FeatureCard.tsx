interface FeatureCardProps {
  heading: string;
  details: string;
}

export default function FeatureCard({ heading, details }: FeatureCardProps) {
  return (
    <div>
      <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-2">
        {heading}
      </h3>
      <p className="text-sm md:text-base text-muted leading-relaxed">{details}</p>
    </div>
  );
}
