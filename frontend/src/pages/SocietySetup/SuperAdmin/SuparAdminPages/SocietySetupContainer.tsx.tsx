import React, { useState } from "react";
import SocietyIdentitySetup from "./SocietyRegistrationPages/SocietyIdentitySetup";
import StructureStep from "./SocietyRegistrationPages/StructureStep";
import AddressStep from "./SocietyRegistrationPages/AddressStep";
import FinalizeSetup from "./SocietyRegistrationPages/FinalizeSetup";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AppDispatch, RootState, useAppSelector } from "@/store/store";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createSocietyBySuperAdmin } from "@/features/Superadmin/superAdminSlice";

const SocietySetupContainer = () => {
  const [activeStep, setActiveStep] = useState(1);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { societies, loading, error} = useAppSelector((state: RootState) => state.superAdmin);

    const initialFormState = {
      identity: {
        societyName: "",
        email: "",
        phone: "",
        logo: null,
        logoPreview: "",
      },
      structure: {
        totalUnits: "",
        totalFloors: "",
        totalTowers: "",
      },
      address: {
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
      },
      settings: {
        maintenanceDue: "5",
        currency: "INR",
        timezone: "Asia/Kolkata",
      },
    };
  

  const [formData, setFormData] = useState(initialFormState);

  const nextStep = () => setActiveStep((prev) => prev + 1);
  const prevStep = () => setActiveStep((prev) => prev - 1);

  const updateFormData = (key: string, data: any) => {
  setFormData((prev) => {
    const updated = {
      ...prev,
      [key]: data,
    };

    console.log(" CUMULATIVE FORM DATA:", updated);

    return updated;
  });
};

const handleFinalSubmit = async (settingsData: any) => {

  if (loading) return; // prevent double click

  const finalData = {
    name: formData.identity?.societyName || "",

    address: {
      line1: formData.address?.addressLine1 || "",
      line2: formData.address?.addressLine2 || "",
      city: formData.address?.city || "",
      state: formData.address?.state || "",
      pincode: formData.address?.pincode || "",
      country: formData.address?.country || "",
    },

    contactEmail: formData.identity?.email || "",
    contactPhone: formData.identity?.phone || "",

    totalUnits: Number(formData.structure?.totalUnits || 0),
    totalFloors: Number(formData.structure?.totalFloors || 0),
    totalTowers: Number(formData.structure?.totalTowers || 0),

    logoUrl: formData.identity?.logoPreview || null,

    settings: {
      maintenanceDueDay: Number(settingsData?.maintenanceDue || 5),
      currency: settingsData?.currency || "INR",
      timezone: settingsData?.timezone || "Asia/Kolkata",
    }
  };

  try {
    console.log(" Society created successfully with data:", finalData);

    //  Call API and get response
    const response = await dispatch(
      createSocietyBySuperAdmin(finalData)
    ).unwrap();

    // Console created society response
    console.log("🎉 Created Society Response:", response);

    console.log("🆔 Created Society ID:", response?.society?._id);

    // Clear form
    setFormData(initialFormState);
    setActiveStep(1);

    navigate("/adminDetailsStep");

  } catch (error) {
    console.error("❌ Society creation failed:", error);
  }
};

  return (
    <>
    
    <DashboardLayout role="super-admin">

      {activeStep > 1 && (
      <div className="w-full max-w-5xl mx-auto px-8 pt-8">

        {/* Step Labels */}
        <div className="flex justify-between items-center mb-4">
          {["Identity", "Structure", "Address", "Finalize"].map((label, index) => {
            const stepNumber = index + 1;
            const isActive = activeStep === stepNumber;
            const isCompleted = activeStep > stepNumber;

            return (
              <div key={label} className="flex flex-col items-center flex-1">
                
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                    ${
                      isCompleted
                        ? "bg-blue-600 text-white"
                        : isActive
                        ? "bg-card border-2 border-blue-600 text-blue-600 scale-110 shadow-md"
                        : "bg-slate-100 text-muted-foreground"
                    }`}
                >
                  {isCompleted ? "✓" : stepNumber}
                </div>

                <span
                  className={`text-[10px] mt-2 font-bold uppercase tracking-wider ${
                    isActive || isCompleted
                      ? "text-blue-600"
                      : "text-muted-foreground"
                  }`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress Line */}
        <div className="relative w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-blue-600 transition-all duration-500"
            style={{ width: `${(activeStep - 1) * 33.33}%` }}
          />
        </div>

      </div>)
      }
      {activeStep === 1 && (
        <SocietyIdentitySetup
          nextStep={nextStep}
          updateFormData={(data: any) =>
            updateFormData("identity", data)
          }
          defaultValues={formData.identity}
        />
      )}

      {activeStep === 2 && (
        <StructureStep
          nextStep={nextStep}
          prevStep={prevStep}
          updateFormData={(data: any) =>
            updateFormData("structure", data)
          }
          defaultValues={formData.structure}
          fullFormData={formData}
        />
      )}

      {activeStep === 3 && (
        <AddressStep
           nextStep={nextStep}
            prevStep={prevStep}
            updateFormData={(data: any) =>
              updateFormData("address", data)
            }
            defaultValues={formData.address}
            fullFormData={formData}
        />
      )}

      {activeStep === 4 && (
        <FinalizeSetup
          prevStep={prevStep}
          submitForm={handleFinalSubmit}
          defaultValues={formData.settings}
          fullFormData={formData}
          loading={loading}
        />
      )}
      </DashboardLayout>
    </>
  );
};

export default SocietySetupContainer;