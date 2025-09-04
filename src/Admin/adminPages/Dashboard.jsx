import React, { useEffect, useState } from 'react';
import {
  getAllPlaces
} from '../../Admin/api/places';
import {
  getAllActivities
} from '../../Admin/api/activities';
import {
  getAllUsers
} from '../../Admin/api/users';
import {
  getAllAccommodationServices
} from '../../Admin/api/AccomodationProviders';
import {
  getAllTransportServices
} from '../../Admin/api/ServiceProviders';

import {
  MapPin, Activity as ActIcon, Users, Building, Bus
} from 'lucide-react';

import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

import PostCard from '../../components/PostCard';

// ✅ Register chart.js modules (only once globally)
ChartJS.register(ArcElement, Tooltip, Legend);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    places: 0,
    activities: 0,
    users: 0,
    accommodation: 0,
    transport: 0
  });

  const [trendData, setTrendData] = useState({
    categories: [],
    counts: [],
  });

  const fetchStats = async () => {
    try {
      const [placesRes, activitiesRes, usersRes, accRes, transportRes] =
        await Promise.all([
          getAllPlaces({ size: 100 }),
          getAllActivities({ size: 100 }),
          getAllUsers({ size: 100 }),
          getAllAccommodationServices({ size: 100 }),
          getAllTransportServices({ size: 100 })
        ]);

      setStats({
        places: placesRes.length,
        activities: activitiesRes.length,
        users: usersRes.length,
        accommodation: accRes.length,
        transport: transportRes.length,
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const fetchTrend = async () => {
    try {
      const places = await getAllPlaces({ size: 100 });
      const counts = places.reduce((acc, p) => {
        acc[p.category] = (acc[p.category] || 0) + 1;
        return acc;
      }, {});
      setTrendData({
        categories: Object.keys(counts),
        counts: Object.values(counts)
      });
    } catch (err) {
      console.error('Error fetching trend data:', err);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchTrend();
  }, []);

  return (
    <div className="space-y-6 p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <PostCard className="bg-blue-50 border-l-4 border-blue-500">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Places</p>
              <p className="text-2xl font-bold text-blue-900">{stats.places}</p>
            </div>
            <MapPin className="h-8 w-8 text-blue-500" />
          </div>
        </PostCard>

        <PostCard className="bg-green-50 border-l-4 border-green-500">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Activities</p>
              <p className="text-2xl font-bold text-green-900">{stats.activities}</p>
            </div>
            <ActIcon className="h-8 w-8 text-green-500" />
          </div>
        </PostCard>

        <PostCard className="bg-purple-50 border-l-4 border-purple-500">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Users</p>
              <p className="text-2xl font-bold text-purple-900">{stats.users}</p>
            </div>
            <Users className="h-8 w-8 text-purple-500" />
          </div>
        </PostCard>

        <PostCard className="bg-yellow-50 border-l-4 border-yellow-500">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Accommodation</p>
              <p className="text-2xl font-bold text-yellow-900">{stats.accommodation}</p>
            </div>
            <Building className="h-8 w-8 text-yellow-500" />
          </div>
        </PostCard>

        <PostCard className="bg-teal-50 border-l-4 border-teal-500">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-teal-600">Transport</p>
              <p className="text-2xl font-bold text-teal-900">{stats.transport}</p>
            </div>
            <Bus className="h-8 w-8 text-teal-500" />
          </div>
        </PostCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PostCard title="Places Category Breakdown">
          {trendData.categories.length > 0 ? (
            <Pie
              data={{
                labels: trendData.categories,
                datasets: [{
                  data: trendData.counts,
                  backgroundColor: ['#60A5FA','#34D399','#FBBF24','#A78BFA','#4ADE80','#38BDF8']
                }]
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'bottom'
                  }
                }
              }}
            />
          ) : (
            <p className="text-gray-500">No data available.</p>
          )}
        </PostCard>

        <PostCard title="Admin Snapshot">
          <div className="space-y-2 text-gray-700">
            <p>Welcome back, Admin!</p>
            <ul className="list-disc pl-4">
              <li><strong>Places:</strong> {stats.places}</li>
              <li><strong>Activities:</strong> {stats.activities}</li>
              <li><strong>Users:</strong> {stats.users}</li>
              <li><strong>Accommodation:</strong> {stats.accommodation}</li>
              <li><strong>Transport:</strong> {stats.transport}</li>
            </ul>
          </div>
        </PostCard>
      </div>
    </div>
  );
};

export default AdminDashboard;
