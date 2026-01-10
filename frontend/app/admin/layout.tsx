import AdminNav from "@/components/ui/AdminNav";
import ToastNotification from "@/components/ui/ToastNotification";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AdminNav />
      <div className="lg:min-h-screen container mx-auto mt-10 px-10">
        <div className="bg-white rounded-lg shadow w-full flex flex-col  mx-auto max-w-4xl p-10 my-10">
          {children}
        </div>
      </div>
      <ToastNotification />
    </>
  );
}
