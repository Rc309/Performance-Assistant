import React, { useState, useEffect } from "react";
import Navbar from "./LandingPageNavbar";
import LoginPage from "../logInPage/LogInPage";
import big from "../../images/bigpicture.jpg";

const LandingPage = () => {
  const [showLogin, setShowLogin] = useState(false);

  const [typedText, setTypedText] = useState("");
  const [lineBreakIndex, setLineBreakIndex] = useState(0);
  const fullText = "Unleashing\nExcellence Through\nDetailed Insights";
  const typingSpeed = 150;

  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        const nextChar = fullText[currentIndex];
        setTypedText((prevText) => {
          if (nextChar === "\n") {
            setLineBreakIndex((prevIndex) => prevIndex + 1);
            return prevText + "\n";
          } else if (lineBreakIndex === 0 || lineBreakIndex === 1) {
            return prevText + nextChar;
          } else {
            return (
              prevText.substr(0, prevText.lastIndexOf("\n") + 1) + nextChar
            );
          }
        });
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, typingSpeed);

    return () => clearInterval(typingInterval);
  }, []);

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-400 via-blue-500 to-purple-700">
      <Navbar onLoginClick={handleLoginClick} />
      <div className="flex items-center justify-center h-screen">
        <div className="w-1/2 flex flex-col items-center justify-center text-white p-8">
          <h1 className="text-6xl font-bold text-center leading-tight whitespace-pre-line shadow-lg">
            {typedText}
          </h1>
        </div>
        <div className="w-1/2 flex justify-center">
          <img
            src={big}
            alt="CCTECH Image"
            className="rounded-full shadow-lg"
            style={{ width: "400px", height: "400px", objectFit: "cover" }}
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
