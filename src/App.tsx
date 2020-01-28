import React, { useEffect, useState } from "react";
import "./App.css";
import socketIOClient from "socket.io-client";

const SOCKET_URL = "http://localhost:8080";

const App: React.FC = () => {
  const [logs, setLogs] = useState<Array<string>>([]);

  const pushLogsWithWs = () => {
    const socketConfig: any = {};
    const socket = socketIOClient(SOCKET_URL, socketConfig);

    socket.emit("start", "message emitted from client");
    socket.on("start", function(data: string) {
      console.log(data);
      setLogs(prevLogs => [...prevLogs, data]);
    });

    socket.on("log", function(newlog: string) {
      setLogs(prevLogs => [...prevLogs, newlog]);
    });
  };

  useEffect(() => {
    pushLogsWithWs();
  }, []);

  return (
    <div className="App">
      <header className="App-header">Remote Terminal</header>
      <div className="App-body">
        <div className="App-log-container">
          <div className="App-log-line">hello, i am a logger!</div>
          {logs.map((log: string, i: number) => {
            return (
              <div key={i} className="App-log-line">
                {log}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default App;
