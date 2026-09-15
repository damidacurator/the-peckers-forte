"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", middleName: "", gender: "", dob: "",
    email: "", phone: "", address: "", state: "", lga: "",
    wing: "", category: "",
    nokName: "", nokPhone: "", nokRel: ""
  });

  const updateForm = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 5) {
      nextStep();
    } else {
      // Submit registration
      alert("Registration submitted successfully! Pending approval.");
      window.location.href = "/login";
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900">Join the Cooperative</h3>
        <p className="mt-1 text-sm text-gray-600">Step {step} of 5</p>
      </div>

      <div className="flex mb-6 space-x-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={`h-2 flex-1 rounded ${step >= i ? 'bg-brand-blue' : 'bg-gray-200'}`} />
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <h4 className="font-semibold border-b pb-2">Personal Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Surname" required value={formData.lastName} onChange={e => updateForm("lastName", e.target.value)} />
              <Input label="First Name" required value={formData.firstName} onChange={e => updateForm("firstName", e.target.value)} />
            </div>
            <Input label="Middle Name" value={formData.middleName} onChange={e => updateForm("middleName", e.target.value)} />
            <div className="grid grid-cols-2 gap-4">
              <Select 
                label="Gender" 
                options={[{value:"",label:"Select"},{value:"M",label:"Male"},{value:"F",label:"Female"}]} 
                value={formData.gender} onChange={e => updateForm("gender", e.target.value)}
                required
              />
              <Input label="Date of Birth" type="date" required value={formData.dob} onChange={e => updateForm("dob", e.target.value)} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <h4 className="font-semibold border-b pb-2">Contact Details</h4>
            <Input label="Email Address" type="email" required value={formData.email} onChange={e => updateForm("email", e.target.value)} />
            <Input label="Phone Number" type="tel" required value={formData.phone} onChange={e => updateForm("phone", e.target.value)} />
            <Input label="Residential Address" required value={formData.address} onChange={e => updateForm("address", e.target.value)} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="State" required value={formData.state} onChange={e => updateForm("state", e.target.value)} />
              <Input label="LGA" required value={formData.lga} onChange={e => updateForm("lga", e.target.value)} />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <h4 className="font-semibold border-b pb-2">Membership Options</h4>
            <Select 
              label="Select Wing" 
              options={[
                {value:"",label:"Select Wing"},
                {value:"CONTRIBUTION",label:"Contribution Wing (PMCS)"},
                {value:"INVESTMENT",label:"Investment Wing (PAP)"},
                {value:"BOTH",label:"Both Wings"}
              ]} 
              required
              value={formData.wing} onChange={e => updateForm("wing", e.target.value)}
            />
            <Select 
              label="Membership Category" 
              options={[
                {value:"",label:"Select Category"},
                {value:"standard",label:"Standard - ₦10,000/mo"},
                {value:"premium",label:"Premium - ₦50,000/mo"},
                {value:"gold",label:"Gold - ₦100,000/mo"}
              ]} 
              required
              value={formData.category} onChange={e => updateForm("category", e.target.value)}
            />
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <h4 className="font-semibold border-b pb-2">Next of Kin</h4>
            <Input label="Full Name" required value={formData.nokName} onChange={e => updateForm("nokName", e.target.value)} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Phone Number" required value={formData.nokPhone} onChange={e => updateForm("nokPhone", e.target.value)} />
              <Input label="Relationship" required value={formData.nokRel} onChange={e => updateForm("nokRel", e.target.value)} />
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <div className="text-center mb-6">
              <CheckCircle2 className="w-16 h-16 text-brand-green mx-auto mb-2" />
              <h4 className="font-bold text-xl">Review & Submit</h4>
              <p className="text-sm text-gray-500">Please verify your information before submitting.</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md text-sm space-y-2">
              <div className="flex justify-between"><span className="font-semibold">Name:</span> <span>{formData.firstName} {formData.lastName}</span></div>
              <div className="flex justify-between"><span className="font-semibold">Email:</span> <span>{formData.email}</span></div>
              <div className="flex justify-between"><span className="font-semibold">Wing:</span> <span>{formData.wing}</span></div>
            </div>
            <p className="text-xs text-gray-500 text-center">
              By submitting, you agree to the Terms and Conditions of THE PECKERS FORTE.
              Note: Registration fee applies.
            </p>
          </div>
        )}

        <div className="flex justify-between pt-4 border-t">
          {step > 1 ? (
            <Button type="button" variant="outline" onClick={prevStep}>Back</Button>
          ) : (
            <div></div> // Empty div for flex spacing
          )}
          <Button type="submit" variant={step === 5 ? "gold" : "default"}>
            {step === 5 ? "Submit Registration" : "Next Step"}
          </Button>
        </div>
      </form>
      <div className="text-center text-sm mt-4">
        Already have an account? <Link href="/login" className="text-brand-blue font-medium hover:underline">Log in</Link>
      </div>
    </div>
  );
}
