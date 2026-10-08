import { UploadForm } from "@/components/upload/upload-form";

export const metadata = { title: "Upload · CloudTube" };

export default function UploadPage() {
    return (
        <div className="mx-auto max-w-5xl space-y-6">
            <h1 className="text-2xl font-semibold">Upload video</h1>
            <UploadForm />
        </div>
    );
}
