"use client";
import { api } from "@/util/api";
import { useEffect, useState } from "react";
import Preloader from "../../common/Preloader";
import Button from "../../ui/button/Button";

type ClassSession = {
  id: number;
  date: string;
  class_status: string;
  start_time: string;
  end_time: string;
  meeting_link: string | null;
  materials: {
    id: number;
    title: string;
    file_url: string;
    type: string;
  }[];
  batch: {
    id: number;
    name: string;
    course: {
      id: number;
      title: string;
      instructor: {
        id: number;
        name: string;
      };
    };
  };
};

export const StudentClasses = () => {
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'upcoming' | 'past'>('upcoming');
  const [selectedClass, setSelectedClass] = useState<ClassSession | null>(null);

  const fetchStudentClasses = async () => {
    try {
      const response = await api.get("/student/classes", {
        params: { filter }
      });
      if (response.status === 200) {
        setClasses(response.data);
        setError(null);
      } else {
        setError("Failed to load classes");
      }
    } catch (error) {
      console.error("Error fetching student's classes:", error);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentClasses();
  }, [filter]);

  const handleViewDetails = (classSession: ClassSession) => {
    setSelectedClass(classSession);
  };

  const handleCloseDetails = () => {
    setSelectedClass(null);
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:gap-6">
      <div className="col-span-full bg-white p-4 rounded-lg shadow-md dark:bg-gray-800">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2 sm:mb-0 dark:text-white">
            My Classes
          </h2>
          <div className="flex space-x-2">
            <Button 
              onClick={() => setFilter('upcoming')}
              variant={filter === 'upcoming' ? 'primary' : 'outline'} 
              size="sm"
            >
              Upcoming
            </Button>
            <Button 
              onClick={() => setFilter('past')}
              variant={filter === 'past' ? 'primary' : 'outline'} 
              size="sm"
            >
              Past
            </Button>
          </div>
        </div>
        
        {loading ? (
          <Preloader />
        ) : error ? (
          <div className="text-red-600 dark:text-red-400">⚠ {error}</div>
        ) : classes.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No classes found for the selected filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    Instructor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-800">
                {classes.map((session) => (
                  <tr key={session.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {session.batch.course.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {session.batch.course.instructor.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {session.date}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {session.start_time} - {session.end_time}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        session.class_status === 'scheduled' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                        session.class_status === 'ongoing' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                        session.class_status === 'completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {session.class_status.charAt(0).toUpperCase() + session.class_status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        {session.class_status === 'ongoing' && (
                          <a 
                            href={session.meeting_link || '#'} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-brand-600 hover:text-brand-800 dark:text-brand-400 dark:hover:text-brand-300"
                          >
                            Join Class
                          </a>
                        )}
                        <Button 
                          onClick={() => handleViewDetails(session)} 
                          variant="outline"
                          size="sm"
                        >
                          Details
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Class Details Modal */}
        {selectedClass && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Class Details
                  </h3>
                  <button 
                    onClick={handleCloseDetails}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Course</h4>
                    <p className="mt-1 text-gray-900 dark:text-white">{selectedClass.batch.course.title}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Instructor</h4>
                    <p className="mt-1 text-gray-900 dark:text-white">{selectedClass.batch.course.instructor.name}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Date & Time</h4>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {selectedClass.date} | {selectedClass.start_time} - {selectedClass.end_time}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h4>
                    <span className={`mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      selectedClass.class_status === 'scheduled' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                      selectedClass.class_status === 'ongoing' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                      selectedClass.class_status === 'completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {selectedClass.class_status.charAt(0).toUpperCase() + selectedClass.class_status.slice(1)}
                    </span>
                  </div>
                  
                  {selectedClass.materials && selectedClass.materials.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Materials</h4>
                      <ul className="mt-2 divide-y divide-gray-200 dark:divide-gray-700">
                        {selectedClass.materials.map((material) => (
                          <li key={material.id} className="py-3 flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {material.title}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {material.type}
                              </p>
                            </div>
                            <a 
                              href={material.file_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-brand-600 hover:text-brand-800 dark:text-brand-400 dark:hover:text-brand-300"
                              download
                            >
                              Download
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {selectedClass.class_status === 'ongoing' && selectedClass.meeting_link && (
                    <div className="mt-6">
                      <a 
                        href={selectedClass.meeting_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                      >
                        Join Class Now
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

