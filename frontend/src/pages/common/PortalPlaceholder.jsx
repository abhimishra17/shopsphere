import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';

/**
 * PortalPlaceholder Component
 * 
 * Reusable placeholder view shown when a user clicks on a flow that hasn't
 * been built yet (e.g. Seller Dashboard or Admin Console).
 * 
 * Props:
 *   - portalName: The name of the selected module/flow
 *   - description: Short summary of what this section will do
 *   - nextStep: Specific upcoming features planned for this section
 */
export default function PortalPlaceholder({ portalName, description, nextStep }) {
  // Hook to navigate back to the main entry page
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center p-4">
      {/* Container card */}
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-xl p-8 text-center space-y-6 shadow-sm">
        
        {/* Simple icon indicator */}
        <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-700 mx-auto flex items-center justify-center">
          <Clock className="w-6 h-6" />
        </div>

        {/* Section title & description */}
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-md">
            {portalName}
          </span>
          <h2 className="text-xl font-bold text-gray-900 pt-2">
            Module In Progress
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Info box detailing what will be implemented next */}
        <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 text-left space-y-1.5 text-xs">
          <div className="font-semibold text-gray-800">Next Implementation Step:</div>
          <p className="text-gray-600 leading-relaxed">{nextStep}</p>
        </div>

        {/* Back navigation button */}
        <button
          onClick={() => navigate('/')}
          className="w-full py-2.5 px-4 rounded-lg font-medium text-sm text-white bg-gray-900 hover:bg-gray-800 transition flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Entry Page</span>
        </button>

      </div>
    </div>
  );
}
