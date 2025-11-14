import React from 'react';

type InfoItemProps = {
  icon: React.ReactNode;
  title: string;
  content: string;
};

export default function InfoItem({ icon, title, content }: InfoItemProps) {
  return (
    <div className="flex items-start">
      <div className="text-gray-400 mr-3 mt-1">
        {icon}
      </div>
      <div>
        <h4 className="text-xs font-bold text-gray-500 mb-1">{title}</h4>
        <p className="text-gray-800 leading-relaxed">{content}</p>
      </div>
    </div>
  );
}
