export const Header = () => {
  return (
    <header className="bg-blue-900 text-white py-8 px-4 md:px-16">
      <div className="container mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Alien Frens Jerseys</h1>
        <p className="text-lg md:text-xl mb-4">
          Special thanks to{' '}
          <a href="https://twitter.com/VictorBirkeland" className="text-yellow-300 hover:text-white underline">
            @VictorBirkeland
          </a>{' '}
          for the jerseys!
        </p>
      </div>
    </header>
  );
};