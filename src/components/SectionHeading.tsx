type SectionHeadingProps = {
  eyebrow: string
  title?: string
  description?: string
  align?: 'left' | 'center'
  light?: boolean
  className?: string
}

/** Shared homepage section chrome — keeps every block on-brand. */
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
      <div className={`flex items-center gap-3 mb-4 ${centered ? 'justify-center' : ''}`}>
        <span
          className={`w-1 h-6 rounded-full shrink-0 ${light ? 'bg-sky-400' : 'bg-sky-600'}`}
        />
        <p
          className={`text-[11px] sm:text-xs font-black tracking-[0.35em] uppercase ${
            light ? 'text-sky-300' : 'text-sky-600'
          }`}
        >
          {eyebrow}
        </p>
      </div>
      {title ? (
        <h2
          className={`font-playfair text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-[1.1] mb-3 ${
            light ? 'text-white' : 'text-blue-950'
          }`}
        >
          {title}
        </h2>
      ) : null}
      {description ? (
        <p
          className={`text-sm sm:text-base leading-relaxed ${
            light ? 'text-white/65' : 'text-stone-500'
          }`}
        >
          {description}
        </p>
      ) : null}
    </div>
  )
}
