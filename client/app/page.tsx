import { CurrentUser } from "@/components/CurrentUser";
import { Main } from "@/components/Main";

export default function Home() {
  return (
    <div className="flex h-screen">
    <div className="flex-1 bg-white p-4">
      <Main /> 
    </div>

    {/* Sidebar section for users */}
    <div className="w-1/3 bg-gray-100 p-4">
      <CurrentUser /> 
    </div>
  </div>
  );
}
