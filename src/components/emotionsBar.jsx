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
  
  const EmotionsBar = ({emotions}) => {
    return (
      <div className="w-2/3 items-center justify-center max-w-lg mx-auto space-y-2">
        {emotions && emotions.map((emotion, index) => (
          <div key={index} className="flex items-center space-x-4 h-3">
            <div className="w-1/3 text-sm">{emotion.name}</div>
            <div className="relative w-2/3 h-3 bg-zinc-900 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-white"
                style={{ width: `${emotion.value}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  export default EmotionsBar;
  