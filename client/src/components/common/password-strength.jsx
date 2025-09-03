import React from 'react';

const PasswordStrength = ({ password }) => {
  const calculateStrength = (password) => {
    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    // Calculate score based on checks
    Object.values(checks).forEach(check => {
      if (check) score++;
    });

    return { score, checks };
  };

  const getStrengthLevel = (score) => {
    if (score <= 2) return { level: 'Weak', color: 'bg-red-500', textColor: 'text-red-500' };
    if (score <= 3) return { level: 'Fair', color: 'bg-yellow-500', textColor: 'text-yellow-500' };
    if (score <= 4) return { level: 'Good', color: 'bg-blue-500', textColor: 'text-blue-500' };
    return { level: 'Strong', color: 'bg-green-500', textColor: 'text-green-500' };
  };

  const getProgressWidth = (score) => {
    return (score / 5) * 100;
  };

  const { score, checks } = calculateStrength(password);
  const { level, color, textColor } = getStrengthLevel(score);
  const progressWidth = getProgressWidth(score);

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      {/* Password Strength Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Password strength:</span>
          <span className={`font-medium ${textColor}`}>{level}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${color}`}
            style={{ width: `${progressWidth}%` }}
          />
        </div>
      </div>

      {/* Password Requirements */}
      <div className="space-y-1 text-xs">
        <div className={`flex items-center gap-2 ${checks.length ? 'text-green-600' : 'text-gray-500'}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${checks.length ? 'bg-green-500' : 'bg-gray-300'}`} />
          <span>At least 8 characters</span>
        </div>
        <div className={`flex items-center gap-2 ${checks.lowercase ? 'text-green-600' : 'text-gray-500'}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${checks.lowercase ? 'bg-green-500' : 'bg-gray-300'}`} />
          <span>One lowercase letter</span>
        </div>
        <div className={`flex items-center gap-2 ${checks.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${checks.uppercase ? 'bg-green-500' : 'bg-gray-300'}`} />
          <span>One uppercase letter</span>
        </div>
        <div className={`flex items-center gap-2 ${checks.number ? 'text-green-600' : 'text-gray-500'}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${checks.number ? 'bg-green-500' : 'bg-gray-300'}`} />
          <span>One number</span>
        </div>
        <div className={`flex items-center gap-2 ${checks.special ? 'text-green-600' : 'text-gray-500'}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${checks.special ? 'bg-green-500' : 'bg-gray-300'}`} />
          <span>One special character</span>
        </div>
      </div>
    </div>
  );
};

export default PasswordStrength;
