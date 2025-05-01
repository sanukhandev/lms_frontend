import React from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";


interface JitsiMeetComponentProps {
  roomName: string;
    userName: string;
    userEmail: string;
}

const JitsiMeetComponent: React.FC<JitsiMeetComponentProps> = ({
  roomName,
    userName,
    userEmail,
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
        onApiReady={(externalApi) => {
          // here you can handle the Jitsi Meet External API
          console.log(externalApi);
        }}
        onReadyToClose={() => {
          window.location.href = "/admin"; // Redirect to the home page when the meeting is closed
        }}
      />
    </div>
  );
};
    

export default JitsiMeetComponent;