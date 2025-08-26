import FileUploader from "@/components/uploader/FileUploader";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function UploadPage() {
  return (
    <div className="max-w-4xl mx-auto py-10 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Upload Your Icons</h1>
        <p className="text-gray-600">Upload SVG, PNG, or AI files to generate metadata automatically</p>
      </div>
      
      <FileUploader />
      
      <div className="flex justify-between items-center pt-4">
        <Button asChild variant="outline">
          <Link href="/">← Back to Home</Link>
        </Button>
        <Button asChild size="lg">
          <Link href="/review">Next: Generate Metadata →</Link>
        </Button>
      </div>
    </div>
  );
}