"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

export default function MessageGenerator() {
	const [formData, setFormData] = useState({
		timeOfDay: "",
		salutation: "",
		subject: "",
		reason: "",
		name: "",
		rollNo: "",
	});

	const [isFormComplete, setIsFormComplete] = useState(false);
	const [isCopied, setIsCopied] = useState(false);

	useEffect(() => {
		// Check if all fields are filled
		const isComplete = Object.values(formData).every((value) => value.trim() !== "");
		setIsFormComplete(isComplete);
	}, [formData]);

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const generateMessage = () => {
		if (!isFormComplete) return "";

		return `Good ${formData.timeOfDay} ${formData.salutation}.

${formData.salutation} I was unable to attend today's ${formData.subject} class as ${formData.reason}.

Humbly request you to please mark my attendance for the same.

Best regards
${formData.name}
${formData.rollNo}`;
	};

	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(generateMessage());
			setIsCopied(true);
			toast.success("Message copied to clipboard!");

			// Reset the copied state after 2 seconds
			setTimeout(() => {
				setIsCopied(false);
			}, 2000);
		} catch (err) {
			toast.error("Failed to copy message");
		}
	};

	// Inline editable components
	const TimeOfDayDropdown = () => (
		<span className="inline-block">
			<Select
				value={formData.timeOfDay}
				onValueChange={(value) => handleInputChange("timeOfDay", value)}
			>
				<SelectTrigger className="h-7 px-2 py-1 min-w-[100px] border-dashed border-primary/50 bg-transparent">
					<SelectValue placeholder="morning/afternoon/evening" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="morning">morning</SelectItem>
					<SelectItem value="afternoon">afternoon</SelectItem>
					<SelectItem value="evening">evening</SelectItem>
				</SelectContent>
			</Select>
		</span>
	);

	const SalutationDropdown = () => (
		<span className="inline-block">
			<Select
				value={formData.salutation}
				onValueChange={(value) => handleInputChange("salutation", value)}
			>
				<SelectTrigger className="h-7 px-2 py-1 min-w-[80px] border-dashed border-primary/50 bg-transparent">
					<SelectValue placeholder="ma'am/sir" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="ma'am">ma'am</SelectItem>
					<SelectItem value="sir">sir</SelectItem>
				</SelectContent>
			</Select>
		</span>
	);

	const InlineInput = ({ field, placeholder, className = "" }) => (
		<Input
			value={formData[field]}
			onChange={(e) => handleInputChange(field, e.target.value)}
			placeholder={placeholder}
			className={`h-7 px-2 py-1 min-w-[100px] inline-flex border-dashed border-primary/50 bg-transparent ${className}`}
		/>
	);

	return (
		<div className="w-full max-w-md">
			<Card>
				<CardHeader>
					<CardTitle>Absence Message Generator</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4 text-base leading-relaxed">
						<p>
							Good <TimeOfDayDropdown /> <SalutationDropdown />.
						</p>
						<p>
							<SalutationDropdown /> I was unable to attend today's{" "}
							<InlineInput
								field="subject"
								placeholder="subject"
							/>{" "}
							class as{" "}
							<InlineInput
								field="reason"
								placeholder="reason"
								className="min-w-[150px]"
							/>
							.
						</p>
						<p>Humbly request you to please mark my attendance for the same.</p>
						<p>
							Best regards
							<br />
							<InlineInput
								field="name"
								placeholder="name"
							/>
							<br />
							<InlineInput
								field="rollNo"
								placeholder="roll no"
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
