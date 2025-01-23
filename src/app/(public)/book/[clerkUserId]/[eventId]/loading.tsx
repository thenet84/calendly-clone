import { LoaderCircle } from "lucide-react";

export default function LoadingPage() {
    return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-4 items-center">
            <div className="text-3xl font-bold text-muted-foreground text-center">
                Loading
            </div>
            <LoaderCircle className="text-muted-foreground size-24 animate-spin" />
        </div>
    )
}