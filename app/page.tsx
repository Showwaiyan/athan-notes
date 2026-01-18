import LogoutButton from "@/components/LogoutButton";
import VoiceRecorder from "@/components/VoiceRecorder";
import InstallPrompt from "@/components/InstallPrompt";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div 
        className="max-w-4xl mx-auto px-6"
        style={{
          paddingTop: 'calc(3rem + env(safe-area-inset-top))',
          paddingBottom: 'calc(3rem + env(safe-area-inset-bottom))',
          paddingLeft: 'calc(1.5rem + env(safe-area-inset-left))',
          paddingRight: 'calc(1.5rem + env(safe-area-inset-right))',
        }}
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-[#37352f]">
            Athan Notes
          </h1>
          <LogoutButton />
        </div>
        
        <VoiceRecorder />
      </div>
      
      <InstallPrompt />
    </div>
  );
}
