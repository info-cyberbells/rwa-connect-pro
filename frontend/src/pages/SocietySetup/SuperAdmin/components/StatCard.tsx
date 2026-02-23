import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  bg?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, bg }) => {
  return (
    <div
      className={`flex items-center justify-between p-4 rounded-xl shadow-md ${
        bg ? bg : "bg-white"
      }`}
    >
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
      {icon && <div className="p-2 bg-white rounded-full">{icon}</div>}
    </div>
  );
};

export default StatCard;