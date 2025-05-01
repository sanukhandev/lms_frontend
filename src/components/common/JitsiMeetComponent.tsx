import React from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";


interface JitsiMeetComponentProps {
  roomName: string;
    userName: string;
    userEmail: string;
    onStartMeeting: () => void;
    onEndMeeting: () => void;
}

const JitsiMeetComponent: React.FC<JitsiMeetComponentProps> = ({
  roomName,
    userName,
    userEmail,
    onStartMeeting,
    onEndMeeting,
}) => {
  return (
    <div className="w-full h-full">
      <JitsiMeeting
        domain={"meetservice.dw-digitalplatforms.in"}
        roomName={roomName}
        configOverwrite={{
          startWithAudioMuted: true,
          disableModeratorIndicator: true,
          startScreenSharing: true,
          enableEmailInStats: false,
        }}
        interfaceConfigOverwrite={{
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
        }}
        userInfo={{
          displayName: userName,
          email: userEmail,
        }}
              onApiReady={() => {
                  console.log("Jitsi API is ready Started meeting");
                  onStartMeeting(); // Call the onStartMeeting function when the API is ready
            
        }}
              onReadyToClose={() => {
                    console.log("Jitsi API is ready to close meeting");
                    onEndMeeting(); // Call the onEndMeeting function when the API is ready to close
        }}
      />
    </div>
  );
};
    

export default JitsiMeetComponent;