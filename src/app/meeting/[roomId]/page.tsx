"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Correct usage of useParams hook
import JitsiMeetComponent from "@/components/common/JitsiMeetComponent";
import { api, getUserData } from "@/util/api";
import Preloader from "@/components/common/Preloader";
import { AxiosError } from "axios";

// Define the UserData type
interface UserData {
  id: string; // Assuming 'id' is available for the student
  name: string;
  email: string;
  role: string;
}

const MeetingPage = () => {
  const { roomId } = useParams(); // Correctly get roomId from URL params
  // Ensure roomId is a string
  const room = Array.isArray(roomId) ? roomId[0] : roomId;

  // handleOnStartMeeting
  const handleOnStartMeeting = () => {
    api.post(`session/${room}/status`, {
      status: "in_progress",
    });
  };

  const handleOnEndMeeting = () => {
    api
      .post(`session/${room}/status`, {
        status: "completed",
      })
      .then(() => {
        setTimeout(() => {
          window.close();
        }, 2000); // Delay for 2 seconds before redirecting
      })
      .catch((error) => {
        console.error("Error ending meeting:", error);
      });
  };

  // Use the UserData type for userData state
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isValidStudent, setIsValidStudent] = useState<boolean>(false); // State to track if the student is valid
  const [sessionError, setSessionError] = useState<string>(""); // To store any session validation errors
  const [roomName, setRoomName] = useState<string>(""); // State to store the room name
  const [loading, setLoading] = useState<boolean>(true); // Track if the data is still loading

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true); // Start loading data
        const data = await getUserData();
        if (data && data.name && data.email && data.role && data.id) {
          setUserData({
            name: data.name,
            email: data.email,
            role: data.role,
            id: data.id,
          } as UserData); // Cast the fetched data to UserData type

          // Check if the session is valid for the student
          const response = await api.get(
            `/session/valid/${room}` // Fetch student session data using the room ID
          );

          if (response.status === 200) {
            const studentData = response.data;
            if (studentData && studentData.valid) {
              setRoomName(studentData.meeting_link); // Set the room name from the response
              setIsValidStudent(true);
            } else {
              setIsValidStudent(false);
              setSessionError("You are not authorized to join this session.");
            }
          } else {
            setIsValidStudent(false);
            setSessionError(response.data.message || "Session not found.");
          }
        } else {
          setUserData(null); // Set null if the data doesn't match the expected structure
        }
      } catch (error: unknown) {
        setIsValidStudent(false);
        if (error instanceof AxiosError) {
          setSessionError(
            error.response?.data.message ||
              "An error occurred while fetching user data."
          );
        } else {
          setSessionError("An unknown error occurred.");
        }
        console.error(error);
      } finally {
        setLoading(false);
        setTimeout(() => {
          // closeThetab
          window.close(); // Close the tab after 2 seconds
        }, 2000); // Delay for 2 seconds before redirecting// End loading
      }
    };

    fetchUserData();
  }, [room]); // Added `room` as a dependency

  // Show preloader until data is fetched and validated
  if (loading) {
    return <Preloader />;
  }

  // Show error if the roomId is not valid
  if (!room) {
    return (
      <div className="flex flex-col h-screen">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-red-500">Invalid room ID.</p>
        </div>
      </div>
    );
  }

  // If the student is not valid, display a message and do not render the meeting component
  if (!isValidStudent) {
    return (
      <div className="flex flex-col h-screen">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-red-500">
            {sessionError + " This window will auto close in 3 seconds." ||
              "You are not authorized to join this meeting."}
          </p>
        </div>
      </div>
    );
  }

  // Create the user object from the fetched user data
  const user = {
    name: `${userData?.name} - ${userData?.role}`,
    email: userData?.email,
  };

  return (
    <div className={`flex flex-col h-screen`}>
      <div className="flex-1 flex items-center justify-center">
        {room && user && (
          <JitsiMeetComponent
            onStartMeeting={handleOnStartMeeting}
            onEndMeeting={handleOnEndMeeting}
            roomName={roomName}
            userName={user.name}
            userEmail={user?.email || ""}
          />
        )}
      </div>
    </div>
  );
};

export default MeetingPage;
