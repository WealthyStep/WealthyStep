"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(10, "Please enter a valid 10-digit phone number."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

type FormValues = z.infer<typeof formSchema>;

export function ContactForm({ className }: { className?: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/chatbot/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          service: 'Other', // Contact page generic service
          source: 'Contact Page'
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit");
      }

      setIsSuccess(true);
      reset();
      
      // Reset success message after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error("Submission error:", error);
      // In a real app we might show an error toast here
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={cn("flex flex-col items-center justify-center p-12 text-center bg-cream rounded-2xl border border-border-sage/20", className)}>
        <CheckCircle2 className="h-16 w-16 text-cta-green mb-4" />
        <h3 className="text-2xl font-bold text-text-dark mb-2">Message Sent!</h3>
        <p className="text-text-body">
          Thank you for reaching out. A Wealthy Step representative will contact you shortly.
        </p>
        <Button 
          variant="outline" 
          className="mt-8"
          onClick={() => setIsSuccess(false)}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("space-y-6 bg-white p-8 rounded-2xl border border-border-sage/30 shadow-sm", isSubmitting && "opacity-50 pointer-events-none", className)}
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-text-dark mb-1">
            Full Name <span className="text-negative">*</span>
          </label>
          <Input
            id="name"
            placeholder="John Doe"
            {...register("name")}
            className={errors.name ? "border-negative focus-visible:ring-negative" : ""}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-negative">{errors.name.message}</p>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-dark mb-1">
              Email Address <span className="text-negative">*</span>
            </label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              {...register("email")}
              className={errors.email ? "border-negative focus-visible:ring-negative" : ""}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-negative">{errors.email.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-text-dark mb-1">
              Phone Number <span className="text-negative">*</span>
            </label>
            <Input
              id="phone"
              type="tel"
              placeholder="+91 9000929666"
              {...register("phone")}
              className={errors.phone ? "border-negative focus-visible:ring-negative" : ""}
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-negative">{errors.phone.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-text-dark mb-1">
            How can we help you? <span className="text-negative">*</span>
          </label>
          <Textarea
            id="message"
            placeholder="Tell us about your mutual fund or insurance requirements..."
            {...register("message")}
            className={errors.message ? "border-negative focus-visible:ring-negative" : ""}
            rows={4}
          />
          {errors.message && (
            <p className="mt-1 text-xs text-negative">{errors.message.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full h-12 text-base flex items-center justify-center gap-2" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Sending...
          </>
        ) : "Send Message"}
      </Button>
      <p className="text-xs text-center text-text-body/70">
        Your information is secure and encrypted. We will never spam you.
      </p>
    </form>
  );
}
