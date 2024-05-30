// components/EmotionsBar.js
const emotionsExample = [
    { name: 'Enojo', value: 0 },
    { name: 'Disgusto', value: 0 },
    { name: 'Miedo', value: 0 },
    { name: 'Felicidad', value: 0 },
    { name: 'Neutral', value: 0 },
    { name: 'Tristeza', value: 0 },
    { name: 'Sorpresa', value: 0 },
  ];
  
  const EmotionsBar = ({emotions}) => {
    return (
      <div className="w-2/3 items-center justify-center max-w-lg mx-auto space-y-2">
        { emotions && emotions.length > 0 ? (emotions.map((emotion, index) => (
          <div key={index} className="flex items-center space-x-4 h-3">
            <div className="w-1/3 text-sm">{emotion.name}</div>
            <div className="relative w-2/3 h-3 bg-zinc-900 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-white"
                style={{ width: `${emotion.value}%` }}
              ></div>
            </div>
          </div>
        ))
      ) : (
          emotionsExample.map((emotion, index) => (
            <div key={index} className="flex items-center space-x-4 h-3">
              <div className="w-1/3 text-sm">{emotion.name}</div>
              <div className="relative w-2/3 h-3 bg-zinc-900 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-white"
                  style={{ width: `${emotion.value}%` }}
                ></div>
              </div>
            </div>
          ))
        )}
        </div>
    );
  };
  
  export default EmotionsBar;
  