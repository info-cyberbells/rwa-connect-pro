import React from "react";

interface SocietyProps {
  society: {
    settings: {
      maintenanceDueDay: number;
      currency: string;
      timezone: string;
    };
    _id: string;
    name: string;
    address: {
      line1: string;
      line2: string;
      city: string;
      state: string;
      pincode: string;
      country: string;
    };
    contactEmail: string;
    contactPhone: string;
    totalUnits: number;
    totalFloors: number;
    totalTowers: number;
    logoUrl: string;
    isActive: boolean;
    createdBy: {
      _id: string;
      name: string;
      email: string;
    };
    slug: string;
    createdAt: string;
    updatedAt: string;
  };
};

const SocietyCard: React.FC<SocietyProps> = ({ society }) => {
  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden mt-8">
      {/* Header */}
      <div className="flex items-center p-5 bg-indigo-600 text-white">
        <img
          src={society.logoUrl}
          alt={society.name}
          className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-white"
        />
        <div>
          <h2 className="text-2xl font-bold">{society.name}</h2>
          <p className="text-sm">Slug: {society.slug}</p>
          <p className="text-sm">
            Status:{" "}
            <span
              className={`font-semibold ${
                society.isActive ? "text-green-400" : "text-red-400"
              }`}
            >
              {society.isActive ? "Active" : "Inactive"}
            </span>
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-5">
        {/* Address */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Address</h3>
          <p>{society.address.line1}</p>
          <p>{society.address.line2}</p>
          <p>
            {society.address.city}, {society.address.state} -{" "}
            {society.address.pincode}, {society.address.country}
          </p>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Contact</h3>
          <p>Email: {society.contactEmail}</p>
          <p>Phone: {society.contactPhone}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-gray-100 rounded-lg p-3 text-center">
            <p className="text-sm text-gray-500">Total Units</p>
            <p className="font-bold text-xl">{society.totalUnits}</p>
          </div>
          <div className="bg-gray-100 rounded-lg p-3 text-center">
            <p className="text-sm text-gray-500">Floors</p>
            <p className="font-bold text-xl">{society.totalFloors}</p>
          </div>
          <div className="bg-gray-100 rounded-lg p-3 text-center">
            <p className="text-sm text-gray-500">Towers</p>
            <p className="font-bold text-xl">{society.totalTowers}</p>
          </div>
        </div>

        {/* Settings */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Settings</h3>
          <p>Maintenance Due Day: {society.settings.maintenanceDueDay}</p>
          <p>Currency: {society.settings.currency}</p>
          <p>Timezone: {society.settings.timezone}</p>
        </div>

        {/* Created By */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Created By</h3>
          <p>Name: {society.createdBy.name}</p>
          <p>Email: {society.createdBy.email}</p>
        </div>

        {/* Dates */}
        <div>
          <p className="text-sm text-gray-500">
            Created At: {new Date(society.createdAt).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">
            Updated At: {new Date(society.updatedAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SocietyCard;