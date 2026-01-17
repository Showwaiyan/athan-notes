import LogoutButton from "@/components/LogoutButton";
import VoiceRecorder from "@/components/VoiceRecorder";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-4xl mx-auto py-12 px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-[#37352f]">
            Athan Notes
          </h1>
          <LogoutButton />
        </div>
        
        <VoiceRecorder />
      </div>
    </div>
  );
}
