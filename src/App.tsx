import { AuthInitializer } from "./components/layout/AuthInitializer";

function App() {
  return (
    <AuthInitializer>
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-semibold">SprintDesk</h1>
      </div>
    </AuthInitializer>
  );
}

export default App;
