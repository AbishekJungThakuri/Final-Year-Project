const MapComponent = ({ planId, mapData, setActiveComponent }) => {
  return (
    <div>
      <h3 className="text-lg font-bold mb-2">Map Data</h3>
      <pre className="bg-gray-100 p-4 rounded-lg h-screen overflow-auto text-sm whitespace-pre-wrap break-words">
        {JSON.stringify(mapData, null, 2)}
      </pre>
    </div>
  );
};

export default MapComponent;
