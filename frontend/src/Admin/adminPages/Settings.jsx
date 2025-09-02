import { Settings } from 'lucide-react';
import PostCard from '../components/PostCard';

// Settings Component (placeholder)
const SettingsComponent = () => {
  return (
    <div className="space-y-6">
      <PostCard title="Settings">
        <div className="text-center py-8 text-gray-500">
          <Settings className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2">Settings management coming soon...</p>
          {/* TODO: Implement settings management */}
        </div>
      </PostCard>
    </div>
  );
};

export default SettingsComponent