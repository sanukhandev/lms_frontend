"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import JitsiMeet from "@/components/common/JitsiMeet";
import { api } from "@/util/api";

export default function ClassPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const sessionId = params.sessionId as string;

  const [sessionInfo, setSessionInfo] = useState<{
    roomName: string;
    displayName: string;
  } | null>(null);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    
    fetchSessionInfo();
  }, [sessionId]);
async function fetchSessionInfo() {
      try {
        const response = await api.get(
          `/courses/class-sessions/${sessionId}`,
        );
        if (response.data) {
          const { roomName, displayName } = response.data.data;
          setSessionInfo({ roomName, displayName });
        }
      } catch (error) {
        console.error("Error fetching session info:", error);
        setSessionInfo(null);
      }
      setLoading(false);
    }
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="loader">Loading</div>
      </div>
    );
  }

  if (!sessionInfo) {
    return (
      <div className="flex items-center justify-center h-[70vh] text-red-500">
        Failed to load session info.
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Join Your Class</h1>
      <JitsiMeet roomName={sessionInfo.roomName} displayName={sessionInfo.displayName} />
    </div>
  );
}
