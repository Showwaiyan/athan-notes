import LogoutButton from "@/components/LogoutButton";
import VoiceRecorder from "@/components/VoiceRecorder";
import InstallPrompt from "@/components/InstallPrompt";

export default function Home() {
  return (
    <div 
      className="min-h-screen bg-[#fafafa]"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
      }}
    >
      <div className="max-w-4xl mx-auto py-12 px-6">
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
