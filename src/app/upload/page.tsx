import FileUploader from "@/components/uploader/FileUploader";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function UploadPage() {
  return (
    <div className="bg-gray-50 flex flex-col" style={{ height: 'calc(100vh - 80px)' }}>
      <div className="flex-1 flex flex-col justify-between max-w-4xl mx-auto w-full px-4">
         {/* Header Section */}
         <div className="pt-8">
           <div className="text-center space-y-2">
             <h1 className="text-3xl font-bold text-gray-900">Upload Your Icons</h1>
             <p className="text-gray-600">Upload SVG, PNG, or AI files to generate metadata automatically</p>
           </div>
         </div>
         
         {/* Main Content */}
         <div className="flex-1 flex items-center justify-center py-8">
           <div className="w-full">
             <FileUploader />
           </div>
         </div>
         
         {/* Bottom Navigation */}
         <div className="pb-8">
           <div className="flex justify-between items-center">
             <Button asChild variant="outline">
               <Link href="/">← Back to Home</Link>
             </Button>
             <Button asChild size="lg">
               <Link href="/review">Next: Generate Metadata →</Link>
             </Button>
           </div>
         </div>
      </div>
    </div>
  );
}