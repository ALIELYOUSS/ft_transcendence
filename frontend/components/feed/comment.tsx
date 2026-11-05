
import React from 'react';
import { User } from 'lucide-react';

interface CommentProps {
  username: string;
  text: string;
}

export const Comment: React.FC<CommentProps> = ({
  username,
  text,
}) => {
  return (
    <div className="flex items-start gap-3 py-2">
      {/* user avatar */}
      <div className="w-8 h-8 rounded-full bg-[#6B3F00] flex items-center justify-center shrink-0">
        <User className="w-4 h-4 text-white" />
      </div>
      {/* comment */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-800 leading-relaxed">
          <span className="font-bold text-gray-900 mr-2">
            {username}
          </span>
          {text}
        </p>
      </div>
    </div>
  );
};
