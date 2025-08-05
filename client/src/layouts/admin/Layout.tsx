import { Outlet } from "react-router-dom";
import Page from "./components/Sidebar";
import { Toaster } from "sonner";

export default function Layout() {
  return (
    <Page>
      <div className="flex flex-col h-screen">
        <div className="flex-1 px-8 flex justify-center items-center py-8">
          <Outlet />
        </div>
      </div>
      <Toaster />
    </Page>
  );
}
