"use client";

import { useState, useEffect, memo, ChangeEvent, JSX } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

// Define types
type TimeOfDay = "morning" | "afternoon" | "evening" | "";
type Salutation = "ma'am" | "sir" | "";

interface FormData {
	timeOfDay: TimeOfDay;
	salutation: Salutation;
	subject: string;
	reason: string;
	name: string;
	rollNo: string;
}

interface InlineInputProps {
	field: keyof FormData;
	value: string;
	onChange: (field: keyof FormData, value: string) => void;
	placeholder: string;
	className?: string;
}

// Memoized input component to prevent unnecessary rerenders
const MemoizedInlineInput = memo(({ field, value, onChange, placeholder, className = "" }: InlineInputProps) => (
	<Input
		value={value}
		onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(field, e.target.value)}
		placeholder={placeholder}
		className={`h-7 px-2 my-1 inline-flex border-dashed border-primary/50 bg-transparent ${className}`}
	/>
));

MemoizedInlineInput.displayName = "MemoizedInlineInput";

export default function MessageGenerator(): JSX.Element {
	const [formData, setFormData] = useState<FormData>({
		timeOfDay: "",
		salutation: "",
		subject: "",
		reason: "",
		name: "",
		rollNo: "",
	});

	const [isFormComplete, setIsFormComplete] = useState<boolean>(false);
	const [isCopied, setIsCopied] = useState<boolean>(false);

	useEffect(() => {
		// Check if all fields are filled
		const isComplete = Object.values(formData).every((value) => value.trim() !== "");
		setIsFormComplete(isComplete);
	}, [formData]);

	const handleInputChange = (field: keyof FormData, value: string): void => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const generateMessage = (): string => {
		if (!isFormComplete) return "";

		return `Good ${formData.timeOfDay} ${formData.salutation}.

${formData.salutation.charAt(0).toUpperCase() + formData.salutation.slice(1)} I was unable to attend today's ${
			formData.subject
		} class as ${formData.reason}.

Humbly request you to please mark my attendance for the same.

Best regards
${formData.name}
${formData.rollNo}`;
	};

	const copyToClipboard = async (): Promise<void> => {
		try {
			await navigator.clipboard.writeText(generateMessage());
			setIsCopied(true);
			toast.success("Message copied to clipboard!");

			// Reset the copied state after 2 seconds
			setTimeout(() => {
				setIsCopied(false);
			}, 2000);
		} catch (err) {
			toast.error(`Failed to copy message.`);
			console.log(err);
		}
	};

	// Inline editable components
	const TimeOfDayDropdown = (): JSX.Element => (
		<span className="inline-block">
			<Select
				value={formData.timeOfDay}
				onValueChange={(value: TimeOfDay) => handleInputChange("timeOfDay", value)}
			>
				<SelectTrigger className="h-7 px-2 py-1 min-w-[100px] border-dashed border-primary/50 bg-transparent">
					<SelectValue placeholder="Morning/Afternoon/Evening" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="morning">morning</SelectItem>
					<SelectItem value="afternoon">afternoon</SelectItem>
					<SelectItem value="evening">evening</SelectItem>
				</SelectContent>
			</Select>
		</span>
	);

	const SalutationDropdown = (): JSX.Element => (
		<span className="inline-block">
			<Select
				value={formData.salutation}
				onValueChange={(value: Salutation) => handleInputChange("salutation", value)}
			>
				<SelectTrigger className="h-7 px-2 py-1 min-w-[80px] border-dashed border-primary/50 bg-transparent">
					<SelectValue placeholder="Ma'am/Sir" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="ma'am">ma&apos;am</SelectItem>
					<SelectItem value="sir">sir</SelectItem>
				</SelectContent>
			</Select>
		</span>
	);

	return (
		<div className="w-full max-w-2xl">
			<Card>
				<CardContent>
					<div className="space-y-4 text-base leading-relaxed">
						<p>
							Good <TimeOfDayDropdown /> <SalutationDropdown /> .
						</p>
						<p>
							<SalutationDropdown /> I was unable to attend today&apos;s{" "}
							<MemoizedInlineInput
								field="subject"
								value={formData.subject}
								onChange={handleInputChange}
								placeholder="{Subject}"
								className="max-w-20"
							/>{" "}
							class as{" "}
							<MemoizedInlineInput
								className="max-w-100"
								field="reason"
								value={formData.reason}
								onChange={handleInputChange}
								placeholder="{Reason why you did not attend}"
							/>{" "}
							.
						</p>
						<p>Humbly request you to please mark my attendance for the same.</p>
						<p>
							Best regards
							<br />
							<MemoizedInlineInput
								field="name"
								value={formData.name}
								onChange={handleInputChange}
								placeholder="{Your name}"
							/>
							<br />
							<MemoizedInlineInput
								field="rollNo"
								value={formData.rollNo}
								onChange={handleInputChange}
								placeholder="{Your roll no}"
							/>
						</p>
					</div>
				</CardContent>

				<CardFooter className="flex justify-end">
					<Button
						onClick={copyToClipboard}
						disabled={!isFormComplete}
						className="w-full"
					>
						{isCopied ? (
							<>
								<Check className="mr-2 h-4 w-4" /> Copied
							</>
						) : (
							<>
								<Copy className="mr-2 h-4 w-4" /> Copy Message
							</>
						)}
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
