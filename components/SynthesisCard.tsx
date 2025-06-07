interface Props {
  text: string | string[] | undefined;
}

export default function SynthesisCard({ text }: Props) {
  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', marginTop: '1rem' }}>
      {text}
    </div>
  );
}
