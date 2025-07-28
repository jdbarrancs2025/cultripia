import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Settings,
  TestTube,
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getToken } = await auth();
  
  // Get the role from Convex token
  let userRole = "traveler";
  try {
    const token = await getToken({ template: "convex" });
    if (token) {
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      userRole = payload.publicMetadata?.role || "traveler";
    }
  } catch (error) {
    console.error("Failed to get role from token:", error);
  }

  if (userRole !== "admin") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Admin Panel
        </h2>
        <nav className="space-y-2">
          <Link href="/admin">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-700 hover:text-gray-900"
            >
              <LayoutDashboard className="mr-3 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/admin/applications">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-700 hover:text-gray-900"
            >
              <FileText className="mr-3 h-4 w-4" />
              Applications
            </Button>
          </Link>
          <Link href="/admin/hosts">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-700 hover:text-gray-900"
            >
              <Users className="mr-3 h-4 w-4" />
              Hosts
            </Button>
          </Link>
          <Link href="/admin/experiences">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-700 hover:text-gray-900"
            >
              <Calendar className="mr-3 h-4 w-4" />
              Experiences
            </Button>
          </Link>
          <Link href="/admin/settings">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-700 hover:text-gray-900"
            >
              <Settings className="mr-3 h-4 w-4" />
              Settings
            </Button>
          </Link>
          <Link href="/admin/test-data">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-700 hover:text-gray-900"
            >
              <TestTube className="mr-3 h-4 w-4" />
              Test Data
            </Button>
          </Link>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 bg-white">
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
}