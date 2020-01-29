import React, { useEffect, useState, useRef, RefObject } from "react";
import "./App.css";
import socketIOClient from "socket.io-client";

const SOCKET_URL = process.env.SERVER_URL || "http://localhost:8080";

const App: React.FC = () => {
  const [logs, setLogs] = useState<Array<string>>(["hello, i am a logger!"]);
  const [isWatchLogs, setWatchLogsStatus] = useState<boolean>(false);
  const logContainerRef: RefObject<HTMLDivElement> = useRef(null);
  let handleSocketStateRef: any = useRef();

  // starts the websocket once
  useEffect(() => {
    const socket = socketIOClient(SOCKET_URL);
    const closureFunc = socketClosure(socket);
    handleSocketStateRef.current = closureFunc;
    handleSocketStateRef.current(true);
    return function() {
      socket.close();
    };
  }, []);

  const socketClosure = (socket: SocketIOClient.Socket) => {
    // gets the start event from server
    socket.on("start", function(data: string) {
      console.log(data);
      setLogs(prevLogs => [data, ...prevLogs]);
    });

    // gets log event, updates state and scrolls to the bottom using ref
    socket.on("log", function(newlog: string) {
      setLogs(prevLogs => [newlog, ...prevLogs]);
      logContainerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
    return (shouldWatch: boolean) => {
      if (!shouldWatch) {
        setWatchLogsStatus(false);
        socket.emit("stop");
      } else {
        setWatchLogsStatus(true);
        socket.emit("start", "message emitted from client");
      }
    };
  };

  // clears the logs every 15 mins
  useEffect(() => {
    let interval = setInterval(() => {
      setLogs(prevLogs => prevLogs.slice(prevLogs.length - 5, prevLogs.length));
    }, 15 * 60 * 1000);
    return function() {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">Remote Terminal</header>
      <div className="App-body">
        {/* ref used to maintain scroll position at the first log */}
        <div className="App-log-container" ref={logContainerRef}>
          {logs.map((log: string, i: number) => {
            const isLatest = i === 0;
            return (
              <div
                key={i}
                className="App-log-line"
                style={{ color: isLatest ? "green" : "white" }}
              >
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
