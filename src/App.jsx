import React, { useState } from "react";
import { OpenAI } from "openai";
import "./App.css";
import { Loader2 } from 'lucide-react';


function App() {
  const [inputPrompt, setInputPrompt] = useState("");
  const [gender, setGender] = useState("🎨 Oil Painting");
  const [style, setStyle] = useState("😌 Serene");
  const [activeTab, setActiveTab] = useState("manual");
  const [imageURL, setImageURL] = useState("");
  // const [revisedPrompt, setRevisedPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Replace with your own OpenAI API key
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const combinedPrompt =
      activeTab === "manual"
        ? `Print a tattoo design of a ${inputPrompt} in black and white.`
        : `Print a tattoo design of a ${inputPrompt}, for a ${gender} , in ${style} with a ${gender} in background. You can refer from internet for more details.`;

    try {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: combinedPrompt,
        n: 1,
        size: "1024x1024",
      });
      console.log("Response from OpenAI:", response);
      // setRevisedPrompt(response.data[0].revised_prompt);
      setImageURL(response.data[0].url);
    } catch (error) {
      console.error("Error generating the image:", error);
      alert(
        "Failed to generate the image. Check the console for more details."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-screen min-h-screen items-center justify-center overflow-y-hidden text-black bg-gray-100 App">
      <div className="flex flex-col items-center justify-center lg:w-1/2 sm:w-1/2 w-full m-6">
        <h1 className="text-4xl mb-6 font-bold">Artbox</h1>
        <p className="text-2xl mb-2 App">
          This is a Tattoo Generator.
        </p>
        <p className="text-gray-600">
          It generates a tatoo based on the description you provide.
        </p>

        {/* Tab Buttons */}
        <div className="mt-4 flex flex-row">
          <div className="flex gap-x-6">
            <button
              className={`${activeTab === "manual" ? "active bg-black text-white" : "bg-white"} py-2 px-4 border border-gray-200 rounded-2xl text-sm font-semibold`}
              onClick={() => setActiveTab("manual")}
            >
              Manual Prompt
            </button>
            <button
              className={`${activeTab === "predefined" ? "active bg-black text-white" : "bg-white"} py-2 px-4 border border-gray-200 rounded-2xl text-sm font-semibold`}
              onClick={() => setActiveTab("predefined")}
            >
              Predefined Options
            </button>
          </div>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-y-4 mt-4 w-full">
          {activeTab === "manual" && (
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Enter a description..."
              className="h-10 pl-4 border border-gray-200 rounded-2xl w-full"
            />
          )}

          {activeTab === "predefined" && (
            <>
              <input
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder="Enter a base description..."
                className="h-10 pl-4 border border-gray-200 rounded-2xl w-full"
              />
              <div className="flex flex-row items-center justify-center w-full">
                <div className="w-1/2 mr-4">
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="Man">👨 Man</option>
                    <option value="Woman">👧 Woman</option>
                    {/* Add more genders with emojis */}
                  </select>
                </div>
                <div className="w-1/2 mr-4">
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="Colorful">Colorful</option>
                    <option value="Black and White">Black & White</option>
                    <option value="Sketchy">Sketchy</option>
                    {/* Add more styles with emojis */}
                  </select>
                </div>
              </div>
            </>
          )}

          <button type="submit" className="bg-black px-4 py-2 rounded-xl text-white" disabled={isLoading}>
            {isLoading ? "Generating..." : "Generate"}
          </button>
        </form>
        {/* Loading Indicator */}
        {isLoading && <div className="bg-black p-2 rounded-lg w-fit mt-2">
          <Loader2 size={30} color="white" className="animate-spin"/>
        </div>}
        {/* Image Display */}
        {imageURL && (
          <div className="w-full flex flex-row items-center justify-center mt-6">
            <img
              src={imageURL}
              alt="Generated from OpenAI"
              className="lg:w-full border border-gray-500 rounded-md p-2 h-fit"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
