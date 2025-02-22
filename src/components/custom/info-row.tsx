interface InfoRowProps {
  label: string,
  children: React.ReactNode,
}

export default function InfoRow({ label, children }: InfoRowProps) {
  return (
    <h3 className="text-base">
      {label} <span className="font-semibold text-black">{children}</span>
    </h3>
  )
};