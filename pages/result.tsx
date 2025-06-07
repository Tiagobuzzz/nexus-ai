import { useRouter } from 'next/router';
import SynthesisCard from '../components/SynthesisCard';

export default function ResultPage() {
  const router = useRouter();
  const { prompt } = router.query;

  return (
    <div>
      <h2>Resultado</h2>
      <SynthesisCard text={`Resposta para: ${prompt}`} />
    </div>
  );
}
