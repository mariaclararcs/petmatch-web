import { AuroraBackground } from "../ui/aurora-background";

export default function Home() {
  return (
    <AuroraBackground>
      <h1 className="text-4xl font-bold dark:text-white">PetMatch!</h1>
      <p className="mt-4 dark:text-white">A sua plataforma para adoção de animais e doações.</p>
    </AuroraBackground>
  );
}
