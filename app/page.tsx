import MessageGenerator from "@/components/MessageGenerator";
import { Toaster } from "@/components/ui/sonner";

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
			<h1 className="mb-6 text-2xl font-bold text-center">Absence Message Generator</h1>
			<MessageGenerator />
			<Toaster />
		</main>
	);
}
