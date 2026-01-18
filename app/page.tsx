import LogoutButton from "@/components/LogoutButton";
import VoiceRecorder from "@/components/VoiceRecorder";
import InstallPrompt from "@/components/InstallPrompt";
import ThemeBackground from "@/components/ThemeBackground";
import { Pinyon_Script } from 'next/font/google';

const pinyonScript = Pinyon_Script({
  weight: '400',
  subsets: ['latin'],
});

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F0F2F4] relative">
      <ThemeBackground />

      <div
        className="max-w-4xl mx-auto px-6 relative z-10"
        style={{
          paddingTop: 'calc(3rem + env(safe-area-inset-top))',
          paddingBottom: 'calc(3rem + env(safe-area-inset-bottom))',
          paddingLeft: 'calc(1.5rem + env(safe-area-inset-left))',
          paddingRight: 'calc(1.5rem + env(safe-area-inset-right))',
        }}
      >
        <div className="flex items-center justify-between mb-12">
          <h1 className={`${pinyonScript.className} text-4xl text-[#1a1a1a] flex items-center`}>
            <span className="text-6xl leading-[0.8] mr-[0.02em]">A</span>than Notes
          </h1>
          <LogoutButton />
        </div>

        <VoiceRecorder />
      </div>

      <InstallPrompt />
    </div>
  );
}
