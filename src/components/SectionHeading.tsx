type SectionHeadingProps = {
  eyebrow: string
  title?: string
  description?: string
  align?: 'left' | 'center'
  light?: boolean
  className?: string
}

/** Shared homepage section chrome — clean Woodora-style headings. */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  light = false,
  className = '',
}: SectionHeadingProps) {
  const centered = align === 'center'

  return (
    <div
      className={`mb-10 sm:mb-14 ${centered ? 'text-center max-w-2xl mx-auto' : 'max-w-xl'} ${className}`}
    >
      <p
        className={`text-[11px] font-medium tracking-[0.25em] uppercase mb-3 ${
          light ? 'text-white/50' : 'text-neutral-400'
        }`}
      >
        {eyebrow}
      </p>
      {title ? (
        <h2
          className={`font-display text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-[1.1] mb-3 ${
            light ? 'text-white' : 'text-neutral-900'
          }`}
        >
          {title}
        </h2>
      ) : null}
      {description ? (
        <p
          className={`text-sm sm:text-base leading-relaxed ${
            light ? 'text-white/60' : 'text-neutral-500'
          }`}
        >
          {description}
        </p>
      ) : null}
    </div>
  )
}
