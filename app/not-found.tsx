import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-6 p-8">
        <div>
          <h1 className="text-9xl font-bold text-turquesa">404</h1>
          <h2 className="text-2xl font-semibold text-gray-900 mt-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 mt-2">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <Button asChild className="bg-turquesa hover:bg-turquesa/90">
            <Link href="/">
              Go back home
            </Link>
          </Button>
          
          <div className="flex justify-center space-x-4 text-sm">
            <Link 
              href="/experiences" 
              className="text-turquesa hover:underline"
            >
              Browse experiences
            </Link>
            <span className="text-gray-400">|</span>
            <Link 
              href="/become-a-host" 
              className="text-turquesa hover:underline"
            >
              Become a host
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}