import { User, Mail, Building2, Calendar, IdCard } from 'lucide-react';

export function MyPage() {
  // Mock user data - in a real app, this would come from authentication/API
  const userProfile = {
    name: 'A Nguyen Van',
    email: 'nguyen.vana@company.com',
    department: 'Engineering',
    position: 'Senior Developer',
    employeeId: 'EMP-2024-001',
    joinDate: 'January 15, 2022',
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-gray-900 mb-6">My Page</h1>
      
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        {/* Profile Header */}
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200">
          <div className="w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center">
            <User size={48} className="text-orange-500" />
          </div>
          <div>
            <h2 className="text-gray-900 mb-1">{userProfile.name}</h2>
            <p className="text-gray-600">{userProfile.position}</p>
            <p className="text-gray-500 mt-1">{userProfile.employeeId}</p>
          </div>
        </div>

        {/* Profile Information */}
        <div className="space-y-6">
          <h3 className="text-gray-900 mb-4">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                <User size={20} className="text-orange-500" />
              </div>
              <div>
                <p className="text-gray-500 mb-1">Full Name</p>
                <p className="text-gray-900">{userProfile.name}</p>
              </div>
            </div>

            {/* Employee ID */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                <IdCard size={20} className="text-orange-500" />
              </div>
              <div>
                <p className="text-gray-500 mb-1">Employee ID</p>
                <p className="text-gray-900">{userProfile.employeeId}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                <Mail size={20} className="text-orange-500" />
              </div>
              <div>
                <p className="text-gray-500 mb-1">Email</p>
                <p className="text-gray-900">{userProfile.email}</p>
              </div>
            </div>

            {/* Department */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                <Building2 size={20} className="text-orange-500" />
              </div>
              <div>
                <p className="text-gray-500 mb-1">Department</p>
                <p className="text-gray-900">{userProfile.department}</p>
              </div>
            </div>

            {/* Join Date */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                <Calendar size={20} className="text-orange-500" />
              </div>
              <div>
                <p className="text-gray-500 mb-1">Join Date</p>
                <p className="text-gray-900">{userProfile.joinDate}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
