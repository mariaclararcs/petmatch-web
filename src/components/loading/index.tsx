import { Bone } from "lucide-react";

export default function LoadingComponent() {
    return (
        <div className="flex flex-col justify-center items-center mx-auto gap-6 px-20 py-6 xl:py-8 min-h-screen">
            <Bone className="h-12 w-12 text-aborder animate-spin"/>
        </div>
    )
}