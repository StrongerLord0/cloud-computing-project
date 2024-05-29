// components/EmotionsBar.js
const emotions = [
    { name: 'Enojo', value: 0.62 },
    { name: 'Disgust', value: 0.00024 },
    { name: 'Fear', value: 0.12 },
    { name: 'Happy', value: 0.0071 },
    { name: 'Neutral', value: 0.0072 },
    { name: 'Sad', value: 99.24 },
    { name: 'Surprise', value: 0.000017 },
  ];
  
  const EmotionsBar = () => {
    return (
      <div className="w-full max-w-2xl mx-auto space-y-4">
        {emotions.map((emotion, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="w-20">{emotion.name}</div>
            <div className="relative w-full h-6 bg-gray-300 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-blue-500"
                style={{ width: `${emotion.value}%` }}
              ></div>
            </div>
            <div className="w-12 text-right">{emotion.value.toFixed(2)}%</div>
          </div>
        ))}
      </div>
    );
  };
  
  export default EmotionsBar;
  