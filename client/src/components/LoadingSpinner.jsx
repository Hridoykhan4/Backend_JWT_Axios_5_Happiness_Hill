'use client';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="relative w-16 h-16">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`absolute w-6 h-6 rounded-full bg-gradient-to-tr from-pink-500 to-yellow-400 dark:from-pink-400 dark:to-yellow-300 
                       animate-bounce${i % 2 === 0 ? '' : ' delay-150'}`}
            style={{
              top: i < 2 ? 0 : 'auto',
              bottom: i >= 2 ? 0 : 'auto',
              left: i % 2 === 0 ? 0 : 'auto',
              right: i % 2 === 1 ? 0 : 'auto',
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default LoadingSpinner;
