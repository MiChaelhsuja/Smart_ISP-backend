import React from "react";

// 🔹 Reusable Section Title
const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-4xl font-bold text-gray-900 mb-8">{children}</h2>
);

// 🔹 Reusable Input Group
const InputGroup: React.FC<{ label: string; placeholder?: string; type?: string }> = ({
  label,
  placeholder,
  type = "text",
}) => (
  <div className="space-y-1 mb-4">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full rounded-lg border border-gray-200 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
    />
  </div>
);

const SettingsPage: React.FC = () => {
  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      {/* Main Title */}
      <SectionTitle>Settings</SectionTitle>

      {/* Settings Form */}
      <form className="max-w-3xl space-y-10">
        {/* 🔹 System Configurations */}
        <div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            System Configurations
          </h3>
          <InputGroup label="Service Plans" placeholder="Manage available service plans" />
          <InputGroup label="SMS Templates" placeholder="Edit or add SMS templates" />
        </div>

        {/* 🔹 User & Role Management */}
        <div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            User & Role Management
          </h3>
          <InputGroup label="Admins" placeholder="Manage admin users" />
          <InputGroup label="Collectors" placeholder="Manage collector accounts" />
        </div>

        {/* 🔹 Integrations */}
        <div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Integrations</h3>
          <InputGroup label="GenieACS API" placeholder="Enter GenieACS API endpoint" />
          <InputGroup label="SMS Gateway" placeholder="Enter SMS Gateway details" />
          <InputGroup label="Payment API" placeholder="Enter Payment API credentials" />
        </div>

        {/* 🔹 Help & Support */}
        <div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Help & Support</h3>
          <InputGroup label="Support Email" placeholder="support@example.com" />
          <InputGroup label="FAQ Link" placeholder="https://example.com/faq" />
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
